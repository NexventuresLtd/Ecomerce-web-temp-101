import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    X,
    UserPlus,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    Image as ImageIcon,
    Upload
} from 'lucide-react';
import type { SignupFormData, ValidationErrors } from '../../types/auth/auth';
import GoogleLoginButton from '../SharedComp/auth/GoogleLoginButton';

interface RegisterProps {
    errors: ValidationErrors;
    handleSignup: ({ }) => void;
    setShowSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    signupData: SignupFormData;
    setSignupData: React.Dispatch<React.SetStateAction<SignupFormData>>;
    successMessage: string | null;
}

const RegisterForm: React.FC<RegisterProps> = ({
    errors,
    successMessage,
    setSignupData,
    signupData,
    handleSignup,
    setShowSignupModal,
    isLoading
}) => {
    const [step, setStep] = useState(1);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profilePicError, setProfilePicError] = useState<string | null>(null);

    const nextStep = () => {
        // Validate current step before proceeding
        if (step === 1) {
            if (!signupData.fname || !signupData.lname) {
                return;
            }
        } else if (step === 2) {
            if (!signupData.email) {
                return;
            }
        } else if (step === 3) {
            if (!signupData.password || !signupData.confirmPassword || signupData.password !== signupData.confirmPassword) {
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setProfilePicError('Image size must be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewImage(base64String);
                setSignupData({ ...signupData, profile_pic: base64String });
                setProfilePicError(null);
            };
            reader.readAsDataURL(file); // converts blob to base64 string
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setPreviewImage(null);
        setSignupData({ ...signupData, profile_pic: undefined });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setProfilePicError('Profile picture is required');
    };

    const handleSubmit = () => {
        // Final validation before submission
        if (!signupData.profile_pic) {
            setProfilePicError('Profile picture is required');
            return;
        }

        const formData = new FormData();
        formData.append('fname', signupData.fname);
        formData.append('lname', signupData.lname);
        formData.append('email', signupData.email);
        if (signupData.phone) { formData.append('phone', signupData.phone) };
        formData.append('password', signupData?.password);
        formData.append('confirmPassword', signupData.confirmPassword);

        if (signupData.profile_pic) {
            // Convert Base64 string back to Blob
            const byteString = atob(signupData.profile_pic.split(',')[1]);
            const mimeString = signupData.profile_pic.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            formData.append('profile_pic', blob, 'profile_pic.png');
        }

        handleSignup({ "type": "LOCAL", provider: null });
    };
    const handelGoogleLogin = (msg?: string, userInfo?: any) => {
        handleSignup({ "type": "GOOGLE", "provider": userInfo?.sub, "data": userInfo, "msg": msg })
    }
    const steps = [
        {
            title: "Full Names",
            fields: (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="text"
                            value={signupData.fname}
                            onChange={(e) => setSignupData({ ...signupData, fname: e.target.value })}
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="Enter your first name"
                            required
                        />
                        {errors.fname && (
                            <p className="text-red-500 text-sm mt-1">{errors.fname}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="text"
                            value={signupData.lname}
                            onChange={(e) => setSignupData({ ...signupData, lname: e.target.value })}
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="Enter your last name"
                            required
                        />
                        {errors.lname && (
                            <p className="text-red-500 text-sm mt-1">{errors.lname}</p>
                        )}
                    </div>
                </>
            )
        },
        {
            title: 'Contact',
            fields: (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="Enter your email"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number (Optional)
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="tel"
                            value={signupData.phone || ''}
                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="+1234567890"
                        />
                    </div>
                </>),
        },
        {
            title: "Security",
            fields: (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="Create a password (min 6 characters)"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="Confirm your password"
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>
                </>
            )
        },
        {
            title: "Profile Picture",
            fields: (
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            {previewImage && (
                                <button
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                            required
                        />

                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={triggerFileInput}
                            className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg flex items-center space-x-2"
                        >
                            <Upload className="w-4 h-4" />
                            <span>{previewImage ? 'Change Image' : 'Upload Image'}</span>
                        </motion.button>

                        <p className="text-xs text-gray-500 mt-2">Required: JPG, PNG up to 2MB</p>
                        {profilePicError && (
                            <p className="text-red-500 text-sm mt-2 text-center">{profilePicError}</p>
                        )}
                    </div>
                </div>
            )
        }
    ];

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
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                    </div>
                    <button
                        onClick={() => setShowSignupModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10"></div>
                    <div
                        className="absolute top-15 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-300"
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                    {[1, 2, 3, 4].map((stepNumber) => (
                        <div key={stepNumber} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {stepNumber}
                            </div>
                            <span className="text-xs mt-1 text-gray-600">{steps[stepNumber - 1].title}</span>
                        </div>
                    ))}
                </div>

                {/* Success Message */}
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg flex items-start space-x-2"
                    >
                        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>{successMessage}</span>
                    </motion.div>
                )}

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

                {/* Form Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="space-y-4"
                    >
                        {steps[step - 1].fields}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    {step > 1 ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={prevStep}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Back</span>
                        </motion.button>
                    ) : (
                        <div></div> // Empty div to maintain space
                    )}

                    {step < 4 ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={nextStep}
                            disabled={
                                (step === 1 && (!signupData.fname || !signupData.lname)) ||
                                (step === 2 && !signupData.email) ||
                                (step === 3 && (!signupData.password || !signupData.confirmPassword || signupData.password !== signupData.confirmPassword))
                            }
                            className="px-6 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
                        >
                            Next
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={isLoading || !!successMessage || !signupData.profile_pic}
                            className="px-6 py-3 bg-primary text-white rounded-lg disabled:opacity-50 flex items-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : successMessage ? (
                                "Account Created!"
                            ) : (
                                "Create Account"
                            )}
                        </motion.button>
                    )}
                </div>

                {/* Already have an account */}
                <div className="text-center pt-4">
                    <p className="text-gray-600 mb-4">
                        Already have an account?{' '}
                        <button
                            onClick={() => setShowSignupModal(false)}
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            Sign in
                        </button>
                    </p>
                    <GoogleLoginButton title="Sign Up With" handelGoogleLogin={handelGoogleLogin} />
                </div>
            </motion.div>
    );
};

export default RegisterForm;