import { X } from 'lucide-react';

const PlanModal = ({
    isOpen,
    currentPlan,
    onClose,
    onSave,
    saving,
    onInputChange,
    onFeaturesChange
}) => {
    if (!isOpen || !currentPlan) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {currentPlan.id ? 'Edit Plan' : 'Create New Plan'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Plan Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                        <input
                            name="name"
                            value={currentPlan.name}
                            onChange={onInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-[#004aad]"
                            placeholder="e.g. 6 Months Premium Plan"
                        />
                    </div>

                    {/* Type + Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                name="type"
                                value={currentPlan.type}
                                onChange={onInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-[#004aad]"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="bi_annual">Bi-Annual</option>
                                <option value="annual">Annual</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                            <input
                                name="duration_months"
                                type="number"
                                min="1"
                                value={currentPlan.duration_months}
                                onChange={onInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-[#004aad]"
                            />
                        </div>
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₦)</label>
                            <input
                                name="original_price"
                                type="number"
                                value={currentPlan.original_price}
                                onChange={onInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-[#004aad]"
                                placeholder="50000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (₦)</label>
                            <input
                                name="discounted_price"
                                type="number"
                                value={currentPlan.discounted_price}
                                onChange={onInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-[#004aad]"
                                placeholder="25000"
                            />
                        </div>
                    </div>

                    {/* Discount Percentage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                        <input
                            name="discount_percentage"
                            type="number"
                            min="0"
                            max="100"
                            value={currentPlan.discount_percentage}
                            onChange={onInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-[#004aad]"
                            placeholder="50"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={2}
                            value={currentPlan.description}
                            onChange={onInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none resize-none focus:border-[#004aad]"
                            placeholder="Short plan description..."
                        />
                    </div>

                    {/* Features - Improved */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Features
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Enter one feature per line or separate with commas
                        </p>
                        <textarea
                            value={Array.isArray(currentPlan.features) ? currentPlan.features.join('\n') : ''}
                            onChange={(e) => {
                                // Smart splitting: handles commas, new lines, and extra spaces
                                const featuresArray = e.target.value
                                    .split(/[\n,]+/)           // Split by new line OR comma
                                    .map(f => f.trim())        // Remove extra spaces
                                    .filter(Boolean);          // Remove empty entries

                                onFeaturesChange({ target: { value: featuresArray } });
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#004aad] min-h-120px resize-y"
                            placeholder="Full access to Quran recitation&#10;Live weekly classes&#10;Progress tracking dashboard&#10;Certificate of completion"
                        />
                    </div>

                    {/* Status + Sort Order */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={currentPlan.status}
                                onChange={onInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-[#004aad]"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                            <input
                                name="sort_order"
                                type="number"
                                min="0"
                                value={currentPlan.sort_order}
                                onChange={onInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-[#004aad]"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-4">
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="flex-1 bg-[#004aad] text-white py-3 rounded-md hover:bg-[#003a8f] transition font-medium disabled:opacity-60"
                    >
                        {saving ? 'Saving...' : currentPlan.id ? 'Save Changes' : 'Create Plan'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-md hover:bg-gray-200 transition font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;