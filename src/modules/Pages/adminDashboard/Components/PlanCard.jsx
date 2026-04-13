import { Edit, Trash2 } from 'lucide-react';

const PlanCard = ({ plan, onEdit, onDelete, formatPrice }) => {
  return (
    <div
      className={`bg-white rounded-md overflow-hidden ${
        plan.status === 'active' ? 'ring-1 ring-[#004aad]' : 'ring-1 ring-gray-200'
      }`}
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
              onClick={() => onEdit(plan)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => onDelete(plan)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span
            className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize ${
              plan.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {plan.status}
          </span>
          <span className="text-xs text-gray-400">
            Created {new Date(plan.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;