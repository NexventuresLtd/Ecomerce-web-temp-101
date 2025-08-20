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

export const validateSignupForm = (data: SignupFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!data.fname) {
        newErrors.fname = 'First name is required';
    }

    if (!data.lname) {
        newErrors.lname = 'Last name is required';
    }

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

    if (!data.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
    }

    if (data.phone && !validatePhone(data.phone)) {
        newErrors.general = 'Please enter a valid phone number';
    }

    return newErrors;
};
