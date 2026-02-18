import { useState, useEffect } from 'react';
import { resultsAPI, classAPI, examAPI, studentAPI } from '../services/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { HiDocumentDownload, HiSearch } from 'react-icons/hi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#818cf8', '#60a5fa', '#34d399', '#f59e0b', '#ef4444'];

export default function ResultsPage() {
    const [mode, setMode] = useState('student'); // student | class
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [selClass, setSelClass] = useState('');
    const [selExam, setSelExam] = useState('');
    const [selStudent, setSelStudent] = useState('');
    const [result, setResult] = useState(null);
    const [classResults, setClassResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        classAPI.getAll().then(r => setClasses(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!selClass) return;
        Promise.all([
            studentAPI.getAll({ class: selClass }),
            examAPI.getAll(selClass),
        ]).then(([s, e]) => { setStudents(s.data); setExams(e.data); });
    }, [selClass]);

    const fetchStudentResult = async () => {
        if (!selStudent) return toast.error('Select a student');
        setFetching(true);
        try {
            const res = selExam
                ? await resultsAPI.getStudentExamResult(selStudent, selExam)
                : await resultsAPI.getStudentResult(selStudent);
            setResult(res.data);
            setClassResults(null);
        } catch { toast.error('Failed to fetch results'); }
        setFetching(false);
    };

    const fetchClassResults = async () => {
        if (!selClass || !selExam) return toast.error('Select class and exam');
        setFetching(true);
        try {
            const res = await resultsAPI.getClassResults(selClass, selExam);
            setClassResults(res.data);
            setResult(null);
        } catch { toast.error('Failed to fetch results'); }
        setFetching(false);
    };

    const generatePDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        const data = result;
        const student = data.student;

        // Header
        doc.setFillColor(30, 41, 59);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text('Student Report Card', 105, 18, { align: 'center' });
        doc.setFontSize(10);
        doc.text(student.school?.name || 'School', 105, 28, { align: 'center' });

        // Student Info
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.text(`Name: ${student.name}`, 14, 52);
        doc.text(`Roll No: ${student.rollNumber}`, 14, 60);
        doc.text(`Class: ${student.class?.name || ''} ${student.class?.section || ''}`, 120, 52);

        let y = 72;

        // Per-exam results or single exam
        if (data.examResults) {
            data.examResults.forEach(er => {
                doc.setFontSize(12);
                doc.setTextColor(99, 102, 241);
                doc.text(er.exam?.name || 'Exam', 14, y);
                y += 6;

                const tableData = er.subjects.map(s => [s.subject?.name, s.marksObtained, s.maxMarks, s.percentage + '%', s.grade]);
                doc.autoTable({
                    startY: y,
                    head: [['Subject', 'Obtained', 'Max', 'Percentage', 'Grade']],
                    body: tableData,
                    theme: 'grid',
                    styles: { fontSize: 9 },
                    headStyles: { fillColor: [99, 102, 241] },
                });
                y = doc.lastAutoTable.finalY + 4;
                doc.setTextColor(30, 41, 59);
                doc.setFontSize(9);
                doc.text(`Total: ${er.totalObtained}/${er.totalMax} | Percentage: ${er.percentage}% | Average: ${er.average}`, 14, y);
                y += 10;
            });
        } else if (data.subjects) {
            const tableData = data.subjects.map(s => [s.subject?.name, s.marksObtained, s.maxMarks, s.percentage + '%', s.grade]);
            doc.autoTable({
                startY: y,
                head: [['Subject', 'Obtained', 'Max', 'Percentage', 'Grade']],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 9 },
                headStyles: { fillColor: [99, 102, 241] },
            });
            y = doc.lastAutoTable.finalY + 6;
        }

        // Summary
        const summary = data.summary;
        if (summary) {
            doc.setFillColor(240, 240, 255);
            doc.rect(14, y, 182, 28, 'F');
            doc.setTextColor(30, 41, 59);
            doc.setFontSize(11);
            doc.text(`Overall: ${summary.totalObtained}/${summary.totalMax}  |  Percentage: ${summary.percentage}%  |  Grade: ${summary.grade}`, 20, y + 10);
            if (summary.rank) doc.text(`Rank: ${summary.rank}`, 20, y + 20);
            if (summary.weightedScore) doc.text(`Weighted Score: ${summary.weightedScore}`, 100, y + 20);
        }

        doc.save(`Report_Card_${student.name}_${student.rollNumber}.pdf`);
        toast.success('PDF downloaded!');
    };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold gradient-text">Results & Report Cards</h1>
                <p className="text-slate-400 text-sm mt-1">View student results, class-wise analysis, and download report cards</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => { setMode('student'); setResult(null); setClassResults(null); }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'student' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'}`}>
                    Student Result
                </button>
                <button onClick={() => { setMode('class'); setResult(null); setClassResults(null); }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'class' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'}`}>
                    Class Results
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card p-5 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label>Class</label>
                        <select className="input-field" value={selClass} onChange={e => { setSelClass(e.target.value); setSelExam(''); setSelStudent(''); }}>
                            <option value="">Select Class</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section && `- ${c.section}`}</option>)}
                        </select>
                    </div>
                    <div><label>Exam (optional for student)</label>
                        <select className="input-field" value={selExam} onChange={e => setSelExam(e.target.value)}>
                            <option value="">All Exams</option>{exams.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                        </select>
                    </div>
                    {mode === 'student' && (
                        <div><label>Student</label>
                            <select className="input-field" value={selStudent} onChange={e => setSelStudent(e.target.value)}>
                                <option value="">Select Student</option>{students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
                            </select>
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={mode === 'student' ? fetchStudentResult : fetchClassResults} className="btn-primary" disabled={fetching}>
                        <HiSearch size={16} /> {fetching ? 'Loading...' : 'View Results'}
                    </button>
                </div>
            </div>

            {/* Student Result */}
            {result && (
                <div className="animate-fade-in">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Total', value: `${result.summary?.totalObtained}/${result.summary?.totalMax}`, color: 'from-blue-500 to-indigo-500' },
                            { label: 'Percentage', value: `${result.summary?.percentage}%`, color: 'from-indigo-500 to-purple-500' },
                            { label: 'Grade', value: result.summary?.grade || '-', color: 'from-emerald-500 to-teal-500' },
                            { label: result.summary?.rank ? 'Rank' : 'Weighted', value: result.summary?.rank ? `#${result.summary.rank}` : (result.summary?.weightedScore || '-'), color: 'from-amber-500 to-orange-500' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="glass-card p-4 text-center">
                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
                                <p className={`text-2xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Detailed tables */}
                    {result.examResults && result.examResults.map(er => (
                        <div key={er.exam?._id} className="glass-card p-5 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white font-bold">{er.exam?.name} <span className="badge badge-info ml-2">{er.exam?.type}</span></h3>
                                <span className="text-indigo-400 font-semibold">{er.percentage}%</span>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead><tr><th>Subject</th><th>Marks</th><th>Max</th><th>%</th><th>Grade</th></tr></thead>
                                    <tbody>{er.subjects.map(s => (
                                        <tr key={s.subject?._id}>
                                            <td className="text-white font-medium">{s.subject?.name}</td>
                                            <td className="text-indigo-400 font-semibold">{s.marksObtained}</td>
                                            <td>{s.maxMarks}</td>
                                            <td>{s.percentage}%</td>
                                            <td><span className="badge badge-success">{s.grade}</span></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {result.subjects && (
                        <div className="glass-card p-5 mb-4">
                            <h3 className="text-white font-bold mb-3">Subject-wise Marks</h3>
                            <div className="table-container">
                                <table>
                                    <thead><tr><th>Subject</th><th>Marks</th><th>Max</th><th>%</th><th>Grade</th></tr></thead>
                                    <tbody>{result.subjects.map(s => (
                                        <tr key={s.subject?._id}>
                                            <td className="text-white font-medium">{s.subject?.name}</td>
                                            <td className="text-indigo-400 font-semibold">{s.marksObtained}</td>
                                            <td>{s.maxMarks}</td>
                                            <td>{s.percentage}%</td>
                                            <td><span className="badge badge-success">{s.grade}</span></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Charts */}
                    {(result.subjects || result.examResults?.[0]?.subjects) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            <div className="glass-card p-5">
                                <h3 className="text-white font-bold mb-4">Marks Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={(result.subjects || result.examResults?.[0]?.subjects || []).map(s => ({
                                        name: s.subject?.name?.substring(0, 8), obtained: s.marksObtained, max: s.maxMarks
                                    }))}>
                                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#e2e8f0' }} />
                                        <Legend />
                                        <Bar dataKey="obtained" fill="#6366f1" radius={[4, 4, 0, 0]} name="Obtained" />
                                        <Bar dataKey="max" fill="#334155" radius={[4, 4, 0, 0]} name="Max" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="glass-card p-5">
                                <h3 className="text-white font-bold mb-4">Subject Score %</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={(result.subjects || result.examResults?.[0]?.subjects || []).map(s => ({ name: s.subject?.name, value: s.percentage }))}
                                            cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}
                                        >
                                            {(result.subjects || result.examResults?.[0]?.subjects || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#e2e8f0' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button onClick={generatePDF} className="btn-primary"><HiDocumentDownload size={16} /> Download PDF Report Card</button>
                    </div>
                </div>
            )}

            {/* Class Results */}
            {classResults && (
                <div className="animate-fade-in">
                    <div className="glass-card p-5 mb-4">
                        <h3 className="text-white font-bold mb-1">Class Results: {classResults.exam?.name}</h3>
                        <p className="text-slate-400 text-sm">{classResults.results?.length} students</p>
                    </div>
                    <div className="table-container glass-card mb-4">
                        <table>
                            <thead><tr><th>Rank</th><th>Student</th><th>Roll No</th><th>Total</th><th>%</th><th>Grade</th></tr></thead>
                            <tbody>
                                {classResults.results?.map(r => (
                                    <tr key={r.student?._id}>
                                        <td><span className={`inline-flex w-8 h-8 items-center justify-center rounded-full font-bold text-sm ${r.rank <= 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{r.rank}</span></td>
                                        <td className="text-white font-medium">{r.student?.name}</td>
                                        <td className="font-mono text-indigo-400">{r.student?.rollNumber}</td>
                                        <td>{r.totalObtained}/{r.totalMax}</td>
                                        <td className="font-semibold text-white">{r.percentage}%</td>
                                        <td><span className="badge badge-success">{r.grade}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {classResults.results?.length > 0 && (
                        <div className="glass-card p-5">
                            <h3 className="text-white font-bold mb-4">Performance Overview</h3>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={classResults.results?.map(r => ({ name: r.student?.name?.split(' ')[0], percentage: r.percentage }))}>
                                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                                    <YAxis tick={{ fill: '#94a3b8' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#e2e8f0' }} />
                                    <Bar dataKey="percentage" fill="#6366f1" radius={[4, 4, 0, 0]} name="Percentage" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
