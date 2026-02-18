import { NavLink } from 'react-router-dom';
import { HiAcademicCap, HiOfficeBuilding, HiBookOpen, HiUsers, HiClipboardList, HiChartBar, HiDocumentReport, HiCog, HiCollection, HiScale } from 'react-icons/hi';

const links = [
    { to: '/', label: 'Dashboard', icon: HiChartBar },
    { to: '/boards', label: 'Academic Boards', icon: HiAcademicCap },
    { to: '/schools', label: 'Schools', icon: HiOfficeBuilding },
    { to: '/classes', label: 'Classes', icon: HiCollection },
    { to: '/subjects', label: 'Subjects', icon: HiBookOpen },
    { to: '/students', label: 'Students', icon: HiUsers },
    { to: '/exams', label: 'Exams', icon: HiClipboardList },
    { to: '/grade-ranges', label: 'Grade Ranges', icon: HiScale },
    { to: '/exam-weightage', label: 'Exam Weightage', icon: HiCog },
    { to: '/marks', label: 'Marks Entry', icon: HiDocumentReport },
    { to: '/results', label: 'Results', icon: HiChartBar },
];

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
            <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-5 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <HiAcademicCap size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white tracking-tight">SchoolMarks</h1>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Management System</p>
                        </div>
                    </div>
                </div>
                <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100vh-80px)]">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white shadow-lg shadow-indigo-500/5 border border-indigo-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <Icon size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}
