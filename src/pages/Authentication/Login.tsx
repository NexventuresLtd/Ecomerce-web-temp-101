import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

import mainAxios from '../../Instance/mainAxios';
import AuthSplitLayout from '../../components/SharedComp/auth/AuthSplitLayout';
import GoogleLoginButton from '../../components/SharedComp/auth/GoogleLoginButton';
import OTPVerification from '../../components/SharedComp/auth/OTPCleint';
import PasswordReset from '../../components/SharedComp/auth/Password';
import { handleApiError } from '../../app/utils/HandelHttpError';
import { validateLoginForm } from '../../app/utils/AuthValidation';
import type { LoginFormData, ValidationErrors } from '../../types/auth/auth';
import { cartApi } from '../../app/products/cart';
import { wishlistService } from '../../app/products/wishlistService';

const redirectForRole = (role: string | undefined) => {
    window.location.href = role === 'admin' ? '/admin-dashboard' : '/profile';
};

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({ identifier: '', password: '' });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [pendingUser, setPendingUser] = useState<any>(null);

    const finalizeLogin = async (newUser: any) => {
        localStorage.setItem('authToken', newUser.access_token);
        localStorage.setItem('refresh', newUser.refresh_token);
        localStorage.setItem('userInfo', JSON.stringify(newUser.encrypted_data));
        await Promise.all([cartApi.mergeGuestCart(), wishlistService.mergeGuestWishlist()]);
        redirectForRole(newUser.encrypted_data?.role);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateLoginForm(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setIsLoading(true);
        setErrors({});
        try {
            const response = await mainAxios.post('/auth/login', {
                identifier: formData.identifier,
                password: formData.password,
            });
            const newUser = response.data;

            if (newUser?.encrypted_data?.two_factor) {
                setPendingUser(newUser);
                setShowOTP(true);
            } else {
                await finalizeLogin(newUser);
            }
        } catch (error) {
            setErrors({ general: handleApiError(error) });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (msg?: string, userInfo?: any) => {
        if (msg || !userInfo?.email) {
            setErrors({ general: msg || 'Google sign-in failed. Please try again.' });
            return;
        }
        setIsLoading(true);
        setErrors({});
        try {
            const response = await mainAxios.post(`/auth/signIn-social-token?Email=${encodeURIComponent(userInfo.email)}`, {});
            await finalizeLogin(response.data);
        } catch (error) {
            setErrors({ general: handleApiError(error) });
        } finally {
            setIsLoading(false);
        }
    };

    if (showOTP && pendingUser) {
        return (
            <AuthSplitLayout>
                <OTPVerification
                    email={pendingUser.encrypted_data?.email || formData.identifier}
                    purpose="login"
                    onVerificationSuccess={() => finalizeLogin(pendingUser)}
                    onBack={() => { setShowOTP(false); setPendingUser(null); }}
                />
            </AuthSplitLayout>
        );
    }

    if (showForgotPassword) {
        return (
            <AuthSplitLayout>
                <PasswordReset
                    setShowSignupModal={() => setShowForgotPassword(false)}
                    onBack={() => setShowForgotPassword(false)}
                    onSuccess={() => setShowForgotPassword(false)}
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
                className="w-full rounded-3xl bg-white backdrop-blur-2xl shadow-2xl p-8 sm:p-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
                    <p className="text-slate-600">Sign in to continue to Umukamezi</p>
                </div>

                <AnimatePresence>
                    {errors.general && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-5 p-3 rounded-xl bg-red-500/30 text-red-900 flex items-start gap-2 text-sm"
                        >
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span>{errors.general}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email or Phone Number</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                            <input
                                type="text"
                                value={formData.identifier}
                                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 text-slate-700 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="you@example.com or +250781234567"
                                autoComplete="username"
                            />
                        </div>
                        {errors.identifier && <p className="text-red-500 text-sm mt-1.5">{errors.identifier}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/10 text-slate-700 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>}
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-slate-700 hover:text-slate-900 text-sm transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-60"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </motion.button>
                </form>

                <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/15" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-transparent text-slate-700">or continue with</span>
                    </div>
                </div>

                <GoogleLoginButton title="Sign In With" handelGoogleLogin={handleGoogleLogin} />

                <p className="text-center text-slate-700 mt-7">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-500 font-medium hover:underline">Create one</a>
                </p>
                <a href="/" className="block text-center text-slate-700/40 hover:text-slate-700/70 text-sm mt-3 transition-colors">
                    Back to shopping
                </a>
            </motion.div>
        </AuthSplitLayout>
    );
};

export default LoginPage;
