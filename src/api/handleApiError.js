import { notify } from "../utils/toast";

export const handleApiError = (err) => {
    console.error("API Error:", err);

    const data = err.response?.data;

    if (!data) {
        notify.error("Network error. Check your connection.");
        return;
    }

    if (data.errors && typeof data.errors === "object") {
        Object.values(data.errors).forEach((messages) => {
            const msg = Array.isArray(messages) ? messages[0] : messages;
            notify.error(msg);
        });
        return;
    }

    if (data.message) {
        notify.error(data.message);
        return;
    }

    notify.error("Something went wrong. Please try again.");
};