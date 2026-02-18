import { useState, useEffect } from 'react';
import { classAPI, schoolAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal, { ConfirmModal } from '../components/Modal';
import Loader from '../components/Loader';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function ClassesPage() {
    const [classes, setClasses] = useState([]);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', section: '', school: '', academicYear: '2025-2026' });
    const [filterSchool, setFilterSchool] = useState('');

    const load = async () => {
        try {
            const [c, s] = await Promise.all([classAPI.getAll(filterSchool || undefined), schoolAPI.getAll()]);
            setClasses(c.data); setSchools(s.data);
        } catch { toast.error('Failed to load'); }
        setLoading(false);
    };

    useEffect(() => { load(); }, [filterSchool]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await classAPI.update(editing, form); toast.success('Class updated'); }
            else { await classAPI.create(form); toast.success('Class created'); }
            setModalOpen(false); setEditing(null); setForm({ name: '', section: '', school: '', academicYear: '2025-2026' }); load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const openEdit = (c) => { setEditing(c._id); setForm({ name: c.name, section: c.section || '', school: c.school?._id || '', academicYear: c.academicYear }); setModalOpen(true); };
    const confirmDelete = async () => { try { await classAPI.delete(deleteModal.id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteModal({ open: false, id: null }); };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div><h1 className="text-2xl font-bold gradient-text">Classes</h1><p className="text-slate-400 text-sm mt-1">Manage classes for each school</p></div>
                <div className="flex gap-3 items-center">
                    <select className="input-field w-48" value={filterSchool} onChange={e => setFilterSchool(e.target.value)}>
                        <option value="">All Schools</option>{schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                    <button onClick={() => { setEditing(null); setForm({ name: '', section: '', school: '', academicYear: '2025-2026' }); setModalOpen(true); }} className="btn-primary"><HiPlus size={16} /> Add</button>
                </div>
            </div>

            <div className="table-container glass-card">
                <table>
                    <thead><tr><th>Class</th><th>Section</th><th>School</th><th>Year</th><th>Actions</th></tr></thead>
                    <tbody>
                        {classes.map(c => (
                            <tr key={c._id}>
                                <td className="text-white font-semibold">{c.name}</td>
                                <td>{c.section || '-'}</td>
                                <td><span className="badge badge-info">{c.school?.name}</span></td>
                                <td>{c.academicYear}</td>
                                <td><div className="flex gap-2">
                                    <button onClick={() => openEdit(c)} className="btn-secondary flex items-center gap-1 text-xs"><HiPencil size={12} /> Edit</button>
                                    <button onClick={() => setDeleteModal({ open: true, id: c._id })} className="btn-danger text-xs"><HiTrash size={12} /></button>
                                </div></td>
                            </tr>
                        ))}
                        {classes.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-slate-500">No classes found</td></tr>}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Class' : 'Add Class'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label>Class Name</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., 10th" required /></div>
                        <div><label>Section</label><input className="input-field" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} placeholder="e.g., A" /></div>
                    </div>
                    <div><label>School</label><select className="input-field" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required><option value="">Select School</option>{schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
                    <div><label>Academic Year</label><input className="input-field" value={form.academicYear} onChange={e => setForm({ ...form, academicYear: e.target.value })} required /></div>
                    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
                </form>
            </Modal>
            <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={confirmDelete} message="Delete this class?" />
        </div>
    );
}
