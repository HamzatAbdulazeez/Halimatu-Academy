import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteModal = ({ title = 'Delete?', message, onConfirm, onClose, loading = false }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-gray-500 text-sm">{message}</p>
            <div className="flex gap-2 pt-1">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    {loading ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    </div>
);

export default DeleteModal;