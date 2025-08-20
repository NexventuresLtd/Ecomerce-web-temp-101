import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, X, ArrowLeft, Loader } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface PasswordResetProps {
    onBack?: () => void;
    onSuccess?: () => void;
    setShowSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

const PasswordReset: React.FC<PasswordResetProps> = ({
    onBack,
    setShowSignupModal,
    onSuccess,

}) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic email validation
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            // Using URLSearchParams to format data as x-www-form-urlencoded
            const formData = new URLSearchParams();
            formData.append('email', email);

            const response = await mainAxios.post('/auth/request-password-reset', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.status === 200) {
                setSuccess(true);
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 3000);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to send reset instructions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, zoom: 0.7 }}
            animate={{ opacity: 1, zoom: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSignupModal(false)}
        >
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
                        <Mail className="text-primary" size={24} />
                    </div>
                </div>

                {!success ? (
                    <>
                        <p className="text-gray-600 text-center mb-6">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader size={18} className="animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Instructions'
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex flex-col items-center">
                            <div className="bg-green-100 p-2 rounded-full mb-3">
                                <Check size={24} className="text-green-600" />
                            </div>
                            <h3 className="font-medium text-lg mb-1">Instructions Sent</h3>
                            <p className="text-sm">
                                We've sent password reset instructions to <span className="font-semibold">{email}</span>.
                                Please check your inbox.
                            </p>
                        </div>

                        <p className="text-gray-600 text-sm">
                            Didn't receive the email? Check your spam folder or{' '}
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-primary hover:text-primary/80 font-medium"
                            >
                                try again
                            </button>
                            .
                        </p>
                    </motion.div>
                )}

            </motion.div>
        </motion.div>
    );
};

export default PasswordReset;