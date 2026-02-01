import Login from "../modules/Auth/Login";
import SignUp from "../modules/Auth/Register";
import Forgot from "../modules/Auth/Forgot";
import Reset from "../modules/Auth/Reset";
import AdminLogin from "../modules/Auth/AdminLogin";


export const authRoutes = [
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <SignUp />,
    },
    {
        path: "/forgot-password",
        element: <Forgot />,
    },
    {
        path: "/reset-password",
        element: <Reset />,
    },
    {
        path: "/admin-login",
        element: <AdminLogin />,
    },
];
