import { Navigate } from "react-router-dom";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import AdminLayout from "../layouts/super-dashboard/admin";
import AdminDashboard from "../modules/Pages/adminDashboard";
import ManageStudents from "../modules/Pages/adminDashboard/ManageStudents";
import ManagePage from "../modules/Pages/adminDashboard/ManageCourses";
import EnrollmentsPage from "../modules/Pages/adminDashboard/CourseEnrollments";
import PlanPage from "../modules/Pages/adminDashboard/PlansPage"
import Certificate from "../modules/Pages/adminDashboard/Certificates";
import NotificationPage from "../modules/Pages/adminDashboard/Notification";
import AdminClassLinksPage from '../modules/Pages/adminDashboard/AdminClassLinksPage';
import AdminTopicsPage from '../modules/Pages/adminDashboard/AdminTopicsPage';
import SettingsPage from "../modules/Pages/adminDashboard/Setting";

export const adminRoutes = [
  {
    
    element: <AdminProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "students", element: <ManageStudents /> },
          { path: "courses", element: <ManagePage /> },
          { path: "enrollments", element: <EnrollmentsPage /> },
          { path: "subscriptions", element: <PlanPage /> },
          { path: "certificates", element: <Certificate /> },
          { path: "notifications", element: <NotificationPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "course-management/links", element: <AdminClassLinksPage /> },
          { path: "course-management/topics", element: <AdminTopicsPage /> },
        ],
      },
    ],
  },
 
  {
    path: "/admin/*",
    element: <Navigate to="/admin-login" replace />,
  },
];