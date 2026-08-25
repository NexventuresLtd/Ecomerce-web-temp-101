import { useState, useEffect, type ReactNode } from 'react';
import {
    ShoppingBag,
    Search,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    AlertCircle,
    Clock,
    Package,
    Receipt,
    RefreshCw,
    TrendingUp,
    XCircle,
    FileText,
    Download,
} from 'lucide-react';
import { paymentService, type AdminOrder } from '../../../app/products/paymentService';
import { createReportDoc, addReportFooter, drawSummaryBand, REPORT_TABLE_THEME } from '../../../app/utils/pdfReport';

const RWF = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 });

type StatusFilter = 'ALL' | 'SUCCESSFUL' | 'PENDING' | 'FAILED';

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { icon: ReactNode; cls: string }> = {
        SUCCESSFUL: { icon: <CheckCircle className="w-3 h-3" />, cls: 'bg-green-50 text-green-700 border-green-200' },
        PENDING: { icon: <Clock className="w-3 h-3" />, cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        FAILED: { icon: <AlertCircle className="w-3 h-3" />, cls: 'bg-red-50 text-red-700 border-red-200' },
    };
    const cfg = map[status] ?? { icon: <Clock className="w-3 h-3" />, cls: 'bg-gray-50 text-gray-600 border-gray-200' };
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${cfg.cls}`}>
            {cfg.icon}
            {status}
        </span>
    );
};

const OrderRow = ({ order }: { order: AdminOrder }) => {
    const [expanded, setExpanded] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendMsg, setResendMsg] = useState<string | null>(null);

    const handleResend = async () => {
        setResending(true);
        setResendMsg(null);
        try {
            await paymentService.adminResendInvoice(order.id);
            setResendMsg('Sent');
            setTimeout(() => setResendMsg(null), 3000);
        } catch {
            setResendMsg('Failed');
            setTimeout(() => setResendMsg(null), 3000);
        } finally {
            setResending(false);
        }
    };

    return (
        <>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-[140px]" title={order.external_id}>{order.external_id}</span>
                    </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                    <div>
                        <p className="font-medium">{order.buyer_name || '—'}</p>
                        <p className="text-xs text-gray-500">{order.buyer_email}</p>
                    </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{order.payer_phone}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">{RWF.format(order.total_amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                        {/* Invoice view */}
                        {order.invoice_number && (
                            <a href={paymentService.getInvoiceViewUrl(order.invoice_number)}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 whitespace-nowrap">
                                <FileText className="w-3 h-3" />
                                Invoice
                            </a>
                        )}

                        {/* Resend — email + WhatsApp via backend */}
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className={`flex items-center gap-1 text-xs font-medium whitespace-nowrap transition-colors ${resendMsg === 'Sent' ? 'text-green-600' :
                                resendMsg === 'Failed' ? 'text-red-500' :
                                    'text-orange-600 hover:text-orange-800'
                                } disabled:opacity-50`}
                            title="Resend invoice email + WhatsApp to customer"
                        >
                            {resending
                                ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                : <Receipt className="w-3 h-3" />}
                            {resendMsg ?? 'Resend Invoice'}
                        </button>

                        {/* Items expand */}
                        <button onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800">
                            {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                    </div>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-3">
                        <div className="space-y-2">
                            {order.items?.map((item, idx) => {
                                const img = (item.images || []).find((i: any) => i.is_primary)?.url || item.images?.[0]?.url;
                                return (
                                    <div key={idx} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-3">
                                        {img ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}${img}`}
                                                alt={item.product_name}
                                                className="w-10 h-10 object-cover rounded flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                <Package className="w-4 h-4 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} &times; {RWF.format(item.price)}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 flex-shrink-0">{RWF.format(item.item_total)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

