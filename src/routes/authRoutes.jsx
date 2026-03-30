import Login from "../modules/Auth/Login";
import SignUp from "../modules/Auth/Register";
import Forgot from "../modules/Auth/Forgot";
import Reset from "../modules/Auth/Reset";
import VerifyOtp from "../modules/Auth/VerifyOtp";
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
        path: "/verify-otp",
        element: <VerifyOtp />,
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
