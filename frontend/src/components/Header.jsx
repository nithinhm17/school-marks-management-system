import { HiMenu } from 'react-icons/hi';

export default function Header({ onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
            <div className="flex items-center justify-between px-4 lg:px-6 h-14">
                <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-white/5 lg:hidden text-slate-400">
                    <HiMenu size={20} />
                </button>
                <div className="text-xs text-slate-500 font-medium hidden sm:block">
                    School Marks Management System
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
}
