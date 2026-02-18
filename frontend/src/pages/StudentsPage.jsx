import { useState, useEffect } from 'react';
import { studentAPI, classAPI, schoolAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal, { ConfirmModal } from '../components/Modal';
import Loader from '../components/Loader';
import { HiPlus, HiPencil, HiTrash, HiUser } from 'react-icons/hi';

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', rollNumber: '', class: '', school: '', parentName: '', contactPhone: '' });
    const [filterClass, setFilterClass] = useState('');

    const load = async () => {
        try {
            const params = {};
            if (filterClass) params.class = filterClass;
            const [s, c, sc] = await Promise.all([studentAPI.getAll(params), classAPI.getAll(), schoolAPI.getAll()]);
            setStudents(s.data); setClasses(c.data); setSchools(sc.data);
        } catch { toast.error('Failed to load'); }
        setLoading(false);
    };

    useEffect(() => { load(); }, [filterClass]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await studentAPI.update(editing, form); toast.success('Student updated'); }
            else { await studentAPI.create(form); toast.success('Student added'); }
            setModalOpen(false); setEditing(null); setForm({ name: '', rollNumber: '', class: '', school: '', parentName: '', contactPhone: '' }); load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const openEdit = (s) => {
        setEditing(s._id);
        setForm({ name: s.name, rollNumber: s.rollNumber, class: s.class?._id || '', school: s.school?._id || '', parentName: s.parentName || '', contactPhone: s.contactPhone || '' });
        setModalOpen(true);
    };
    const confirmDelete = async () => { try { await studentAPI.delete(deleteModal.id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteModal({ open: false, id: null }); };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div><h1 className="text-2xl font-bold gradient-text">Students</h1><p className="text-slate-400 text-sm mt-1">Manage student records</p></div>
                <div className="flex gap-3 items-center">
                    <select className="input-field w-48" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                        <option value="">All Classes</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section && `- ${c.section}`}</option>)}
                    </select>
                    <button onClick={() => { setEditing(null); setForm({ name: '', rollNumber: '', class: '', school: '', parentName: '', contactPhone: '' }); setModalOpen(true); }} className="btn-primary"><HiPlus size={16} /> Add</button>
                </div>
            </div>

            <div className="table-container glass-card">
                <table>
                    <thead><tr><th>Student</th><th>Roll No</th><th>Class</th><th>School</th><th>Parent</th><th>Actions</th></tr></thead>
                    <tbody>
                        {students.map(s => (
                            <tr key={s._id}>
                                <td><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{s.name?.[0]}</div><span className="text-white font-semibold">{s.name}</span></div></td>
                                <td><span className="font-mono text-indigo-400">{s.rollNumber}</span></td>
                                <td><span className="badge badge-info">{s.class?.name} {s.class?.section && `- ${s.class.section}`}</span></td>
                                <td>{s.school?.name || '-'}</td>
                                <td>{s.parentName || '-'}</td>
                                <td><div className="flex gap-2">
                                    <button onClick={() => openEdit(s)} className="btn-secondary text-xs flex items-center gap-1"><HiPencil size={12} /> Edit</button>
                                    <button onClick={() => setDeleteModal({ open: true, id: s._id })} className="btn-danger text-xs"><HiTrash size={12} /></button>
                                </div></td>
                            </tr>
                        ))}
                        {students.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-slate-500">No students found</td></tr>}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Student' : 'Add Student'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label>Student Name</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div><label>Roll Number</label><input className="input-field" value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} required /></div>
                    </div>
                    <div><label>School</label><select className="input-field" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required><option value="">Select School</option>{schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
                    <div><label>Class</label><select className="input-field" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required><option value="">Select Class</option>{classes.filter(c => !form.school || c.school?._id === form.school).map(c => <option key={c._id} value={c._id}>{c.name} {c.section && `- ${c.section}`}</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label>Parent Name</label><input className="input-field" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} /></div>
                        <div><label>Phone</label><input className="input-field" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} /></div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
                </form>
            </Modal>
            <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={confirmDelete} message="Delete this student?" />
        </div>
    );
}
