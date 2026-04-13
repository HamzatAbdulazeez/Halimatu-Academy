import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  adminGetPlans,
  adminCreatePlan,
  adminUpdatePlan,
  adminDeletePlan,
  getSubscriptions,
  getSubscriptionStats
} from "../../../../api/authApi";
import { notify } from "../../../../utils/toast";

import PlanCard from '../Components/PlanCard';
import SubscriptionStats from '../Components/SubscriptionStats';
import RecentSubscriptionsTable from '../Components/RecentSubscriptionsTable';
import PlanModal from '../Components/PlanModal';
import DeleteConfirmModal from '../Components/DeleteConfirmModal';

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
    name: '', type: 'monthly', duration_months: 1,
    original_price: '', discounted_price: '', discount_percentage: '',
    description: '', features: [], status: 'active', sort_order: 0,
  };

  // Fetch data
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [plansRes, subsRes] = await Promise.all([
        adminGetPlans(),           // ← Changed
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
  
    try {
      const statsRes = await getSubscriptionStats();
      setSubStats(statsRes?.data || statsRes || {});
    } catch {
      console.warn("Subscription stats unavailable");
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Modal handlers
  const openCreate = () => { setCurrentPlan({ ...emptyPlan }); setModalOpen(true); };
  const openEdit = (plan) => { setCurrentPlan({ ...plan }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setCurrentPlan(null); };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPlan(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFeaturesChange = (e) => {
    const inputValue = String(e.target.value || '');   // Force it to be a string
  
    const featuresArray = inputValue
      .split(/[\n,]+/)                    // Split by newline or comma
      .map(f => f.trim())
      .filter(f => f.length > 0);
  
    setCurrentPlan(prev => ({
      ...prev,
      features: featuresArray
    }));
  };
  const handleSave = async () => {
    if (!currentPlan) return;
  
    // Quick client-side check
    if (!currentPlan.name?.trim()) {
      notify.error("Plan name is required");
      return;
    }
  
    setSaving(true);
  
    const payload = {
      name: currentPlan.name?.trim() || '',
      type: currentPlan.type || 'monthly',
      duration_months: Number(currentPlan.duration_months) || 1,
      original_price: Number(currentPlan.original_price) || 0,
      discounted_price: Number(currentPlan.discounted_price) || 0,
      discount_percentage: Number(currentPlan.discount_percentage) || 0,
      description: currentPlan.description?.trim() || '',
      features: Array.isArray(currentPlan.features) ? currentPlan.features : [],
      status: currentPlan.status || 'active',
      sort_order: Number(currentPlan.sort_order) || 0,
    };
  
    try {
      if (currentPlan.id) {
        await adminUpdatePlan(currentPlan.id, payload);
        notify.success("Plan updated successfully");
      } else {
        await adminCreatePlan(payload);
        notify.success("Plan created successfully");
      }
  
      closeModal();
      fetchAll();
    } catch (err) {
      console.error("Save error full details:", err);
  
      const errors = err.response?.data?.errors;
  
      if (errors && Object.keys(errors).length > 0) {
        // Show the first validation error clearly
        const firstError = Object.values(errors).flat()[0];
        notify.error(`Validation Error: ${firstError}`);
  
        // Optional: Log all errors for debugging
        console.table(errors);
      } 
      else if (err.response?.data?.message) {
        notify.error(err.response.data.message);
      } 
      else {
        notify.error("Failed to save plan. Please check console for details.");
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (plan) => { setPlanToDelete(plan); setDeleteModalOpen(true); };
  const handleDelete = async () => {
    if (!planToDelete) return;
    try {
      await adminDeletePlan(planToDelete.id);               // ← Changed
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
    return isNaN(n) ? '₦0' : `₦${n.toLocaleString()}`;
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

        <SubscriptionStats subStats={subStats} loading={loading} formatPrice={formatPrice} />

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
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={openEdit}
                    onDelete={confirmDelete}
                    formatPrice={formatPrice}
                  />
                ))}
            </div>
          )}
        </div>

        <RecentSubscriptionsTable
          subscriptions={subscriptions}
          loading={loading}
          formatPrice={formatPrice}
        />
      </div>

      <PlanModal
        isOpen={modalOpen}
        currentPlan={currentPlan}
        onClose={closeModal}
        onSave={handleSave}
        saving={saving}
        onInputChange={handleInputChange}
        onFeaturesChange={handleFeaturesChange}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        planToDelete={planToDelete}
        onCancel={() => { setDeleteModalOpen(false); setPlanToDelete(null); }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SubscriptionsPage;