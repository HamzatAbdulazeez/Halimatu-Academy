import React from 'react';
import { Video, Plus, Pencil, Trash2 } from 'lucide-react';
import CopyButton from './CopyButton';
import StatusBadge from './StatusBadge';

const ClassesTable = ({ 
    classes = [], 
    topicId, 
    onEdit, 
    onDelete, 
    onAddFirst 
}) => {
    if (!classes || classes.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium mb-1">No classes yet for this topic</p>
                <button
                    onClick={onAddFirst}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-2.5  bg-[#004aad] text-white text-sm rounded-2xl hover:bg-[#003a8c] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add First Class
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 text-left border-b">
                        <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Class</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Date & Time</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Google Meet Link</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {classes.map((cls) => {
                        const className = cls.name || cls.title || 'Untitled Class';
                        const meetLink = cls.meeting_link || cls.meetLink || '';
                        const startDateTime = cls.start_date || cls.date || '';
                        const endDateTime = cls.end_date || '';
                        const duration = cls.duration || '';

                        // Format date nicely for display
                        let displayDate = startDateTime;
                        if (startDateTime) {
                            try {
                                const date = new Date(startDateTime);
                                displayDate = date.toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                });
                            } catch {}
                        }

                        return (
                            <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                                {/* Class Name + Duration */}
                                <td className="px-6 py-5">
                                    <div className="font-semibold text-gray-900">{className}</div>
                                    {duration && (
                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            ⏱ {duration}
                                        </div>
                                    )}
                                </td>

                                {/* Date & Time */}
                                <td className="px-6 py-5 hidden md:table-cell">
                                    {startDateTime ? (
                                        <div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <div className="text-lg">📅</div>
                                                <div>
                                                    <div>{displayDate}</div>
                                                    {startDateTime.includes('T') && (
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {new Date(startDateTime).toLocaleTimeString([], { 
                                                                hour: 'numeric', 
                                                                minute: '2-digit' 
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Not scheduled</span>
                                    )}
                                </td>

                                {/* Google Meet Link */}
                                <td className="px-6 py-5">
                                    {meetLink ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-0.5 shrink-0" />
                                            <div className="font-mono text-xs text-gray-600 break-all max-w-xs">
                                                {meetLink}
                                            </div>
                                            <CopyButton text={meetLink} />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-amber-600">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-0.5" />
                                            <span className="text-sm">No link set</span>
                                            <button 
                                                onClick={() => onEdit(cls)}
                                                className="text-[#004aad] hover:underline text-sm font-medium ml-1"
                                            >
                                                + Add link
                                            </button>
                                        </div>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-5">
                                    <StatusBadge status={cls.status || 'scheduled'} />
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => onEdit(cls)}
                                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(cls)}
                                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ClassesTable;