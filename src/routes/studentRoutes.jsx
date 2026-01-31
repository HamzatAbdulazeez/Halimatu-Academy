import StudentLayout from "../layouts/dashboard/student";
import StudentDashboard from "../modules/Pages/studentDashboard";
import SubscriptionFlow from "../modules/Pages/studentDashboard/SubscriptionFlow";
import Courses from "../modules/Pages/studentDashboard/Courses";
import CertificatePage from "../modules/Pages/studentDashboard/Certificate";
import NotificationsPage from "../modules/Pages/studentDashboard/Notification";
import SettingsPage from "../modules/Pages/studentDashboard/Setting";

// Define student routes

export const studentRoutes = [
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <StudentDashboard />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "certificates",
        element: <CertificatePage />,
      },
      {
        path: "subscription",
        element: <SubscriptionFlow />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    
      // Add other student dashboard routes here
    ],
  },
];
