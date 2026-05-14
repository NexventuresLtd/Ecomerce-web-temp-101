import { useState, useEffect, type ReactNode } from 'react';
import {
    Truck, Building2, CheckCircle, Clock, Search, RefreshCw,
    Package, ChevronDown, ChevronUp, ShieldCheck, AlertCircle,
    Receipt, XCircle,
} from 'lucide-react';
import { paymentService, type DeliveryItem, type InvoiceVerifyResponse } from '../../../app/products/paymentService';

const RWF = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 });

const DeliveryBadge = ({ type }: { type: string }) =>
    type === 'delivery'
        ? <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"><Truck className="w-3 h-3" />Delivery</span>
        : <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200"><Building2 className="w-3 h-3" />Pickup</span>;

const StatusBadge = ({ status }: { status: string }) => {
    const cfg: Record<string, { cls: string; icon: ReactNode }> = {
        PENDING_DELIVERY: { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock className="w-3 h-3" /> },
        DELIVERED:        { cls: 'bg-green-50 text-green-700 border-green-200',  icon: <CheckCircle className="w-3 h-3" /> },
        PICKED_UP:        { cls: 'bg-teal-50 text-teal-700 border-teal-200',     icon: <CheckCircle className="w-3 h-3" /> },
    };
    const c = cfg[status] ?? cfg.PENDING_DELIVERY;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${c.cls}`}>
            {c.icon}{status.replace('_', ' ')}
        </span>
    );
};

const DeliveryCard = ({
    item, onUpdate, updating,
}: { item: DeliveryItem; onUpdate: (id: number, s: 'DELIVERED' | 'PICKED_UP') => void; updating: number | null }) => {
    const [expanded, setExpanded] = useState(false);
    const busy = updating === item.id;

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.delivery_type === 'delivery' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                            {item.delivery_type === 'delivery' ? <Truck className="w-5 h-5 text-blue-600" /> : <Building2 className="w-5 h-5 text-purple-600" />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{item.buyer_name}</p>
                            <p className="text-xs text-gray-500">{item.buyer_email} · {item.payer_phone}</p>
                            {item.invoice_number && (
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{item.invoice_number}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <DeliveryBadge type={item.delivery_type} />
                        <StatusBadge status={item.delivery_status} />
                    </div>
                </div>

                {item.delivery_type === 'delivery' && item.delivery_address && (
                    <div className="flex items-start gap-2 mb-3 bg-blue-50 rounded-lg p-2">
                        <Truck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">{item.delivery_address}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <p className="font-bold text-gray-900">{RWF.format(item.total_amount)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {item.items_count} item{item.items_count !== 1 ? 's' : ''} ·{' '}
                            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                            Items {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {item.delivery_status === 'PENDING_DELIVERY' && (
                            <>
                                {item.delivery_type === 'delivery' ? (
                                    <button
                                        disabled={busy}
                                        onClick={() => onUpdate(item.id, 'DELIVERED')}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50"
                                        style={{ backgroundColor: '#1d293d' }}>
                                        {busy ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                        Mark Delivered
                                    </button>
                                ) : (
                                    <button
                                        disabled={busy}
                                        onClick={() => onUpdate(item.id, 'PICKED_UP')}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50"
                                        style={{ backgroundColor: '#1d293d' }}>
                                        {busy ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                        Mark Picked Up
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {expanded && item.items?.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50">
                    {item.items.map((it, i) => {
                        const img = (it.images || []).find((x: any) => x.is_primary)?.url || it.images?.[0]?.url;
                        return (
                            <div key={i} className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0">
                                {img ? (
                                    <img src={`${import.meta.env.VITE_API_BASE_URL}${img}`} alt={it.product_name}
                                        className="w-10 h-10 object-cover rounded flex-shrink-0" />
                                ) : (
                                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                        <Package className="w-4 h-4 text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{it.product_name}</p>
                                    <p className="text-xs text-gray-500">Qty: {it.quantity} × {RWF.format(it.price)}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">{RWF.format(it.item_total)}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const InvoiceVerifier = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<InvoiceVerifyResponse | null>(null);
    const [error, setError] = useState('');

    const verify = async () => {
        const num = input.trim();
        if (!num) { setError('Enter an invoice number'); return; }
        setLoading(true); setError(''); setResult(null);
        try {
            const data = await paymentService.verifyInvoice(num);
            setResult(data);
        } catch (e: any) {
            setError(e?.response?.data?.detail || 'Invoice not found or invalid');
        } finally {
            setLoading(false);
        }
    };

    const statusColor: Record<string, string> = {
        SUCCESSFUL: 'text-green-600', PENDING: 'text-yellow-600', FAILED: 'text-red-600',
    };
    const deliveryStatusColor: Record<string, string> = {
        PENDING_DELIVERY: 'text-yellow-600', DELIVERED: 'text-green-600', PICKED_UP: 'text-teal-600',
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-900">Invoice Verification</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                Enter an invoice number to verify its authenticity against the system database.
                If the number has been altered, it will be rejected.
            </p>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={input}
                    onChange={e => { setInput(e.target.value); setError(''); setResult(null); }}
                    placeholder="e.g. UMK-20260514-000042-A1B2C3D4"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    onKeyDown={e => e.key === 'Enter' && verify()}
                />
                <button
                    onClick={verify} disabled={loading}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    style={{ backgroundColor: '#1d293d' }}>
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                    Verify
                </button>
            </div>

            {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {result && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 bg-green-50 border-b border-green-100 px-4 py-3">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-semibold text-green-700">Invoice Verified — Authentic</p>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                        <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Invoice No.</p>
                            <p className="font-mono font-semibold text-gray-900 text-xs">{result.invoice_number}</p></div>
                        <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Payment Status</p>
                            <p className={`font-bold text-sm ${statusColor[result.status] ?? ''}`}>{result.status}</p></div>
                        <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Buyer</p>
                            <p className="font-medium text-gray-900">{result.buyer_name}</p>
                            <p className="text-xs text-gray-500">{result.buyer_email}</p></div>
                        <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Amount</p>
                            <p className="font-bold text-gray-900">{RWF.format(result.total_amount)}</p></div>
                        <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fulfillment</p>
                            <p className="capitalize font-medium text-gray-900">{result.delivery_type === 'delivery' ? 'Home Delivery' : 'Office Pickup'}</p></div>
                        <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Delivery Status</p>
                            <p className={`font-semibold text-sm ${deliveryStatusColor[result.delivery_status] ?? ''}`}>
                                {result.delivery_status.replace('_', ' ')}
                            </p></div>
                        {result.delivery_address && (
                            <div className="col-span-2">
                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Delivery Address</p>
                                <p className="text-gray-900">{result.delivery_address}</p>
                            </div>
                        )}
                        <div className="col-span-2"><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Items</p>
                            <div className="space-y-1">
                                {result.items?.map((it, i) => (
                                    <p key={i} className="text-xs text-gray-700">
                                        {it.product_name} × {it.quantity} — {RWF.format(it.item_total)}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-2"><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date</p>
                            <p className="text-gray-900 text-xs">{new Date(result.created_at).toLocaleString()}</p></div>
                    </div>
                </div>
            )}
        </div>
    );
};

type TabType = 'pending' | 'completed';

const AdminDeliveries = () => {
    const [tab, setTab] = useState<TabType>('pending');
    const [items, setItems] = useState<DeliveryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const loadDeliveries = async (t: TabType) => {
        setLoading(true); setError('');
        try {
            const ds = t === 'pending' ? 'PENDING_DELIVERY' : 'DELIVERED';
            const data = await paymentService.getPendingDeliveries(ds);
            setItems(data.deliveries || []);
        } catch (e: any) {
            setError(e?.response?.data?.detail || 'Failed to load deliveries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDeliveries(tab); }, [tab]);

    const handleUpdate = async (id: number, s: 'DELIVERED' | 'PICKED_UP') => {
        setUpdating(id);
        try {
            await paymentService.updateDeliveryStatus(id, s);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (e: any) {
            alert(e?.response?.data?.detail || 'Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const filtered = items.filter(i => {
        const q = search.toLowerCase();
        return !q || i.buyer_name?.toLowerCase().includes(q)
            || i.buyer_email?.toLowerCase().includes(q)
            || i.payer_phone?.includes(q)
            || i.invoice_number?.toLowerCase().includes(q)
            || i.delivery_address?.toLowerCase().includes(q);
    });

    const pendingCount = tab === 'pending' ? items.length : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Deliveries</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage order fulfillment and verify invoices</p>
                </div>
                <button onClick={() => loadDeliveries(tab)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: '#1d293d' }}>
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
                {(['pending', 'completed'] as TabType[]).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t === 'pending' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {t === 'pending' ? 'Pending' : 'Completed'}
                        {t === 'pending' && pendingCount > 0 && (
                            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email, phone, invoice or address…"
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
                    {tab === 'pending'
                        ? <><Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No pending deliveries</p></>
                        : <><CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No completed deliveries yet</p></>
                    }
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(item => (
                        <DeliveryCard key={item.id} item={item} onUpdate={handleUpdate} updating={updating} />
                    ))}
                    <p className="text-xs text-gray-400 text-center">
                        Showing {filtered.length} of {items.length}
                    </p>
                </div>
            )}

            {/* Invoice Verifier */}
            <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Receipt className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Invoice Verification</h2>
                </div>
                <InvoiceVerifier />
            </div>
        </div>
    );
};

export default AdminDeliveries;
