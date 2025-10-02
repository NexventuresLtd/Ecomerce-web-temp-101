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
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
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
  const [loading, setLoading] = useState(false);
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
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await mainAxios.get(`/dashboard/comprehensive-report?${params}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    fetchReport();
  };

  const generatePDFReport = async () => {
    if (!reportData) return;

    setGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Report Header
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPREHENSIVE DASHBOARD REPORT', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 32, { align: 'center' });

      let yPosition = 60;

      // Summary Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('EXECUTIVE SUMMARY', 20, yPosition);

      yPosition += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const summaryData = [
        ['Total Users', reportData.summary.total_users.toString()],
        ['Total Products', reportData.summary.total_products.toString()],
        ['Total Carts', reportData.summary.total_carts.toString()],
        ['Total Wishlists', reportData.summary.total_wishlists.toString()],
        ['Total Billings', reportData.summary.total_billings.toString()],
        ['Main Categories', reportData.summary.total_main_categories.toString()],
        ['Sub Categories', reportData.summary.total_sub_categories.toString()],
        ['Product Categories', reportData.summary.total_product_categories.toString()],
      ];

      doc.autoTable({
        startY: yPosition,
        head: [['Metric', 'Count']],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        margin: { left: 20, right: 20 }
      });

      yPosition = doc.lastAutoTable?.finalY || yPosition + 50;

      // Users Section
      if (reportData.users.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('USERS REPORT', 20, yPosition + 10);

        const userData = reportData.users.slice(0, 15).map(user => [
          user.id.toString(),
          `${user.first_name} ${user.last_name}`,
          user.email,
          user.is_active ? 'Active' : 'Inactive',
          user.is_verified ? 'Verified' : 'Not Verified',
          user.cart_count.toString(),
          user.billing_count.toString()
        ]);

        doc.autoTable({
          startY: yPosition + 15,
          head: [['ID', 'Name', 'Email', 'Status', 'Verified', 'Carts', 'Billings']],
          body: userData,
          theme: 'grid',
          styles: { fontSize: 7 },
          headStyles: {
            fillColor: [107, 114, 128],
            textColor: 255
          },
          margin: { left: 20, right: 20 }
        });

        yPosition = doc.lastAutoTable?.finalY || yPosition + 100;
      }

      // Products Section
      if (reportData.products.length > 0) {
        doc.addPage();
        yPosition = 20;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PRODUCTS REPORT', 20, yPosition);

        const productData = reportData.products.slice(0, 15).map(product => [
          product.id.toString(),
          product.name.substring(0, 30),
          `$${product.price.toFixed(2)}`,
          product.stock_quantity.toString(),
          product.is_active ? 'Active' : 'Inactive',
          product.cart_appearances.toString()
        ]);

        doc.autoTable({
          startY: yPosition + 10,
          head: [['ID', 'Name', 'Price', 'Stock', 'Status', 'Cart Appearances']],
          body: productData,
          theme: 'grid',
          styles: { fontSize: 7 },
          headStyles: {
            fillColor: [16, 185, 129],
            textColor: 255
          },
          margin: { left: 20, right: 20 }
        });

        yPosition = doc.lastAutoTable?.finalY || yPosition + 100;
      }

      // Carts Section
      if (reportData.carts.length > 0) {
        doc.addPage();
        yPosition = 20;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CARTS REPORT', 20, yPosition);

        const cartData = reportData.carts.slice(0, 15).map(cart => [
          cart.id.toString(),
          cart.user_name,
          cart.user_email,
          cart.total_items.toString(),
          `$${cart.total_value.toFixed(2)}`,
          cart.is_active ? 'Active' : 'Inactive',
          new Date(cart.created_at).toLocaleDateString()
        ]);

        doc.autoTable({
          startY: yPosition + 10,
          head: [['Cart ID', 'User', 'Email', 'Items', 'Total Value', 'Status', 'Created']],
          body: cartData,
          theme: 'grid',
          styles: { fontSize: 7 },
          headStyles: {
            fillColor: [139, 92, 246],
            textColor: 255
          },
          margin: { left: 20, right: 20 }
        });
      }

      // Billings Section
      if (reportData.billings.length > 0) {
        doc.addPage();
        yPosition = 20;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('BILLINGS REPORT', 20, yPosition);

        const billingData = reportData.billings.slice(0, 15).map(billing => [
          billing.id.toString(),
          billing.user_name,
          billing.user_email,
          `$${billing.total_amount.toFixed(2)}`,
          billing.status,
          billing.payment_method,
          new Date(billing.created_at).toLocaleDateString()
        ]);

        doc.autoTable({
          startY: yPosition + 10,
          head: [['Billing ID', 'Customer', 'Email', 'Amount', 'Status', 'Payment Method', 'Created']],
          body: billingData,
          theme: 'grid',
          styles: { fontSize: 7 },
          headStyles: {
            fillColor: [234, 88, 12],
            textColor: 255
          },
          margin: { left: 20, right: 20 }
        });
      }

      // Add footer to all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10);
        doc.text(`Dashboard Report - Confidential`, 20, pageHeight - 10);
      }

      // Save PDF
      const fileName = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

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
          <h2 className="text-2xl font-semibold text-gray-800">Comprehensive Dashboard Report</h2>
          <p className="text-gray-600 mt-1">
            Complete overview of your e-commerce platform
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

          {/* Download PDF */}
          <button
            onClick={generatePDFReport}
            disabled={!reportData || generatingPDF}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
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