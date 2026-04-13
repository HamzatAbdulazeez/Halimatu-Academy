import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from "../../../../../utils/imageHelper";

const Sidebar = ({ user, learningStats }) => {
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

    return (
        <aside className="space-y-6">
            {/* Subscription Info */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Subscription Details</h2>
                <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6">
                        <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                        <p className="font-bold text-lg text-gray-900">{learningStats.subscriptionType}</p>
                        <p className="text-xs text-gray-500 mt-2">✓ Access to Quranic Studies program</p>
                    </div>
                    <div className="bg-white rounded-lg p-6">
                        <p className="text-sm text-gray-600 mb-1">Subscription Status</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <p className="font-semibold text-green-700">Active</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Enrolled since {learningStats.enrollmentDate}
                        </p>
                    </div>
                    <div className="bg-blue-600 text-white rounded-lg p-6">
                        <p className="text-sm text-blue-100 mb-2">💡 Upgrade to unlock Arabic Language course!</p>
                        <Link
                            to="/student/subscription"
                            className="block w-full bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center text-sm"
                        >
                            Upgrade Now →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Daily Reminder */}
            <section className="bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-md p-6">
                <h2 className="text-xl font-bold mb-3">💡 Daily Reminder</h2>
                <p className="text-blue-100 text-sm mb-4">
                    &quot;Seek knowledge from the cradle to the grave.&quot;
                    <br />
                    <span className="text-xs italic">- Prophet Muhammad ﷺ</span>
                </p>
                <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                    <p className="text-sm font-medium">🎯 Today&apos;s Goal</p>
                    <p className="text-xs text-blue-100 mt-1">
                        Complete at least one lesson and review yesterday&apos;s notes
                    </p>
                </div>
            </section>

            {/* Account Info */}
            <section className="bg-white rounded-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Account Info</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        {rawPic ? (
                            <img
                                src={profilePic}
                                alt={fullName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#004aad] flex items-center justify-center text-sm font-bold text-white">
                                {initials}
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-gray-900">{fullName}</p>
                            <p className="text-xs text-gray-400">{studentId}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-semibold text-gray-900 text-xs break-all">{email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Enrolled Since</p>
                        <p className="font-semibold text-gray-900">{learningStats.enrollmentDate}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Status</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <p className="font-semibold text-green-700 capitalize">
                                {user?.status || "Active"}
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/student/settings"
                        className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg transition-colors font-medium text-center mt-4"
                    >
                        Manage Account
                    </Link>
                </div>
            </section>
        </aside>
    );
};

export default Sidebar;