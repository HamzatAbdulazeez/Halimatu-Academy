import React from 'react';
import { DollarSign, Users, TrendingUp, Calendar, Edit, Plus } from 'lucide-react';

const SubscriptionsPage = () => {
  const plans = [
    {
      id: 1,
      name: '6 Months Plan',
      originalPrice: '₦50,000',
      discountedPrice: '₦25,000',
      discount: '50%',
      subscribers: 892,
      revenue: '₦22,000',
      active: true
    },
    {
      id: 2,
      name: '12 Months Plan',
      originalPrice: '₦100,000',
      discountedPrice: '₦50,000',
      discount: '50%',
      subscribers: 1357,
      revenue: '₦67,000',
      active: true,
      popular: true
    }
  ];

  const recentSubscriptions = [
    { id: 1, student: 'Abdullah Rahman', plan: '12 Months', course: 'Qur\'an & Arabic', amount: '₦50,000', date: 'Feb 05, 2027', status: 'active' },
    { id: 2, student: 'Fatima Hassan', plan: '6 Months', course: 'Hadith', amount: '₦25,000', date: 'Feb 05, 2027', status: 'active' },
    { id: 3, student: 'Omar Ali', plan: '12 Months', course: 'Tafsīr', amount: '₦50,000', date: 'Feb 04, 2027', status: 'active' },
    { id: 4, student: 'Aisha Mohamed', plan: '6 Months', course: 'Fiqh', amount: '₦25,000', date: 'Feb 04, 2027', status: 'active' },
    { id: 5, student: 'Ibrahim Yusuf', plan: '12 Months', course: 'Tawhīd', amount: '₦50,000', date: 'Feb 03, 2027', status: 'active' }
  ];

 

  return (
    <div className="">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Subscriptions & Plans</h1>
            <p className="text-gray-600">Manage pricing plans and subscription analytics</p>
          </div>
          <button className="px-6 py-3 bg-gradient text-white rounded-md hover:shadow-lg transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Plan
          </button>
        </div>


        {/* Pricing Plans */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Plans</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={`bg-white rounded-md overflow-hidden ${plan.popular ? 'ring-1 ring-[#004aad]' : ''}`}>
                {plan.popular && (
                  <div className="bg-orange-500 text-white text-center py-2 font-bold text-sm">
                    ⭐ MOST POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-black mb-3">{plan.name}</h3>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-black">{plan.discountedPrice}</span>
                        <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                      </div>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        {plan.discount} OFF
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">Subscribers</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{plan.subscribers}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm text-gray-600">Revenue</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{plan.revenue}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`px-4 py-2 rounded-md text-sm font-semibold ${
                      plan.active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-white rounded-md overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black">Recent Subscriptions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-lg text-black">Student</th>
                  <th className="px-6 py-4 text-left text-lg text-black">Course</th>
                  <th className="px-6 py-4 text-left text-lg text-black">Plan</th>
                  <th className="px-6 py-4 text-left text-lg text-black">Amount</th>
                  <th className="px-6 py-4 text-left text-lg text-black">Date</th>
                  <th className="px-6 py-4 text-left text-lg text-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{sub.student}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{sub.course}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-emerald-600">{sub.plan}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{sub.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {sub.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionsPage;