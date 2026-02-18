import { useState, useEffect } from 'react';
import { marksAPI, studentAPI, subjectAPI, examAPI, classAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../components/Modal';
import Loader from '../components/Loader';
import { HiTrash, HiUpload } from 'react-icons/hi';

export default function MarksEntryPage() {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);
    const [marks, setMarks] = useState([]);
    const [selClass, setSelClass] = useState('');
    const [selExam, setSelExam] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [markEntries, setMarkEntries] = useState({});

    useEffect(() => {
        classAPI.getAll().then(r => setClasses(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!selClass) { setStudents([]); setSubjects([]); setExams([]); return; }
        Promise.all([
            studentAPI.getAll({ class: selClass }),
            subjectAPI.getAll(selClass),
            examAPI.getAll(selClass),
        ]).then(([s, sub, ex]) => { setStudents(s.data); setSubjects(sub.data); setExams(ex.data); });
    }, [selClass]);

    useEffect(() => {
        if (!selClass || !selExam) { setMarks([]); return; }
        marksAPI.getAll({ exam: selExam }).then(r => setMarks(r.data)).catch(() => { });
    }, [selClass, selExam]);

    const getExistingMark = (studentId, subjectId) => {
        return marks.find(m =>
            (m.student?._id || m.student) === studentId &&
            (m.subject?._id || m.subject) === subjectId
        );
    };

    const handleMarkChange = (studentId, subjectId, value) => {
        setMarkEntries(prev => ({ ...prev, [`${studentId}_${subjectId}`]: value }));
    };

    const submitMarks = async () => {
        const entries = Object.entries(markEntries).filter(([, v]) => v !== '' && v !== undefined);
        if (entries.length === 0) { toast.error('No marks to submit'); return; }

        setSubmitting(true);
        const marksToSubmit = entries.map(([key, value]) => {
            const [student, subject] = key.split('_');
            return { student, subject, exam: selExam, marksObtained: Number(value) };
        });

        try {
            const res = await marksAPI.bulkCreate(marksToSubmit);
            toast.success(res.message);
            setMarkEntries({});
            // Reload marks
            const r = await marksAPI.getAll({ exam: selExam });
            setMarks(r.data);
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit marks'); }
        setSubmitting(false);
    };

    const confirmDelete = async () => {
        try { await marksAPI.delete(deleteModal.id); toast.success('Deleted'); const r = await marksAPI.getAll({ exam: selExam }); setMarks(r.data); }
        catch { toast.error('Failed'); }
        setDeleteModal({ open: false, id: null });
    };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold gradient-text">Marks Entry</h1>
                <p className="text-slate-400 text-sm mt-1">Enter marks per student per subject per exam</p>
            </div>

            <div className="glass-card p-5 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label>Select Class</label>
                        <select className="input-field" value={selClass} onChange={e => { setSelClass(e.target.value); setSelExam(''); setMarkEntries({}); }}>
                            <option value="">Choose a class</option>
                            {classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section && `- ${c.section}`} ({c.school?.name})</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Select Exam</label>
                        <select className="input-field" value={selExam} onChange={e => { setSelExam(e.target.value); setMarkEntries({}); }}>
                            <option value="">Choose an exam</option>
                            {exams.map(e => <option key={e._id} value={e._id}>{e.name} ({e.type})</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {selClass && selExam && students.length > 0 && subjects.length > 0 && (
                <>
                    <div className="table-container glass-card mb-4">
                        <table>
                            <thead>
                                <tr>
                                    <th className="sticky left-0 bg-slate-900/95 z-10">Student</th>
                                    {subjects.map(sub => <th key={sub._id}>{sub.name}<div className="text-indigo-400 text-[10px] font-normal normal-case">Max: {sub.maxMarks}</div></th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(stu => (
                                    <tr key={stu._id}>
                                        <td className="sticky left-0 bg-slate-900/80 z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">{stu.name?.[0]}</div>
                                                <div><span className="text-white font-medium text-sm">{stu.name}</span><p className="text-slate-500 text-[10px]">{stu.rollNumber}</p></div>
                                            </div>
                                        </td>
                                        {subjects.map(sub => {
                                            const existing = getExistingMark(stu._id, sub._id);
                                            return (
                                                <td key={sub._id}>
                                                    {existing ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-emerald-400 font-semibold">{existing.marksObtained}</span>
                                                            <span className="badge badge-success">{existing.grade}</span>
                                                            <button onClick={() => setDeleteModal({ open: true, id: existing._id })} className="text-red-400 hover:text-red-300 transition-colors ml-1"><HiTrash size={12} /></button>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            className="input-field w-20 text-center py-1.5 text-sm"
                                                            min="0"
                                                            max={sub.maxMarks}
                                                            value={markEntries[`${stu._id}_${sub._id}`] || ''}
                                                            onChange={e => handleMarkChange(stu._id, sub._id, e.target.value)}
                                                            placeholder="—"
                                                        />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={submitMarks} disabled={submitting} className="btn-primary">
                            <HiUpload size={16} /> {submitting ? 'Submitting...' : 'Submit Marks'}
                        </button>
                    </div>
                </>
            )}

            {selClass && selExam && (students.length === 0 || subjects.length === 0) && (
                <div className="glass-card p-8 text-center text-slate-500">
                    {students.length === 0 ? 'No students in this class.' : 'No subjects for this class.'}
                </div>
            )}

            {(!selClass || !selExam) && (
                <div className="glass-card p-8 text-center text-slate-500">
                    Select a class and exam to start entering marks
                </div>
            )}

            <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={confirmDelete} message="Delete this marks entry?" />
        </div>
    );
}
