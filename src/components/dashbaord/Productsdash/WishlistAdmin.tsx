import React, { useState, useEffect } from 'react';
import {
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Package,
  CreditCard,
  ToggleLeft,
  ToggleRight,
  Eye,
  ShoppingCart,
  PhoneCall,
  MessageCircle,
  MessageSquare,
  Download,
  Filter,
  Lock
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';
import { handleClickWhatsapp } from '../../../app/ProductWhasapp';
import { notifyApi } from '../../../app/notify';
import SmsComposeModal from './SmsComposeModal';
import { getAdminErrorMessage } from '../../../app/utils/getAdminErrorMessage';

// Import jsPDF and autoTable with proper types
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface ProductColor {
  name: string;
  hex: string;
}

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  wishlist_color: ProductColor[];
  product_color: ProductColor[];
  delivery: string;
  price_at_time: number;
  created_at: string;
  total_item_price: number;
}

interface Wishlist {
  id: number;
  user_id: number;
  fname: string;
  lname: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  items: WishlistItem[];
  total_items: number;
  total_price: number;
}

const WishlistAdmin: React.FC = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [filteredWishlists, setFilteredWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [overallStats, setOverallStats] = useState({ total_items_all: 0, total_value_all: 0, active_users_count: 0 });
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // SMS compose modal — lets the admin edit the default message before sending
  const [smsTarget, setSmsTarget] = useState<Wishlist | null>(null);
  const [sendingSms, setSendingSms] = useState(false);

  // Date filtering states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    fetchWishlists(currentPage);
  }, [currentPage]);

  useEffect(() => {
    applyDateFilter();
  }, [wishlists, startDate, endDate]);

  const fetchWishlists = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * itemsPerPage;
      const response = await mainAxios.get(`/wishlist/all?skip=${skip}&limit=${itemsPerPage}`);
      setWishlists(response.data.wishlists || []);
      setTotalCount(response.data.total_count || 0);
      setOverallStats({
        total_items_all: response.data.total_items_all || 0,
        total_value_all: response.data.total_value_all || 0,
        active_users_count: response.data.active_users_count || 0,
      });
    } catch (err) {
      console.error('Error fetching wishlists:', err);
      setError(getAdminErrorMessage(err, 'Failed to load wishlists'));
    } finally {
      setLoading(false);
    }
  };

  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredWishlists(wishlists);
      return;
    }

    const filtered = wishlists.filter(wishlist => {
      const wishlistDate = new Date(wishlist.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        end.setHours(23, 59, 59, 999);
        return wishlistDate >= start && wishlistDate <= end;
      } else if (start) {
        return wishlistDate >= start;
      } else if (end) {
        end.setHours(23, 59, 59, 999);
        return wishlistDate <= end;
      }
      return true;
    });

    setFilteredWishlists(filtered);
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredWishlists(wishlists);
  };

  const generatePDFReport = async () => {
    setGeneratingReport(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc.setFillColor(59, 130, 246);
      doc.rect(20, 15, 30, 30, 'F');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('LOGO', 35, 32, { align: 'center' });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('WISHLIST MANAGEMENT REPORT', pageWidth / 2, 30, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${reportDate}`, pageWidth / 2, 40, { align: 'center' });

      if (startDate || endDate) {
        const start = startDate ? new Date(startDate).toLocaleDateString() : 'Beginning';
        const end = endDate ? new Date(endDate).toLocaleDateString() : 'Present';
        doc.text(`Date Range: ${start} - ${end}`, pageWidth / 2, 48, { align: 'center' });
      }

      const totalWishlists = filteredWishlists.length;
      const totalItems = filteredWishlists.reduce((sum, w) => sum + w.items.length, 0);
      const totalValue = filteredWishlists.reduce((sum, w) => sum + w.total_price, 0);
      const activeUsers = new Set(filteredWishlists.map(w => w.user_id)).size;

      let yPosition = 70;

      doc.setFillColor(243, 244, 246);
      doc.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SUMMARY OVERVIEW', 28, yPosition);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Wishlists: ${totalWishlists}`, 28, yPosition + 8);
      doc.text(`Total Items: ${totalItems}`, 100, yPosition + 8);
      doc.text(`Total Value: ${formatCurrency(totalValue)}`, 150, yPosition + 8);
      doc.text(`Active Users: ${activeUsers}`, 28, yPosition + 16);

      yPosition += 35;

      if (filteredWishlists.length > 0) {
        const tableData = filteredWishlists.map((wishlist, index) => [
          (index + 1).toString(),
          wishlist.id.toString(),
          `${wishlist.fname} ${wishlist.lname}`,
          wishlist.email,
          wishlist.phone || 'N/A',
          wishlist.items.length.toString(),
          formatCurrency(wishlist.total_price),
          wishlist.is_active ? 'Active' : 'Inactive',
          new Date(wishlist.created_at).toLocaleDateString()
        ]);

        const headers = [
          '#', 'Wishlist ID', 'Customer Name', 'Email', 'Phone', 'Items', 'Total Value', 'Status', 'Created Date'
        ];

        doc.autoTable({
          startY: yPosition,
          head: [headers],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [243, 244, 246] },
          margin: { left: 20, right: 20 }
        });
      } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text('No wishlist data available for the selected criteria.', pageWidth / 2, yPosition + 20, { align: 'center' });
      }

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 10);
        doc.text(`Generated by Wishlist Management System`, 25, pageHeight - 10);
      }

      const fileName = `wishlists-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const generateDetailedPDFReport = async () => {
    setGeneratingReport(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('UMUKAMEZI WISHLIST REPORT', pageWidth / 2, 25, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 32, { align: 'center' });

      let yPosition = 60;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORT SUMMARY', 20, yPosition);

      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      const totalWishlists = filteredWishlists.length;
      const totalItems = filteredWishlists.reduce((sum, w) => sum + w.items.length, 0);
      const totalValue = filteredWishlists.reduce((sum, w) => sum + w.total_price, 0);
      const activeWishlists = filteredWishlists.filter(w => w.is_active).length;

      doc.text(`• Total Wishlists: ${totalWishlists}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Active Wishlists: ${activeWishlists}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Inactive Wishlists: ${totalWishlists - activeWishlists}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Total Items: ${totalItems}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Total Wishlist Value: ${formatCurrency(totalValue)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Average Wishlist Value: ${formatCurrency(totalWishlists > 0 ? totalValue / totalWishlists : 0)}`, 25, yPosition);

      yPosition += 15;

      filteredWishlists.forEach((wishlist, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFillColor(243, 244, 246);
        doc.rect(20, yPosition, pageWidth - 40, 12, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`WISHLIST ${index + 1}: #${wishlist.id} - ${wishlist.fname} ${wishlist.lname}`, 25, yPosition + 8);

        yPosition += 20;

        doc.setFont('helvetica', 'normal');
        doc.text(`Customer: ${wishlist.fname} ${wishlist.lname}`, 25, yPosition);
        doc.text(`Email: ${wishlist.email}`, 25, yPosition + 6);
        doc.text(`Phone: ${wishlist.phone || 'N/A'}`, 25, yPosition + 12);
        doc.text(`User ID: ${wishlist.user_id}`, 100, yPosition);
        doc.text(`Status: ${wishlist.is_active ? 'Active' : 'Inactive'}`, 100, yPosition + 6);
        doc.text(`Created: ${new Date(wishlist.created_at).toLocaleDateString()}`, 100, yPosition + 12);

        yPosition += 25;

        if (wishlist.items && wishlist.items.length > 0) {
          const itemData = wishlist.items.map(item => [
            item.product_name.substring(0, 35),
            item.quantity.toString(),
            formatCurrency(item.price_at_time),
            formatCurrency(item.total_item_price),
            item.delivery || 'Standard'
          ]);

          doc.autoTable({
            startY: yPosition,
            head: [['Product Name', 'Quantity', 'Unit Price', 'Total', 'Delivery']],
            body: itemData,
            theme: 'grid',
            styles: { fontSize: 7 },
            headStyles: { fillColor: [107, 114, 128], textColor: 255 },
            margin: { left: 20, right: 20 }
          });

          yPosition = (doc.lastAutoTable?.finalY || yPosition) + 10;
        } else {
          doc.text('No items in this wishlist', 25, yPosition);
          yPosition += 15;
        }

        doc.setFont('helvetica', 'bold');
        doc.text(`Wishlist Total: ${formatCurrency(wishlist.total_price)} (${wishlist.items.length} items)`, pageWidth - 30, yPosition, { align: 'right' });

        yPosition += 20;

        if (index < filteredWishlists.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(20, yPosition, pageWidth - 20, yPosition);
          yPosition += 10;
        }
      });

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 10);
        doc.text(`Confidential - Wishlist Management Report`, 25, pageHeight - 10);
      }

      const fileName = `detailed-wishlists-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating detailed PDF report:', error);
      alert('Failed to generate detailed PDF report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const removeWishlistItem = async (wishlistId: number, itemId: number) => {
    if (!window.confirm('Are you sure you want to remove this item from the wishlist?')) {
      return;
    }

    try {
      await mainAxios.delete(`/wishlist/delete/${itemId}`);
      // Update local state
      setWishlists(prev => prev.map(wishlist =>
        wishlist.id === wishlistId
          ? {
              ...wishlist,
              items: wishlist.items.filter(item => item.id !== itemId),
              total_items: wishlist.total_items - (wishlist.items.find(item => item.id === itemId)?.quantity || 0),
              total_price: wishlist.total_price - (wishlist.items.find(item => item.id === itemId)?.total_item_price || 0)
            }
          : wishlist
      ));

      if (selectedWishlist && selectedWishlist.id === wishlistId) {
        setSelectedWishlist(prev => prev ? {
          ...prev,
          items: prev.items.filter(item => item.id !== itemId),
          total_items: prev.total_items - (prev.items.find(item => item.id === itemId)?.quantity || 0),
          total_price: prev.total_price - (prev.items.find(item => item.id === itemId)?.total_item_price || 0)
        } : null);
      }
    } catch (error) {
      console.error('Error removing wishlist item:', error);
      alert('Failed to remove wishlist item');
    }
  };

  const toggleWishlistStatus = async (wishlistId: number, currentStatus: boolean) => {
    try {
      await mainAxios.put(`/wishlist/toggle/${wishlistId}`, null, {
        params: { is_active: !currentStatus }
      });

      // Update local state
      setWishlists(prev => prev.map(wishlist =>
        wishlist.id === wishlistId
          ? { ...wishlist, is_active: !currentStatus }
          : wishlist
      ));
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
      alert('Failed to update wishlist status');
    }
  };

  const viewWishlistDetails = (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist);
    setShowDetailsModal(true);
  };

  const handleWhatsAppMessage = (wishlist: Wishlist) => {
    const itemsList = wishlist.items.map(item =>
      `• ${item.product_name} (Qty: ${item.quantity}) - ${formatCurrency(item.total_item_price)}`
    ).join('\n');

    const message = `❤️ Hello ${wishlist.fname}, here is your wishlist summary:\n\n${itemsList}\n\nTotal items: ${wishlist.items.length}\nTotal price: ${formatCurrency(wishlist.total_price)}\n\nThank you for shopping with us!`;

    handleClickWhatsapp("Wishlist Information", wishlist.phone || "250781691713", message);
  };

  const buildDefaultSmsMessage = (wishlist: Wishlist) => {
    const itemsList = wishlist.items.map(item =>
      `${item.product_name} (Qty: ${item.quantity}) - ${formatCurrency(item.total_item_price)}`
    ).join(', ');

    return `Hello ${wishlist.fname}, your wishlist: ${itemsList}. Total: ${formatCurrency(wishlist.total_price)}. - Umukamezi`;
  };

  const openSmsCompose = (wishlist: Wishlist) => {
    if (!wishlist.phone) return;
    setSmsTarget(wishlist);
  };

  const handleSendSms = async (message: string) => {
    if (!smsTarget?.phone) return;
    setSendingSms(true);
    try {
      await notifyApi.sendSms(smsTarget.phone, message);
      alert('SMS sent successfully');
      setSmsTarget(null);
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Failed to send SMS');
    } finally {
      setSendingSms(false);
    }
  };

  // Pagination — server already returns just the current page, newest-item-added-first
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading wishlists...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Lock className="w-10 h-10 text-red-400 mb-3" />
        <p className="text-gray-700 font-medium">{error}</p>
        <button
          onClick={() => fetchWishlists(currentPage)}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Wishlist Management</h2>
          <p className="text-gray-600 mt-1">
            Showing {filteredWishlists.length} of {totalCount} wishlist{totalCount !== 1 ? 's' : ''} • {' '}
            page {currentPage} of {totalPages}
            {(startDate || endDate) && (
              <span className="text-blue-600 ml-2">
                (Filtered)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Date Filter Toggle */}
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              showDateFilter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>

          {/* Download Report Dropdown */}
          <div className="relative group">
            <button
              disabled={filteredWishlists.length === 0 || generatingReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {generatingReport ? 'Generating...' : 'Download Report'}
            </button>

            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={generatePDFReport}
                disabled={generatingReport || filteredWishlists.length === 0}
                className="w-full text-left hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md disabled:opacity-50"
              >
                📊 Summary Report (PDF)
              </button>
              <button
                onClick={generateDetailedPDFReport}
                disabled={generatingReport || filteredWishlists.length === 0}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md disabled:opacity-50"
              >
                📋 Detailed Report (PDF)
              </button>
            </div>
          </div>

          <button
            onClick={() => fetchWishlists(currentPage)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Date Filter Section */}
      {showDateFilter && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Filter by Date Range</h3>
            <button
              onClick={clearDateFilter}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filter
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
                onClick={applyDateFilter}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filter
              </button>
            </div>
          </div>
          {(startDate || endDate) && (
            <div className="mt-3 text-sm text-gray-600">
              Showing wishlists from {startDate || 'the beginning'} to {endDate || 'now'}
            </div>
          )}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Total Wishlists</p>
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Total Items</p>
              <p className="text-2xl font-bold text-green-600">
                {overallStats.total_items_all}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(overallStats.total_value_all)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <User className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-900">Active Users</p>
              <p className="text-2xl font-bold text-orange-600">
                {overallStats.active_users_count}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wishlist Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items & Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredWishlists.map((wishlist) => (
              <tr key={wishlist.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">ID: {wishlist.id}</p>
                    <p className="text-sm text-gray-600">{wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {wishlist.fname} {wishlist.lname}
                    </p>
                    <p className="text-sm text-gray-600">{wishlist.email}</p>
                    {wishlist.phone && (
                      <div
                        onClick={() => handleWhatsAppMessage(wishlist)}
                        className="text-xs text-blue-600 flex items-center gap-1 mt-1 cursor-pointer hover:underline"
                      >
                        <PhoneCall className="w-3 h-3" />
                        {wishlist.phone}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">UID: {wishlist.user_id}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {wishlist.items.length} items
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      {formatCurrency(wishlist.total_price)}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleWishlistStatus(wishlist.id, wishlist.is_active)}
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        wishlist.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {wishlist.is_active ? (
                        <ToggleRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 mr-1" />
                      )}
                      {wishlist.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDate(wishlist.created_at)}
                </td>
                <td className="px-4 py-4 space-x-2 flex xl:flex-row gap-3">
                  <button
                    onClick={() => viewWishlistDetails(wishlist)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  {wishlist.phone && (
                    <button
                      onClick={() => handleWhatsAppMessage(wishlist)}
                      className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </button>
                  )}
                  {wishlist.phone && (
                    <button
                      onClick={() => openSmsCompose(wishlist)}
                      className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      SMS
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredWishlists.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {wishlists.length === 0 ? 'No wishlists found.' : 'No wishlists match your filter criteria.'}
          </p>
          {(startDate || endDate) && (
            <button
              onClick={clearDateFilter}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* Wishlist Details Modal */}
      {showDetailsModal && selectedWishlist && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Wishlist Details - {selectedWishlist.fname} {selectedWishlist.lname}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Wishlist ID: {selectedWishlist.id} • User ID: {selectedWishlist.user_id}
              </p>
            </div>

            <div className="p-6">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Name:</span> {selectedWishlist.fname} {selectedWishlist.lname}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedWishlist.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedWishlist.phone || 'Not provided'}</p>
                    <p><span className="text-gray-600">User ID:</span> {selectedWishlist.user_id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Wishlist Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Total Items:</span> {selectedWishlist.items?.length || 0}</p>
                    <p><span className="text-gray-600">Total Value:</span> {formatCurrency(selectedWishlist.total_price)}</p>
                    <p><span className="text-gray-600">Status:</span>
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        selectedWishlist.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedWishlist.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    <p><span className="text-gray-600">Created:</span> {formatDate(selectedWishlist.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <h4 className="font-medium text-gray-900 mb-4">Wishlist Items ({selectedWishlist.items.length})</h4>
              <div className="space-y-4">
                {selectedWishlist.items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                          <span className="text-sm text-gray-500">ID: {item.product_id}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-medium">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Price:</span>
                            <span className="ml-2 font-medium">{formatCurrency(item.price_at_time)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {formatCurrency(item.total_item_price)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Delivery:</span>
                            <span className="ml-2 font-medium">{item.delivery}</span>
                          </div>
                        </div>

                        {/* Colors */}
                        {item.wishlist_color && item.wishlist_color.length > 0 && (
                          <div className="mt-2">
                            <span className="text-gray-600 text-sm">Selected Colors:</span>
                            <div className="flex gap-1 mt-1">
                              {item.wishlist_color.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-4 h-4 rounded-full border border-gray-200"
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-500">
                          Added on {formatDate(item.created_at)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeWishlistItem(selectedWishlist.id, item.id)}
                        className="ml-4 flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedWishlist.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items in this wishlist
                </div>
              )}

              {/* Wishlist Total */}
              {selectedWishlist.items.length > 0 && (
                <div className="flex justify-between items-center p-4 border-t border-gray-200 mt-6">
                  <div>
                    <p className="font-semibold text-gray-900">Wishlist Total</p>
                    <p className="text-sm text-gray-600">{selectedWishlist.items.length} item{selectedWishlist.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <p className="font-bold text-2xl text-green-600">
                    {formatCurrency(selectedWishlist.total_price)}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              {selectedWishlist.phone && (
                <button
                  onClick={() => handleWhatsAppMessage(selectedWishlist)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send WhatsApp
                </button>
              )}
              {selectedWishlist.phone && (
                <button
                  onClick={() => openSmsCompose(selectedWishlist)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send SMS
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Compose Modal */}
      <SmsComposeModal
        isOpen={!!smsTarget}
        phone={smsTarget?.phone || ''}
        recipientName={smsTarget ? `${smsTarget.fname} ${smsTarget.lname}` : ''}
        defaultMessage={smsTarget ? buildDefaultSmsMessage(smsTarget) : ''}
        sending={sendingSms}
        onClose={() => setSmsTarget(null)}
        onSend={handleSendSms}
      />
    </div>
  );
};

export default WishlistAdmin;
