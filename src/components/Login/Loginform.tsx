import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    User,
    AlertCircle,
} from 'lucide-react';
import { formVariant } from '../../constants/auth/authVariants';
import type { FormData, SignupFormData, ValidationErrors } from '../../types/auth/auth';
import GoogleLoginButton from '../SharedComp/auth/GoogleLoginButton';
import { InteractivePatternCaptcha, SmartLogicCaptcha } from '../SharedComp/auth/rechaprtch';


interface LoginProps {
    isClothPulled: boolean;
    setPasswordreset: React.Dispatch<React.SetStateAction<boolean>>;
    errors: ValidationErrors;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    handleLogin: () => void;
    handleGoogleLogin: ({ }) => void;
    setShowSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
    setSignupData: React.Dispatch<React.SetStateAction<SignupFormData>>;
    isLoading: boolean;
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
    isVerified: boolean;
}
const Loginform = ({ isClothPulled, setPasswordreset, errors, isVerified, setIsVerified, formData, setFormData, handleLogin, handleGoogleLogin, setShowSignupModal, isLoading }: LoginProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const [whichMethod, setwhichMethod] = useState("smart");

    const handelGoogleLogin = (msg?: string, userInfo?: any) => {
        handleGoogleLogin({ "type": "GOOGLE", "provider": null, "email": userInfo?.email, "msg": msg })
    }
    //------Handel rechatp
    const handleVerify = (success: boolean) => {
        setIsVerified(success);
        console.log('Verification result:', success);
    };


    return (
        <>
            <motion.div
                className="w-full max-w-lg"
                variants={formVariant}
                initial="hidden"
                animate={isClothPulled ? "visible" : "hidden"}
            >
                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    {!isVerified ?
                        <>
                            <div className="w-full max-w-md mx-auto">
                                <h2 className="text-xl justify-center font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    🤖 Show That You’re Not a Robot
                                </h2>

                                <div className="bg-blue-50 rounded-xl p-4 flex gap-4 justify-center mb-4">
                                    <button
                                        onClick={() => setwhichMethod("smart")}
                                        className="bg-white px-4 py-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                                    >
                                        Smart
                                    </button>
                                    <button
                                        onClick={() => setwhichMethod("pattern")}
                                        className="bg-white px-4 py-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                                    >
                                        Pattern
                                    </button>
                                </div>
                            </div>

                            {whichMethod == "smart" ?
                                <SmartLogicCaptcha
                                    onVerify={handleVerify}
                                    theme={"light"}
                                />
                                :
                                <InteractivePatternCaptcha
                                    onVerify={handleVerify}
                                    theme="light"
                                    className=""
                                />
                            }
                        </> :
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                                    className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <User className="w-8 h-8 text-white" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                                <p className="text-gray-600">Sign in to your account</p>
                            </div>

                            {/* General Error */}
                            {errors.general && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start space-x-2"
                                >
                                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <span>{errors.general}</span>
                                </motion.div>
                            )}
                            {/* Login Form */}
                            <div className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <motion.input
                                            whileFocus={{ scale: 1.02 }}
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl outline-none focus:ring-3 focus:ring-slate-200 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm mt-1"
                                        >
                                            {errors.email}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <motion.input
                                            whileFocus={{ scale: 1.02 }}
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl outline-none focus:ring-3 focus:ring-slate-200 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm mt-1"
                                        >
                                            {errors.password}
                                        </motion.p>
                                    )}

                                    {/* Forgot Password */}
                                    <div className="flex justify-between mt-3">
                                        {/* Create Account Link */}
                                        <button
                                            onClick={() => { setShowSignupModal(true); setPasswordreset(false) }}
                                            className="text-slate-800 hover:text-slate-800/80 font-medium text-sm transition-colors"
                                        >
                                            Create new account
                                        </button>

                                        <button
                                            onClick={() => {
                                                setPasswordreset(true);
                                                setShowSignupModal(true)
                                            }}

                                            type="button"
                                            className="text-slate-800 cursor-pointer hover:text-slate-800/80 text-sm font-medium transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                </div>
                                {/* Login Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Sign In"
                                    )}
                                </motion.button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>

                                {/* Google Sign In */}
                                <GoogleLoginButton title="Sign In With" handelGoogleLogin={handelGoogleLogin} />


                            </div>
                        </>
                    }
                </div>
            </motion.div>

        </>
    )
}

export default Loginform
