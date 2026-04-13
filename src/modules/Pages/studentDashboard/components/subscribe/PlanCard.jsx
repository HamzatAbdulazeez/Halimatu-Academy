import React from 'react';
import { FaSync } from 'react-icons/fa';

const PlanCard = ({ plan, isCurrent, isProcessing, isDisabled, onSelectPlan }) => {
    const disabled = isCurrent || isProcessing || isDisabled;

    return (
        <div className={`
            bg-white rounded-2xl p-6 flex flex-col transition-all duration-200
            ${isCurrent 
                ? 'border-2 border-[#1D9E75] shadow-md' 
                : plan.popular 
                    ? 'border-2 border-[#185FA5] shadow-lg' 
                    : 'border border-gray-200 hover:border-gray-300'
            }
        `}>
            
            {/* Badge */}
            {isCurrent ? (
                <span className="inline-block text-[11px] font-medium px-3 py-1 bg-[#E1F5EE] text-[#085041] rounded-full mb-4">
                    Your plan ✓
                </span>
            ) : plan.popular ? (
                <span className="inline-block text-[11px] font-medium px-3 py-1 bg-[#E6F1FB] text-[#0C447C] rounded-full mb-4">
                    Most popular
                </span>
            ) : (
                <div className="h-[21px] mb-4" /> // Spacer
            )}

            {/* Period */}
            <p className="text-[11px] font-medium tracking-[0.07em] uppercase text-[#185FA5] mb-1">
                {plan.period}
            </p>

            {/* Plan Name */}
            <h3 className="text-[17px] font-medium text-gray-900 mb-5">
                {plan.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-5 pb-5 border-b border-gray-100">
                <span className="text-3xl font-medium text-gray-900">
                    {plan.displayPrice}
                </span>
                <span className="text-sm text-gray-500">
                    /{plan.period.toLowerCase()}
                </span>
            </div>

            {/* Features */}
            <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                            ${isCurrent ? 'bg-[#E1F5EE]' : 'bg-[#E6F1FB]'}`}>
                            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                <polyline 
                                    points="2,5 4,7.5 8,3" 
                                    stroke={isCurrent ? "#1D9E75" : "#185FA5"} 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                />
                            </svg>
                        </span>
                        {feature}
                    </li>
                ))}
            </ul>

            {/* Subscribe Button */}
            <button
                onClick={() => !disabled && onSelectPlan(plan)}
                disabled={disabled}
                className={`
                    w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all
                    ${isCurrent 
                        ? 'bg-[#E1F5EE] text-[#085041] cursor-default' 
                        : isDisabled 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-[#185FA5] text-white hover:bg-[#0F4A85]'
                    }
                `}
            >
                {isProcessing ? (
                    <>
                        <FaSync className="animate-spin" />
                        Processing...
                    </>
                ) : isCurrent ? (
                    'Current plan ✓'
                ) : (
                    'Subscribe now →'
                )}
            </button>
        </div>
    );
};

export default PlanCard;