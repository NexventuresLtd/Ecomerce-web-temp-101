import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, RotateCcw, Check, X, ArrowLeft } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface OTPVerificationProps {
    email: string;
    purpose: 'login' | 'email' | 'reset' | 'Info';
    onVerificationSuccess: () => void;
    onBack?: () => void;
    className?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
    email,
    purpose,
    onVerificationSuccess,
    onBack,
    className = ''
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [verificationCode, setVerificationCode] = useState('');
    const [activeInput, setActiveInput] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const purposeLabels = {
        login: 'Login Verification',
        email: 'Email Verification',
        reset: 'Password Reset',
        Info: 'Security Access'
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        if (inputRefs.current[activeInput]) {
            inputRefs.current[activeInput]?.focus();
        }
    }, [activeInput]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (/^[A-Z0-9]$/i.test(value) || value === '') {
            const newOtp = [...otp];

            // If user pasted multiple characters (like from an SMS)
            if (value.length > 1) {
                const pastedData = value.slice(0, 6).split('');
                pastedData.forEach((char, i) => {
                    if (i < 6 && /^[A-Z0-9]$/i.test(char)) {
                        newOtp[i] = char.toUpperCase();
                    }
                });
                setOtp(newOtp);

                // Focus the last input if all are filled
                const lastFilledIndex = newOtp.findIndex(char => char === '');
                if (lastFilledIndex === -1) {
                    setActiveInput(5);
                    inputRefs.current[5]?.blur();
                } else {
                    setActiveInput(Math.min(lastFilledIndex, 5));
                }
            } else {
                newOtp[index] = value.toUpperCase();
                setOtp(newOtp);

                // Move to next input if current input has value
                if (value && index < 5) {
                    setActiveInput(index + 1);
                }
            }

            setError('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            setActiveInput(index - 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');

        if (pastedData.every(char => /^[A-Z0-9]$/i.test(char))) {
            const newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (i < 6) {
                    newOtp[i] = char.toUpperCase();
                }
            });
            setOtp(newOtp);

            // Focus the last input if all are filled
            const lastFilledIndex = newOtp.findIndex(char => char === '');
            if (lastFilledIndex === -1) {
                setActiveInput(5);
                inputRefs.current[5]?.blur();
            } else {
                setActiveInput(Math.min(lastFilledIndex, 5));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const otpCode = otp.join('');

            const response = await mainAxios.post('/auth/verify-otp', {
                otp_code: otpCode,
                verification_code: verificationCode,
                email: email
            });

            if (response.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    onVerificationSuccess();
                }, 1500);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resendOTP = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await mainAxios.post('/auth/send-otp/', {
                purpose: purpose,
                toEmail: email
            });

            if (response.status === 200) {
                setVerificationCode(response.data.verification_Code);
                setOtp(new Array(6).fill(''));
                setActiveInput(0);
                setCountdown(60); // 60 seconds countdown
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-submit when all OTP fields are filled
    useEffect(() => {
        if (otp.every(value => value !== '') && verificationCode) {
            handleSubmit({ preventDefault: () => { } } as React.FormEvent);
        }
    }, [otp, verificationCode]);

    // Initialize with a verification code when component mounts
    useEffect(() => {
        resendOTP();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-xl shadow-lg p-6 w-full max-w-md ${className}`}
        >
            <div className="flex items-center justify-between mb-6">
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
                    {purposeLabels[purpose]}
                </h2>
                <div className="w-8" /> {/* Spacer for balance */}
            </div>

            <div className="flex items-center justify-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="text-primary" size={24} />
                </div>
            </div>

            <p className="text-gray-600 text-center mb-6">
                We've sent a verification code to <span className="font-medium">{email}</span>.
                Please enter the code below to verify your identity.
            </p>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex justify-between space-x-2 mb-6">
                    {otp.map((digit, index) => (
                        <motion.input
                            key={index}
                            ref={(el) => { (inputRefs.current[index] = el) }}
                            type="text"
                            inputMode="numeric"
                            pattern="[A-Z0-9]*"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            onFocus={() => setActiveInput(index)}
                            className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            maxLength={1}
                            disabled={isLoading || success}
                            whileFocus={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        />
                    ))}
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

                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center"
                        >
                            <Check size={16} className="mr-2 flex-shrink-0" />
                            <span className="text-sm">Verification successful! Redirecting...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isLoading || success || otp.some(d => d === '')}
                    className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Verifying...' : success ? 'Verified!' : 'Verify Code'}
                </button>
            </form>

            <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">
                    Didn't receive the code?
                </p>
                <button
                    onClick={resendOTP}
                    disabled={isLoading || countdown > 0}
                    className="text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                    <RotateCcw size={16} className="mr-1" />
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
            </div>
        </motion.div>
    );
};

export default OTPVerification;