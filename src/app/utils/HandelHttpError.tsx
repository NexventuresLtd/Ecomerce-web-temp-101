import type { ApiError } from "../../types/auth/auth";

// Handle API errors
export const handleApiError = (error: any): string => {
    if (error.response) {
        // The request was made and the server responded with a status code
        const apiError: ApiError = error.response.data;

        if (error.response.status === 401) {
            return 'Invalid credentials. Please check your email and password.';
        } else if (error.response.status === 403) {
            return 'Your account is not active. Please check your email for verification.inbox/spam';
        } else if (error.response.status === 404) {
            // FastAPI sends a plain string detail for real "not found" cases (e.g. no
            // account with that phone/email); a route that doesn't exist on the server
            // sends detail: "Not Found" instead — don't show that raw string to users.
            const detail = typeof apiError?.detail === 'string' ? apiError.detail : '';
            return detail && detail.toLowerCase() !== 'not found'
                ? detail
                : "We couldn't find what you're looking for. Please try again.";
        } else if (error.response.status === 422) {
            if (Array.isArray(error?.response?.data?.detail) && error.response.data.detail[0]?.msg == "String should have at least 8 characters") {
                return "Password should Contain String number symbols"
            } else if (Array.isArray(error?.response?.data?.detail)) {
                return error.response.data.detail[0]?.msg || "Inputs type Not Matching"
            }
            return typeof apiError?.detail === 'string' ? apiError.detail : "Inputs type Not Matching"
        } else if (error.response.status === 406) {
            console.log(error.response)
            return error?.response?.data.detail
        } else if (error.response.status === 502) {
            return "We couldn't send the code right now. Please try again in a moment.";
        }

        return apiError.detail || apiError.message || 'An error occurred during the request.';
    } else if (error.request) {
        // The request was made but no response was received
        return 'Network error. Please check your internet connection.';
    } else {
        // Something happened in setting up the request
        return 'An unexpected error occurred. Please try again.';
    }
};