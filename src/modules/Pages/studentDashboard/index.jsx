import React, { useState, useEffect } from 'react';
import { 
    getStudentEnrolledCourses,
} from '../../../api/courseApi';

import WelcomeHeader from './components/welcome/WelcomeHeader';
import QuickStats from './components/welcome/QuickStats';
import EnrolledCourses from './components/welcome/EnrolledCourses';
import ClassSchedule from './components/welcome/ClassSchedule';
import RightSideBar from './components/welcome/RightSide';

const StudentWelcomeDashboard = () => {
    const [user, setUser] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(false);

    // Load user from localStorage
    useEffect(() => {
        const loadUserData = () => {
            try {
                const stored = localStorage.getItem("user");
                if (stored) setUser(JSON.parse(stored));
            } catch (err) {
                console.error("Failed to parse user from localStorage:", err);
            }
        };

        loadUserData();
        window.addEventListener("storage", loadUserData);
        return () => window.removeEventListener("storage", loadUserData);
    }, []);

    // Fetch Enrolled Courses (Main Data)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const coursesData = await getStudentEnrolledCourses().catch(() => []);
                setEnrolledCourses(Array.isArray(coursesData) ? coursesData : []);

                // Upcoming Classes - Keep commented until API is ready
                // setLoadingClasses(true);
                // const classesData = await getStudentUpcomingClasses().catch(() => []);
                // setUpcomingClasses(Array.isArray(classesData) ? classesData : []);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
                setLoadingClasses(false);
            }
        };

        fetchData();
    }, []);

    const learningStats = {
        classesAttended: 6,
        currentStreak: 3,
        enrollmentDate: user?.created_at
            ? new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : "—",
        subscriptionType: '6 Months - Quranic Studies',
    };

    return (
        <div className="space-y-5">
            <WelcomeHeader user={user} />

            {/* Quick Stats */}
            <QuickStats
                enrolledCount={enrolledCourses.length}
                classesAttended={learningStats.classesAttended}
                currentStreak={learningStats.currentStreak}
                loading={loading}
            />

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-5">
                    
                    {/* Prominent Enrolled Courses Section */}
                    <div>
                        
                        <EnrolledCourses 
                            courses={enrolledCourses} 
                            loading={loading} 
                        />
                    </div>

                    {/* Upcoming Classes */}
                    <ClassSchedule 
                        classes={upcomingClasses} 
                        loading={loadingClasses} 
                    />
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4">
                    <RightSideBar 
                        user={user} 
                        learningStats={learningStats} 
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentWelcomeDashboard;