import Login from "../modules/Auth/Login";
import SignUp from "../modules/Auth/Register";
import Forgot from "../modules/Auth/Forgot";
import Reset from "../modules/Auth/Reset";

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
];
