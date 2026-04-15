import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from "../../../../../utils/imageHelper";

const RightSideBar = ({ user, activeSubscription }) => {
    const rawPic =
        user?.profile_picture ||
        user?.profile?.profile_picture ||
        user?.image ||
        null;
    const profilePic = getImageUrl(rawPic);

    const fullName = user
        ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.name || "Student"
        : "Student";

    const initials = user
        ? ((user.first_name?.charAt(0) || user.name?.charAt(0) || "") +
            (user.last_name?.charAt(0) || "")).toUpperCase() || "S"
        : "S";

    const studentId =
        user?.student_id ||
        user?.profile?.student_id ||
        user?.id_number ||
        user?.user_id ||
        user?.profile?.user_id ||
        "—";

    const email = user?.email || "—";

    // Safe subscription display
    const planName = activeSubscription
        ? (activeSubscription.plan_name ||
           activeSubscription.plan?.name ||
           activeSubscription.name ||
           'No Active Plan')
        : 'No Active Plan';

    const isActive = activeSubscription?.is_active ||
                     activeSubscription?.status === 'active' ||
                     !!activeSubscription;

    const enrollmentDate = activeSubscription?.created_at || activeSubscription?.start_date || user?.created_at;

    const formattedDate = enrollmentDate
        ? new Date(enrollmentDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—";

    return (
        <aside className="space-y-6">
            {/* Subscription Info - Now Dynamic */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📋 Subscription Details
                </h2>

                <div className="space-y-5">
                    <div className="bg-white rounded-xl p-5">
                        <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                        <p className="font-bold text-lg text-gray-900">{planName}</p>
                        
                        {isActive && (
                            <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
                                ✓ Full access to Quranic Studies & more
                            </p>
                        )}
                    </div>

                    <div className="bg-white rounded-xl p-5">
                        <p className="text-sm text-gray-600 mb-1">Subscription Status</p>
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full animate-pulse ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            <p className={`font-semibold ${isActive ? 'text-emerald-700' : 'text-red-600'}`}>
                                {isActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Enrolled since {formattedDate}
                        </p>
                    </div>

                    {/* Upgrade / Manage Button */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-5">
                        <p className="text-sm opacity-90 mb-3">
                            {isActive 
                                ? 'Want longer access or better savings?' 
                                : 'Get full access to all courses'}
                        </p>
                        <Link
                            to="/student/subscription"
                            className="block w-full bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-xl font-semibold text-center transition-all active:scale-95"
                        >
                            {isActive ? 'Manage / Upgrade Plan →' : 'Subscribe Now →'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Account Info - Unchanged */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Account Info</h2>
                
                <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                    {rawPic ? (
                        <img
                            src={profilePic}
                            alt={fullName}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                            {initials}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-lg text-gray-900">{fullName}</p>
                        <p className="text-sm text-gray-500">ID: {studentId}</p>
                    </div>
                </div>

                <div className="mt-5 space-y-4 text-sm">
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-900 break-all">{email}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                            <p className="font-semibold text-emerald-700">Active Student</p>
                        </div>
                    </div>
                </div>

                <Link
                    to="/student/settings"
                    className="mt-6 block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-3 rounded-xl font-medium text-center transition-colors"
                >
                    Manage Account →
                </Link>
            </section>
        </aside>
    );
};

export default RightSideBar;