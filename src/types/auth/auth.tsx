export interface DecodedUser {
    iss: string;
    nbf: number;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
    jti: string;
}
// TypeScript interfaces
export interface FormData {
    email: string;
    password: string;
}

export type VerifyVia = 'email' | 'phone' | 'both';

// Login is by email OR phone ("identifier") + password — no more OTP-only login.
export interface LoginFormData {
    identifier: string;
    password: string;
}

export interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
    fname: string;
    lname: string;
    phone: string;
    verify_via: VerifyVia;
}

export interface ValidationErrors {
    identifier?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    fname?: string;
    lname?: string;
    phone?: string;
    verify_via?: string;
    general?: string;
}

export interface ApiError {
    message?: string;
    detail?: string; // FastAPI's HTTPException error responses use this field
    errors?: Record<string, string[]>;
    statusCode?: number;
}
