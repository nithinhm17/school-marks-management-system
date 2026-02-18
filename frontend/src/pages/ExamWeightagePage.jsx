import { useState, useEffect } from 'react';
import { examWeightageAPI, examAPI, schoolAPI, classAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal, { ConfirmModal } from '../components/Modal';
import Loader from '../components/Loader';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function ExamWeightagePage() {
    const [weightages, setWeightages] = useState([]);
    const [exams, setExams] = useState([]);
    const [schools, setSchools] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ exam: '', school: '', class: '', weightagePercent: 0 });

    const load = async () => {
        try {
            const [w, e, s, c] = await Promise.all([examWeightageAPI.getAll({}), examAPI.getAll(), schoolAPI.getAll(), classAPI.getAll()]);
            setWeightages(w.data); setExams(e.data); setSchools(s.data); setClasses(c.data);
        } catch { toast.error('Failed to load'); }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await examWeightageAPI.update(editing, form); toast.success('Updated'); }
            else { await examWeightageAPI.create(form); toast.success('Created'); }
            setModalOpen(false); setEditing(null); setForm({ exam: '', school: '', class: '', weightagePercent: 0 }); load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const openEdit = (w) => { setEditing(w._id); setForm({ exam: w.exam?._id || '', school: w.school?._id || '', class: w.class?._id || '', weightagePercent: w.weightagePercent }); setModalOpen(true); };
    const confirmDelete = async () => { try { await examWeightageAPI.delete(deleteModal.id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteModal({ open: false, id: null }); };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold gradient-text">Exam Weightage</h1><p className="text-slate-400 text-sm mt-1">Define weightage percentages for exams</p></div>
                <button onClick={() => { setEditing(null); setForm({ exam: '', school: '', class: '', weightagePercent: 0 }); setModalOpen(true); }} className="btn-primary"><HiPlus size={16} /> Add</button>
            </div>

            <div className="table-container glass-card">
                <table>
                    <thead><tr><th>Exam</th><th>School</th><th>Class</th><th>Weightage %</th><th>Actions</th></tr></thead>
                    <tbody>
                        {weightages.map(w => (
                            <tr key={w._id}>
                                <td className="text-white font-semibold">{w.exam?.name}</td>
                                <td>{w.school?.name}</td>
                                <td><span className="badge badge-info">{w.class?.name}</span></td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-2 rounded-full bg-slate-700 overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${w.weightagePercent}%` }} /></div>
                                        <span className="text-indigo-400 font-semibold">{w.weightagePercent}%</span>
                                    </div>
                                </td>
                                <td><div className="flex gap-2">
                                    <button onClick={() => openEdit(w)} className="btn-secondary text-xs"><HiPencil size={12} /></button>
                                    <button onClick={() => setDeleteModal({ open: true, id: w._id })} className="btn-danger text-xs"><HiTrash size={12} /></button>
                                </div></td>
                            </tr>
                        ))}
                        {weightages.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-slate-500">No weightages configured</td></tr>}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Weightage' : 'Add Weightage'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label>Exam</label><select className="input-field" value={form.exam} onChange={e => setForm({ ...form, exam: e.target.value })} required><option value="">Select Exam</option>{exams.map(ex => <option key={ex._id} value={ex._id}>{ex.name} ({ex.type})</option>)}</select></div>
                    <div><label>School</label><select className="input-field" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required><option value="">Select School</option>{schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
                    <div><label>Class</label><select className="input-field" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required><option value="">Select Class</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section && `- ${c.section}`}</option>)}</select></div>
                    <div><label>Weightage Percentage</label><input type="number" className="input-field" value={form.weightagePercent} onChange={e => setForm({ ...form, weightagePercent: Number(e.target.value) })} min="0" max="100" required /></div>
                    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
                </form>
            </Modal>
            <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={confirmDelete} message="Delete this weightage?" />
        </div>
    );
}
