import React from 'react';
import { getImageUrl } from "../../../../../utils/imageHelper";

const WelcomeHeader = ({ user }) => {
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

    return (
        <div className="bg-gradient text-white">
            <div className="py-8 px-4 mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        {rawPic ? (
                            <img
                                src={profilePic}
                                alt={fullName}
                                className="w-16 h-16 rounded-full border-4 border-white/30 object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center text-xl font-bold text-white">
                                {initials}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold">
                                Welcome, {fullName}! 👋
                            </h1>
                            <p className="text-blue-100 mt-1">
                                Ready to continue your Islamic learning journey?
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                        <p className="text-sm text-blue-100">Student ID</p>
                        <p className="font-semibold">{studentId}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeHeader;