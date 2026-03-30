import { toast } from "sonner";

export const handleApiError = (err) => {
    console.error("API Error:", err);

    const data = err.response?.data;

    if (!data) {
        toast.error("Network error. Check your connection.");
        return;
    }
    if (data.errors && typeof data.errors === "object") {
        Object.values(data.errors).forEach((messages) => {
            const msg = Array.isArray(messages) ? messages[0] : messages;
            toast.error(msg);
        });
        return;
    }

    // Simple message
    if (data.message) {
        toast.error(data.message);
        return;
    }

    // Fallback
    toast.error("Something went wrong. Please try again.");
};