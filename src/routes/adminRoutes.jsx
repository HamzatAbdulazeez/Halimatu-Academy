import AdminLayout from "../layouts/super-dashboard/admin";
import AdminDashboard from "../modules/Pages/adminDashboard";
import ManageStudents from "../modules/Pages/adminDashboard/ManageStudents";
import ManagePage from "../modules/Pages/adminDashboard/ManageCourses";
import EnrollmentsPage from "../modules/Pages/adminDashboard/CourseEnrollments";
import PlanPage from "../modules/Pages/adminDashboard/PlansPage"
// Define student routes

export const adminRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "students",
        element: <ManageStudents />,
      },
      {
        path: "courses",
        element: <ManagePage />,
      },
      {
        path: "enrollments",
        element: <EnrollmentsPage />,
      },
      {
        path: "subscriptions",
        element: <PlanPage />,
      },
      // Add other student dashboard routes here
    ],
  },
];
