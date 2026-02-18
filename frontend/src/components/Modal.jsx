import { useState } from 'react';
import { HiX, HiCheck } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg glass-card p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                        <HiX size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm glass-card p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-3">{title || 'Confirm'}</h3>
                <p className="text-slate-400 text-sm mb-5">{message || 'Are you sure?'}</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={onConfirm} className="btn-danger">Delete</button>
                </div>
            </div>
        </div>
    );
}
