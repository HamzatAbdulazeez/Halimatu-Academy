/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
    getStudentEnrolledCourses,
} from '../../../api/courseApi';

import { 
    getMyActiveSubscription,     
    getMySubscriptionStatus    
} from '../../../api/plansApi';

import WelcomeHeader from './components/welcome/WelcomeHeader';
import QuickStats from './components/welcome/QuickStats';
import EnrolledCourses from './components/welcome/EnrolledCourses';
import ClassSchedule from './components/welcome/ClassSchedule';
import RightSideBar from './components/welcome/RightSide';

const StudentWelcomeDashboard = () => {
    const [user, setUser] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [activeSubscription, setActiveSubscription] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [loadingSubscription, setLoadingSubscription] = useState(true);

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

    // Fetch Enrolled Courses + Active Subscription
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setLoadingSubscription(true);

            try {
                // Fetch courses
                const coursesData = await getStudentEnrolledCourses().catch(() => []);
                setEnrolledCourses(Array.isArray(coursesData) ? coursesData : []);

                // Fetch active subscription
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
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-5">
            <WelcomeHeader user={user} />

            {/* Quick Stats */}
            <QuickStats
                enrolledCount={enrolledCourses.length}
                classesAttended={6}           // You can make this dynamic later
                currentStreak={3}
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
                        classes={[]} 
                        loading={false} 
                    />
                </div>

                {/* Right Sidebar - Now receives real subscription */}
                <div className="lg:col-span-4">
                    <RightSideBar 
                        user={user} 
                        activeSubscription={activeSubscription} 
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentWelcomeDashboard;