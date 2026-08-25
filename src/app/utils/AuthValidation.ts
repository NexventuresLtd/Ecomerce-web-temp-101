import type { SignupFormData, ValidationErrors, LoginFormData } from "../../types/auth/auth";

// Validation functions
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
};

// Login is by email OR phone ("identifier") + password.
export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!data.identifier) {
        newErrors.identifier = 'Email or phone number is required';
    } else if (!validateEmail(data.identifier) && !validatePhone(data.identifier)) {
        newErrors.identifier = 'Enter a valid email address or phone number';
    }

    if (!data.password) {
        newErrors.password = 'Password is required';
    }

    return newErrors;
};

// At least one of email/phone is required (whichever verify_via points at must
// actually be filled in), plus a real password — the backend enforces the same
// rules, this is just the friendly client-side pass.
export const validateSignupForm = (data: SignupFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    const hasEmail = !!data.email;
    const hasPhone = !!data.phone;

    if (!hasEmail && !hasPhone) {
        newErrors.general = 'Provide at least an email address or a phone number';
    }

    if (hasEmail && !validateEmail(data.email)) {
        newErrors.email = 'Please enter a valid email address';
    }
    if (hasPhone && !validatePhone(data.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
    }

    if (data.verify_via === 'email' && !hasEmail) {
        newErrors.verify_via = 'An email address is required to verify via email';
    }
    if (data.verify_via === 'phone' && !hasPhone) {
        newErrors.verify_via = 'A phone number is required to verify via phone';
    }
    if (data.verify_via === 'both' && !(hasEmail && hasPhone)) {
        newErrors.verify_via = 'Both an email address and a phone number are required to verify via both';
    }

    if (!data.password) {
        newErrors.password = 'Password is required';
    } else if (data.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
    }
    if (data.password !== data.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
};
