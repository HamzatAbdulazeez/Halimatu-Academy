import { Navigate } from "react-router-dom";
import StudentProtectedRoute from "../components/StudentProtectedRoute";
import StudentLayout from "../layouts/dashboard/student";
import StudentDashboard from "../modules/Pages/studentDashboard";
import SubscriptionFlow from "../modules/Pages/studentDashboard/subscriptions/SubscriptionFlow";
import Courses from "../modules/Pages/studentDashboard/Courses";
import CertificatePage from "../modules/Pages/studentDashboard/Certificate";
import NotificationsPage from "../modules/Pages/studentDashboard/Notification";
import SettingsPage from "../modules/Pages/studentDashboard/Setting";
import SubscriptionGuard from "../components/SubscriptionGuard";

export const studentRoutes = [
  {
    element: <StudentProtectedRoute />,
    children: [
      {
        path: "/student",
        element: (
          <SubscriptionGuard>
            {" "}
            <StudentLayout />{" "}
          </SubscriptionGuard>
        ),
        children: [
          { index: true, element: <StudentDashboard /> },
          { path: "courses", element: <Courses /> },
          { path: "certificates", element: <CertificatePage /> },
          { path: "subscription", element: <SubscriptionFlow /> },
          { path: "notifications", element: <NotificationsPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: "/student/*", element: <Navigate to="/login" replace /> },
];
