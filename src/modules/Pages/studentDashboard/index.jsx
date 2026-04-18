/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
    getStudentEnrolledCourses,
    getUpcomingClasses  
} from '../../../api/courseApi';

import { 
    getMyActiveSubscription    
} from '../../../api/plansApi';

import WelcomeHeader from './components/welcome/WelcomeHeader';
import QuickStats from './components/welcome/QuickStats';
import EnrolledCourses from './components/welcome/EnrolledCourses';
import ClassSchedule from './components/welcome/ClassSchedule';
import RightSideBar from './components/welcome/RightSide';

const StudentWelcomeDashboard = () => {
    const [user, setUser] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [activeSubscription, setActiveSubscription] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [loadingSubscription, setLoadingSubscription] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(true);

    // Load user from localStorage
    useEffect(() => {
        const loadUserData = () => {
            try {
                const stored = localStorage.getItem("user");
                if (stored) {
                    setUser(JSON.parse(stored));
                }
            } catch (err) {
                console.error("Failed to parse user from localStorage:", err);
            }
        };

        loadUserData();
        window.addEventListener("storage", loadUserData);
        return () => window.removeEventListener("storage", loadUserData);
    }, []);

    // Fetch all dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setLoadingSubscription(true);
            setLoadingClasses(true);

            try {
                // 1. Fetch enrolled courses (always fetch since user is subscribed)
                const coursesData = await getStudentEnrolledCourses().catch(() => []);
                setEnrolledCourses(Array.isArray(coursesData) ? coursesData : []);

                // 2. Fetch upcoming classes (always fetch)
                const classesData = await getUpcomingClasses().catch(() => []);
                setUpcomingClasses(Array.isArray(classesData) ? classesData : []);

                // 3. Fetch active subscription (for RightSideBar display only)
                const subRes = await getMyActiveSubscription().catch(() => null);
                const subData = subRes?.subscription || 
                               subRes?.data?.subscription || 
                               subRes?.data || 
                               subRes;

                setActiveSubscription(subData && typeof subData === 'object' ? subData : null);

            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
                setLoadingSubscription(false);
                setLoadingClasses(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-5">
            <WelcomeHeader user={user} />

            {/* Quick Stats */}
            <QuickStats
                enrolledCount={enrolledCourses.length}
                classesAttended={6}        // TODO: Make this dynamic later
                currentStreak={3}          // TODO: Make this dynamic later
                loading={loading}
            />

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-5">
                    <EnrolledCourses 
                        courses={enrolledCourses} 
                        loading={loading} 
                    />

                    <ClassSchedule 
                        classes={upcomingClasses}
                        loading={loadingClasses}
                    />
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4">
                    <RightSideBar 
                        user={user} 
                        activeSubscription={activeSubscription} 
                        loading={loadingSubscription}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentWelcomeDashboard;