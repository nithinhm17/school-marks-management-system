import { useState, useEffect } from 'react';
import { boardAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal, { ConfirmModal } from '../components/Modal';
import Loader from '../components/Loader';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function BoardsPage() {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });

    const load = async () => {
        try {
            const res = await boardAPI.getAll();
            setBoards(res.data);
        } catch { toast.error('Failed to load boards'); }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await boardAPI.update(editing, form);
                toast.success('Board updated');
            } else {
                await boardAPI.create(form);
                toast.success('Board created');
            }
            setModalOpen(false);
            setEditing(null);
            setForm({ name: '', description: '' });
            load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const openEdit = (b) => { setEditing(b._id); setForm({ name: b.name, description: b.description || '' }); setModalOpen(true); };
    const confirmDelete = async () => {
        try { await boardAPI.delete(deleteModal.id); toast.success('Deleted'); load(); }
        catch { toast.error('Failed to delete'); }
        setDeleteModal({ open: false, id: null });
    };

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold gradient-text">Academic Boards</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage academic boards (CBSE, State, ICSE, etc.)</p>
                </div>
                <button onClick={() => { setEditing(null); setForm({ name: '', description: '' }); setModalOpen(true); }} className="btn-primary">
                    <HiPlus size={16} /> Add Board
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards.map((b, i) => (
                    <div key={b._id} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-white font-bold text-lg">{b.name}</h3>
                            <span className={`badge ${b.isActive ? 'badge-success' : 'badge-danger'}`}>{b.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        {b.description && <p className="text-slate-400 text-sm mb-4">{b.description}</p>}
                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => openEdit(b)} className="btn-secondary flex items-center gap-1"><HiPencil size={14} /> Edit</button>
                            <button onClick={() => setDeleteModal({ open: true, id: b._id })} className="btn-danger flex items-center gap-1"><HiTrash size={14} /> Delete</button>
                        </div>
                    </div>
                ))}
                {boards.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No boards yet. Create your first academic board.</div>}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Board' : 'Add Board'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label>Board Name</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., CBSE" required /></div>
                    <div><label>Description</label><input className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" /></div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
            <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={confirmDelete} message="This will permanently delete this board." />
        </div>
    );
}
