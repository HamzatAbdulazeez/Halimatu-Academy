// routes/adminRoutes.js
import { Navigate } from "react-router-dom";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import AdminLayout from "../layouts/super-dashboard/admin";

import AdminDashboard from "../modules/Pages/adminDashboard";
import ManageStudents from "../modules/Pages/adminDashboard/ManageStudents";
import ManagePage from "../modules/Pages/adminDashboard/ManageCourses";
import EnrollmentsPage from "../modules/Pages/adminDashboard/CourseEnrollments";
import PlanPage from "../modules/Pages/adminDashboard/subscriptions/PlansPage";
import Certificate from "../modules/Pages/adminDashboard/Certificates";
import NotificationPage from "../modules/Pages/adminDashboard/Notification";
import AdminClassLinksPage from '../modules/Pages/adminDashboard/AdminClassLinksPage';
import AdminTopicsPage from '../modules/Pages/adminDashboard/AdminTopicsPage';
import SettingsPage from "../modules/Pages/adminDashboard/Setting";
import AdminRole from "../modules/Pages/adminDashboard/roles/AdminRoles";
import RolePermissions from "../modules/Pages/adminDashboard/roles/RolePermissions";
import ManageAdminsPage from "../modules/Pages/adminDashboard/staff/ManageAdminsPage";
import Unauthorized from "../modules/Pages/adminDashboard/Unauthorized";

export const adminRoutes = [
  {
    element: <AdminProtectedRoute />,           // Base protection
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

          // === STAFF & ROLES MANAGEMENT (Super Admin + Admin only) ===
          {
            element: <AdminProtectedRoute allowedRoles={["Super Admin", "Admin"]} />,
            children: [
              { path: "staff", element: <ManageAdminsPage /> },
              { path: "roles", element: <AdminRole /> },
              { path: "roles/:roleId/permissions", element: <RolePermissions /> },
            ],
          },

          // === COURSE MANAGEMENT (Super Admin, Admin, Content Moderator) ===
          {
            element: <AdminProtectedRoute allowedRoles={["Super Admin", "Admin", "Content Moderator"]} />,
            children: [
              { path: "course-management/links", element: <AdminClassLinksPage /> },
              { path: "course-management/topics", element: <AdminTopicsPage /> },
            ],
          },

          // === SETTINGS (Only Super Admin) ===
          {
            element: <AdminProtectedRoute allowedRoles={["Super Admin"]} />,
            children: [
              { path: "settings", element: <SettingsPage /> },
            ],
          },
        ],
      },
    ],
  },

  // Unauthorized page
  {
    path: "/admin/unauthorized",
    element: <Unauthorized />,
  },

  // Catch all unknown admin routes → redirect to login
  {
    path: "/admin/*",
    element: <Navigate to="/admin-login" replace />,
  },
];