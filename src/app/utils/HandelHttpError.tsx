import type { ApiError } from "../../types/auth/auth";

// A backend bug can leak a raw stack trace / SQL error into `detail` instead
// of a clean message. Never show that verbatim — it's meaningless (and a bit
// alarming) to an end user.
const looksLikeRawServerError = (text: string): boolean => {
    if (!text) return false;
    if (text.length > 300) return true;
    return /traceback|psycopg2|sqlalchemy|\[sql:|stack trace|nonetype|exception/i.test(text);
};

// Handle API errors
export const handleApiError = (error: any): string => {
    if (error.response) {
        // The request was made and the server responded with a status code
        const apiError: ApiError = error.response.data;

        if (error.response.status >= 500) {
            // Server errors are, by definition, unexpected bugs — never trust
            // whatever text came back, even if it happens to look sane.
            return "Something went wrong on our end. Please try again in a moment.";
        } else if (error.response.status === 401) {
            return 'Invalid credentials. Please check your email and password.';
        } else if (error.response.status === 403) {
            const detail = typeof apiError?.detail === 'string' ? apiError.detail : '';
            return detail && !looksLikeRawServerError(detail)
                ? detail
                : 'Your account is not active. Please check your email/phone for a verification message.';
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
            return typeof apiError?.detail === 'string' && !looksLikeRawServerError(apiError.detail)
                ? apiError.detail
                : 'This action requires attention. Please try again.';
        } else if (error.response.status === 502) {
            return "We couldn't send the code right now. Please try again in a moment.";
        }

        const fallbackDetail = apiError.detail || apiError.message;
        if (fallbackDetail && !looksLikeRawServerError(fallbackDetail)) {
            return fallbackDetail;
        }
        return 'An error occurred during the request. Please try again.';
    } else if (error.request) {
        // The request was made but no response was received
        return 'Network error. Please check your internet connection.';
    } else {
        // Something happened in setting up the request
        return 'An unexpected error occurred. Please try again.';
    }
};