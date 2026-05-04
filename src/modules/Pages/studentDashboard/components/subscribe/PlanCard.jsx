import React from 'react';
import { FaSync, FaChevronRight } from 'react-icons/fa';

const PlanCard = ({ plan, isCurrent, isProcessing, onSelectPlan }) => {
    const isDisabled = isCurrent || isProcessing;

    return (
        <div className={`
            bg-white rounded-xl border p-6 transition-all duration-300 relative
            ${isCurrent ? 'border-emerald-500 shadow-md' : 'border-blue-100 hover:border-blue-300 shadow-sm'}
        `}>
            
            {/* Header: Plan Name & Subscription Type */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-400 mt-1 capitalize">
                    {plan.period || 'Annual'} • {plan.duration_months} Months
                </p>
            </div>

          
            <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-black text-gray-900">
                    ₦{Number(plan.discounted_price || plan.price).toLocaleString()}
                </span>
                {plan.original_price && (
                    <span className="text-lg text-gray-300 line-through decoration-gray-400">
                        ₦{Number(plan.original_price).toLocaleString()}
                    </span>
                )}
            </div>

            {/* 50% OFF Badge */}
            <div className="inline-block bg-emerald-50 text-emerald-600 text-[11px] font-bold px-3 py-1 rounded-md mb-5 uppercase tracking-wider">
                50% OFF
            </div>

            {/* Plan Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xl">
                {plan.description || "We provide structured online Qur’an, Tajw?d, Hadith, and Arabic language courses through qualified tutors. Our classes are designed for children and adults, allowing students to learn from the comfort of their homes. We offer both group sessions and private classes with a clear yearly curriculum and certification."}
            </p>

            {/* Feature List */}
            <div className="space-y-2.5 mb-8">
                {plan.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[12px] font-bold text-[#004aad] capitalize tracking-tight">
                        <span className="w-1.5 h-1.5 bg-[#004aad] rounded-full shrink-0" />
                       {feature}
                    </div>
                ))}
            </div>

            {/* Footer: Status and Action Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div>
                    {isCurrent ? (
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-lg">
                            Active Plan
                        </span>
                    ) : (
                        <span className="text-black text-xs font-medium">
                            Available for purchase
                        </span>
                    )}
                </div>
                
                <button
                    onClick={() => !isDisabled && onSelectPlan(plan)}
                    disabled={isDisabled}
                    className={`
                        flex items-center gap-2 px-6 py-2.5 rounded-md text-sm transition-all cursor-pointer
                        ${isCurrent 
                            ? 'bg-gray-50 text-gray-400 cursor-default' 
                            : 'bg-[#004aad] text-white hover:bg-[#003a8c] hover:shadow-lg active:scale-95'}
                    `}
                >
                    {isProcessing ? (
                        <FaSync className="animate-spin" />
                    ) : isCurrent ? (
                        'Current'
                    ) : (
                        <>Subscribe Now <FaChevronRight size={10} /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PlanCard;