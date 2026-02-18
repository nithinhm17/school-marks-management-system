import { useState, useEffect } from 'react';
import { subjectAPI, classAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal, { ConfirmModal } from '../components/Modal';
import Loader from '../components/Loader';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', code: '', class: '', maxMarks: 100 });
    const [filterClass, setFilterClass] = useState('');

    const load = async () => {
        try {
            const [s, c] = await Promise.all([subjectAPI.getAll(filterClass || undefined), classAPI.getAll()]);
            setSubjects(s.data); setClasses(c.data);
        } catch { toast.error('Failed to load'); }
        setLoading(false);
    };

    useEffect(() => { load(); }, [filterClass]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await subjectAPI.update(editing, form); toast.success('Subject updated'); }
            else { await subjectAPI.create(form); toast.success('Subject created'); }
            setModalOpen(false); setEditing(null); setForm({ name: '', code: '', class: '', maxMarks: 100 }); load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const openEdit = (s) => { setEditing(s._id); setForm({ name: s.name, code: s.code || '', class: s.class?._id || '', maxMarks: s.maxMarks }); setModalOpen(true); };
    const confirmDelete = async () => { try { await subjectAPI.delete(deleteModal.id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteModal({ open: false, id: null }); };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div><h1 className="text-2xl font-bold gradient-text">Subjects</h1><p className="text-slate-400 text-sm mt-1">Manage subjects per class</p></div>
                <div className="flex gap-3 items-center">
                    <select className="input-field w-48" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                        <option value="">All Classes</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section && `- ${c.section}`} ({c.school?.name})</option>)}
                    </select>
                    <button onClick={() => { setEditing(null); setForm({ name: '', code: '', class: '', maxMarks: 100 }); setModalOpen(true); }} className="btn-primary"><HiPlus size={16} /> Add</button>
                </div>
            </div>

            <div className="table-container glass-card">
                <table>
                    <thead><tr><th>Subject</th><th>Code</th><th>Class</th><th>Max Marks</th><th>Actions</th></tr></thead>
                    <tbody>
                        {subjects.map(s => (
                            <tr key={s._id}>
                                <td className="text-white font-semibold">{s.name}</td>
                                <td>{s.code || '-'}</td>
                                <td><span className="badge badge-info">{s.class?.name} {s.class?.section && `- ${s.class.section}`}</span></td>
                                <td><span className="font-semibold text-indigo-400">{s.maxMarks}</span></td>
                                <td><div className="flex gap-2">
                                    <button onClick={() => openEdit(s)} className="btn-secondary text-xs flex items-center gap-1"><HiPencil size={12} /> Edit</button>
                                    <button onClick={() => setDeleteModal({ open: true, id: s._id })} className="btn-danger text-xs"><HiTrash size={12} /></button>
                                </div></td>
                            </tr>
                        ))}
                        {subjects.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-slate-500">No subjects found</td></tr>}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Subject' : 'Add Subject'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label>Subject Name</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div><label>Code</label><input className="input-field" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g., MATH" /></div>
                    </div>
                    <div><label>Class</label><select className="input-field" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required><option value="">Select Class</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section && `- ${c.section}`} ({c.school?.name})</option>)}</select></div>
                    <div><label>Maximum Marks</label><input type="number" className="input-field" value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: Number(e.target.value) })} min="1" required /></div>
                    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
                </form>
            </Modal>
            <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={confirmDelete} message="Delete this subject?" />
        </div>
    );
}
