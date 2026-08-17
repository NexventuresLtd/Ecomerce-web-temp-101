import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, RotateCcw, Check, X, ArrowLeft } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface OTPVerificationProps {
    email: string;
    userEmail?: string;
    userPhone?: string;
    purpose: 'login' | 'email' | 'reset' | 'Info' | 'payment';
    onVerificationSuccess: () => void;
    onBack?: () => void;
    className?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
    email,
    userEmail,
    userPhone,
    purpose,
    onVerificationSuccess,
    onBack,
    className = ''
}) => {
    // Resolve available channel targets
    const resolvedEmail = userEmail || (email && email.includes('@') ? email : '');
    const resolvedPhone = userPhone || (email && !email.includes('@') ? email : '');

    // Track chosen channel: 'email' | 'phone' | null
    const [selectedChannel, setSelectedChannel] = useState<'email' | 'phone' | null>(() => {
        if (purpose !== 'login' && purpose !== 'payment') {
            return resolvedPhone ? 'phone' : 'email';
        }
        return null; // Require explicit selection on login and payment!
    });

    const [activeTarget, setActiveTarget] = useState<string>(() => {
        if (purpose !== 'login' && purpose !== 'payment') return email;
        return '';
    });

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
        Info: 'Security Access',
        payment: 'Payment Checkout Verification'
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        if (selectedChannel && inputRefs.current[activeInput]) {
            inputRefs.current[activeInput]?.focus();
        }
    }, [activeInput, selectedChannel]);

    const handleSelectChannel = (channel: 'email' | 'phone') => {
        const target = channel === 'email' ? (resolvedEmail || email) : (resolvedPhone || email);
        setSelectedChannel(channel);
        setActiveTarget(target);
        setOtp(new Array(6).fill(''));
        setError('');
        sendOTP(channel, target);
    };

    const sendOTP = async (_channel: 'email' | 'phone', target: string) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await mainAxios.post('/auth/send-otp/', {
                purpose: purpose,
                toEmail: target,
                identifier: target
            });

            if (response.status === 200) {
                setVerificationCode(response.data.verification_Code || response.data.verification_code);
                setOtp(new Array(6).fill(''));
                setActiveInput(0);
                setCountdown(60);
            }
        } catch (err: any) {
            const rawDetail = err.response?.data?.detail;
            const errMsg = typeof rawDetail === 'string'
                ? rawDetail
                : Array.isArray(rawDetail) && rawDetail[0]?.msg
                    ? rawDetail[0].msg
                    : 'Failed to send OTP code. Please try again.';
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const resendOTP = async () => {
        if (countdown > 0 || !selectedChannel || !activeTarget) return;
        await sendOTP(selectedChannel, activeTarget);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (/^[A-Z0-9]$/i.test(value) || value === '') {
            const newOtp = [...otp];

            if (value.length > 1) {
                const pastedData = value.slice(0, 6).split('');
                pastedData.forEach((char, i) => {
                    if (i < 6 && /^[A-Z0-9]$/i.test(char)) {
                        newOtp[i] = char.toUpperCase();
                    }
                });
                setOtp(newOtp);

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

                if (value !== '' && index < 5) {
                    setActiveInput(index + 1);
                }
            }

            setError('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                setActiveInput(index - 1);
            }
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
        } else if (e.key === 'ArrowLeft' && index > 0) {
            setActiveInput(index - 1);
        } else if (e.key === 'ArrowRight' && index < 5) {
            setActiveInput(index + 1);
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

        if (isLoading || success || otp.some(d => d === '')) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const otpCode = otp.join('');

            const response = await mainAxios.post('/auth/verify-otp', {
                otp_code: otpCode,
                verification_code: verificationCode,
                email: activeTarget || email,
                identifier: activeTarget || email
            });

            if (response.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    onVerificationSuccess();
                }, 1200);
            }
        } catch (err: any) {
            const rawDetail = err.response?.data?.detail;
            const errMsg = typeof rawDetail === 'string'
                ? rawDetail
                : Array.isArray(rawDetail) && rawDetail[0]?.msg
                    ? rawDetail[0].msg
                    : 'Verification failed. Please check the code.';
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (otp.every(value => value !== '') && verificationCode) {
            const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
            handleSubmit(syntheticEvent);
        }
    }, [otp, verificationCode]);

    // Non-login auto dispatch (e.g. registration verification)
    useEffect(() => {
        if (purpose !== 'login' && selectedChannel && activeTarget) {
            sendOTP(selectedChannel, activeTarget);
        }
    }, []);

    // SCREEN 1: Channel Selector Screen
    if (!selectedChannel) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md ${className}`}
            >
                <div className="flex items-center justify-between mb-6">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Go back"
                            type="button"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-gray-800 flex-1 text-center mr-2">
                        Verification Method
                    </h2>
                    <div className="w-8" />
                </div>

                <p className="text-gray-600 text-center mb-6 text-sm">
                    How would you like to receive your 6-digit security code?
                </p>

                <div className="space-y-4 mb-4">
                    {/* Send via Email */}
                    <button
                        type="button"
                        onClick={() => handleSelectChannel('email')}
                        className="w-full border-2 border-gray-200 hover:border-primary rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01] text-left group"
                    >
                        <div className="bg-blue-50 group-hover:bg-primary/10 p-3 rounded-full flex-shrink-0">
                            <Mail className="text-primary" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800">
                                Email Address
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                                {resolvedEmail || email}
                            </div>
                        </div>
                    </button>

                    {/* Send via SMS */}
                    <button
                        type="button"
                        onClick={() => handleSelectChannel('phone')}
                        className="w-full border-2 border-gray-200 hover:border-amber-500 rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01] text-left group"
                    >
                        <div className="bg-amber-50 group-hover:bg-amber-100 p-3 rounded-full flex-shrink-0">
                            <Smartphone className="text-amber-600" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800">
                                Phone Number / SMS
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                                {resolvedPhone || (email && !email.includes('@') ? email : 'Registered Phone Number')}
                            </div>
                        </div>
                    </button>
                </div>
            </motion.div>
        );
    }

    // SCREEN 2: 6-Digit Code Input Screen
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md ${className}`}
        >
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => {
                        if (purpose === 'login') {
                            setSelectedChannel(null);
                        } else if (onBack) {
                            onBack();
                        }
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Change method"
                    type="button"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-800 flex-1 text-center mr-2">
                    {purposeLabels[purpose]}
                </h2>
                <div className="w-8" />
            </div>

            <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    {selectedChannel === 'phone' ? (
                        <Smartphone className="text-primary" size={26} />
                    ) : (
                        <Mail className="text-primary" size={26} />
                    )}
                </div>
            </div>

            <p className="text-gray-600 text-center mb-6 text-sm">
                We've sent a 6-digit code via{' '}
                <span className="font-semibold text-gray-800">
                    {selectedChannel === 'phone' ? 'SMS' : 'Email'}
                </span>{' '}
                to <span className="font-medium text-gray-800">{activeTarget}</span>.
            </p>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex justify-between space-x-2 mb-6">
                    {otp.map((digit, index) => (
                        <motion.input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            pattern="[A-Z0-9]*"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={(e) => handlePaste(e)}
                            onFocus={() => setActiveInput(index)}
                            className="w-12 h-12 border border-gray-300 rounded-xl text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            maxLength={1}
                            disabled={(isLoading && otp.some(d => d != '')) || success}
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
                    disabled={(isLoading && otp.some(d => d === '')) || success}
                    className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {(isLoading && otp.some(d => d != '')) ? 'Verifying...' : success ? 'Verified!' : 'Verify Code'}
                </button>
            </form>

            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-500 text-sm">Didn't receive code?</span>
                    <button
                        onClick={resendOTP}
                        disabled={isLoading || countdown > 0}
                        className="text-primary hover:text-primary/80 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                        type="button"
                    >
                        <RotateCcw size={14} className="mr-1" />
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
                    </button>
                </div>

                {purpose === 'login' && (
                    <button
                        onClick={() => setSelectedChannel(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 underline block mx-auto pt-1"
                        type="button"
                    >
                        Switch verification method
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default OTPVerification;