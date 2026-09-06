import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, X, Loader, Smartphone, CheckCircle, AlertCircle, Clock, CreditCard } from 'lucide-react';
import Footer from '../../components/SharedComp/footer';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import { RWF } from '../../app/priceConver';
import { useNavigation } from '../../hooks/product/useNavigation';
import mainAxios from "../../Instance/mainAxios";
import { paymentService } from '../../app/products/paymentService';
import { billingService } from '../../app/userProfile/billingService';
import { token } from '../../app/Localstorage';
import { getGuestCartId } from '../../app/utils/guestCart';
import { notifyCartUpdated } from '../../app/utils/countEvents';

// Interfaces based on API response
interface Color {
    hex: string;
    name: string;
    stock: number;
}

interface CartItem {
    cart_item_id: number;
    product_id: number;
    product_name: string;
    product_image: { url: string; is_primary: boolean }[];
    current_price: number;
    price_at_time: number;
    quantity: number;
    cart_color: { color: Color }[];
    product_color: Color[];
    delivery: string;       // user's selected option: "free" | "2000" | "5000" | "0"
    delivery_fee: string;   // product's own delivery note set by admin (e.g. "Free" or custom text)
    item_total: number;
    in_stock: number;
    max_available: number;
}

/** Parse the user's selected delivery option into an RWF amount. */
const parseDeliveryFee = (delivery: string): number => {
    if (!delivery || delivery === 'free') return 0;
    const n = parseInt(delivery, 10);
    return isNaN(n) ? 0 : n;
};

interface CartResponse {
    cart_id: number;
    user_id: number;
    items: CartItem[];
    total_items: number;
    total_price: number;
    cart_status: boolean;
    created_at: string;
}

type PaymentStage = 'method' | 'delivery' | 'input' | 'processing' | 'card-pending' | 'success' | 'failed';
type PaymentMethod = 'momo' | 'card';

const UMUKAMEZI_WA = "250781691713";

const PaymentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onSuccess: () => void;
    items?: CartItem[];
}> = ({ isOpen, onClose, total, onSuccess, items = [] }) => {
    const [stage, setStage] = useState<PaymentStage>('method');
    const [method, setMethod] = useState<PaymentMethod>('momo');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [billings, setBillings] = useState<any[]>([]);
    const [selectedBillingId, setSelectedBillingId] = useState<number | null>(null);
    const [updateBillingChecked, setUpdateBillingChecked] = useState(false);
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
    const pendingBillingUpdateRef = useRef<{ billingId: number; digits: string } | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryAddressError, setDeliveryAddressError] = useState('');
    const [selectedDeliveryBillingId, setSelectedDeliveryBillingId] = useState<number | null>(null);
    const [updateAddressChecked, setUpdateAddressChecked] = useState(false);
    const pendingAddressUpdateRef = useRef<{ billingId: number; address: string } | null>(null);
    const [externalId, setExternalId] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pollCount = useRef(0);

    const stopPolling = () => {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };

    useEffect(() => {
        if (!isOpen) {
            stopPolling();
            setStage('method');
            setMethod('momo');
            setPhone('');
            setBillings([]);
            setSelectedBillingId(null);
            setUpdateBillingChecked(false);
            setPhoneError('');
            setDeliveryType('pickup');
            setDeliveryAddress('');
            setDeliveryAddressError('');
            setSelectedDeliveryBillingId(null);
            setUpdateAddressChecked(false);
            pendingAddressUpdateRef.current = null;
            setExternalId('');
            setInvoiceNumber('');
            setStatusMsg('');
            pollCount.current = 0;
        }
        if (isOpen) {
            (async () => {
                try {
                    const resp = await billingService.getMyBillings();
                    const list = resp.billings || [];
                    setBillings(list);
                    if (list.length > 0) {
                        // Phone: prefer a phone-type billing
                        const phoneBilling = list.find((b: any) => b.billing_type === 'phone') || list[0];
                        setSelectedBillingId(phoneBilling.id);
                        setPhone(formatPhoneInput(String(phoneBilling.card_number || '')));

                        // Address: prefer a billing that has a saved address
                        const addrBilling = list.find((b: any) => b.address) || list[0];
                        if (addrBilling) {
                            setSelectedDeliveryBillingId(addrBilling.id);
                            setDeliveryAddress(formatBillingAddress(addrBilling));
                        }
                    }
                } catch (e) { /* ignore */ }
            })();
        }
    }, [isOpen]);

    const formatBillingAddress = (b: any): string =>
        [b.address, b.city, b.zip_code, b.country].filter(Boolean).join(', ');

    const validatePhone = (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Phone number is required';
        if (digits.length < 9 || digits.length > 13) return 'Enter a valid Rwanda phone number (e.g. 0788123456)';
        return '';
    };

    const formatPhoneInput = (value: string) => {
        const digits = String(value || '').replace(/\D/g, '');
        if (!digits) return '';
        if (digits.startsWith('250') && digits.length >= 12) {
            return `+250 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 12)}`;
        }
        if (digits.startsWith('0') && digits.length === 10) {
            return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
        }
        if (digits.length <= 4) return digits;
        if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    };

    const getFriendlyPaymentError = (error: any, fallback: string) => {
        const statusCode = error?.response?.status;
        const backendDetail = String(error?.response?.data?.detail || '').trim();

        const mappedErrors: Record<number, string> = {
            400: 'The phone number looks invalid. Please check it and try again.',
            401: 'Payment authorization failed. Please try again later.',
            403: 'The payment provider blocked this request. Please try again or use the hosted checkout.',
            404: 'The payment session could not be found. Please try again.',
            409: 'The payment was canceled or declined on the phone prompt. If you still want to pay, please try again.',
            422: 'The payment details could not be validated. Please check the phone number and amount.',
        };

        if (statusCode && mappedErrors[statusCode]) {
            return mappedErrors[statusCode];
        }

        if (backendDetail && !backendDetail.toLowerCase().includes('payment gateway error')) {
            return backendDetail;
        }

        return fallback;
    };

    const startPolling = (extId: string) => {
        pollRef.current = setInterval(async () => {
            pollCount.current += 1;
            if (pollCount.current > 30) {
                stopPolling();
                setStage('failed');
                setStatusMsg('Payment timed out. Please try again.');
                return;
            }
            try {
                const res = await paymentService.getPaymentStatus(extId);
                if (res.status === 'SUCCESSFUL') {
                    stopPolling(); setStage('success');
                    setStatusMsg('Payment confirmed! Check your email for your invoice.');
                    if (res.invoice_number) setInvoiceNumber(res.invoice_number);
                    onSuccess();
                    // Update phone billing if requested
                    if (pendingBillingUpdateRef.current) {
                        const p = pendingBillingUpdateRef.current; pendingBillingUpdateRef.current = null;
                        try {
                            await billingService.updateBilling(p.billingId, { card_number: p.digits });
                            setAlert({ message: 'Saved billing phone updated.', type: 'success' });
                        } catch (e) {
                            setAlert({ message: 'Could not update saved billing. Update later from your profile.', type: 'error' });
                        }
                    }
                    // Update delivery address billing if requested
                    if (pendingAddressUpdateRef.current) {
                        const a = pendingAddressUpdateRef.current; pendingAddressUpdateRef.current = null;
                        const parts = a.address.split(',').map((s: string) => s.trim());
                        try {
                            await billingService.updateBilling(a.billingId, {
                                address: parts[0] || a.address,
                                city: parts[1] || undefined,
                                zip_code: parts[2] || undefined,
                                country: parts[3] || undefined,
                            });
                            setAlert({ message: 'Saved billing address updated.', type: 'success' });
                        } catch (e) {
                            setAlert({ message: 'Could not update saved billing address. Update later from your profile.', type: 'error' });
                        }
                    }
                } else if (res.status === 'FAILED') {
                    stopPolling(); setStage('failed');
                    setStatusMsg('Payment was declined. Please try again.');
                }
            } catch { /* ignore transient errors */ }
        }, 4000);
    };

    const handleMomoSubmit = async () => {
        const err = validatePhone(phone);
        if (err) { setPhoneError(err); return; }
        setStage('processing');
        setStatusMsg('Sending payment request to your phone…');
        pollCount.current = 0;
        try {
            const digits = phone.replace(/\D/g, '');
            if (selectedBillingId && updateBillingChecked) {
                pendingBillingUpdateRef.current = { billingId: selectedBillingId, digits };
            } else {
                pendingBillingUpdateRef.current = null;
            }
            if (deliveryType === 'delivery' && selectedDeliveryBillingId && updateAddressChecked && deliveryAddress.trim()) {
                pendingAddressUpdateRef.current = { billingId: selectedDeliveryBillingId, address: deliveryAddress.trim() };
            } else {
                pendingAddressUpdateRef.current = null;
            }
            const resp = await paymentService.initiatePayment(digits, deliveryType, deliveryAddress);
            setExternalId(resp.external_id);
            if (resp.checkout_url) {
                window.open(resp.checkout_url, '_blank');
                setStage('card-pending');
                setStatusMsg('V-Pay required checkout instead of direct MoMo. Complete the payment in the new tab.');
                startPolling(resp.external_id);
                return;
            }
            if (resp.status === 'SUCCESSFUL') {
                setStage('success'); setStatusMsg('Payment confirmed!');
                if (resp.invoice_number) setInvoiceNumber(resp.invoice_number);
                onSuccess();
                if (pendingBillingUpdateRef.current) {
                    const p = pendingBillingUpdateRef.current; pendingBillingUpdateRef.current = null;
                    try { await billingService.updateBilling(p.billingId, { card_number: p.digits }); setAlert({ message: 'Saved billing updated.', type: 'success' }); } catch (e) { setAlert({ message: 'Could not update saved billing. Update later from your profile.', type: 'error' }); }
                }
                return;
            }
            if (resp.status === 'FAILED') {
                setStage('failed'); setStatusMsg('Payment was declined. Please try again.'); return;
            }
            setStatusMsg('Waiting for you to approve the USSD prompt on your phone…');
            startPolling(resp.external_id);
        } catch (e: any) {
            setStage('failed');
            setStatusMsg(getFriendlyPaymentError(e, 'Payment initiation failed. Please try again.'));
        }
    };

    const handleCardSubmit = async () => {
        const err = validatePhone(phone);
        if (err) { setPhoneError(err); return; }
        setStage('processing');
        setStatusMsg('Opening secure checkout…');
        pollCount.current = 0;
        try {
            const digits = phone.replace(/\D/g, '');
            if (selectedBillingId && updateBillingChecked) {
                pendingBillingUpdateRef.current = { billingId: selectedBillingId, digits };
            } else {
                pendingBillingUpdateRef.current = null;
            }
            if (deliveryType === 'delivery' && selectedDeliveryBillingId && updateAddressChecked && deliveryAddress.trim()) {
                pendingAddressUpdateRef.current = { billingId: selectedDeliveryBillingId, address: deliveryAddress.trim() };
            } else {
                pendingAddressUpdateRef.current = null;
            }
            const redirectUrl = `${window.location.origin}/profile`;
            const resp = await paymentService.initiateCheckout(digits, redirectUrl, deliveryType, deliveryAddress);
            setExternalId(resp.external_id);
            // Open the V-Pay hosted checkout in a new tab
            window.open(resp.checkout_url, '_blank');
            setStage('card-pending');
            setStatusMsg('Complete your payment in the checkout tab, then check back here.');
            startPolling(resp.external_id);
        } catch (e: any) {
            setStage('failed');
            setStatusMsg(getFriendlyPaymentError(e, 'Could not open checkout. Please try again.'));
        }
    };

    if (!isOpen) return null;

    const canClose = stage === 'method' || stage === 'input' || stage === 'success' || stage === 'failed' || stage === 'card-pending';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl max-w-md w-full p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Checkout</h3>
                    {canClose && (
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Amount */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount to Pay</span>
                    <span className="font-bold text-gray-900 text-lg">{RWF.format(total)}</span>
                </div>

                {/* Stage: method selection */}
                {stage === 'method' && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 mb-3">Select your payment method</p>

                        {/* MTN MoMo */}
                        <button
                            onClick={() => { setMethod('momo'); setStage('delivery'); }}
                            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-900 transition-colors text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                                <Smartphone className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">MTN Mobile Money</p>
                                <p className="text-xs text-gray-500">USSD push to your phone</p>
                            </div>
                        </button>

                        {/* WhatsApp — send order to Umukamezi */}
                        <button
                            onClick={() => {
                                const lines = items.map(i => `• ${i.product_name} × ${i.quantity} — ${RWF.format(i.item_total)}`).join('\n');
                                const msg = `Hello Umukamezi! I'd like to place an order:\n\n${lines}\n\nTotal: ${RWF.format(total)}\n\nPlease confirm my order. Thank you!`;
                                window.open(`https://wa.me/${UMUKAMEZI_WA}?text=${encodeURIComponent(msg)}`, '_blank');
                                onClose();
                            }}
                            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 transition-colors text-left"
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dcfce7' }}>
                                <svg className="w-5 h-5" fill="#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Order via WhatsApp</p>
                                <p className="text-xs text-gray-500">Send your order to Umukamezi on WhatsApp</p>
                            </div>
                        </button>

                        {/* Card — disabled, coming soon */}
                        <button disabled
                            className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl text-left opacity-50 cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-500 text-sm">Card Payment</p>
                                <p className="text-xs text-gray-400">Coming soon</p>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">Soon</span>
                        </button>
                    </div>
                )}

                {/* Stage: delivery / pickup choice */}
                {stage === 'delivery' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">How would you like to receive your order?</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setDeliveryType('pickup')}
                                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors ${deliveryType === 'pickup' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryType === 'pickup' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                    <svg className={`w-5 h-5 ${deliveryType === 'pickup' ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-900 text-sm">Office Pickup</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Free · Come to our office</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setDeliveryType('delivery')}
                                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors ${deliveryType === 'delivery' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryType === 'delivery' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                    <svg className={`w-5 h-5 ${deliveryType === 'delivery' ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-900 text-sm">Home Delivery</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Delivered to your address</p>
                                </div>
                            </button>
                        </div>
                        {deliveryType === 'delivery' && (
                            <div className="space-y-3">
                                {/* Billing address selector — same UX as phone billing picker */}
                                {billings.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Use saved billing address</label>
                                        <select
                                            value={selectedDeliveryBillingId ?? ''}
                                            onChange={e => {
                                                const id = Number(e.target.value) || null;
                                                setSelectedDeliveryBillingId(id);
                                                const sel = billings.find((b: any) => b.id === id);
                                                if (sel) {
                                                    setDeliveryAddress(formatBillingAddress(sel));
                                                    setDeliveryAddressError('');
                                                }
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">(none)</option>
                                            {billings.map((b: any) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.full_name} — {formatBillingAddress(b) || b.billing_type}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedDeliveryBillingId && (
                                            <label className="inline-flex items-center gap-2 text-xs text-gray-600 mt-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={updateAddressChecked}
                                                    onChange={e => setUpdateAddressChecked(e.target.checked)}
                                                />
                                                Save updated address back to this billing after payment
                                            </label>
                                        )}
                                    </div>
                                )}

                                {/* Address textarea — pre-filled from billing, freely editable */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                    <textarea
                                        value={deliveryAddress}
                                        onChange={e => { setDeliveryAddress(e.target.value); setDeliveryAddressError(''); }}
                                        rows={2}
                                        placeholder="Street, district, city…"
                                        className={`w-full px-3 py-2 border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${deliveryAddressError ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {deliveryAddressError && <p className="text-red-600 text-xs mt-1">{deliveryAddressError}</p>}
                                </div>
                            </div>
                        )}
                        <div className="flex gap-3 pt-1">
                            <button onClick={() => setStage('method')}
                                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
                                        setDeliveryAddressError('Please enter a delivery address'); return;
                                    }
                                    setStage('input');
                                }}
                                className="flex-1 py-3 rounded-lg font-medium text-white text-sm transition-colors"
                                style={{ backgroundColor: '#1d293d' }}>
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Stage: phone input */}
                {stage === 'input' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            {method === 'momo'
                                ? <Smartphone className="w-4 h-4 text-yellow-600" />
                                : <CreditCard className="w-4 h-4 text-blue-600" />}
                            <span className="text-sm font-medium text-gray-700">
                                {method === 'momo' ? 'MTN Mobile Money' : 'Card / Hosted Checkout'}
                            </span>
                        </div>
                        <div>
                            {billings.length > 0 && (
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Use saved billing</label>
                                    <select
                                        value={selectedBillingId ?? ''}
                                        onChange={e => {
                                            const id = Number(e.target.value) || null;
                                            setSelectedBillingId(id);
                                            const sel = billings.find(b => b.id === id);
                                            if (sel) setPhone(formatPhoneInput(String(sel.card_number || '')));
                                        }}
                                        className="w-full p-2 border rounded-lg"
                                    >
                                        <option value="">(none)</option>
                                        {billings.map(b => (
                                            <option key={b.id} value={b.id}>{b.billing_type}: {formatPhoneInput(String(b.card_number ?? '')) || String(b.card_number ?? '').slice(-8)}</option>
                                        ))}
                                    </select>
                                    {selectedBillingId && (
                                        <label className="inline-flex items-center gap-2 text-xs text-gray-600 mt-2">
                                            <input type="checkbox" checked={updateBillingChecked} onChange={e => setUpdateBillingChecked(e.target.checked)} />
                                            Update this billing with the phone entered (will be updated after successful payment)
                                        </label>
                                    )}
                                </div>
                            )}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="tel" value={phone}
                                    onChange={e => { setPhone(formatPhoneInput(e.target.value)); setPhoneError(''); }}
                                    placeholder="e.g. 0788123456"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                                    onKeyDown={e => e.key === 'Enter' && (method === 'momo' ? handleMomoSubmit() : handleCardSubmit())}
                                />
                            </div>
                            {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
                            <p className="text-xs text-gray-500 mt-2">
                                {method === 'momo'
                                    ? 'You will receive a USSD prompt. Approve it to complete payment.'
                                    : 'Used for the payment receipt. A secure checkout page will open in a new tab.'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStage('delivery')}
                                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedBillingId && updateBillingChecked) {
                                        setShowUpdateConfirm(true);
                                    } else {
                                        (method === 'momo' ? handleMomoSubmit() : handleCardSubmit());
                                    }
                                }}
                                className="flex-1 py-3 rounded-lg font-medium text-white transition-colors"
                                style={{ backgroundColor: '#1d293d' }}>
                                {method === 'momo' ? 'Pay Now' : 'Open Checkout'}
                            </button>
                        </div>
                        <ConfirmationDialog
                            isOpen={showUpdateConfirm}
                            title="Update saved billing?"
                            message="We'll update your saved billing with the phone you entered after a successful payment. Continue?"
                            onConfirm={() => { setShowUpdateConfirm(false); (method === 'momo' ? handleMomoSubmit() : handleCardSubmit()); }}
                            onCancel={() => { setShowUpdateConfirm(false); setUpdateBillingChecked(false); (method === 'momo' ? handleMomoSubmit() : handleCardSubmit()); }}
                            confirmText="Yes, update after success"
                            cancelText="No, proceed without update"
                        />
                        {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
                    </div>
                )}

                {/* Stage: processing */}
                {stage === 'processing' && (
                    <div className="text-center py-4 space-y-4">
                        <div className="flex justify-center">
                            <div className="w-14 h-14 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 mb-1">Processing</p>
                            <p className="text-sm text-gray-600">{statusMsg}</p>
                        </div>
                    </div>
                )}

                {/* Stage: card pending (tab opened, polling) */}
                {stage === 'card-pending' && (
                    <div className="text-center py-4 space-y-4">
                        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                            <CreditCard className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 mb-1">Complete Payment in the New Tab</p>
                            <p className="text-sm text-gray-600">{statusMsg}</p>
                            {externalId && <p className="text-xs text-gray-400 mt-1">Ref: {externalId}</p>}
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <p className="text-xs text-blue-700">
                                This page will update automatically once payment is confirmed.
                            </p>
                        </div>
                        <button onClick={onClose}
                            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                            I'll check my orders later
                        </button>
                    </div>
                )}

                {/* Stage: success */}
                {stage === 'success' && (
                    <div className="text-center py-4 space-y-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <div>
                            <p className="text-xl font-bold text-gray-900 mb-1">Payment Successful!</p>
                            <p className="text-sm text-gray-500">Your order is confirmed. An invoice has been sent to your email.</p>
                            {invoiceNumber && <p className="text-xs text-gray-400 mt-1 font-mono">{invoiceNumber}</p>}
                        </div>
                        {invoiceNumber && (
                            <a href={paymentService.getInvoiceViewUrl(invoiceNumber)}
                                target="_blank" rel="noopener noreferrer"
                                className="block w-full py-2.5 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                                View Invoice
                            </a>
                        )}
                        <button
                            onClick={() => { onClose(); window.location.href = '/products'; }}
                            className="w-full py-3 rounded-lg font-bold text-white text-sm transition-colors"
                            style={{ backgroundColor: '#1d293d' }}>
                            Okay
                        </button>
                    </div>
                )}

                {/* Stage: failed */}
                {stage === 'failed' && (
                    <div className="text-center py-4 space-y-4">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <div>
                            <p className="text-xl font-bold text-gray-900 mb-1">Payment Failed</p>
                            <p className="text-sm text-gray-600">{statusMsg}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose}
                                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                Close
                            </button>
                            <button onClick={() => { setStage('method'); setStatusMsg(''); setPhoneError(''); }}
                                className="flex-1 py-3 rounded-lg font-medium text-white transition-colors"
                                style={{ backgroundColor: '#1d293d' }}>
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Custom alert component
const CustomAlert: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}> = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
        type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
            'bg-blue-100 border-blue-400 text-blue-700';

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 border ${bgColor} px-4 py-3 rounded shadow-md z-50 flex items-center justify-between max-w-md`}
        >
            <p>{message}</p>
            <button onClick={onClose} className="ml-4">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// Confirmation Dialog Component
const ConfirmationDialog: React.FC<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg max-w-md w-full p-6"
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};


// Color Selection Component
const ColorSelection: React.FC<{
    colors: Color[];
    selectedColor: Color | null;
    onSelectColor: (color: Color) => void;
    cartItemId: number;
    isLoading: boolean;
    quantity: number;
    delivery: string;
}> = ({ colors, selectedColor, onSelectColor, cartItemId, isLoading, quantity, delivery }) => {
    const handleColorChange = async (color: Color) => {
        if (isLoading || selectedColor?.name === color.name) return;

        try {
            // Prepare query parameters
            const params = new URLSearchParams({
                quantity: quantity.toString(),
                delivery: delivery,
                guest_id: getGuestCartId()
            });

            // Prepare request body with color array
            const requestBody = [color];

            await mainAxios.put(`/cart/update/${cartItemId}?${params.toString()}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            onSelectColor(color);
        } catch (error) {
            console.error('Error updating color:', error);
        }
    };

    return (
        <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Color:</label>
            <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                    <button
                        key={color.name}
                        onClick={() => handleColorChange(color)}
                        disabled={isLoading || color.stock === 0}
                        className={`w-8 h-8 rounded-full border-2 relative ${selectedColor?.name === color.name
                            ? 'border-gray-800 ring-2 ring-offset-1 ring-gray-300'
                            : 'border-gray-300'
                            } ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} ${color.stock === 0 ? '(Out of stock)' : `(${color.stock} available)`}`}
                    >
                        {isLoading && selectedColor?.name === color.name && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader className="w-3 h-3 animate-spin text-gray-600" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
            {selectedColor && (
                <p className="text-sm text-gray-600 mt-2">
                    Selected: <span className="font-medium">{selectedColor.name}</span>
                </p>
            )}
        </div>
    );
};

// CartItem Component
const CartItem: React.FC<{
    item: CartItem;
    onUpdateQuantity: (cartItemId: number, quantity: number, delivery: string) => void;
    onRemove: (cartItemId: number) => void;
    isLoading: boolean;
    onConfirmRemove: (cartItemId: number) => void;
}> = ({ item, onUpdateQuantity, isLoading, onConfirmRemove }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState<Color | null>(
        item.cart_color?.[0]?.color || null
    );
    console.log(isHovered)
    const [selectedDelivery, setSelectedDelivery] = useState(item.delivery || "free");
    const [isUpdatingColor, setIsUpdatingColor] = useState(false);
    const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false);
    const { navigateToProduct } = useNavigation();

    const primaryImage = item.product_image?.find(img => img.is_primary)?.url ||
        item.product_image?.[0]?.url || '';

    const handleColorSelect = async (color: Color) => {
        if (selectedColor?.name === color.name) return;

        setIsUpdatingColor(true);
        try {
            // Prepare query parameters
            const params = new URLSearchParams({
                quantity: item.quantity.toString(),
                delivery: selectedDelivery,
                guest_id: getGuestCartId()
            });

            // Prepare request body with color array
            const requestBody = [color];

            await mainAxios.put(`/cart/update/${item.cart_item_id}?${params.toString()}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setSelectedColor(color);
        } catch (error) {
            console.error('Error updating color:', error);
        } finally {
            setIsUpdatingColor(false);
        }
    };

    const handleDeliveryChange = async (delivery: string) => {
        setSelectedDelivery(delivery);
        setIsUpdatingDelivery(true);
        try {
            // Get current color selection
            const currentColor = selectedColor || item.cart_color?.[0]?.color || item.product_color?.[0] || null;

            // Prepare query parameters
            const params = new URLSearchParams({
                quantity: item.quantity.toString(),
                delivery: delivery,
                guest_id: getGuestCartId()
            });

            // Prepare request body with color array
            const requestBody = currentColor ? [currentColor] : [];

            await mainAxios.put(`/cart/update/${item.cart_item_id}?${params.toString()}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Call the parent update function to refresh the cart
            onUpdateQuantity(item.cart_item_id, item.quantity, delivery);
        } catch (error) {
            console.error('Error updating delivery:', error);
        } finally {
            setIsUpdatingDelivery(false);
        }
    };



    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg border border-gray-200 mb-4"
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* Product Image */}
                <div
                    onClick={() => navigateToProduct(item.product_id.toString())}
                    className="relative w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${primaryImage}`}
                        alt={item.product_name}
                        className="w-full h-full object-cover transition-all duration-300"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product_name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">Delivery:</span>
                                <select
                                    value={selectedDelivery}
                                    onChange={(e) => handleDeliveryChange(e.target.value)}
                                    disabled={isUpdatingDelivery}
                                    className="text-sm text-gray-600 py-1 w-fit border-0 outline-0 cursor-pointer bg-transparent"
                                >
                                    <option value={"free"}>City Center → Free</option>
                                    <option value={"2000"}>In Kigali → 2,000 RWF</option>
                                    <option value={"5000"}>Out of Kigali → 5,000 RWF</option>
                                    <option value={"0"}>Outside Rwanda → Negotiable</option>
                                </select>
                                {isUpdatingDelivery && (
                                    <Loader className="w-3 h-3 animate-spin text-gray-600" />
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-2">
                                <span className="text-xl font-bold text-gray-900">
                                    {RWF.format(item.current_price)}
                                </span>
                                {item.price_at_time !== item.current_price && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {RWF.format(item.price_at_time)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                Stock: <span className={item.in_stock > 10 ? "text-green-600" : "text-orange-600"}>
                                    {item.in_stock - item.quantity} available
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Color Selection */}
                    {item.product_color && item.product_color.length > 0 && (
                        <ColorSelection
                            colors={item.product_color}
                            selectedColor={selectedColor}
                            onSelectColor={handleColorSelect}
                            cartItemId={item.cart_item_id}
                            isLoading={isUpdatingColor}
                            quantity={item.quantity}
                            delivery={selectedDelivery}
                        />
                    )}

                    {/* Quantity and Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Quantity:</label>
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={() => onUpdateQuantity(item.cart_item_id, item.quantity - 1, selectedDelivery)}
                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    disabled={item.quantity <= 1 || isLoading}
                                >
                                    {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
                                </button>
                                <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                                <button
                                    onClick={() => onUpdateQuantity(item.cart_item_id, item.quantity + 1, selectedDelivery)}
                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    disabled={item.quantity >= item.max_available || isLoading}
                                >
                                    {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">
                                {RWF.format(item.item_total)}
                            </span>
                            <button
                                onClick={() => onConfirmRemove(item.cart_item_id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                title="Remove item"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// CartSummary Component
const CartSummary: React.FC<{
    items: CartItem[];
    availableItems: CartItem[];
    availableTotal: number;
    onCheckout: () => void;
    isLoading?: boolean;
}> = ({ items, availableItems, availableTotal, onCheckout, isLoading = false }) => {
    const outOfStockItems = items.filter(i => i.in_stock === 0);
    const totalDelivery = availableItems.reduce((sum, item) => sum + parseDeliveryFee(item.delivery), 0);
    const grandTotal = availableTotal + totalDelivery;

    return (
        <div className="bg-white p-6 pt-20 rounded-lg border border-gray-200 sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6">
                {/* Out-of-stock warning */}
                {outOfStockItems.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-red-700 mb-1">
                            {outOfStockItems.length} item{outOfStockItems.length > 1 ? 's' : ''} excluded — out of stock:
                        </p>
                        {outOfStockItems.map(i => (
                            <p key={i.cart_item_id} className="text-xs text-red-600 truncate">• {i.product_name}</p>
                        ))}
                    </div>
                )}

                <div className="flex justify-between">
                    <span className="text-gray-600">
                        Items ({availableItems.length}
                        {outOfStockItems.length > 0 && <span className="text-red-500"> of {items.length}</span>})
                    </span>
                    <span className="font-medium">{RWF.format(availableTotal)}</span>
                </div>

                {/* Delivery fees — only for available items */}
                {availableItems.map(item => {
                    const fee = parseDeliveryFee(item.delivery);
                    const label = item.delivery === 'free' || item.delivery === ''
                        ? 'Free'
                        : item.delivery === '0'
                            ? 'Negotiable'
                            : RWF.format(fee);
                    return (
                        <div key={item.cart_item_id} className="flex justify-between text-sm">
                            <span className="text-gray-500 truncate max-w-[55%]">
                                Delivery · {item.product_name.slice(0, 20)}{item.product_name.length > 20 ? '…' : ''}
                                {item.delivery_fee ? <span className="text-xs text-blue-600 ml-1">({item.delivery_fee})</span> : null}
                            </span>
                            <span className={fee === 0 && item.delivery !== '0' ? 'text-green-600 font-medium' : 'font-medium'}>
                                {label}
                            </span>
                        </div>
                    );
                })}

                <hr className="my-2" />

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Delivery</span>
                    <span className={totalDelivery === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                        {totalDelivery === 0 ? 'Free' : RWF.format(totalDelivery)}
                    </span>
                </div>

                <hr className="my-2" />

                <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span>{RWF.format(grandTotal)}</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                disabled={isLoading || availableItems.length === 0}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <button
                onClick={() => window.location.href = '/products'}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
            </button>
        </div>
    );
};

// Main ShoppingCartPage Component
const ShoppingCartPage: React.FC = () => {
    const [cartData, setCartData] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchCart();
    }, []);

    // Always sent: the server ignores it whenever the request carries a
    // usable user, and an expired token counts as no user.
    const guestParam = () => `?guest_id=${getGuestCartId()}`;

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await mainAxios.get(`/cart/my-cart${guestParam()}`);
            setCartData(response.data);
            // Keep the navbar badge in step — this runs after every add,
            // quantity change, removal and completed checkout on this page.
            notifyCartUpdated();
        } catch (error: any) {
            console.error('Error fetching cart:', error);
            if (error.response?.status === 404) {
                setCartData(null);
            } else {
                showAlert('Failed to load cart', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId: number, quantity: number, delivery: string) => {
        if (quantity < 1) return;

        try {
            setUpdating(true);

            // Find the item to get its current color
            const itemToUpdate = cartData?.items.find(item => item.cart_item_id === cartItemId);

            if (!itemToUpdate) {
                showAlert('Item not found', 'error');
                return;
            }

            // Get current color selection
            const currentColor = itemToUpdate.cart_color?.[0]?.color ||
                itemToUpdate.product_color?.[0] ||
                null;

            // Prepare query parameters
            const params = new URLSearchParams({
                quantity: quantity.toString(),
                delivery: delivery,
                guest_id: getGuestCartId()
            });

            // Prepare request body with color array
            const requestBody = currentColor ? [currentColor] : [];

            await mainAxios.put(`/cart/update/${cartItemId}?${params.toString()}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            showAlert('Quantity updated successfully', 'success');
            fetchCart(); // Refresh cart data
        } catch (error: any) {
            console.error('Error updating quantity:', error);
            if (error.response?.status === 404) {
                showAlert('Item not found in cart', 'error');
            } else if (error.response?.status === 422) {
                showAlert('Invalid data format', 'error');
            } else {
                showAlert('Failed to update quantity', 'error');
            }
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (cartItemId: number) => {
        try {
            setUpdating(true);
            await mainAxios.delete(`/cart/delete/${cartItemId}${guestParam()}`);
            showAlert('Item removed from cart', 'success');
            fetchCart(); // Refresh cart data
        } catch (error: any) {
            console.error('Error removing item:', error);
            if (error.response?.status === 404) {
                showAlert('Item not found in cart', 'error');
            } else {
                showAlert('Failed to remove item', 'error');
            }
        } finally {
            setUpdating(false);
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        }
    };

    const confirmRemoveItem = (cartItemId: number) => {
        setItemToDelete(cartItemId);
        setShowDeleteConfirm(true);
    };

    const handleCheckout = () => {
        if (!token) {
            showAlert('Please log in or create an account to complete checkout.', 'info');
            window.location.href = '/login?next=/shopping-cart';
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        fetchCart();
    };

    const showAlert = (message: string, type: 'success' | 'error' | 'info') => {
        setAlert({ message, type });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty State or Cart not found
    if (!cartData || cartData.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
                        <p className="text-gray-600">Review your items and proceed to checkout</p>
                    </div>

                    {/* Empty State */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
                        <button
                            onClick={() => window.location.href = '/products'}
                            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </motion.div>
                </div>
                <Footer />
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={closeAlert} />}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
                    <p className="text-gray-600">Review your items and proceed to checkout</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <AnimatePresence>
                            {cartData.items.map((item) => (
                                <CartItem
                                    key={item.cart_item_id}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeItem}
                                    isLoading={updating}
                                    onConfirmRemove={confirmRemoveItem}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Cart Summary — only in-stock items count toward payment */}
                    <div className="lg:col-span-1">
                        {(() => {
                            const availableItems = cartData.items.filter(i => i.in_stock > 0);
                            const availableTotal = availableItems.reduce((s, i) => s + i.item_total, 0);
                            return (
                                <CartSummary
                                    items={cartData.items}
                                    availableItems={availableItems}
                                    availableTotal={availableTotal}
                                    onCheckout={handleCheckout}
                                    isLoading={updating}
                                />
                            );
                        })()}
                    </div>
                </div>
            </div>
            <Footer />

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                total={cartData.items.filter(i => i.in_stock > 0).reduce((s, i) => s + i.item_total, 0)}
                onSuccess={handlePaymentSuccess}
                items={cartData.items.filter(i => i.in_stock > 0)}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                title="Remove Item"
                message="Are you sure you want to remove this item from your cart?"
                onConfirm={() => itemToDelete && removeItem(itemToDelete)}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                }}
                confirmText="Remove"
            />

            {/* Custom Alert */}
            {alert && <CustomAlert message={alert.message} type={alert.type} onClose={closeAlert} />}
        </div>
    );
};

export default ShoppingCartPage;