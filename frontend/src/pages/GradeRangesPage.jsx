import { useState, useEffect } from 'react';
import { gradeRangeAPI, schoolAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal, { ConfirmModal } from '../components/Modal';
import Loader from '../components/Loader';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

const gradeColors = { 'A+': 'from-emerald-400 to-green-500', 'A': 'from-green-400 to-teal-500', 'B+': 'from-blue-400 to-indigo-500', 'B': 'from-indigo-400 to-purple-500', 'C+': 'from-yellow-400 to-amber-500', 'C': 'from-amber-400 to-orange-500', 'D': 'from-orange-400 to-red-500', 'F': 'from-red-400 to-rose-600' };

export default function GradeRangesPage() {
    const [grades, setGrades] = useState([]);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ school: '', grade: '', minPercentage: 0, maxPercentage: 100, description: '' });
    const [filterSchool, setFilterSchool] = useState('');

    const load = async () => {
        try {
            const [g, s] = await Promise.all([gradeRangeAPI.getAll(filterSchool || undefined), schoolAPI.getAll()]);
            setGrades(g.data); setSchools(s.data);
        } catch { toast.error('Failed to load'); }
        setLoading(false);
    };

    useEffect(() => { load(); }, [filterSchool]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await gradeRangeAPI.update(editing, form); toast.success('Updated'); }
            else { await gradeRangeAPI.create(form); toast.success('Created'); }
            setModalOpen(false); setEditing(null); setForm({ school: '', grade: '', minPercentage: 0, maxPercentage: 100, description: '' }); load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const openEdit = (g) => { setEditing(g._id); setForm({ school: g.school?._id || '', grade: g.grade, minPercentage: g.minPercentage, maxPercentage: g.maxPercentage, description: g.description || '' }); setModalOpen(true); };
    const confirmDelete = async () => { try { await gradeRangeAPI.delete(deleteModal.id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteModal({ open: false, id: null }); };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div><h1 className="text-2xl font-bold gradient-text">Grade Ranges</h1><p className="text-slate-400 text-sm mt-1">Define grading scale for each school</p></div>
                <div className="flex gap-3 items-center">
                    <select className="input-field w-48" value={filterSchool} onChange={e => setFilterSchool(e.target.value)}>
                        <option value="">All Schools</option>{schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                    <button onClick={() => { setEditing(null); setForm({ school: '', grade: '', minPercentage: 0, maxPercentage: 100, description: '' }); setModalOpen(true); }} className="btn-primary"><HiPlus size={16} /> Add</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {grades.map((g, i) => {
                    const color = gradeColors[g.grade] || 'from-slate-400 to-slate-500';
                    return (
                        <div key={g._id} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
                                <span className="text-white text-xl font-black">{g.grade}</span>
                            </div>
                            <p className="text-white font-semibold">{g.minPercentage}% — {g.maxPercentage}%</p>
                            {g.description && <p className="text-slate-500 text-xs mt-1">{g.description}</p>}
                            <p className="text-slate-500 text-xs mt-1">{g.school?.name}</p>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => openEdit(g)} className="btn-secondary text-xs"><HiPencil size={12} /></button>
                                <button onClick={() => setDeleteModal({ open: true, id: g._id })} className="btn-danger text-xs"><HiTrash size={12} /></button>
                            </div>
                        </div>
                    );
                })}
                {grades.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No grade ranges. Define your grading scale.</div>}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Grade' : 'Add Grade Range'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label>School</label><select className="input-field" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required><option value="">Select School</option>{schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
                    <div><label>Grade</label><input className="input-field" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="e.g., A+" required /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label>Min %</label><input type="number" className="input-field" value={form.minPercentage} onChange={e => setForm({ ...form, minPercentage: Number(e.target.value) })} min="0" max="100" required /></div>
                        <div><label>Max %</label><input type="number" className="input-field" value={form.maxPercentage} onChange={e => setForm({ ...form, maxPercentage: Number(e.target.value) })} min="0" max="100" required /></div>
                    </div>
                    <div><label>Description</label><input className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g., Outstanding" /></div>
                    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
                </form>
            </Modal>
            <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={confirmDelete} message="Delete this grade range?" />
        </div>
    );
}
