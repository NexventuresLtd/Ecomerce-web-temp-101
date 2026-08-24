import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, X, ArrowLeft, Loader, Lock } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface PasswordResetProps {
    onBack?: () => void;
    onSuccess?: () => void;
    setShowSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

type Step = 'email' | 'otp' | 'password' | 'done';

const PasswordReset: React.FC<PasswordResetProps> = ({
    onBack,
    setShowSignupModal,
    onSuccess,

}) => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            const response = await mainAxios.post('/auth/forgot-password/request-otp', { email });
            setVerificationCode(response.data.verification_code || '');
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to send reset code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otpCode.trim().length < 6) {
            setError('Enter the 6-digit code sent to your email/phone');
            return;
        }
        setStep('password');
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await mainAxios.post('/auth/forgot-password/verify-and-reset', {
                email,
                otp_code: otpCode.trim(),
                verification_code: verificationCode,
                new_password: newPassword,
            });
            setStep('done');
            if (onSuccess) {
                setTimeout(() => onSuccess(), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-between">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h2 className="text-xl font-semibold text-gray-800 flex-1 text-center mr-4">
                        Reset Password
                    </h2>
                    <div className="w-8" /> {/* Spacer for balance */}
                </div>

                <button
                    onClick={() => setShowSignupModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>


            <div className="flex items-center justify-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                    {step === 'password' ? (
                        <Lock className="text-primary" size={24} />
                    ) : (
                        <Mail className="text-primary" size={24} />
                    )}
                </div>
            </div>

            {step === 'email' && (
                <>
                    <p className="text-gray-600 text-center mb-6">
                        Enter your email address and we'll send a reset code to your email and phone.
                    </p>

                    <form onSubmit={handleRequestOtp}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter your email"
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center"
                                >
                                    <X size={16} className="mr-2 flex-shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full py-4 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={18} className="animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Code'
                            )}
                        </button>
                    </form>
                </>
            )}

            {step === 'otp' && (
                <>
                    <p className="text-gray-600 text-center mb-6">
                        We've sent a 6-character code to <span className="font-medium">{email}</span> (and your phone, if on file).
                    </p>

                    <form onSubmit={handleVerifyOtp}>
                        <input
                            type="text"
                            inputMode="text"
                            autoCapitalize="characters"
                            autoCorrect="off"
                            spellCheck={false}
                            value={otpCode}
                            onChange={(e) => { setOtpCode(e.target.value.toUpperCase()); setError(''); }}
                            placeholder="Enter 6-character code"
                            maxLength={6}
                            className="w-full text-center text-2xl tracking-[0.5em] font-semibold px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
                        />

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center"
                                >
                                    <X size={16} className="mr-2 flex-shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={otpCode.trim().length < 6}
                            className="w-full py-4 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Continue
                        </button>
                    </form>
                </>
            )}

            {step === 'password' && (
                <>
                    <p className="text-gray-600 text-center mb-6">
                        Choose a new password for your account.
                    </p>

                    <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="At least 8 characters"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Re-enter your password"
                                disabled={isLoading}
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center"
                                >
                                    <X size={16} className="mr-2 flex-shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading || !newPassword || !confirmPassword}
                            className="w-full py-4 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={18} className="animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                </>
            )}

            {step === 'done' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                >
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex flex-col items-center">
                        <div className="bg-green-100 p-2 rounded-full mb-3">
                            <Check size={24} className="text-green-600" />
                        </div>
                        <h3 className="font-medium text-lg mb-1">Password Updated</h3>
                        <p className="text-sm">
                            Your password has been changed successfully. You can now log in.
                        </p>
                    </div>
                </motion.div>
            )}

        </motion.div>
    );
};

export default PasswordReset;
