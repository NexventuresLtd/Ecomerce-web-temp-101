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
            } else if (error.response.status === 422) {
               return error?.response?.data?.detail[0]?.msg || "Inputs type Not Matching"
            }else if (error.response.status === 406) {
                console.log(error.response)
               return error?.response?.data.detail
            }
            
            return apiError.message || 'An error occurred during the request.';
        } else if (error.request) {
            // The request was made but no response was received
            return 'Network error. Please check your internet connection.';
        } else {
            // Something happened in setting up the request
            return 'An unexpected error occurred. Please try again.';
        }
    };