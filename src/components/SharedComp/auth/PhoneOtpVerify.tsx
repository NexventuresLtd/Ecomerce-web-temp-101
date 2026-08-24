import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, RotateCcw, Check, X, ArrowLeft } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface PhoneOtpVerifyProps {
    phone: string;
    // 'register' just marks the account verified (no tokens issued).
    // 'login' verifies + returns access/refresh tokens.
    mode: 'register' | 'login';
    initialVerificationCode: string;
    onVerified: (data?: any) => void;
    onBack?: () => void;
}

const PhoneOtpVerify: React.FC<PhoneOtpVerifyProps> = ({
    phone,
    mode,
    initialVerificationCode,
    onVerified,
    onBack,
}) => {
    const [otpCode, setOtpCode] = useState('');
    const [verificationCode, setVerificationCode] = useState(initialVerificationCode);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resending, setResending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || success || otpCode.trim().length < 6) return;

        setIsLoading(true);
        setError('');
        try {
            if (mode === 'register') {
                await mainAxios.post('/auth/verify-otp', {
                    otp_code: otpCode.trim(),
                    verification_code: verificationCode,
                    phone,
                });
                setSuccess(true);
                setTimeout(() => onVerified(), 1200);
            } else {
                const response = await mainAxios.post('/auth/login-phone/verify-otp', {
                    phone,
                    otp_code: otpCode.trim(),
                    verification_code: verificationCode,
                });
                setSuccess(true);
                setTimeout(() => onVerified(response.data), 1200);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resending) return;
        setResending(true);
        setError('');
        try {
            const url = mode === 'register' ? '/auth/register-phone/resend-otp' : '/auth/login-phone/request-otp';
            const response = await mainAxios.post(url, { phone });
            setVerificationCode(response.data.verification_code);
            setOtpCode('');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to resend code. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        >
            <div className="flex items-center justify-between mb-6">
                {onBack && (
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors" type="button">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h2 className="text-xl font-semibold text-gray-800 flex-1 text-center mr-4">
                    {mode === 'register' ? 'Verify Your Phone' : 'Login Verification'}
                </h2>
                <div className="w-8" />
            </div>

            <div className="flex items-center justify-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Smartphone className="text-primary" size={24} />
                </div>
            </div>

            <p className="text-gray-600 text-center mb-6">
                We've sent a verification code to <span className="font-medium">{phone}</span>.
            </p>

            <form onSubmit={handleSubmit} className="mb-6">
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
                    disabled={isLoading || success}
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

                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center"
                        >
                            <Check size={16} className="mr-2 flex-shrink-0" />
                            <span className="text-sm">Verified! Redirecting...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isLoading || success || otpCode.trim().length < 6}
                    className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Verifying...' : success ? 'Verified!' : 'Verify Code'}
                </button>
            </form>

            <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    type="button"
                >
                    <RotateCcw size={16} className="mr-1" />
                    {resending ? 'Sending...' : 'Resend Code'}
                </button>
            </div>
        </motion.div>
    );
};

export default PhoneOtpVerify;
