import StudentLayout from "../layouts/dashboard/student";
import StudentDashboard from "../modules/Pages/studentDashboard";
import SubscriptionFlow from "../modules/Pages/studentDashboard/SubscriptionFlow";


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
        path: "subscribe",
        element: <SubscriptionFlow />,
      },
      // Add other student dashboard routes here
    ],
  },
];
