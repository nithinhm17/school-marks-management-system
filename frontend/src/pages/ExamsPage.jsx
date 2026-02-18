import { useState, useEffect } from 'react';
import { examAPI, classAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal, { ConfirmModal } from '../components/Modal';
import Loader from '../components/Loader';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function ExamsPage() {
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', type: '', class: '', academicYear: '2025-2026', maxMarks: 100, description: '' });
    const [filterClass, setFilterClass] = useState('');

    const load = async () => {
        try {
            const [e, c] = await Promise.all([examAPI.getAll(filterClass || undefined), classAPI.getAll()]);
            setExams(e.data); setClasses(c.data);
        } catch { toast.error('Failed to load'); }
        setLoading(false);
    };

    useEffect(() => { load(); }, [filterClass]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await examAPI.update(editing, form); toast.success('Exam updated'); }
            else { await examAPI.create(form); toast.success('Exam created'); }
            setModalOpen(false); setEditing(null); setForm({ name: '', type: '', class: '', academicYear: '2025-2026', maxMarks: 100, description: '' }); load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const openEdit = (ex) => {
        setEditing(ex._id);
        setForm({ name: ex.name, type: ex.type, class: ex.class?._id || '', academicYear: ex.academicYear, maxMarks: ex.maxMarks, description: ex.description || '' });
        setModalOpen(true);
    };
    const confirmDelete = async () => { try { await examAPI.delete(deleteModal.id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteModal({ open: false, id: null }); };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div><h1 className="text-2xl font-bold gradient-text">Exams</h1><p className="text-slate-400 text-sm mt-1">Configure exam types — Monthly Test, F1, Midterm, Final, or any custom exam</p></div>
                <div className="flex gap-3 items-center">
                    <select className="input-field w-48" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                        <option value="">All Classes</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section && `- ${c.section}`}</option>)}
                    </select>
                    <button onClick={() => { setEditing(null); setForm({ name: '', type: '', class: '', academicYear: '2025-2026', maxMarks: 100, description: '' }); setModalOpen(true); }} className="btn-primary"><HiPlus size={16} /> Add</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exams.map((ex, i) => (
                    <div key={ex._id} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-white font-bold">{ex.name}</h3>
                            <span className="badge badge-info">{ex.type}</span>
                        </div>
                        <p className="text-slate-400 text-sm">Class: <span className="text-white">{ex.class?.name} {ex.class?.section && `- ${ex.class.section}`}</span></p>
                        <p className="text-slate-400 text-sm">Max Marks: <span className="text-indigo-400 font-semibold">{ex.maxMarks}</span></p>
                        <p className="text-slate-400 text-sm">Year: {ex.academicYear}</p>
                        {ex.description && <p className="text-slate-500 text-xs mt-2">{ex.description}</p>}
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => openEdit(ex)} className="btn-secondary text-xs flex items-center gap-1"><HiPencil size={12} /> Edit</button>
                            <button onClick={() => setDeleteModal({ open: true, id: ex._id })} className="btn-danger text-xs"><HiTrash size={12} /></button>
                        </div>
                    </div>
                ))}
                {exams.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No exams configured yet</div>}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Exam' : 'Create Exam'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label>Exam Name</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Midterm Exam" required /></div>
                        <div><label>Exam Type</label><input className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="e.g., Monthly, F1, Final" required /></div>
                    </div>
                    <div><label>Class</label><select className="input-field" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required><option value="">Select Class</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section && `- ${c.section}`} ({c.school?.name})</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label>Academic Year</label><input className="input-field" value={form.academicYear} onChange={e => setForm({ ...form, academicYear: e.target.value })} required /></div>
                        <div><label>Max Marks</label><input type="number" className="input-field" value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: Number(e.target.value) })} min="1" required /></div>
                    </div>
                    <div><label>Description</label><input className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
                </form>
            </Modal>
            <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={confirmDelete} message="Delete this exam?" />
        </div>
    );
}
