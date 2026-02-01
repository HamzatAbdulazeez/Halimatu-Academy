import AdminLayout from "../layouts/dashboard/student";
import AdminDashboard from "../modules/Pages/studentDashboard";
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
      // Add other student dashboard routes here
    ],
  },
];
