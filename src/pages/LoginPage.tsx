import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import mainAxios from '../Instance/mainAxios';
import type { FormData, SignupFormData, ValidationErrors } from '../types/auth/auth';
import { clothVariant, handVariant } from '../constants/auth/authVariants';
import Loginform from '../components/Login/Loginform';
import RegisterForm from '../components/Register/RegisterForm';
import { handleApiError } from '../app/utils/HandelHttpError';
import { validateForm, validateSignupForm } from '../app/utils/AuthValidation';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import OTPVerification from '../components/SharedComp/auth/OTPCleint';
import PasswordReset from '../components/SharedComp/auth/Password';



const AnimatedLoginPage: React.FC = () => {
    const [isClothPulled, setIsClothPulled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false)
    const [NewUSer, setNewUser] = useState()
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [Passwordreset, setPasswordreset] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [signupData, setSignupData] = useState<SignupFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        fname: '',
        lname: '',
        phone: '',
        profile_pic: ''
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [emoji, setEmoji] = useState(String)
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | null;
        message: string | null;
    }>({ type: null, message: null });

    // Start cloth animation after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClothPulled(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);


    // Show notification and auto-hide after 5 seconds
    useEffect(() => {
        if (notification.message) {
            const timer1 = setTimeout(() => {
                setNotification({ type: null, message: null });
                setErrors({});
            }, 3000);
            return () => { clearTimeout(timer1); };
        }
    }, [notification]);


    const EnableOtp = (newUser: any) => {
        // Save tokens
        localStorage.setItem("authToken", newUser.access_token);
        localStorage.setItem("refresh", newUser.refresh_token);
        // Save user info
        localStorage.setItem("userInfo", JSON.stringify(newUser.decrypted_data.UserInfo));
    }

    // Handle form submission
    const handleLogin = async () => {
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            setErrors({});

            try {
                let response = await mainAxios.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                // Handle successful login (store token, redirect, etc.)
                setNotification({
                    type: 'success',
                    message: 'Login successful! Redirecting...'
                });
                setEmoji("success")

                // Here you would typically:
                // 1. Store the authentication token
                // 2. Redirect to dashboard or protected route
                const newUser = response?.data;

                setNewUser(newUser)
                if (newUser?.decrypted_data?.UserInfo?.two_factor) {
                    setShowOTP(true)
                } else {
                    // Save tokens
                    localStorage.setItem("authToken", newUser.access_token);
                    localStorage.setItem("refresh", newUser.refresh_token);
                    // Save user info
                    localStorage.setItem("userInfo", JSON.stringify(newUser.decrypted_data.UserInfo));
                    window.location.href = "/"
                }


            } catch (error) {
                const errorMessage = handleApiError(error);
                setErrors({ general: errorMessage });
                setEmoji("error")
                setNotification({
                    type: 'error',
                    message: errorMessage
                });
            } finally {
                setIsLoading(false);
            }
        }
    };
    // Handle form submission
    const handleGoogleLogin = async (registerType: any) => {
        try {
            let response = await mainAxios.post(`/auth/signIn-social-token?Email=${registerType.email}`, {});

            console.log("hello")
            // Handle successful login (store token, redirect, etc.)
            setNotification({
                type: 'success',
                message: 'Login successful! Redirecting...'
            });
            setEmoji("success")

            // Here you would typically:
            // 1. Store the authentication token
            // 2. Redirect to dashboard or protected route
            const newUser = response?.data;
            // Save tokens
            localStorage.setItem("authToken", newUser.access_token);
            localStorage.setItem("refresh", newUser.refresh_token);
            // Save user info
            localStorage.setItem("userInfo", JSON.stringify(newUser.decrypted_data.UserInfo));
            window.location.href = "/"

        } catch (error) {
            const errorMessage = handleApiError(error);
            setErrors({ general: errorMessage });
            setEmoji("error")
            setNotification({
                type: 'error',
                message: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (registerType: any) => {
        const validationErrors = validateSignupForm(signupData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            setErrors({});

            try {
                const { confirmPassword, ...payload } = signupData;
                console.log(signupData)
                let response
                if (registerType.type == "GOOGLE") {
                    response = await mainAxios.post(`/auth/signUp-social-auth?provider=${registerType.type}&provider_id=${registerType.provider}`, payload);
                } else {
                    response = await mainAxios.post('/auth/register', payload);
                }

                setSuccessMessage(response?.data?.message);
                setNotification({
                    type: 'success',
                    message: response?.data?.message
                });
                setEmoji("success")

                // Clear form and close modal after successful registration
                setTimeout(() => {
                    setShowSignupModal(false);
                    setSignupData({
                        email: '',
                        password: '',
                        confirmPassword: '',
                        fname: '',
                        lname: '',
                        phone: '',
                        profile_pic: ''
                    });
                    setSuccessMessage(null);
                }, 3000);

            } catch (error) {
                const errorMessage = handleApiError(error);
                setErrors({ general: errorMessage });
                setEmoji("error")
                setNotification({
                    type: 'error',
                    message: errorMessage
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    ///--------OTP setup


    const handleVerificationSuccess = () => {
        EnableOtp(NewUSer)
        console.log('OTP verification successful!');
        // Redirect user or perform next steps
        window.location.href = "/"
    };

    const handleBack = () => {
        setShowOTP(false);
        setShowSignupModal(false)
        // Navigate back to email input
    };
    //------------------forgot password succes
    const handleSuccess = () => {
        console.log('Password reset instructions sent successfully');
        // Optionally navigate away or show additional UI
        setNotification({
            type: 'success',
            message: 'Password reset instructions sent successfully'
        });
    };
    return (
        <div className="min-h-screen bg-primary relative overflow-hidden">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification.message && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between p-4 rounded-xl shadow-lg max-w-md w-full ${notification.type === 'error'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            {notification.type === 'error' ? (
                                <AlertCircle className="w-6 h-6" />
                            ) : (
                                <CheckCircle2 className="w-6 h-6" />
                            )}
                            <span>{notification.message}</span>
                        </div>
                        <button
                            onClick={() => setNotification({ type: null, message: null })}
                            className="ml-4 text-current hover:opacity-70"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated Cloth */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-gray z-20 flex justify-center p-30 md:rounded-b-full"
                variants={clothVariant}
                initial="initial"
                animate={isClothPulled ? "animate" : "initial"}
                transition={{ duration: 2.0, ease: "easeInOut" }}
            >
                <img src="https://media3.giphy.com/media/gk3qooQQqkSvSQLsOt/giphy.gif" className='max-w-3xl object-contain p-36 m-auto' />
            </motion.div>

            {/* Cartoon Hand */}
            <motion.div
                className="absolute top-10 left-1/2 transform -translate-x-1/2 z-30 text-6xl "
                variants={handVariant}
                initial="initial"
                animate={isClothPulled ? "animate" : "initial"}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            >
                <div className="animate-bounce">
                    {emoji === "error" ? <>😭</> : emoji === "success" ? <> 🤗 </> : <>👋</>}
                </div>
            </motion.div>

            {/* Main Content */}
            <div
                className="relative z-10 min-h-screen flex items-center justify-center px-4">
                {showOTP && formData.email ?
                    <OTPVerification
                        email={formData.email}
                        purpose="login"
                        onVerificationSuccess={handleVerificationSuccess}
                        onBack={handleBack}
                    />
                    :
                    <Loginform
                        handleLogin={handleLogin}
                        handleGoogleLogin={handleGoogleLogin}
                        setShowSignupModal={setShowSignupModal}
                        setPasswordreset={setPasswordreset}
                        isClothPulled={isClothPulled}
                        isLoading={isLoading}
                        errors={errors}
                        formData={formData}
                        setErrors={setErrors}
                        setSignupData={setSignupData}
                        setFormData={setFormData} />
                }

            </div>

            {/* Signup Modal */}
            <AnimatePresence>
                {showSignupModal && !Passwordreset && (
                    <RegisterForm
                        setShowSignupModal={setShowSignupModal}
                        isLoading={isLoading}
                        errors={errors}
                        handleSignup={handleSignup}
                        signupData={signupData}
                        successMessage={successMessage}
                        setSignupData={setSignupData}
                    />
                )}
                {showSignupModal && Passwordreset && (
                    <PasswordReset
                        setShowSignupModal={setShowSignupModal}
                        onBack={handleBack}
                        onSuccess={handleSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedLoginPage;