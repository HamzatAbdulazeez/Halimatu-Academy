import { toast } from "react-toastify";

export const notify = {
  error: (message) =>
    toast.error(message, {
      toastId: message, 
      position: "top-right",
      autoClose: 4000,
    }),

  success: (message) =>
    toast.success(message, {
      toastId: message,
      position: "top-right",
      autoClose: 3000,
    }),

  info: (message) =>
    toast.info(message, {
      toastId: message,
      position: "top-right",
      autoClose: 3000,
    }),
};