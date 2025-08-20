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

export interface SignupFormData extends FormData {
    confirmPassword: string;
    fname: string;
    lname: string;
    phone?: string;
    profile_pic?: string;
}

export interface ValidationErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    fname?: string;
    lname?: string;
    general?: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    statusCode?: number;
}
