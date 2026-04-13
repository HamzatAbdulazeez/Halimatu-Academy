import { Calendar } from 'lucide-react';

const RecentSubscriptionsTable = ({ subscriptions, loading, formatPrice }) => {
  return (
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
                      {sub.user?.last_name || sub.last_name || ''}
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
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        sub.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : sub.status === 'cancelled'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
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
  );
};

export default RecentSubscriptionsTable;