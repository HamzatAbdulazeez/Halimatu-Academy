import React, { useState, useEffect } from 'react';
import { getStudentEnrolledCourses } from '../../../api/courseApi';
// import { getStudentUpcomingClasses } from '../../../api/courseApi';

import WelcomeHeader from './components/welcome/WelcomeHeader';
import QuickStats from './components/welcome/QuickStats';
import EnrolledCourses from './components/welcome/EnrolledCourses';
import ClassSchedule from './components/welcome/ClassSchedule';
import RightSideBar from './components/welcome/RightSide';

const StudentWelcomeDashboard = () => {
    const [user, setUser] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    // const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Fetch courses — classes API stubbed until endpoint is ready
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const coursesData = await getStudentEnrolledCourses().catch(() => []);
                setEnrolledCourses(Array.isArray(coursesData) ? coursesData : []);

                // TODO: Uncomment when classes API is ready
                // const classesData = await getStudentUpcomingClasses().catch(() => []);
                // setUpcomingClasses(Array.isArray(classesData) ? classesData : []);
            } catch (err) {
                console.error("Failed to fetch student data:", err);
            } finally {
                setLoading(false);
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
        <div className="space-y-8">
            <WelcomeHeader user={user} />

            <div>
                <QuickStats
                    enrolledCount={enrolledCourses.length}
                    classesAttended={learningStats.classesAttended}
                    currentStreak={learningStats.currentStreak}
                    loading={loading}
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <EnrolledCourses courses={enrolledCourses} loading={loading} />
                        {/* <ClassSchedule classes={upcomingClasses} loading={false} /> */}
                    </div>

                    <RightSideBar user={user} learningStats={learningStats} />
                </div>
            </div>
        </div>
    );
};

export default StudentWelcomeDashboard;