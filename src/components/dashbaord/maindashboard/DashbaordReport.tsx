import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Filter, 
  RefreshCw, 
  Users, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Heart,
  BarChart3,
  FileText,
  Layers
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';
import { BrandPdf, loadLogo, downloadCsv, RWF } from '../../../app/reports/brandPdf';
import { getAdminErrorMessage } from '../../../app/utils/getAdminErrorMessage';
import { TrendingUp, Sheet } from 'lucide-react';

interface SalesReport {
  period: { start: string; end: string };
  generated_at: string;
  currency: string;
  totals: {
    orders: number; successful: number; pending: number; failed: number;
    revenue: number; items_sold: number; avg_order_value: number; success_rate: number;
  };
  daily: Array<{ date: string; orders: number; successful: number; revenue: number }>;
  by_delivery_type: Record<string, { orders: number; revenue: number }>;
  top_products: Array<{ product_id: number | null; name: string; quantity: number; revenue: number; orders: number }>;
  top_customers: Array<{ user_id: number; name: string; phone: string; orders: number; revenue: number }>;
  orders: Array<{
    id: number; invoice_number: string | null; external_id: string; date: string | null;
    customer: string; phone: string; amount: number; currency: string; status: string;
    delivery_type: string; delivery_status: string; items: number;
  }>;
  orders_truncated: boolean;
}

interface ReportData {
  summary: {
    total_users: number;
    total_products: number;
    total_carts: number;
    total_wishlists: number;
    total_billings: number;
    total_main_categories: number;
    total_sub_categories: number;
    total_product_categories: number;
    total_login_records: number;
    report_generated_at: string;
    date_range: {
      start_date: string | null;
      end_date: string | null;
    };
  };
  users: Array<{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    last_login: string;
    cart_count: number;
    wishlist_count: number;
    billing_count: number;
  }>;
  products: Array<{
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
    is_featured: boolean;
    category_id: number;
    created_at: string;
    cart_appearances: number;
  }>;
  carts: Array<{
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    is_active: boolean;
    total_items: number;
    total_value: number;
    created_at: string;
    items_count: number;
    items: Array<{
      product_id: number;
      product_name: string;
      quantity: number;
      price_at_time: number;
      total_item_price: number;
    }>;
  }>;
  wishlists: Array<{
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    product_id: number;
    is_active: boolean;
    created_at: string;
  }>;
  billings: Array<{
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    total_amount: number;
    status: string;
    payment_method: string;
    created_at: string;
  }>;
  categories: {
    main_categories: Array<{
      id: number;
      name: string;
      description: string;
      is_active: boolean;
      sub_categories_count: number;
    }>;
    sub_categories: Array<{
      id: number;
      name: string;
      description: string;
      main_category_id: number;
      is_active: boolean;
      product_categories_count: number;
    }>;
    product_categories: Array<{
      id: number;
      name: string;
      description: string;
      sub_category_id: number;
      is_active: boolean;
      products_count: number;
    }>;
  };
  login_logs: Array<{
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    ip_address: string;
    device_info: string;
    login_time: string;
    device_active: boolean;
  }>;
}

