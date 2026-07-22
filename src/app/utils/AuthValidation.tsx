import type { SignupFormData, ValidationErrors, FormData } from "../../types/auth/auth";

// Validation functions
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
};

export const validateForm = (data: FormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!data.email) {
        newErrors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
        newErrors.email = 'Please enter a valid email address';
    }

    if (!data.password) {
        newErrors.password = 'Password is required';
    } else if (data.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
};

// Only the phone number is required to create an account — name, email and
// password are all optional and only validated if the user chose to fill them in.
export const validateSignupForm = (data: SignupFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!data.phone) {
        newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(data.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
    }

    if (data.email && !validateEmail(data.email)) {
        newErrors.email = 'Please enter a valid email address';
    }

    if (data.password || data.confirmPassword) {
        if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
    }

    return newErrors;
};
