import { useState, useEffect } from 'react';
import { schoolAPI, boardAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal, { ConfirmModal } from '../components/Modal';
import Loader from '../components/Loader';
import { HiPlus, HiPencil, HiTrash, HiOfficeBuilding } from 'react-icons/hi';

export default function SchoolsPage() {
    const [schools, setSchools] = useState([]);
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', address: '', board: '', contactEmail: '', contactPhone: '' });

    const load = async () => {
        try {
            const [s, b] = await Promise.all([schoolAPI.getAll(), boardAPI.getAll()]);
            setSchools(s.data); setBoards(b.data);
        } catch { toast.error('Failed to load'); }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await schoolAPI.update(editing, form); toast.success('School updated'); }
            else { await schoolAPI.create(form); toast.success('School created'); }
            setModalOpen(false); setEditing(null); setForm({ name: '', address: '', board: '', contactEmail: '', contactPhone: '' }); load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const openEdit = (s) => { setEditing(s._id); setForm({ name: s.name, address: s.address || '', board: s.board?._id || '', contactEmail: s.contactEmail || '', contactPhone: s.contactPhone || '' }); setModalOpen(true); };
    const confirmDelete = async () => { try { await schoolAPI.delete(deleteModal.id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteModal({ open: false, id: null }); };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold gradient-text">Schools</h1><p className="text-slate-400 text-sm mt-1">Manage schools and their board associations</p></div>
                <button onClick={() => { setEditing(null); setForm({ name: '', address: '', board: '', contactEmail: '', contactPhone: '' }); setModalOpen(true); }} className="btn-primary"><HiPlus size={16} /> Add School</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schools.map((s, i) => (
                    <div key={s._id} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><HiOfficeBuilding className="text-white" size={18} /></div>
                                <div><h3 className="text-white font-bold">{s.name}</h3>{s.board && <span className="badge badge-info mt-1">{s.board.name}</span>}</div>
                            </div>
                        </div>
                        {s.address && <p className="text-slate-400 text-sm mb-1">📍 {s.address}</p>}
                        {s.contactEmail && <p className="text-slate-400 text-sm mb-1">✉️ {s.contactEmail}</p>}
                        {s.contactPhone && <p className="text-slate-400 text-sm">📞 {s.contactPhone}</p>}
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => openEdit(s)} className="btn-secondary flex items-center gap-1"><HiPencil size={14} /> Edit</button>
                            <button onClick={() => setDeleteModal({ open: true, id: s._id })} className="btn-danger flex items-center gap-1"><HiTrash size={14} /> Delete</button>
                        </div>
                    </div>
                ))}
                {schools.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No schools yet. Add your first school.</div>}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit School' : 'Add School'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label>School Name</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                    <div><label>Academic Board</label><select className="input-field" value={form.board} onChange={e => setForm({ ...form, board: e.target.value })} required><option value="">Select Board</option>{boards.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
                    <div><label>Address</label><input className="input-field" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label>Email</label><input className="input-field" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} /></div>
                        <div><label>Phone</label><input className="input-field" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} /></div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
                </form>
            </Modal>
            <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={confirmDelete} message="This will permanently delete this school." />
        </div>
    );
}
