import React, { useState } from 'react';
import { BookMarked, Plus, Pencil, Trash2, Save, X, Check } from 'lucide-react';

const TopicsModal = ({ course, onSave, onClose, loading = false }) => {
    // Normalise topics to {id, title} objects
    const normalise = (t) => typeof t === 'string'
        ? { id: null, title: t }
        : { id: t.id ?? null, title: t.title ?? t.name ?? '' };

    const [topics,   setTopics]  = useState((course.whatYouLearn ?? []).map(normalise));
    const [newTopic, setNewTopic] = useState('');
    const [editIdx,  setEditIdx]  = useState(null);
    const [editVal,  setEditVal]  = useState('');

    const addTopic = () => {
        const trimmed = newTopic.trim();
        if (trimmed) {
            setTopics(prev => [...prev, { id: null, title: trimmed }]);
            setNewTopic('');
        }
    };

    const removeTopic = (idx) => {
        // If we're editing this item, cancel the edit first
        if (editIdx === idx) { setEditIdx(null); setEditVal(''); }
        setTopics(prev => prev.filter((_, i) => i !== idx));
    };

    const startEdit = (idx) => {
        setEditIdx(idx);
        setEditVal(topics[idx].title);
    };

    const saveEdit = () => {
        const trimmed = editVal.trim();
        if (trimmed) {
            setTopics(prev =>
                prev.map((t, i) => i === editIdx ? { ...t, title: trimmed } : t)
            );
        }
        setEditIdx(null);
        setEditVal('');
    };

    const cancelEdit = () => {
        setEditIdx(null);
        setEditVal('');
    };

    // Course display name — backend may use title or name
    const courseName = course.title || course.name || '';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#004aad] to-[#0062e6] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <BookMarked className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base">What You Will Learn</h3>
                            <p className="text-white/70 text-xs truncate max-w-[260px]">{courseName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Topics list */}
                <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                    {topics.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
                            No topics yet. Add your first topic below.
                        </div>
                    )}
                    {topics.map((topic, idx) => (
                        <div key={topic.id ?? `new-${idx}`} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                            <div className="w-6 h-6 bg-[#004aad]/10 text-[#004aad] rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                                {idx + 1}
                            </div>
                            {editIdx === idx ? (
                                <input
                                    value={editVal}
                                    onChange={e => setEditVal(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') saveEdit();
                                        if (e.key === 'Escape') cancelEdit();
                                    }}
                                    className="flex-1 px-2 py-1 border border-[#004aad] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/20"
                                    autoFocus
                                />
                            ) : (
                                <span className="flex-1 text-sm text-gray-800">{topic.title}</span>
                            )}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {editIdx === idx ? (
                                    <>
                                        <button
                                            onClick={saveEdit}
                                            className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-lg transition-colors"
                                            title="Save"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors"
                                            title="Cancel"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => startEdit(idx)}
                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => removeTopic(idx)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add topic input */}
                <div className="px-6 pb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTopic}
                            onChange={e => setNewTopic(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTopic()}
                            placeholder="Add a new topic..."
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                        />
                        <button
                            onClick={addTopic}
                            disabled={!newTopic.trim()}
                            className="px-4 py-2.5 bg-[#004aad] text-white rounded-xl hover:bg-[#003a8c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400">{topics.length} topic{topics.length !== 1 ? 's' : ''}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(course.id, topics)}
                            disabled={loading}
                            className="px-5 py-2 bg-[#004aad] text-white rounded-xl hover:bg-[#003a8c] transition-colors text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicsModal;