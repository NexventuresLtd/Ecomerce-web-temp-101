import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, Mail, Lock, Smartphone, User } from 'lucide-react';

import mainAxios from '../../Instance/mainAxios';
import AuthSplitLayout from '../../components/SharedComp/auth/AuthSplitLayout';
import GoogleLoginButton from '../../components/SharedComp/auth/GoogleLoginButton';
import OTPVerification from '../../components/SharedComp/auth/OTPCleint';
import PhoneOtpVerify from '../../components/SharedComp/auth/PhoneOtpVerify';
import { handleApiError } from '../../app/utils/HandelHttpError';
import { validateSignupForm } from '../../app/utils/AuthValidation';
import type { SignupFormData, ValidationErrors, VerifyVia } from '../../types/auth/auth';

const VERIFY_OPTIONS: { value: VerifyVia; label: string }[] = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'both', label: 'Both' },
];

const initialForm: SignupFormData = {
    fname: '', lname: '', email: '', phone: '', password: '', confirmPassword: '', verify_via: 'email',
};

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<SignupFormData>(initialForm);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Which OTP screen to show after a successful registration.
    const [emailOtpTarget, setEmailOtpTarget] = useState<string | null>(null);
    const [phoneOtp, setPhoneOtp] = useState<{ phone: string; verificationCode: string } | null>(null);
    const [verifiedDone, setVerifiedDone] = useState(false);

    const availableVerifyOptions = VERIFY_OPTIONS.filter((opt) => {
        if (opt.value === 'email') return !!formData.email;
        if (opt.value === 'phone') return !!formData.phone;
        return !!formData.email && !!formData.phone;
    });

    const handleChange = (field: keyof SignupFormData, value: string) => {
        setFormData((prev) => {
            const next = { ...prev, [field]: value };
            // Keep verify_via valid as the user edits contact fields — never leave
            // it pointed at a channel that no longer has a value.
            const stillValid =
                next.verify_via === 'email' ? !!next.email :
                    next.verify_via === 'phone' ? !!next.phone :
                        !!(next.email && next.phone);
            if (!stillValid) {
                next.verify_via = next.email ? 'email' : next.phone ? 'phone' : 'email';
            }
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateSignupForm(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setIsLoading(true);
        setErrors({});
        try {
            const { confirmPassword, ...payload } = formData;
            const response = await mainAxios.post('/auth/register', payload);
            setSuccessMessage(response.data?.message || 'Registration successful.');

            if (response.data?.email) {
                setEmailOtpTarget(response.data.email);
            } else if (response.data?.phone) {
                setPhoneOtp({ phone: response.data.phone, verificationCode: response.data.verification_code });
            }
        } catch (error) {
            setErrors({ general: handleApiError(error) });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async (msg?: string, userInfo?: any) => {
        if (msg || !userInfo?.email) {
            setErrors({ general: msg || 'Google sign-up failed. Please try again.' });
            return;
        }
        setIsLoading(true);
        setErrors({});
        try {
            // Google's OAuth response never includes a phone number or a password —
            // don't fake one with the email address, that corrupts the phone field.
            const response = await mainAxios.post(
                `/auth/signUp-social-auth?provider=GOOGLE&provider_id=${encodeURIComponent(userInfo.sub)}`,
                {
                    email: userInfo.email,
                    fname: userInfo.given_name,
                    lname: userInfo.family_name,
                    profile_pic: userInfo.picture,
                }
            );
            localStorage.setItem('authToken', response.data.access_token);
            localStorage.setItem('refresh', response.data.refresh_token);
            localStorage.setItem('userInfo', JSON.stringify(response.data.encrypted_data?.UserInfo || response.data.encrypted_data));
            window.location.href = '/';
        } catch (error) {
            setErrors({ general: handleApiError(error) });
        } finally {
            setIsLoading(false);
        }
    };

    if (verifiedDone) {
        return (
            <AuthSplitLayout>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full rounded-3xl bg-white/10 backdrop-blur-2xl shadow-2xl p-10 text-center"
                >
                    <CheckCircle2 className="w-14 h-14 text-emerald-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Account Verified!</h2>
                    <p className="text-white/60 mb-6">You can now sign in to your account.</p>
                    <a href="/login" className="inline-block px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-colors">
                        Go to Sign In
                    </a>
                </motion.div>
            </AuthSplitLayout>
        );
    }

    if (emailOtpTarget) {
        return (
            <AuthSplitLayout>
                <OTPVerification
                    email={emailOtpTarget}
                    purpose="email"
                    onVerificationSuccess={() => { setEmailOtpTarget(null); setVerifiedDone(true); }}
                    onBack={() => setEmailOtpTarget(null)}
                />
            </AuthSplitLayout>
        );
    }

    if (phoneOtp) {
        return (
            <AuthSplitLayout>
                <PhoneOtpVerify
                    phone={phoneOtp.phone}
                    initialVerificationCode={phoneOtp.verificationCode}
                    onVerified={() => { setPhoneOtp(null); setVerifiedDone(true); }}
                    onBack={() => setPhoneOtp(null)}
                />
            </AuthSplitLayout>
        );
    }

    return (
        <AuthSplitLayout>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-3xl bg-white/10 backdrop-blur-2xl shadow-2xl p-8 sm:p-10"
            >
                <div className="text-center mb-7">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-white/60">Join Umukamezi in a few quick steps</p>
                </div>

                <AnimatePresence>
                    {errors.general && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-5 p-3 rounded-xl bg-red-500/15 text-red-200 flex items-start gap-2 text-sm"
                        >
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span>{errors.general}</span>
                        </motion.div>
                    )}
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-5 p-3 rounded-xl bg-emerald-500/15 text-emerald-200 flex items-start gap-2 text-sm"
                        >
                            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span>{successMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">First Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    value={formData.fname}
                                    onChange={(e) => handleChange('fname', e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 text-sm"
                                    placeholder="First name"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Last Name</label>
                            <input
                                type="text"
                                value={formData.lname}
                                onChange={(e) => handleChange('lname', e.target.value)}
                                className="w-full px-3.5 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 text-sm"
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30"
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-300 text-sm mt-1.5">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
                        <div className="relative">
                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30"
                                placeholder="+250781234567"
                            />
                        </div>
                        {errors.phone && <p className="text-red-300 text-sm mt-1.5">{errors.phone}</p>}
                        {!formData.email && !formData.phone && (
                            <p className="text-white/40 text-xs mt-1.5">Provide at least an email or a phone number.</p>
                        )}
                    </div>

                    {availableVerifyOptions.length > 1 && (
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Verify my account via</label>
                            <div className="flex gap-2">
                                {availableVerifyOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, verify_via: opt.value })}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${formData.verify_via === opt.value
                                                ? 'bg-secondary text-white'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30"
                                    placeholder="At least 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-300 text-sm mt-1.5">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30"
                                    placeholder="Re-enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-300 text-sm mt-1.5">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-60 mt-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </motion.button>
                </form>

                <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/15" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-transparent text-white/50">or continue with</span>
                    </div>
                </div>

                <GoogleLoginButton title="Sign Up With" handelGoogleLogin={handleGoogleSignup} />

                <p className="text-center text-white/60 mt-7">
                    Already have an account?{' '}
                    <a href="/login" className="text-white font-medium hover:underline">Sign in</a>
                </p>
                <a href="/" className="block text-center text-white/40 hover:text-white/70 text-sm mt-3 transition-colors">
                    Back to Home
                </a>
            </motion.div>
        </AuthSplitLayout>
    );
};

export default RegisterPage;
