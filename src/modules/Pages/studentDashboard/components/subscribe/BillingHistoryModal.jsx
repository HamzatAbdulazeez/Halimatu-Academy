import React from 'react';
import { FaTimes, FaCreditCard, FaHistory } from 'react-icons/fa';
import { formatDate, formatPrice } from '../../subscriptions/utils';

const BillingHistoryModal = ({ isOpen, subscriptions = [], onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Billing History</h3>
                        <p className="text-sm text-gray-500">
                            {subscriptions.length} transaction{subscriptions.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {subscriptions.length === 0 ? (
                        <div className="text-center py-12">
                            <FaHistory className="mx-auto text-gray-300" size={40} />
                            <p className="mt-4 text-gray-400">No billing history yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {subscriptions.map((sub, index) => (
                                <div 
                                    key={sub.id || sub._id || index} 
                                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-[#004aad]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaCreditCard className="text-[#004aad]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {sub.plan_name || sub.plan || 'Subscription'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(sub.created_at || sub.date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            {formatPrice(sub.amount)}
                                        </p>
                                        <span className="text-xs px-3 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                            {sub.status || 'paid'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillingHistoryModal;