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
    X,
    ShoppingBag,
    Package,
    ChevronDown,
    ChevronUp,
    LayoutDashboard,
    Heart,
    Menu,
    Camera,
    ArrowBigLeft,
} from 'lucide-react';
import { billingService, type BillingRecord, type BillingData } from '../app/userProfile/billingService';
import { paymentService, type Order } from '../app/products/paymentService';
import { FileText } from 'lucide-react';
import { getUserInfo, token } from '../app/Localstorage';
import { logout } from '../app/utils/HandelLogout';
import mainAxios from '../Instance/mainAxios';
import UserNotificationBell from '../components/SharedComp/auth/UserNotificationBell';
import { useUserNotifications } from '../hooks/useUserNotifications';
import { resolveImageUrl } from '../app/utils/resolveImageUrl';

const RWF = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 });

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


type ProfileTab = 'overview' | 'billing' | 'orders' | 'profile';
type OrderStatusFilter = 'all' | 'done' | 'pending' | 'failed';

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { cls: string; label: string }> = {
        SUCCESSFUL: { cls: 'bg-green-50 text-green-700 border-green-200', label: 'Paid' },
        FAILED: { cls: 'bg-red-50 text-red-600 border-red-200', label: 'Failed' },
        PENDING: { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Pending' },
    };
    const c = map[status] ?? map.PENDING;
    return (
        <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${c.cls}`}>
            {c.label}
        </span>
    );
};

const FulfillmentBadge = ({ type, dStatus }: { type?: string; dStatus?: string }) => {
    // delivery_status: PENDING_DELIVERY | DELIVERED | PICKED_UP
    if (!type) return null;
    if (type === 'delivery') {
        const done = dStatus === 'DELIVERED';
        return (
            <div className="flex flex-col gap-0.5">
                <span className="text-xs text-blue-700 font-medium">Home Delivery</span>
                <span className={`text-xs font-semibold ${done ? 'text-green-600' : 'text-yellow-600'}`}>
                    {done ? 'Delivered' : 'Awaiting delivery'}
                </span>
            </div>
        );
    }
    const done = dStatus === 'PICKED_UP';
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-purple-700 font-medium">Office Pickup</span>
            <span className={`text-xs font-semibold ${done ? 'text-green-600' : 'text-yellow-600'}`}>
                {done ? 'Picked up' : 'Ready for pickup'}
            </span>
        </div>
    );
};

const OrderRow = ({ order }: { order: Order }) => {
    const [expanded, setExpanded] = useState(false);
    const primaryImg = (item: any) =>
        (item.images || []).find((i: any) => i.is_primary)?.url || item.images?.[0]?.url || null;

    return (
        <>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {/* Invoice / Date */}
                <td className="px-4 py-3 max-w-[140px]">
                    <div className="text-xs font-mono text-gray-800 truncate" title={order.invoice_number || order.external_id}>
                        {order.invoice_number || order.external_id}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </td>

                {/* Items count */}
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{order.items_count}</td>

                {/* Amount */}
                <td className="px-4 py-3 font-semibold text-gray-900 text-sm whitespace-nowrap">
                    {RWF.format(order.total_amount)}
                </td>

                {/* Fulfillment — type + status in one cell */}
                <td className="px-4 py-3">
                    <FulfillmentBadge type={order.delivery_type} dStatus={order.delivery_status} />
                </td>

                {/* Payment status */}
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>

                {/* Actions */}
                <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                        {order.invoice_number && (
                            <a href={paymentService.getInvoiceViewUrl(order.invoice_number)}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap">
                                <FileText className="w-3 h-3" />
                                View Invoice
                            </a>
                        )}
                        <button onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">
                            {expanded ? 'Hide' : 'Items'}
                            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                    </div>
                </td>
            </tr>

            {expanded && (
                <tr>
                    <td colSpan={6} className="bg-gray-50 border-b border-gray-100 px-4 py-3">
                        <div className="space-y-2">
                            {order.items?.map((item, i) => {
                                const img = primaryImg(item);
                                return (
                                    <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-2">
                                        {img
                                            ? <img src={`${import.meta.env.VITE_API_BASE_URL}${img}`} alt={item.product_name} className="w-10 h-10 object-cover rounded flex-shrink-0" />
                                            : <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0"><Package className="w-4 h-4 text-gray-400" /></div>
                                        }
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                                            <p className="text-xs text-gray-500">Qty {item.quantity} × {RWF.format(item.price)}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 flex-shrink-0">{RWF.format(item.item_total)}</span>
                                    </div>
                                );
                            })}
                            {order.delivery_type === 'delivery' && order.delivery_address && (
                                <p className="text-xs text-blue-700 bg-blue-50 rounded px-3 py-2">
                                    Delivery address: <strong>{order.delivery_address}</strong>
                                </p>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

// Unread-notification count pill for a sidebar entry.
const NavBadge = ({ count }: { count?: number }) => {
    if (!count) return null;
    return (
        <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
            {count > 99 ? '99+' : count}
        </span>
    );
};

const VALID_TABS: ProfileTab[] = ['overview', 'billing', 'orders', 'profile'];

const UserDashboard = () => {
    const initialSection = new URLSearchParams(window.location.search).get('section') as ProfileTab | null;
    const [activeTab, setActiveTab] = useState<ProfileTab>(
        initialSection && VALID_TABS.includes(initialSection) ? initialSection : 'overview'
    );
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    // Drives the per-section unread badges in the sidebar.
    const { unreadBySection } = useUserNotifications();
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
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersSummary, setOrdersSummary] = useState({ total_spent: 0, total_orders: 0, successful_orders: 0 });
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersPagination, setOrdersPagination] = useState({ page: 1, limit: 6, total_items: 0, total_pages: 0, has_prev: false, has_next: false });
    const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>('all');
    const [billingOriginalReference, setBillingOriginalReference] = useState('');

    // Edit-profile (name, phone + photo) state — lives inline in the Profile tab now.
    const [editFname, setEditFname] = useState(getUserInfo?.fname || '');
    const [editLname, setEditLname] = useState(getUserInfo?.lname || '');
    const [editPhone, setEditPhone] = useState(getUserInfo?.phone || '');
    const [editEmail, setEditEmail] = useState(getUserInfo?.email || '');
    const [editPhotoPreview, setEditPhotoPreview] = useState<string | undefined>(getUserInfo?.profile_pic || undefined);
    const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileEditError, setProfileEditError] = useState('');
    const [profileSaved, setProfileSaved] = useState(false);

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setEditPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setEditPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        if (!getUserInfo?.id) return;
        setSavingProfile(true);
        setProfileEditError('');
        setProfileSaved(false);
        // The avatar endpoint commits on its own, so a photo that uploaded is
        // already saved even if the details PUT then fails — track it so the
        // local copy stays in step either way.
        let uploadedPic: string | null = null;
        try {
            let newProfilePic = getUserInfo.profile_pic;

            // Photo is uploaded to its own endpoint — the file is stored on the
            // server and only its URL ever touches the database/JSON payloads.
            if (editPhotoFile) {
                const avatarForm = new FormData();
                avatarForm.append('file', editPhotoFile);
                const avatarRes = await mainAxios.post(`/auth/users/${getUserInfo.id}/avatar`, avatarForm, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                newProfilePic = avatarRes.data.profile_pic;
                uploadedPic = newProfilePic;
            }

            // Blank phone/email must go over as null — "" collides with the
            // UNIQUE index the moment a second user also leaves it empty, and
            // that failure used to take the photo change down with it.
            const res = await mainAxios.put(`/auth/users/${getUserInfo.id}`, {
                fname: editFname,
                lname: editLname,
                phone: editPhone.trim() || null,
                email: editEmail.trim() || null,
                profile_pic: newProfilePic,
            });

            const store = localStorage.getItem('authToken') ? localStorage : sessionStorage;
            store.setItem('userInfo', JSON.stringify({ ...getUserInfo, ...res.data.user, profile_pic: newProfilePic }));
            setEditPhotoFile(null);
            setProfileSaved(true);
            setTimeout(() => window.location.reload(), 900);
        } catch (error: any) {
            if (uploadedPic) {
                // Photo went through; only the details failed. Keep the new
                // photo rather than making the user upload it a second time.
                const store = localStorage.getItem('authToken') ? localStorage : sessionStorage;
                store.setItem('userInfo', JSON.stringify({ ...getUserInfo, profile_pic: uploadedPic }));
                setEditPhotoFile(null);
                setEditPhotoPreview(uploadedPic);
            }
            const detail = error?.response?.data?.detail;
            setProfileEditError(
                (typeof detail === 'string' ? detail : '') ||
                'Could not update profile. Please try again.'
            );
        } finally {
            setSavingProfile(false);
        }
    };

    // A notification's `link` is either an in-app section (/profile?section=X)
    // or an external route (/shopping-cart, /wish-list) — route accordingly.
    const handleNotificationNavigate = (link: string) => {
        try {
            const url = new URL(link, window.location.origin);
            if (url.pathname === '/profile') {
                const section = url.searchParams.get('section') as ProfileTab | null;
                if (section && VALID_TABS.includes(section)) {
                    setActiveTab(section);
                    return;
                }
            }
            window.location.href = link;
        } catch {
            window.location.href = link;
        }
    };

    // Check if user is logged in and load billings
    useEffect(() => {
        const userInfo = getUserInfo;
        // A logged-in user may only have a phone (no email) — don't gate on email specifically.
        if (!token || !userInfo) {
            setIsLoggedIn(false);
            return;
        }
        loadUserBillings();
        loadOrders(1, orderStatusFilter);
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

    const loadOrders = async (page = ordersPage, status = orderStatusFilter) => {
        try {
            setOrdersLoading(true);
            const response = await paymentService.getMyOrdersPaged(page, 6, status);
            setOrders(response.orders || []);
            setOrdersSummary({
                total_spent: response.summary.total_spent || 0,
                total_orders: response.summary.total_orders || 0,
                successful_orders: response.summary.successful_orders || 0,
            });
            setOrdersPagination(response.pagination || { page: 1, limit: 6, total_items: 0, total_pages: 0, has_prev: false, has_next: false });
            setOrdersPage(response.pagination?.page || page);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setOrdersLoading(false);
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
        window.location.href = '/login';
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

    const statusFilterButtons: Array<{ label: string; value: OrderStatusFilter }> = [
        { label: 'All', value: 'all' },
        { label: 'Done', value: 'done' },
        { label: 'Pending', value: 'pending' },
        { label: 'Failed', value: 'failed' },
    ];

    const handleOrderStatusChange = (value: OrderStatusFilter) => {
        setOrderStatusFilter(value);
        setOrdersPage(1);
        loadOrders(1, value);
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
            setBillingOriginalReference('');
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
                setBillingOriginalReference(billing.card_number || '');
                break;
            case 'phone':
                formData.phoneNumber = billing.card_number || '';
                setBillingOriginalReference(billing.card_number || '');
                break;
            case 'bank_transfer':
                formData.accountNumber = billing.card_number || '';
                setBillingOriginalReference(billing.card_number || '');
                break;
            case 'paypal':
                formData.paypalEmail = billing.card_number || '';
                setBillingOriginalReference(billing.card_number || '');
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

    const getBillingReferenceValue = () => {
        switch (billingData.billingType) {
            case 'card':
                return billingData.cardNumber.replace(/\s/g, '');
            case 'phone':
                return billingData.phoneNumber.replace(/\D/g, '');
            case 'bank_transfer':
                return billingData.accountNumber.replace(/\s/g, '');
            case 'paypal':
                return billingData.paypalEmail.trim();
            default:
                return '';
        }
    };

    const hasBillingReferenceChanged = Boolean(isEditing) && getBillingReferenceValue() !== billingOriginalReference;

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
                        {hasBillingReferenceChanged && (
                            <p className="text-amber-600 text-xs mt-2">
                                Changing this billing number will also update the saved billing method.
                            </p>
                        )}
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
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleLogout()}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="w-full bg-primary hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                        >
                            Go to Login
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    const navItems: { id: ProfileTab; label: string; icon: any; badge?: number }[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag, badge: (unreadBySection.order ?? 0) + (unreadBySection.payment ?? 0) },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'profile', label: 'Profile', icon: User },
    ];
    const pageTitle = navItems.find(n => n.id === activeTab)?.label || 'Dashboard';

    return (
        <>
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}
                <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
                    <a
                        href="/"
                        className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        title="Go to homepage"
                    >
                        <img src="/Umukamezilogo.jpg" alt="Umukamezi" className="h-9 w-9 rounded object-cover flex-shrink-0" />
                        <span className="font-bold text-gray-900 tracking-tight uppercase text-sm">Umukamezi</span>
                    </a>
                    <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-black text-white overflow-hidden flex justify-center items-center font-bold text-sm flex-shrink-0">
                            {getUserInfo?.profile_pic ? (
                                <img src={resolveImageUrl(getUserInfo.profile_pic)} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <>{getUserInfo?.fname?.charAt(0).toUpperCase()}</>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{getUserInfo?.fname} {getUserInfo?.lname}</p>
                            <p className="text-xs text-gray-500 truncate">{getUserInfo?.email || getUserInfo?.phone}</p>
                        </div>
                    </div>
                    <nav className="mt-4">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium flex-1">{item.label}</span>
                                    <NavBadge count={item.badge} />
                                </button>
                            );
                        })}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <a href="/shopping-cart" className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                <ShoppingBag size={20} />
                                <span className="font-medium flex-1">Cart</span>
                                <NavBadge count={unreadBySection.cart} />
                            </a>
                            <a href="/wish-list" className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                <Heart size={20} />
                                <span className="font-medium flex-1">Wishlist</span>
                                <NavBadge count={unreadBySection.wishlist} />
                            </a>
                            <div className="mt-3 pt-2 border-t border-gray-100"></div>
                            <a
                                href="/"
                                className="w-full flex items-center gap-3 px-6 py-3 text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                                <ArrowBigLeft size={20} />
                                <span className="font-medium">Back to Home</span>
                            </a>
                    </div>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <UserNotificationBell onNavigate={handleNotificationNavigate} />
                            <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">Welcome back, {getUserInfo?.fname || 'there'}!</h2>
                                <p className="text-gray-500 text-sm">Here's a quick look at your account.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Spent</p>
                                    <p className="text-2xl font-bold text-gray-900">{RWF.format(ordersSummary.total_spent)}</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Confirmed Orders</p>
                                    <p className="text-2xl font-bold text-green-600">{ordersSummary.successful_orders}</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">All Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{ordersSummary.total_orders}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <button onClick={() => setActiveTab('orders')} className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-gray-300 transition-colors">
                                    <ShoppingBag className="w-6 h-6 text-gray-700 mb-2" />
                                    <p className="font-medium text-gray-900">View Orders</p>
                                </button>
                                <button onClick={() => setActiveTab('profile')} className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-gray-300 transition-colors">
                                    <User className="w-6 h-6 text-gray-700 mb-2" />
                                    <p className="font-medium text-gray-900">Edit Profile</p>
                                </button>
                                <button onClick={() => window.location.href = '/wish-list'} className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-gray-300 transition-colors">
                                    <Heart className="w-6 h-6 text-gray-700 mb-2" />
                                    <p className="font-medium text-gray-900">My Wishlist</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="max-w-2xl bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h2>
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                        {editPhotoPreview ? (
                                            <img src={resolveImageUrl(editPhotoPreview)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-10 h-10 text-gray-400" />
                                        )}
                                    </div>
                                    <label className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                                        <Camera className="w-4 h-4" />
                                        <input type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoChange} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Click the camera icon to change your photo</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input type="text" value={editFname} onChange={(e) => setEditFname(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input type="text" value={editLname} onChange={(e) => setEditLname(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+250781234567" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 text-gray-800 rounded-lg px-3 py-2.5 text-sm " />
                                </div>
                            </div>

                            {profileEditError && <p className="text-sm text-red-600 mt-4">{profileEditError}</p>}
                            {profileSaved && <p className="text-sm text-green-600 mt-4">Profile updated!</p>}

                            <button
                                onClick={handleSaveProfile}
                                disabled={savingProfile || !editFname.trim()}
                                className="mt-6 px-5 py-2.5 bg-primary hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium"
                            >
                                {savingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* Transactions Tab */}
                    {activeTab === 'orders' && (
                        <div className="space-y-5">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Spent</p>
                                    <p className="text-xl font-bold text-gray-900">{RWF.format(ordersSummary.total_spent)}</p>
                                </div>
                                <div className="bg-white border border-green-200 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Confirmed</p>
                                    <p className="text-xl font-bold text-green-600">{ordersSummary.successful_orders}</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">All Transactions</p>
                                    <p className="text-xl font-bold text-gray-900">{ordersSummary.total_orders}</p>
                                </div>
                            </div>

                            {/* Filter tabs */}
                            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit flex-wrap">
                                {statusFilterButtons.map(btn => (
                                    <button key={btn.value} onClick={() => handleOrderStatusChange(btn.value)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${orderStatusFilter === btn.value ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                                        {btn.label}
                                    </button>
                                ))}
                            </div>

                            {/* Table */}
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                {ordersLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="w-7 h-7 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 text-sm font-medium">No transactions found</p>
                                        <button onClick={() => window.location.href = '/products'}
                                            className="mt-4 px-5 py-2 rounded-lg text-white text-sm font-medium"
                                            style={{ backgroundColor: '#1d293d' }}>
                                            Browse Products
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-200">
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice / Date</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Fulfillment</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map(order => (
                                                        <OrderRow key={order.id} order={order} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* Pagination */}
                                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">
                                                Page {ordersPagination.page} of {ordersPagination.total_pages || 1} · {ordersPagination.total_items} transactions
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { const p = Math.max(1, ordersPage - 1); setOrdersPage(p); loadOrders(p, orderStatusFilter); }}
                                                    disabled={!ordersPagination.has_prev || ordersLoading}
                                                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium disabled:opacity-40">
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => { const p = ordersPage + 1; setOrdersPage(p); loadOrders(p, orderStatusFilter); }}
                                                    disabled={!ordersPagination.has_next || ordersLoading}
                                                    className="px-3 py-1.5 rounded-lg text-white text-xs font-medium disabled:opacity-40"
                                                    style={{ backgroundColor: '#1d293d' }}>
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === 'billing' && (
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
                                                <p className="text-gray-800">{getUserInfo?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="text-gray-800">{getUserInfo?.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Member Since</p>
                                                <p className="text-gray-800">{formatDate(getUserInfo?.created_at)}</p>
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
                    )}
                </main>
            </div>
        </div >

            {/* Logout Confirmation Modal */ }
    {
        showLogoutModal && (
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
        )
    }

    {/* Billing Details Modal */ }
    {
        showDetailsModal && selectedBilling && (
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
        )
    }
        </>
    );
};

export default UserDashboard;