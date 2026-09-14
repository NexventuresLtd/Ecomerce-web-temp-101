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
      const pdf = new BrandPdf('Business Report', `Sales & operations · ${periodLabel()}`, logo);
      const t = salesData.totals;
      const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

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

      // ── 2. Daily trend ──
      if (salesData.daily.length) {
        pdf.section('Daily revenue');
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
        { align: ['left', 'left', 'left', 'right', 'right', 'left', 'left'], widths: [52, 22, undefined, 12, 26, 14, 18], fontSize: 7.4 },
      );

      // ── 6. Operations ──
      pdf.newPage();
      pdf.section('Platform overview');
      const sm = reportData.summary;
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

      if (reportData.users.length) {
        pdf.section('Users');
        pdf.table(
          ['Name', 'Email', 'Phone', 'Status', 'Verified', 'Joined'],
          reportData.users.map(u => [
            `${u.first_name} ${u.last_name}`.trim() || '—', u.email || '—', u.phone || '—',
            u.is_active ? 'Active' : 'Inactive', u.is_verified ? 'Yes' : 'No', fmtDate(u.created_at),
          ]),
          { widths: [38, undefined, 30, 18, 16, 24] },
        );
      }

      if (reportData.products.length) {
        pdf.section('Products');
        pdf.table(
          ['Product', 'Price', 'Stock', 'Status', 'Featured', 'In carts'],
          reportData.products.map(p => [
            p.name, RWF.format(p.price), p.stock_quantity, p.is_active ? 'Active' : 'Inactive',
            p.is_featured ? 'Yes' : 'No', p.cart_appearances,
          ]),
          { align: ['left', 'right', 'right', 'left', 'left', 'right'], widths: [undefined, 30, 16, 18, 18, 18] },
        );
      }

      if (reportData.carts.length) {
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

      pdf.finish().save(`umukamezi-report-${new Date().toISOString().slice(0, 10)}.pdf`);
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
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading comprehensive report...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Business Report</h2>
          <p className="text-gray-600 mt-1">
            Sales &amp; operations{salesData ? ` · ${periodLabel()}` : ''}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              showFilters 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>

          {/* Orders CSV */}
          <button
            onClick={downloadOrdersCsv}
            disabled={!salesData}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Order ledger as CSV"
          >
            <Sheet className="w-4 h-4 mr-2" />
            Orders CSV
          </button>

          {/* Download PDF */}
          <button
            onClick={generatePDFReport}
            disabled={!reportData || !salesData || generatingPDF}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
          </button>

          <button
            onClick={fetchReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Date Filter Section */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Filter by Date Range</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={fetchReport}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filter
              </button>
            </div>
          </div>
          {(startDate || endDate) && (
            <div className="mt-3 text-sm text-gray-600">
              Showing data from {startDate || 'the beginning'} to {endDate || 'now'}
            </div>
          )}
        </div>
      )}

      {loadError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>
      )}

      {/* ── Sales ── */}
      {salesData && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Sales</h3>
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
              <div key={k.label} className={`rounded-lg border p-4 ${k.cls}`}>
                <p className="text-xs uppercase tracking-wide text-gray-500">{k.label}</p>
                <p className="text-xl font-bold mt-1">{k.value}</p>
                {k.sub && <p className="text-xs text-gray-500 mt-0.5">{k.sub}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">Top products</div>
              {salesData.top_products.length === 0 ? (
                <p className="p-4 text-sm text-gray-400">No successful sales in this period</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {salesData.top_products.slice(0, 8).map((p, i) => (
                      <tr key={`${p.product_id}-${i}`} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-2 text-gray-400 w-8">{i + 1}</td>
                        <td className="px-2 py-2 text-gray-800 truncate max-w-[220px]" title={p.name}>{p.name}</td>
                        <td className="px-2 py-2 text-right text-gray-500 whitespace-nowrap">{p.quantity} sold</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">{RWF.format(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">Recent orders</div>
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
                        <td className="px-4 py-2 text-right">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                            o.status === 'SUCCESSFUL' ? 'bg-green-50 text-green-700 border-green-200'
                            : o.status === 'FAILED' ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                            {o.status === 'SUCCESSFUL' ? 'Paid' : o.status === 'FAILED' ? 'Failed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {reportData && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(reportData.summary.total_users)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Total Products</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(reportData.summary.total_products)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center">
                <ShoppingCart className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-900">Total Carts</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(reportData.summary.total_carts)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-900">Total Billings</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatNumber(reportData.summary.total_billings)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-indigo-900">Wishlists</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {formatNumber(reportData.summary.total_wishlists)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
              <div className="flex items-center">
                <Layers className="w-6 h-6 text-pink-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-pink-900">Categories</p>
                  <p className="text-xl font-bold text-pink-600">
                    {formatNumber(reportData.summary.total_main_categories + reportData.summary.total_sub_categories + reportData.summary.total_product_categories)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-teal-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-teal-900">Login Records</p>
                  <p className="text-xl font-bold text-teal-600">
                    {formatNumber(reportData.summary.total_login_records)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {/* Users Section */}
            <div className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Users ({reportData.users.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Carts</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Billings</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.users.slice(0, 5).map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{user.cart_count}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{user.billing_count}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Carts Section */}
            <div className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-purple-600" />
                  Carts ({reportData.carts.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cart ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.carts.slice(0, 5).map((cart) => (
                      <tr key={cart.id}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">#{cart.id}</td>
                        <td className="px-4 py-2">
                          <div>
                            <p className="font-medium text-gray-900">{cart.user_name}</p>
                            <p className="text-sm text-gray-600">{cart.user_email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{cart.total_items}</td>
                        <td className="px-4 py-2 text-sm font-semibold text-green-600">
                          ${cart.total_value.toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            cart.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {cart.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Products Section */}
            <div className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Products ({reportData.products.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cart Appearances</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.products.slice(0, 5).map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-2">
                          <p className="font-medium text-gray-900">{product.name}</p>
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{product.stock_quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{product.cart_appearances}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            product.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Billings Section */}
            {reportData.billings.length > 0 && (
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                    Billings ({reportData.billings.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Billing ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.billings.slice(0, 5).map((billing) => (
                        <tr key={billing.id}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">#{billing.id}</td>
                          <td className="px-4 py-2">
                            <div>
                              <p className="font-medium text-gray-900">{billing.user_name}</p>
                              <p className="text-sm text-gray-600">{billing.user_email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm font-semibold text-green-600">
                            ${billing.total_amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              billing.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : billing.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {billing.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 capitalize">
                            {billing.payment_method}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Report Metadata */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Report generated on {formatDate(reportData.summary.report_generated_at)}
              {reportData.summary.date_range.start_date && (
                <span> • Date range: {reportData.summary.date_range.start_date} to {reportData.summary.date_range.end_date}</span>
              )}
            </p>
          </div>
        </>
      )}

      {!reportData && !loading && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No report data available.</p>
          <button
            onClick={fetchReport}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate Report
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardReport;