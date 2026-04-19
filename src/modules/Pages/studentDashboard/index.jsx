/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance'; // adjust if needed
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

// ─── helpers ──────────────────────────────────────────────────────────────────
const readUserFromStorage = () => {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

// Unwrap whatever shape the API returns into a plain array
const toArray = (value) => {
    if (Array.isArray(value))               return value;
    if (Array.isArray(value?.data))         return value.data;
    if (Array.isArray(value?.courses))      return value.courses;
    if (Array.isArray(value?.classes))      return value.classes;
    if (Array.isArray(value?.upcoming_classes)) return value.upcoming_classes;
    if (Array.isArray(value?.results))      return value.results;
    return [];
};

// ─── component ────────────────────────────────────────────────────────────────
const StudentWelcomeDashboard = () => {

    // ── user ──────────────────────────────────────────────────────────────────
    const [user, setUser] = useState(readUserFromStorage);

    useEffect(() => {
        let alive = true;
        axiosInstance.get('/user/me')
            .then(res => {
                if (!alive) return;
                const full = { ...readUserFromStorage(), ...res.data };
                setUser(full);
                localStorage.setItem('user', JSON.stringify(full));
            })
            .catch(err => console.error('/user/me failed:', err));
        return () => { alive = false; };
    }, []);

    // ── dashboard data ────────────────────────────────────────────────────────
    const [enrolledCourses,    setEnrolledCourses]    = useState([]);
    const [upcomingClasses,    setUpcomingClasses]    = useState([]);
    const [activeSubscription, setActiveSubscription] = useState(null);

    const [loading,             setLoading]             = useState(true);
    const [loadingClasses,      setLoadingClasses]      = useState(true);
    const [loadingSubscription, setLoadingSubscription] = useState(true);

    useEffect(() => {
        let alive = true;

        const run = async () => {
            // ── courses ───────────────────────────────────────────────────────
            try {
                const res = await getStudentEnrolledCourses();
                if (alive) setEnrolledCourses(toArray(res));
            } catch (err) {
                console.error('courses fetch failed:', err);
                if (alive) setEnrolledCourses([]);
            } finally {
                if (alive) setLoading(false);
            }

            // ── upcoming classes ──────────────────────────────────────────────
            try {
                const res = await getUpcomingClasses();
                if (alive) setUpcomingClasses(toArray(res));
            } catch (err) {
                console.error('classes fetch failed:', err);
                if (alive) setUpcomingClasses([]);
            } finally {
                if (alive) setLoadingClasses(false);
            }

            // ── subscription ──────────────────────────────────────────────────
            try {
                const res = await getMyActiveSubscription();
                if (alive) {
                    const sub = res?.subscription ?? res?.data?.subscription ?? res?.data ?? res;
                    setActiveSubscription(sub && typeof sub === 'object' ? sub : null);
                }
            } catch (err) {
                console.error('subscription fetch failed:', err);
                if (alive) setActiveSubscription(null);
            } finally {
                if (alive) setLoadingSubscription(false);
            }
        };

        run();
        return () => { alive = false; };
    }, []);

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-5">
            <WelcomeHeader user={user} />

            <QuickStats
                enrolledCount={enrolledCourses.length}
                classesAttended={6}
                currentStreak={3}
                loading={loading}
            />

            <div className="grid lg:grid-cols-12 gap-8">
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