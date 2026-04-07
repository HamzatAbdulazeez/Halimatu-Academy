import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Calendar, Edit, Plus, X, Trash2, BarChart2 } from 'lucide-react';
import {
  getPlans, createPlan, updatePlan, deletePlan,
  getSubscriptions, getSubscriptionStats
} from "../../../api/authApi";
import { notify } from "../../../utils/toast";

const SubscriptionsPage = () => {
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subStats, setSubStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyPlan = {
    name: '',
    type: 'monthly',
    duration_months: 1,
    original_price: '',
    discounted_price: '',
    discount_percentage: '',
    description: '',
    features: [],
    status: 'active',
    sort_order: 0,
  };

  // ── Fetch all data ──
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [plansRes, subsRes] = await Promise.all([
        getPlans(),
        getSubscriptions(),
      ]);
      setPlans(Array.isArray(plansRes) ? plansRes : plansRes?.data || []);
      setSubscriptions(Array.isArray(subsRes) ? subsRes : subsRes?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      notify.error("Failed to load data");
    } finally {
      setLoading(false);
    }

    // Stats independently — ignore if 500
    try {
      const statsRes = await getSubscriptionStats();
      setSubStats(statsRes?.data || statsRes || {});
    } catch {
      console.warn("Subscription stats unavailable");
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Modal helpers ──
  const openCreate = () => { setCurrentPlan({ ...emptyPlan }); setModalOpen(true); };
  const openEdit   = (plan) => { setCurrentPlan({ ...plan }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setCurrentPlan(null); };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPlan(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFeaturesChange = (e) => {
    // Comma-separated features → array
    setCurrentPlan(prev => ({
      ...prev,
      features: e.target.value.split(',').map(f => f.trim()).filter(Boolean),
    }));
  };

  // ── Save (create or update) ──
  const handleSave = async () => {
    if (!currentPlan) return;
    setSaving(true);

    const payload = {
      name:                currentPlan.name,
      type:                currentPlan.type,
      duration_months:     Number(currentPlan.duration_months),
      original_price:      Number(currentPlan.original_price),
      discounted_price:    Number(currentPlan.discounted_price),
      discount_percentage: Number(currentPlan.discount_percentage),
      description:         currentPlan.description || '',
      features:            Array.isArray(currentPlan.features) ? currentPlan.features : [],
      status:              currentPlan.status || 'active',
      sort_order:          Number(currentPlan.sort_order) || 0,
    };

    try {
      if (currentPlan.id) {
        await updatePlan(currentPlan.id, payload);
        notify.success("Plan updated successfully");
      } else {
        await createPlan(payload);
        notify.success("Plan created successfully");
      }
      closeModal();
      fetchAll();
    } catch (err) {
      console.error("Save error:", err);
      notify.error("Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const confirmDelete = (plan) => { setPlanToDelete(plan); setDeleteModalOpen(true); };
  const handleDelete = async () => {
    if (!planToDelete) return;
    try {
      await deletePlan(planToDelete.id);
      notify.success(`"${planToDelete.name}" deleted`);
      setDeleteModalOpen(false);
      setPlanToDelete(null);
      fetchAll();
    } catch (err) {
      console.error("Delete error:", err);
      notify.error("Failed to delete plan");
    }
  };

  const formatPrice = (val) => {
    const n = Number(val);
    if (isNaN(n)) return '₦0';
    return `₦${n.toLocaleString()}`;
  };

  return (
    <div className="">
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1 sm:mb-2">
              Subscriptions & Plans
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage pricing plans and subscription analytics
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#004aad] text-white font-medium rounded-lg shadow-sm hover:bg-[#003a8f] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Create Plan
          </button>
        </div>

        {/* Stats from /admin/subscriptions/stats */}
        {Object.keys(subStats).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Subscriptions', value: subStats.total_subscriptions ?? subStats.total ?? '—' },
              { label: 'Active',              value: subStats.active_subscriptions ?? subStats.active ?? '—' },
              { label: 'Cancelled',           value: subStats.cancelled_subscriptions ?? subStats.cancelled ?? '—' },
              { label: 'Total Revenue',       value: subStats.total_revenue ? formatPrice(subStats.total_revenue) : '—' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-md p-5 border border-gray-100">
                <p className="text-gray-500 text-sm mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-black">{loading ? '...' : s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Plans Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Plans</h2>

          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-md border border-gray-100">
              No plans yet. Create your first plan.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {plans
                .slice()
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-md overflow-hidden ${plan.status === 'active' ? 'ring-1 ring-[#004aad]' : 'ring-1 ring-gray-200'}`}
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-base font-bold text-black mb-1">{plan.name}</h3>
                          <p className="text-xs text-gray-400 mb-3 capitalize">
                            {plan.type} · {plan.duration_months} month{plan.duration_months !== 1 ? 's' : ''}
                          </p>
                          <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-black">
                              {formatPrice(plan.discounted_price)}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              {formatPrice(plan.original_price)}
                            </span>
                          </div>
                          {plan.discount_percentage > 0 && (
                            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                              {plan.discount_percentage}% OFF
                            </span>
                          )}
                          {plan.description && (
                            <p className="text-sm text-gray-500 mt-3">{plan.description}</p>
                          )}
                          {Array.isArray(plan.features) && plan.features.length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {plan.features.map((f, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#004aad] inline-block" />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => openEdit(plan)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            onClick={() => confirmDelete(plan)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize ${
                          plan.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {plan.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          Created {new Date(plan.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent Subscriptions from server */}
        <div className="bg-white rounded-md overflow-hidden border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black">Recent Subscriptions</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-gray-400">
                      Loading subscriptions...
                    </td>
                  </tr>
                ) : subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-gray-400">
                      No subscriptions yet.
                    </td>
                  </tr>
                ) : (
                  subscriptions.slice(0, 10).map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {sub.user?.first_name || sub.first_name || '—'}{' '}
                          {sub.user?.last_name  || sub.last_name  || ''}
                        </p>
                        <p className="text-xs text-gray-400">{sub.user?.email || sub.email || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-emerald-600">
                          {sub.plan?.name || sub.plan_name || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">
                          {sub.amount ? formatPrice(sub.amount) : '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {sub.created_at
                            ? new Date(sub.created_at).toLocaleDateString()
                            : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : sub.status === 'cancelled'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {sub.status || '—'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {modalOpen && currentPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {currentPlan.id ? 'Edit Plan' : 'Create New Plan'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input name="name" value={currentPlan.name} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none"
                  placeholder="e.g. 6 Months Plan" />
              </div>

              {/* Type + Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select name="type" value={currentPlan.type} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one_time">One Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                  <input name="duration_months" type="number" min="1"
                    value={currentPlan.duration_months} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none" />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₦)</label>
                  <input name="original_price" type="number" value={currentPlan.original_price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none"
                    placeholder="50000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (₦)</label>
                  <input name="discounted_price" type="number" value={currentPlan.discounted_price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none"
                    placeholder="25000" />
                </div>
              </div>

              {/* Discount % */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                <input name="discount_percentage" type="number" min="0" max="100"
                  value={currentPlan.discount_percentage} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none"
                  placeholder="50" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows={2} value={currentPlan.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none resize-none"
                  placeholder="Short plan description..." />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features <span className="text-gray-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  value={Array.isArray(currentPlan.features) ? currentPlan.features.join(', ') : ''}
                  onChange={handleFeaturesChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none"
                  placeholder="Full Quran access, Live sessions, Certificate" />
              </div>

              {/* Status + Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={currentPlan.status} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input name="sort_order" type="number" min="0"
                    value={currentPlan.sort_order} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-4">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-[#004aad] text-white py-3 rounded-md hover:bg-[#003a8f] transition font-medium disabled:opacity-60">
                {saving ? 'Saving...' : currentPlan.id ? 'Save Changes' : 'Create Plan'}
              </button>
              <button onClick={closeModal}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-md hover:bg-gray-200 transition font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteModalOpen && planToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-5">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Plan?</h2>
            <p className="text-gray-500 mb-8">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{planToDelete.name}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setDeleteModalOpen(false); setPlanToDelete(null); }}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;