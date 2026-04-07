import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            newestOnTop={true}       
            closeOnClick
            pauseOnHover
            limit={5}               
        />
    );
};

export default ToastProvider;