const DashboardReport: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [salesData, setSalesData] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Which slice of the business the report covers. Drives the on-screen
  // sections, the PDF contents/title, and what the CSV button exports.
  type ReportType = 'full' | 'financial' | 'users' | 'products' | 'operations';
  const REPORT_TYPES: { id: ReportType; label: string; title: string; blurb: string }[] = [
    { id: 'full',       label: 'Full report',  title: 'Business Report',   blurb: 'Sales & operations' },
    { id: 'financial',  label: 'Financial',    title: 'Financial Report',  blurb: 'Revenue, orders & top products' },
    { id: 'users',      label: 'Users',        title: 'Users Report',      blurb: 'Accounts, activity & top customers' },
    { id: 'products',   label: 'Products',     title: 'Products Report',   blurb: 'Catalogue, stock & best sellers' },
    { id: 'operations', label: 'Operations',   title: 'Operations Report', blurb: 'Carts, wishlists & categories' },
  ];
  const [reportType, setReportType] = useState<ReportType>('full');
  const rt = REPORT_TYPES.find(r => r.id === reportType)!;
  const show = {
    sales:    reportType === 'full' || reportType === 'financial',
    overview: reportType === 'full' || reportType === 'operations',
    users:    reportType === 'full' || reportType === 'users',
    products: reportType === 'full' || reportType === 'products',
    carts:    reportType === 'full' || reportType === 'operations',
    orders:   reportType === 'full' || reportType === 'financial',
  };
  
  // Date filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      // Sales (money) and operations (users/products/carts) come from two
      // endpoints; both are super-admin-only.
      const [ops, sales] = await Promise.all([
        mainAxios.get(`/dashboard/comprehensive-report?${params}`),
        mainAxios.get(`/dashboard/sales-report?${params}`),
      ]);
      setReportData(ops.data);
      setSalesData(sales.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setLoadError(getAdminErrorMessage(error, 'Failed to fetch report data'));
    } finally {
      setLoading(false);
    }
  };

  const periodLabel = () => {
    if (!salesData) return '';
    const f = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${f(salesData.period.start)} – ${f(salesData.period.end)}`;
  };

  const csvLabel = { full: 'Orders CSV', financial: 'Orders CSV', users: 'Users CSV', products: 'Products CSV', operations: 'Carts CSV' }[reportType];
  const downloadCsvForType = () => {
    const day = new Date().toISOString().slice(0, 10);
    if (reportType === 'users' && reportData) {
      return downloadCsv(`umukamezi-users-${day}.csv`,
        ['Name', 'Email', 'Phone', 'Status', 'Verified', 'Joined', 'Carts', 'Wishlists'],
        reportData.users.map(u => [`${u.first_name} ${u.last_name}`.trim(), u.email, u.phone, u.is_active ? 'Active' : 'Inactive',
          u.is_verified ? 'Yes' : 'No', u.created_at ? new Date(u.created_at).toLocaleDateString() : '', u.cart_count, u.wishlist_count]));
    }
    if (reportType === 'products' && reportData) {
      return downloadCsv(`umukamezi-products-${day}.csv`,
        ['Product', 'Price (RWF)', 'Stock', 'Status', 'Featured', 'In carts'],
        reportData.products.map(p => [p.name, p.price, p.stock_quantity, p.is_active ? 'Active' : 'Inactive', p.is_featured ? 'Yes' : 'No', p.cart_appearances]));
    }
    if (reportType === 'operations' && reportData) {
      return downloadCsv(`umukamezi-carts-${day}.csv`,
        ['Customer', 'Email', 'Items', 'Value (RWF)', 'Status', 'Created'],
        reportData.carts.map(c => [c.user_name, c.user_email, c.total_items, c.total_value, c.is_active ? 'Active' : 'Closed', c.created_at ? new Date(c.created_at).toLocaleDateString() : '']));
    }
    return downloadOrdersCsv();
  };

  // Order ledger as CSV — the thing accountants actually ask for.
  const downloadOrdersCsv = () => {
    if (!salesData) return;
    downloadCsv(
      `umukamezi-orders-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Invoice', 'Date', 'Customer', 'Phone', 'Items', 'Amount (RWF)', 'Status', 'Fulfilment', 'Delivery status'],
      salesData.orders.map(o => [
        o.invoice_number || o.external_id, o.date ? new Date(o.date).toLocaleString() : '',
        o.customer, o.phone, o.items, o.amount, o.status, o.delivery_type, o.delivery_status,
      ]),
    );
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    fetchReport();
  };

  const generatePDFReport = async () => {
    if (!reportData || !salesData) return;
    setGeneratingPDF(true);
    try {
      const logo = await loadLogo();
      const pdf = new BrandPdf(rt.title, `${rt.blurb} · ${periodLabel()}`, logo);
      const t = salesData.totals;
      const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
      const sm = reportData.summary;

      if (show.sales) {
      // ── 1. Sales summary ──
      pdf.section('Sales summary');
      pdf.kpis([
        { label: 'Revenue', value: RWF.format(t.revenue), sub: 'successful payments only', tone: 'success' },
        { label: 'Successful orders', value: String(t.successful), sub: `${t.success_rate.toFixed(0)}% of ${t.orders} attempts`, tone: 'primary' },
        { label: 'Avg order value', value: RWF.format(t.avg_order_value), tone: 'secondary' },
        { label: 'Items sold', value: String(t.items_sold), tone: 'primary' },
        { label: 'Pending', value: String(t.pending), tone: 'warning' },
        { label: 'Failed', value: String(t.failed), sub: t.orders ? `${((t.failed / t.orders) * 100).toFixed(0)}% of attempts` : undefined, tone: 'accent' },
        { label: 'Home delivery', value: RWF.format(salesData.by_delivery_type.delivery?.revenue ?? 0), sub: `${salesData.by_delivery_type.delivery?.orders ?? 0} orders`, tone: 'secondary' },
        { label: 'Office pickup', value: RWF.format(salesData.by_delivery_type.pickup?.revenue ?? 0), sub: `${salesData.by_delivery_type.pickup?.orders ?? 0} orders`, tone: 'secondary' },
      ]);

      // Highlights — the sentences the owner actually reads.
      const top = salesData.top_products[0];
      const bestDay = salesData.daily.reduce<typeof salesData.daily[number] | null>((b, d) => (!b || d.revenue > b.revenue ? d : b), null);
      pdf.highlights([
        `Revenue of ${RWF.format(t.revenue)} from ${t.successful} paid order${t.successful === 1 ? '' : 's'} (${t.items_sold} items), average ${RWF.format(t.avg_order_value)} per order.`,
        `${t.orders} payment attempts: ${t.successful} paid, ${t.failed} failed, ${t.pending} pending — a ${t.success_rate.toFixed(0)}% success rate.`,
        ...(top ? [`Best seller: ${top.name} — ${top.quantity} sold for ${RWF.format(top.revenue)}.`] : []),
        ...(bestDay && bestDay.revenue > 0 ? [`Best day: ${fmtDate(bestDay.date)} with ${RWF.format(bestDay.revenue)}.`] : []),
      ]);

      // ── 2. Daily trend ──
      if (salesData.daily.length) {
        pdf.section('Daily revenue');
        if (salesData.daily.length >= 2) {
          pdf.bars(salesData.daily.map(d => ({ label: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), value: d.revenue })),
            { format: v => RWF.format(v).replace('RF', '').trim() });
        }
        pdf.table(
          ['Date', 'Attempts', 'Successful', 'Revenue'],
          salesData.daily.map(d => [fmtDate(d.date), d.orders, d.successful, RWF.format(d.revenue)]),
          { align: ['left', 'right', 'right', 'right'] },
        );
      }

      // ── 3. Top products ──
      if (salesData.top_products.length) {
        pdf.section('Top products');
        pdf.table(
          ['#', 'Product', 'Qty sold', 'Orders', 'Revenue'],
          salesData.top_products.map((p, i) => [i + 1, p.name, p.quantity, p.orders, RWF.format(p.revenue)]),
          { align: ['right', 'left', 'right', 'right', 'right'], widths: [8, undefined, 20, 18, 34] },
        );
      }

      // ── 4. Top customers ──
      if (salesData.top_customers.length) {
        pdf.section('Top customers');
        pdf.table(
          ['#', 'Customer', 'Phone', 'Orders', 'Revenue'],
          salesData.top_customers.map((c, i) => [i + 1, c.name, c.phone, c.orders, RWF.format(c.revenue)]),
          { align: ['right', 'left', 'left', 'right', 'right'], widths: [8, undefined, 34, 18, 34] },
        );
      }

      // ── 5. Order ledger ──
      pdf.section('Order ledger');
      if (salesData.orders_truncated) pdf.note('Showing the most recent 500 orders. Use the CSV export for the full ledger.');
      pdf.table(
        ['Invoice', 'Date', 'Customer', 'Items', 'Amount', 'Status', 'Fulfilment'],
        salesData.orders.map(o => [
          o.invoice_number || o.external_id, fmtDate(o.date), o.customer, o.items, RWF.format(o.amount),
          o.status === 'SUCCESSFUL' ? 'Paid' : o.status === 'FAILED' ? 'Failed' : 'Pending',
          o.delivery_type === 'delivery' ? 'Delivery' : 'Pickup',
        ]),
        { align: ['left', 'left', 'left', 'right', 'right', 'left', 'left'], widths: [52, 22, undefined, 12, 26, 14, 18], fontSize: 7.4,
          cellStyle: (col, v) => col === 5 ? (v === 'Paid' ? { textColor: [21, 128, 61], fontStyle: 'bold' } : v === 'Failed' ? { textColor: [185, 28, 28], fontStyle: 'bold' } : { textColor: [161, 98, 7] }) : null },
      );

      } // show.sales

      // ── 6. Operations ──
      if (show.overview) {
      if (show.sales) pdf.newPage();
      pdf.section('Platform overview');
      pdf.kpis([
        { label: 'Users', value: String(sm.total_users), tone: 'primary' },
        { label: 'Products', value: String(sm.total_products), tone: 'primary' },
        { label: 'Carts', value: String(sm.total_carts), tone: 'secondary' },
        { label: 'Wishlists', value: String(sm.total_wishlists), tone: 'secondary' },
        { label: 'Main categories', value: String(sm.total_main_categories), tone: 'primary' },
        { label: 'Sub categories', value: String(sm.total_sub_categories), tone: 'primary' },
        { label: 'Product categories', value: String(sm.total_product_categories), tone: 'primary' },
        { label: 'Login records', value: String(sm.total_login_records), tone: 'secondary' },
      ]);
      } // show.overview

      if (show.users) {
        pdf.section('Users');
        pdf.kpis([
          { label: 'Total users', value: String(sm.total_users), tone: 'primary' },
          { label: 'Active', value: String(reportData.users.filter(u => u.is_active).length), tone: 'success' },
          { label: 'Inactive', value: String(reportData.users.filter(u => !u.is_active).length), tone: 'accent' },
          { label: 'Verified', value: String(reportData.users.filter(u => u.is_verified).length), tone: 'secondary' },
        ]);
        // The financial section already lists top customers in the full report.
        if (!show.sales && salesData.top_customers.length) {
          pdf.section('Top customers');
          pdf.table(['#', 'Customer', 'Phone', 'Orders', 'Revenue'],
            salesData.top_customers.map((c, i) => [i + 1, c.name, c.phone, c.orders, RWF.format(c.revenue)]),
            { align: ['right', 'left', 'left', 'right', 'right'], widths: [8, undefined, 34, 18, 34] });
        }
      }
      if (show.users && reportData.users.length) {
        pdf.section('All users');
        pdf.table(
          ['Name', 'Email', 'Phone', 'Status', 'Verified', 'Joined'],
          reportData.users.map(u => [
            `${u.first_name} ${u.last_name}`.trim() || '—', u.email || '—', u.phone || '—',
            u.is_active ? 'Active' : 'Inactive', u.is_verified ? 'Yes' : 'No', fmtDate(u.created_at),
          ]),
          { widths: [38, undefined, 30, 18, 16, 24] },
        );
      }

      if (show.products) {
        pdf.section('Products');
        pdf.kpis([
          { label: 'Products', value: String(sm.total_products), tone: 'primary' },
          { label: 'Active', value: String(reportData.products.filter(p => p.is_active).length), tone: 'success' },
          { label: 'Out of stock', value: String(reportData.products.filter(p => p.stock_quantity <= 0).length), tone: 'accent' },
          { label: 'Featured', value: String(reportData.products.filter(p => p.is_featured).length), tone: 'secondary' },
        ]);
        if (!show.sales && salesData.top_products.length) {
          pdf.section('Best sellers');
          pdf.table(['#', 'Product', 'Qty sold', 'Orders', 'Revenue'],
            salesData.top_products.map((p, i) => [i + 1, p.name, p.quantity, p.orders, RWF.format(p.revenue)]),
            { align: ['right', 'left', 'right', 'right', 'right'], widths: [8, undefined, 20, 18, 34] });
        }
      }
      if (show.products && reportData.products.length) {
        pdf.section('Catalogue');
        pdf.table(
          ['Product', 'Price', 'Stock', 'Status', 'Featured', 'In carts'],
          reportData.products.map(p => [
            p.name, RWF.format(p.price), p.stock_quantity, p.is_active ? 'Active' : 'Inactive',
            p.is_featured ? 'Yes' : 'No', p.cart_appearances,
          ]),
          { align: ['left', 'right', 'right', 'left', 'left', 'right'], widths: [undefined, 30, 16, 18, 18, 18] },
        );
      }

      if (show.carts && reportData.carts.length) {
        pdf.section('Active carts');
        pdf.table(
          ['Customer', 'Email', 'Items', 'Value', 'Status', 'Created'],
          reportData.carts.map(c => [
            c.user_name, c.user_email, c.total_items, RWF.format(c.total_value),
            c.is_active ? 'Active' : 'Closed', fmtDate(c.created_at),
          ]),
          { align: ['left', 'left', 'right', 'right', 'left', 'left'], widths: [40, undefined, 14, 30, 18, 24] },
        );
      }

      pdf.finish().save(`umukamezi-${reportType}-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setLoadError('Failed to generate PDF report');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n ?? 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading report…</span>
      </div>
    );
  }

  const fmtDate = (d?: string | null) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const StatusPill = ({ status }: { status: string }) => {
    const m: Record<string, string> = {
      SUCCESSFUL: 'bg-green-50 text-green-700 border-green-200',
      FAILED: 'bg-red-50 text-third border-red-200',
      PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    };
    const label = status === 'SUCCESSFUL' ? 'Paid' : status === 'FAILED' ? 'Failed' : 'Pending';
    return <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border ${m[status] ?? m.PENDING}`}>{label}</span>;
  };
  const Section = ({ title, icon: Icon, count, children }: { title: string; icon: any; count?: number; children: React.ReactNode }) => (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <span className="w-1 h-5 rounded bg-secondary" />
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">{title}</h3>
        {typeof count === 'number' && <span className="ml-auto text-xs text-gray-500">{formatNumber(count)} total · showing first {Math.min(count, 8)}</span>}
      </div>
      {children}
    </div>
  );
  const Th = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
    <th className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide ${right ? 'text-right' : 'text-left'}`}>{children}</th>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <img src="/Umukamezilogo.jpg" alt="Umukamezi" className="h-11 w-11 rounded-lg object-cover border border-gray-200" />
          <div>
            <h2 className="text-2xl font-semibold text-primary">{rt.title}</h2>
            <p className="text-gray-500 text-sm">
              {rt.blurb}{salesData ? ` · ${periodLabel()}` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button
            onClick={fetchReport}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={downloadCsvForType}
            disabled={!salesData || !reportData}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium border border-primary text-primary hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Export this report's data as CSV"
          >
            <Sheet className="w-4 h-4 mr-2" />
            {csvLabel}
          </button>
          <button
            onClick={generatePDFReport}
            disabled={!reportData || !salesData || generatingPDF}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {generatingPDF ? 'Generating PDF…' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Report type */}
      <div className="flex flex-wrap gap-2 mb-6">
        {REPORT_TYPES.map(r => (
          <button key={r.id} onClick={() => setReportType(r.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              reportType === r.id ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Date Filter */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Filter by date range</h3>
            <button onClick={clearFilters} className="text-sm text-primary hover:underline">Clear</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <button onClick={fetchReport}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light transition-colors font-medium">
              Apply
            </button>
          </div>
          {(startDate || endDate) && (
            <p className="mt-3 text-sm text-gray-600">Showing data from {startDate || 'the beginning'} to {endDate || 'now'}</p>
          )}
        </div>
      )}

      {loadError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-third">{loadError}</div>
      )}

      {/* ── Sales ── */}
      {show.sales && salesData && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-5 rounded bg-secondary" />
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Sales</h3>
            <span className="text-xs text-gray-400">· revenue counts successful payments only</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Revenue', value: RWF.format(salesData.totals.revenue), cls: 'text-green-700 border-green-200 bg-green-50' },
              { label: 'Successful orders', value: `${salesData.totals.successful}`, sub: `${salesData.totals.success_rate.toFixed(0)}% of ${salesData.totals.orders} attempts`, cls: 'text-primary border-gray-200 bg-white' },
              { label: 'Avg order value', value: RWF.format(salesData.totals.avg_order_value), cls: 'text-secondary border-blue-200 bg-blue-50' },
              { label: 'Items sold', value: `${salesData.totals.items_sold}`, cls: 'text-primary border-gray-200 bg-white' },
              { label: 'Pending', value: `${salesData.totals.pending}`, cls: 'text-yellow-700 border-yellow-200 bg-yellow-50' },
              { label: 'Failed', value: `${salesData.totals.failed}`, cls: 'text-third border-red-200 bg-red-50' },
              { label: 'Home delivery', value: RWF.format(salesData.by_delivery_type.delivery?.revenue ?? 0), sub: `${salesData.by_delivery_type.delivery?.orders ?? 0} orders`, cls: 'text-primary border-gray-200 bg-white' },
              { label: 'Office pickup', value: RWF.format(salesData.by_delivery_type.pickup?.revenue ?? 0), sub: `${salesData.by_delivery_type.pickup?.orders ?? 0} orders`, cls: 'text-primary border-gray-200 bg-white' },
            ].map(k => (
              <div key={k.label} className={`rounded-xl border p-4 ${k.cls}`}>
                <p className="text-xs uppercase tracking-wide text-gray-500">{k.label}</p>
                <p className="text-xl font-bold mt-1">{k.value}</p>
                {k.sub && <p className="text-xs text-gray-500 mt-0.5">{k.sub}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Section title="Top products" icon={Package}>
              {salesData.top_products.length === 0 ? (
                <p className="p-4 text-sm text-gray-400">No successful sales in this period</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {salesData.top_products.slice(0, 8).map((pr, i) => (
                      <tr key={`${pr.product_id}-${i}`} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-2 text-gray-400 w-8">{i + 1}</td>
                        <td className="px-2 py-2 text-gray-800 truncate max-w-[220px]" title={pr.name}>{pr.name}</td>
                        <td className="px-2 py-2 text-right text-gray-500 whitespace-nowrap">{pr.quantity} sold</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">{RWF.format(pr.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Section>
            <Section title="Recent orders" icon={FileText}>
              {salesData.orders.length === 0 ? (
                <p className="p-4 text-sm text-gray-400">No orders in this period</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {salesData.orders.slice(0, 8).map(o => (
                      <tr key={o.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-2 font-mono text-xs text-gray-600 truncate max-w-[150px]" title={o.invoice_number || o.external_id}>{o.invoice_number || o.external_id}</td>
                        <td className="px-2 py-2 text-gray-800 truncate max-w-[120px]">{o.customer}</td>
                        <td className="px-2 py-2 text-right font-semibold whitespace-nowrap">{RWF.format(o.amount)}</td>
                        <td className="px-4 py-2 text-right"><StatusPill status={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Section>
          </div>
        </div>
      )}

      {/* ── Platform overview ── */}
      {reportData && (
        <div className="space-y-6">
          {show.overview && <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded bg-secondary" />
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Platform overview</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Users', value: reportData.summary.total_users, icon: Users },
                { label: 'Products', value: reportData.summary.total_products, icon: Package },
                { label: 'Carts', value: reportData.summary.total_carts, icon: ShoppingCart },
                { label: 'Wishlists', value: reportData.summary.total_wishlists, icon: Heart },
                { label: 'Main categories', value: reportData.summary.total_main_categories, icon: Layers },
                { label: 'Sub categories', value: reportData.summary.total_sub_categories, icon: Layers },
                { label: 'Product categories', value: reportData.summary.total_product_categories, icon: Layers },
                { label: 'Login records', value: reportData.summary.total_login_records, icon: CreditCard },
              ].map(k => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200"><Icon className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">{k.label}</p>
                      <p className="text-xl font-bold text-primary">{formatNumber(k.value)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* Users-only extras: top customers */}
          {reportType === 'users' && salesData && salesData.top_customers.length > 0 && (
            <Section title="Top customers" icon={Users}>
              <table className="w-full text-sm"><tbody>
                {salesData.top_customers.map((c, i) => (
                  <tr key={c.user_id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2 text-gray-400 w-8">{i + 1}</td>
                    <td className="px-2 py-2 text-gray-800">{c.name}<span className="text-xs text-gray-400 ml-2">{c.phone}</span></td>
                    <td className="px-2 py-2 text-right text-gray-500 whitespace-nowrap">{c.orders} orders</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">{RWF.format(c.revenue)}</td>
                  </tr>
                ))}
              </tbody></table>
            </Section>
          )}
          {/* Products-only extras: best sellers */}
          {reportType === 'products' && salesData && salesData.top_products.length > 0 && (
            <Section title="Best sellers" icon={Package}>
              <table className="w-full text-sm"><tbody>
                {salesData.top_products.map((pr, i) => (
                  <tr key={`${pr.product_id}-${i}`} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2 text-gray-400 w-8">{i + 1}</td>
                    <td className="px-2 py-2 text-gray-800 truncate max-w-[320px]" title={pr.name}>{pr.name}</td>
                    <td className="px-2 py-2 text-right text-gray-500 whitespace-nowrap">{pr.quantity} sold</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">{RWF.format(pr.revenue)}</td>
                  </tr>
                ))}
              </tbody></table>
            </Section>
          )}

          <div className={`grid grid-cols-1 gap-4 ${[show.users, show.products, show.carts, show.orders && !!salesData].filter(Boolean).length > 1 ? 'xl:grid-cols-2' : ''}`}>
            {show.users && <Section title="Users" icon={Users} count={reportData.users.length}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><Th>User</Th><Th>Status</Th><Th right>Carts</Th><Th right>Joined</Th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.users.slice(0, 8).map(u => (
                      <tr key={u.id}>
                        <td className="px-4 py-2">
                          <p className="font-medium text-gray-900">{`${u.first_name} ${u.last_name}`.trim() || '—'}</p>
                          <p className="text-xs text-gray-500">{u.email || u.phone || '—'}</p>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border ${u.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-third border-red-200'}`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">{u.cart_count}</td>
                        <td className="px-4 py-2 text-right text-gray-500 whitespace-nowrap">{fmtDate(u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>}

            {show.products && <Section title="Products" icon={Package} count={reportData.products.length}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><Th>Product</Th><Th right>Price</Th><Th right>Stock</Th><Th right>In carts</Th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.products.slice(0, 8).map(pr => (
                      <tr key={pr.id}>
                        <td className="px-4 py-2">
                          <p className="font-medium text-gray-900 truncate max-w-[240px]" title={pr.name}>{pr.name}</p>
                          <p className="text-xs text-gray-500">{pr.is_active ? 'Active' : 'Inactive'}{pr.is_featured ? ' · Featured' : ''}</p>
                        </td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">{RWF.format(pr.price)}</td>
                        <td className={`px-4 py-2 text-right ${pr.stock_quantity > 0 ? 'text-gray-700' : 'text-third font-semibold'}`}>{pr.stock_quantity}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{pr.cart_appearances}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>}

            {show.carts && <Section title="Carts" icon={ShoppingCart} count={reportData.carts.length}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><Th>Customer</Th><Th right>Items</Th><Th right>Value</Th><Th right>Created</Th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.carts.slice(0, 8).map(ct => (
                      <tr key={ct.id}>
                        <td className="px-4 py-2">
                          <p className="font-medium text-gray-900">{ct.user_name}</p>
                          <p className="text-xs text-gray-500">{ct.user_email}</p>
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">{ct.total_items}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">{RWF.format(ct.total_value)}</td>
                        <td className="px-4 py-2 text-right text-gray-500 whitespace-nowrap">{fmtDate(ct.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>}

            {show.orders && salesData && (
              <Section title="All orders in period" icon={FileText} count={salesData.orders.length}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50"><tr><Th>Invoice</Th><Th>Customer</Th><Th right>Amount</Th><Th right>Status</Th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {salesData.orders.slice(0, 8).map(o => (
                        <tr key={o.id}>
                          <td className="px-4 py-2">
                            <p className="font-mono text-xs text-gray-700 truncate max-w-[180px]" title={o.invoice_number || o.external_id}>{o.invoice_number || o.external_id}</p>
                            <p className="text-xs text-gray-500">{fmtDate(o.date)} · {o.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-800 truncate max-w-[140px]">{o.customer}</td>
                          <td className="px-4 py-2 text-right font-semibold whitespace-nowrap">{RWF.format(o.amount)}</td>
                          <td className="px-4 py-2 text-right"><StatusPill status={o.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}
          </div>

          {/* Metadata */}
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            Generated {formatDate(reportData.summary.report_generated_at)}
            {reportData.summary.date_range.start_date || reportData.summary.date_range.end_date
              ? ` · ${fmtDate(reportData.summary.date_range.start_date) } – ${fmtDate(reportData.summary.date_range.end_date)}`
              : ' · all time'} · The PDF contains the full tables.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardReport;