import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    CheckCircle,
    CreditCard,
    MapPin,
    ChevronRight,
    ChevronLeft,
    LogIn,
    Trash2,
    Edit,
    LogOut,
    Eye,
    X
} from 'lucide-react';
import Footer from '../components/SharedComp/footer';
import Navbar from '../components/SharedComp/navabaritems/NavBar';
import { billingService, type BillingRecord, type BillingData } from '../app/userProfile/billingService';
import { getUserInfo } from '../app/Localstorage';
import { logout } from '../app/utils/HandelLogout';

interface BillingFormData {
    fullName: string;
    billingType: 'card' | 'phone' | 'paypal' | 'bank_transfer' | 'Other';
    cardNumber: string;
    phoneNumber: string;
    accountNumber: string;
    paypalEmail: string;
    expiryDate: string;
    cvv: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
}


const UserDashboard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [billingData, setBillingData] = useState<BillingFormData>({
        fullName: '',
        billingType: 'card',
        cardNumber: '',
        phoneNumber: '',
        accountNumber: '',
        paypalEmail: '',
        expiryDate: '',
        cvv: '',
        address: '',
        city: '',
        zipCode: '',
        country: ''
    });
    const [errors, setErrors] = useState<Partial<BillingFormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userBillings, setUserBillings] = useState<BillingRecord[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string>('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Check if user is logged in and load billings
    useEffect(() => {
        const userInfo = getUserInfo;
        if (!userInfo?.email) {
            setIsLoggedIn(false);
            return;
        }
        loadUserBillings();
    }, []);

    const loadUserBillings = async () => {
        try {
            setLoading(true);
            const response = await billingService.getMyBillings();
            setUserBillings(response.billings || []);
        } catch (error) {
            console.error('Error loading billings:', error);
            setApiError('Failed to load billing information');
        } finally {
            setLoading(false);
        }
    };

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Logout function
    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        setShowLogoutModal(false);
        window.location.href = '/authentication';
    };

    // View billing details
    const handleViewDetails = (billing: BillingRecord) => {
        setSelectedBilling(billing);
        setShowDetailsModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowDetailsModal(false);
        setSelectedBilling(null);
        setShowLogoutModal(false);
    };

    // Validation functions
    const validateStep1 = () => {
        const newErrors: Partial<BillingFormData> = {};

        if (!billingData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (billingData.fullName.length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Validation based on billing type
        switch (billingData.billingType) {
            case 'card':
                if (!billingData.cardNumber.trim()) {
                    newErrors.cardNumber = 'Card number is required';
                } else if (!/^\d{16}$/.test(billingData.cardNumber.replace(/\s/g, ''))) {
                    newErrors.cardNumber = 'Please enter a valid 16-digit card number';
                }

                if (!billingData.expiryDate.trim()) {
                    newErrors.expiryDate = 'Expiry date is required';
                } else if (!/^\d{2}\/\d{2}$/.test(billingData.expiryDate)) {
                    newErrors.expiryDate = 'Please enter date in MM/YY format';
                }

                if (!billingData.cvv.trim()) {
                    newErrors.cvv = 'CVV is required';
                } else if (!/^\d{3,4}$/.test(billingData.cvv)) {
                    newErrors.cvv = 'CVV must be 3 or 4 digits';
                }
                break;

            case 'phone':
                if (!billingData.phoneNumber.trim()) {
                    newErrors.phoneNumber = 'Phone number is required';
                } else if (!/^\+?[\d\s-()]{10,}$/.test(billingData.phoneNumber)) {
                    newErrors.phoneNumber = 'Please enter a valid phone number';
                }
                break;

            case 'bank_transfer':
                if (!billingData.accountNumber.trim()) {
                    newErrors.accountNumber = 'Account number is required';
                } else if (!/^\d{8,20}$/.test(billingData.accountNumber.replace(/\s/g, ''))) {
                    newErrors.accountNumber = 'Please enter a valid account number (8-20 digits)';
                }
                break;

            case 'paypal':
                if (!billingData.paypalEmail.trim()) {
                    newErrors.paypalEmail = 'PayPal email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.paypalEmail)) {
                    newErrors.paypalEmail = 'Please enter a valid email address';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Partial<BillingFormData> = {};

        if (!billingData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!billingData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!billingData.zipCode.trim()) {
            newErrors.zipCode = 'ZIP code is required';
        }

        if (!billingData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handlePrevStep = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
            setErrors({});
        }
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;

        setIsSubmitting(true);
        setApiError('');

        try {
            const billingPayload: BillingData = {
                full_name: billingData.fullName,
                billing_type: billingData.billingType,
                address: billingData.address,
                city: billingData.city,
                zip_code: billingData.zipCode,
                country: billingData.country
            };

            // Map all number fields to card_number for backend
            switch (billingData.billingType) {
                case 'card':
                    billingPayload.card_number = billingData.cardNumber.replace(/\s/g, '');
                    billingPayload.expiry_date = billingData.expiryDate;
                    billingPayload.cvv = billingData.cvv;
                    break;
                case 'phone':
                    billingPayload.card_number = billingData.phoneNumber.replace(/\D/g, '');
                    break;
                case 'bank_transfer':
                    billingPayload.card_number = billingData.accountNumber.replace(/\s/g, '');
                    break;
                case 'paypal':
                    billingPayload.card_number = billingData.paypalEmail;
                    break;
                case 'Other':
                    billingPayload.card_number = 'other';
                    break;
            }

            if (isEditing) {
                await billingService.updateBilling(isEditing, billingPayload);
                alert('Billing information updated successfully!');
            } else {
                await billingService.addBilling(billingPayload);
                alert('Billing method added successfully!');
            }

            // Reset form and reload billings
            setBillingData({
                fullName: '',
                billingType: 'card',
                cardNumber: '',
                phoneNumber: '',
                accountNumber: '',
                paypalEmail: '',
                expiryDate: '',
                cvv: '',
                address: '',
                city: '',
                zipCode: '',
                country: ''
            });
            setCurrentStep(1);
            setIsEditing(null);
            loadUserBillings();
        } catch (error: any) {
            console.error('Error saving billing:', error);
            setApiError(error.response?.data?.detail || 'Failed to save billing information');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditBilling = (billing: BillingRecord) => {
        // When editing, populate the appropriate field based on billing type
        const formData: BillingFormData = {
            fullName: billing.full_name,
            billingType: billing.billing_type,
            cardNumber: '',
            phoneNumber: '',
            accountNumber: '',
            paypalEmail: '',
            expiryDate: billing.expiry_date || '',
            cvv: billing.cvv || '',
            address: billing.address || '',
            city: billing.city || '',
            zipCode: billing.zip_code || '',
            country: billing.country || ''
        };

        // Populate the correct field based on billing type
        switch (billing.billing_type) {
            case 'card':
                formData.cardNumber = billing.card_number || '';
                break;
            case 'phone':
                formData.phoneNumber = billing.card_number || '';
                break;
            case 'bank_transfer':
                formData.accountNumber = billing.card_number || '';
                break;
            case 'paypal':
                formData.paypalEmail = billing.card_number || '';
                break;
        }

        setBillingData(formData);
        setIsEditing(billing.id);
        setCurrentStep(1);
    };

    const handleDeleteBilling = async (billingId: number) => {
        if (!confirm('Are you sure you want to delete this billing method?')) {
            return;
        }

        try {
            await billingService.deleteBilling(billingId);
            alert('Billing method deleted successfully!');
            loadUserBillings();
        } catch (error: any) {
            console.error('Error deleting billing:', error);
            setApiError(error.response?.data?.detail || 'Failed to delete billing method');
        }
    };

    const handleInputChange = (field: keyof BillingFormData, value: string) => {
        setBillingData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleBillingTypeChange = (type: BillingFormData['billingType']) => {
        setBillingData(prev => ({ 
            ...prev, 
            billingType: type,
            // Clear all payment-specific fields when changing type
            cardNumber: '',
            phoneNumber: '',
            accountNumber: '',
            paypalEmail: '',
            expiryDate: '',
            cvv: ''
        }));
        // Clear all errors when changing billing type
        setErrors({});
    };

    // Format card number input
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : v;
    };

    // Format phone number input
    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    };

    // Format account number input (add spaces for readability)
    const formatAccountNumber = (value: string) => {
        const numbers = value.replace(/\s/g, '').replace(/\D/g, '');
        if (numbers.length <= 4) return numbers;
        if (numbers.length <= 8) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
        return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)}`;
    };

    // Render appropriate input field based on billing type
    const renderPaymentField = () => {
        switch (billingData.billingType) {
            case 'card':
                return (
                    <>
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={billingData.cardNumber}
                                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                    className={`w-full bg-white text-gray-800 p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cardNumber ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                />
                            </div>
                            {errors.cardNumber && <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-2">Expiry Date</label>
                                <input
                                    type="text"
                                    value={billingData.expiryDate}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length >= 2) {
                                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                        }
                                        handleInputChange('expiryDate', value);
                                    }}
                                    className={`w-full bg-white text-gray-800 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expiryDate ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                                {errors.expiryDate && <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-2">CVV</label>
                                <input
                                    type="text"
                                    value={billingData.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                    className={`w-full bg-white text-gray-800 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cvv ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="123"
                                    maxLength={4}
                                />
                                {errors.cvv && <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>}
                            </div>
                        </div>
                    </>
                );

            case 'phone':
                return (
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={billingData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', formatPhoneNumber(e.target.value))}
                                className={`w-full bg-white text-gray-800 p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phoneNumber ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="(123) 456-7890"
                                maxLength={14}
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>
                );

            case 'bank_transfer':
                return (
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Account Number</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={billingData.accountNumber}
                                onChange={(e) => handleInputChange('accountNumber', formatAccountNumber(e.target.value))}
                                className={`w-full bg-white text-gray-800 p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.accountNumber ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="1234 5678 9012"
                                maxLength={14}
                            />
                        </div>
                        {errors.accountNumber && <p className="text-red-600 text-sm mt-1">{errors.accountNumber}</p>}
                    </div>
                );

            case 'paypal':
                return (
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">PayPal Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={billingData.paypalEmail}
                                onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                                className={`w-full bg-white text-gray-800 p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.paypalEmail ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="your.email@example.com"
                            />
                        </div>
                        {errors.paypalEmail && <p className="text-red-600 text-sm mt-1">{errors.paypalEmail}</p>}
                    </div>
                );

            case 'Other':
                return (
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">
                            For other payment methods, please contact our support team for assistance.
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    // Display appropriate identifier in saved billing methods
    const renderBillingIdentifier = (billing: BillingRecord) => {
        switch (billing.billing_type) {
            case 'card':
                return billing.card_number ? (
                    <p className="text-xs text-gray-500">**** {billing.card_number.slice(-4)}</p>
                ) : null;
            case 'phone':
                return billing.card_number ? (
                    <p className="text-xs text-gray-500">{billing.card_number}</p>
                ) : null;
            case 'bank_transfer':
                return billing.card_number ? (
                    <p className="text-xs text-gray-500">***{billing.card_number.slice(-4)}</p>
                ) : null;
            case 'paypal':
                return billing.card_number ? (
                    <p className="text-xs text-gray-500">{billing.card_number}</p>
                ) : null;
            default:
                return null;
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg text-center max-w-lg w-full">
                    <LogIn className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
                    <button
                        onClick={() => window.location.href = '/authentication'}
                        className="w-full bg-primary hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-11/12 mx-auto">
                    {/* Header Section */}
                    <div className="bg-white p-6 rounded-lg mb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                {getUserInfo.profile_pic ? (
                                    <img
                                        src={getUserInfo.profile_pic}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                                            {getUserInfo.fname} {getUserInfo.lname}
                                        </h1>
                                        <p className="text-gray-600 capitalize mb-2">{getUserInfo.role}</p>
                                        <p className="text-gray-700">{getUserInfo.email}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowLogoutModal(true)}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Account Information */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="text-gray-800">{getUserInfo.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="text-gray-800">{getUserInfo.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">Member Since</p>
                                            <p className="text-gray-800">{formatDate(getUserInfo.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Saved Billing Methods */}
                            <div className="bg-white p-6 rounded-lg mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved Billing Methods</h2>
                                {loading ? (
                                    <div className="text-center py-4">Loading...</div>
                                ) : userBillings.length === 0 ? (
                                    <p className="text-gray-600 text-center py-4">No billing methods saved</p>
                                ) : (
                                    <div className="space-y-3">
                                        {userBillings.map((billing) => (
                                            <div key={billing.id} className="bg-gray-50 p-3 rounded">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{billing.full_name}</p>
                                                        <p className="text-sm text-gray-600 capitalize">{billing.billing_type}</p>
                                                        {renderBillingIdentifier(billing)}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewDetails(billing)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditBilling(billing)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBilling(billing.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {billing.city}, {billing.country}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Billing Information Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 rounded-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {isEditing ? 'Edit Billing Method' : 'Add Billing Method'}
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-gray-800' : 'bg-gray-300'}`}></span>
                                        <span>Payment</span>
                                        <span className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-gray-800' : 'bg-gray-300'}`}></span>
                                        <span>Address</span>
                                    </div>
                                </div>

                                {apiError && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                        {apiError}
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-2">Billing Type</label>
                                            <select
                                                value={billingData.billingType}
                                                onChange={(e) => handleBillingTypeChange(e.target.value as BillingFormData['billingType'])}
                                                className="w-full bg-white text-gray-800 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="card">Credit Card</option>
                                                <option value="phone">Phone</option>
                                                <option value="paypal">PayPal</option>
                                                <option value="bank_transfer">Bank Transfer</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={billingData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                className={`w-full bg-white text-gray-800 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="Enter your full name"
                                            />
                                            {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                                        </div>

                                        {renderPaymentField()}

                                        <button
                                            onClick={handleNextStep}
                                            className="w-full bg-primary hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                                        >
                                            Next Step
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-2">Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={billingData.address}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                    className={`w-full bg-white text-gray-800 p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="123 Main Street"
                                                />
                                            </div>
                                            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    value={billingData.city}
                                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                                    className={`w-full bg-white text-gray-800 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="New York"
                                                />
                                                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-700 mb-2">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    value={billingData.zipCode}
                                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                                    className={`w-full bg-white text-gray-800 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.zipCode ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="12345"
                                                />
                                                {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-700 mb-2">Country</label>
                                            <select
                                                value={billingData.country}
                                                onChange={(e) => handleInputChange('country', e.target.value)}
                                                className={`w-full bg-white text-gray-800 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.country ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                                                    }`}
                                            >
                                                <option value="">Select Country</option>
                                                <option value="Rwanda">Rwanda</option>
                                                <option value="United States">United States</option>
                                                <option value="Canada">Canada</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Australia">Australia</option>
                                            </select>
                                            {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={handlePrevStep}
                                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                                Previous
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="flex-1 bg-primary hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        {isEditing ? 'Updating...' : 'Saving...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-5 h-5" />
                                                        {isEditing ? 'Update Billing' : 'Save Billing Method'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full">
                                <LogOut className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Confirm Logout</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to logout? You'll need to sign in again to access your account.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Billing Details Modal */}
            {showDetailsModal && selectedBilling && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 ">
                            <h3 className="text-lg font-semibold text-gray-800">Billing Details</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Full Name</h4>
                                <p className="text-gray-800">{selectedBilling.full_name}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Billing Type</h4>
                                <p className="text-gray-800 capitalize">{selectedBilling.billing_type}</p>
                            </div>
                            
                            {selectedBilling.billing_type === 'card' && (
                                <>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Card Number</h4>
                                        <p className="text-gray-800">
                                            **** {selectedBilling.card_number?.slice(-4) || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Expiry Date</h4>
                                            <p className="text-gray-800">{selectedBilling.expiry_date || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">CVV</h4>
                                            <p className="text-gray-800">{selectedBilling.cvv ? '***' : 'N/A'}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {selectedBilling.billing_type === 'phone' && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Phone Number</h4>
                                    <p className="text-gray-800">{selectedBilling.card_number || 'N/A'}</p>
                                </div>
                            )}
                            
                            {selectedBilling.billing_type === 'bank_transfer' && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Account Number</h4>
                                    <p className="text-gray-800">
                                        ***{selectedBilling.card_number?.slice(-4) || 'N/A'}
                                    </p>
                                </div>
                            )}
                            
                            {selectedBilling.billing_type === 'paypal' && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">PayPal Email</h4>
                                    <p className="text-gray-800">{selectedBilling.card_number || 'N/A'}</p>
                                </div>
                            )}
                            
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Address</h4>
                                <p className="text-gray-800">{selectedBilling.address || 'N/A'}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">City</h4>
                                    <p className="text-gray-800">{selectedBilling.city || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">ZIP Code</h4>
                                    <p className="text-gray-800">{selectedBilling.zip_code || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Country</h4>
                                <p className="text-gray-800">{selectedBilling.country || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Created Date</h4>
                                <p className="text-gray-800">{selectedBilling.created_at}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t">
                            <button
                                onClick={() => {
                                    handleEditBilling(selectedBilling);
                                    closeModal();
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                            >
                                Edit
                            </button>
                            <button
                                onClick={closeModal}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserDashboard;