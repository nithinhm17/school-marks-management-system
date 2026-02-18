import { useState, useEffect } from 'react';
import { boardAPI, schoolAPI, classAPI, subjectAPI, studentAPI, examAPI } from '../services/api';
import { HiAcademicCap, HiOfficeBuilding, HiBookOpen, HiUsers, HiClipboardList, HiCollection } from 'react-icons/hi';
import Loader from '../components/Loader';

const statCards = [
    { key: 'boards', label: 'Academic Boards', icon: HiAcademicCap, gradient: 'from-blue-500 to-cyan-400' },
    { key: 'schools', label: 'Schools', icon: HiOfficeBuilding, gradient: 'from-indigo-500 to-purple-500' },
    { key: 'classes', label: 'Classes', icon: HiCollection, gradient: 'from-purple-500 to-pink-500' },
    { key: 'subjects', label: 'Subjects', icon: HiBookOpen, gradient: 'from-emerald-500 to-teal-400' },
    { key: 'students', label: 'Students', icon: HiUsers, gradient: 'from-orange-500 to-amber-400' },
    { key: 'exams', label: 'Exams', icon: HiClipboardList, gradient: 'from-rose-500 to-pink-400' },
];

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [boards, schools, classes, subjects, students, exams] = await Promise.all([
                    boardAPI.getAll(), schoolAPI.getAll(), classAPI.getAll(),
                    subjectAPI.getAll(), studentAPI.getAll({}), examAPI.getAll(),
                ]);
                setStats({
                    boards: boards.data?.length || 0,
                    schools: schools.data?.length || 0,
                    classes: classes.data?.length || 0,
                    subjects: subjects.data?.length || 0,
                    students: students.data?.length || 0,
                    exams: exams.data?.length || 0,
                });
            } catch { setStats({ boards: 0, schools: 0, classes: 0, subjects: 0, students: 0, exams: 0 }); }
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
                <p className="text-slate-400 text-sm">Overview of your school management system</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {statCards.map(({ key, label, icon: Icon, gradient }, i) => (
                    <div key={key} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                                <Icon size={20} className="text-white" />
                            </div>
                            <span className="text-3xl font-bold text-white">{stats[key] ?? 0}</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{label}</p>
                        <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000`}
                                style={{ width: `${Math.min((stats[key] || 0) * 10, 100)}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 glass-card p-6">
                <h2 className="text-lg font-bold text-white mb-4">Quick Start Guide</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { step: '1', title: 'Create Academic Board', desc: 'Define your board type (CBSE, State, etc.)' },
                        { step: '2', title: 'Add School', desc: 'Register your school with the board' },
                        { step: '3', title: 'Set Up Classes & Subjects', desc: 'Create classes and assign subjects' },
                        { step: '4', title: 'Configure Exams & Grades', desc: 'Define exam structure and grade ranges' },
                        { step: '5', title: 'Add Students', desc: 'Register students in their classes' },
                        { step: '6', title: 'Enter Marks & View Results', desc: 'Input marks and generate report cards' },
                    ].map(({ step, title, desc }) => (
                        <div key={step} className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">{step}</div>
                            <div>
                                <p className="text-white text-sm font-semibold">{title}</p>
                                <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
