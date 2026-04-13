const SubscriptionStats = ({ subStats, loading, formatPrice }) => {
    if (Object.keys(subStats).length === 0) return null;
  
    const stats = [
      { label: 'Total Subscriptions', value: subStats.total_subscriptions ?? subStats.total ?? '—' },
      { label: 'Active', value: subStats.active_subscriptions ?? subStats.active ?? '—' },
      { label: 'Cancelled', value: subStats.cancelled_subscriptions ?? subStats.cancelled ?? '—' },
      { label: 'Total Revenue', value: subStats.total_revenue ? formatPrice(subStats.total_revenue) : '—' },
    ];
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-md p-5 border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-black">{loading ? '...' : s.value}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default SubscriptionStats;