const AdminOrders = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total_items: 0, total_pages: 0, has_prev: false, has_next: false });
    const [summary, setSummary] = useState({
        total_orders: 0,
        total_revenue: 0,
        successful_orders: 0,
        pending_orders: 0,
        failed_orders: 0,
    });
    const [generatingReport, setGeneratingReport] = useState(false);

    const loadOrders = async (nextPage = page, nextStatus = statusFilter) => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentService.getAllOrders(nextPage, 10, nextStatus.toLowerCase());
            setOrders(data.orders || []);
            setSummary({
                total_orders: data.summary.total_orders || 0,
                total_revenue: data.summary.total_revenue || 0,
                successful_orders: data.summary.successful_orders || 0,
                pending_orders: data.summary.pending_orders || 0,
                failed_orders: data.summary.failed_orders || 0,
            });
            setPagination(data.pagination || { page: 1, limit: 10, total_items: 0, total_pages: 0, has_prev: false, has_next: false });
            setPage(data.pagination?.page || nextPage);
        } catch (e: any) {
            setError(e?.response?.data?.detail || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadOrders(1, statusFilter); }, []);

    const generatePDFReport = async () => {
        setGeneratingReport(true);
        try {
            // Pull every matching transaction (not just the current page) for the export.
            const data = await paymentService.getAllOrders(1, 1000, statusFilter.toLowerCase());
            const reportOrders = data.orders || [];

            const subtitle = statusFilter !== 'ALL' ? `Filter: ${statusFilter}` : undefined;
            const doc = await createReportDoc('TRANSACTIONS REPORT', subtitle);
            const pageWidth = doc.internal.pageSize.getWidth();

            const reportSummary = data.summary || summary;
            let yPosition = drawSummaryBand(doc, 48, [
                { label: 'Total Orders', value: (reportSummary.total_orders ?? 0).toString() },
                { label: 'Revenue', value: RWF.format(reportSummary.total_revenue ?? 0) },
                { label: 'Successful', value: (reportSummary.successful_orders ?? 0).toString() },
                { label: 'Pending', value: (reportSummary.pending_orders ?? 0).toString() },
                { label: 'Failed', value: (reportSummary.failed_orders ?? 0).toString() },
            ]);

            if (reportOrders.length > 0) {
                const tableData = reportOrders.map((o) => [
                    o.external_id,
                    o.buyer_name || '—',
                    o.buyer_email || '—',
                    o.payer_phone || 'N/A',
                    RWF.format(o.total_amount),
                    o.status,
                    new Date(o.created_at).toLocaleDateString(),
                ]);

                doc.autoTable({
                    ...REPORT_TABLE_THEME,
                    startY: yPosition,
                    head: [['Order ID', 'Buyer', 'Email', 'Phone', 'Amount', 'Status', 'Date']],
                    body: tableData,
                    margin: { left: 14, right: 14 },
                });
            } else {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'italic');
                doc.text('No transactions found for the selected filter.', pageWidth / 2, yPosition + 10, { align: 'center' });
            }

            addReportFooter(doc);
            doc.save(`transactions-report-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (e) {
            console.error('Error generating transactions report:', e);
            alert('Failed to generate PDF report. Please try again.');
        } finally {
            setGeneratingReport(false);
        }
    };

    const filtered = orders.filter(o => {
        const q = search.toLowerCase();
        const matchSearch = !q
            || o.external_id.toLowerCase().includes(q)
            || o.buyer_name?.toLowerCase().includes(q)
            || o.buyer_email?.toLowerCase().includes(q)
            || o.payer_phone?.includes(q);
        return matchSearch;
    });

    const filterButtons: Array<{ label: string; value: StatusFilter }> = [
        { label: 'All', value: 'ALL' },
        { label: 'Successful', value: 'SUCCESSFUL' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Failed', value: 'FAILED' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-sm text-gray-500 mt-1">All customer purchases via MTN Mobile Money</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={generatePDFReport}
                        disabled={generatingReport}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {generatingReport ? 'Generating...' : 'Export Report'}
                    </button>
                    <button
                        onClick={() => loadOrders(page, statusFilter)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{summary.total_orders}</p>
                </div>
                <div className="bg-white border border-green-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Revenue</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">{RWF.format(summary.total_revenue)}</p>
                </div>
                <div className="bg-white border border-green-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Successful</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{summary.successful_orders}</p>
                </div>
                <div className="bg-white border border-yellow-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{summary.pending_orders}</p>
                </div>
                <div className="bg-white border border-red-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Failed</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{summary.failed_orders}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone or order ID…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
                    {filterButtons.map(s => (
                        <button
                            key={s.label}
                            onClick={() => {
                                setStatusFilter(s.value);
                                setPage(1);
                                loadOrders(1, s.value);
                            }}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${statusFilter === s.value ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">{error}</p>
                        <button onClick={() => loadOrders()} className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700">Retry</button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">{search || statusFilter !== 'ALL' ? 'No orders match your filters.' : 'No orders yet.'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Order ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Buyer</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Invoice / Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => (
                                    <OrderRow key={order.id} order={order} />
                                ))}
                            </tbody>
                        </table>
                        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
                            Showing page {pagination.page} of {pagination.total_pages || 1} · {pagination.total_items} matching orders
                        </div>
                        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
                            <button
                                onClick={() => {
                                    const nextPage = Math.max(1, page - 1);
                                    setPage(nextPage);
                                    loadOrders(nextPage, statusFilter);
                                }}
                                disabled={!pagination.has_prev || loading}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => {
                                    const nextPage = page + 1;
                                    setPage(nextPage);
                                    loadOrders(nextPage, statusFilter);
                                }}
                                disabled={!pagination.has_next || loading}
                                className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
