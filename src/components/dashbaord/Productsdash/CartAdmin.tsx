import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  RefreshCw, 
  PhoneCall, 
  ShoppingCart,
  User,
  CreditCard,
  Package,
  ToggleLeft,
  ToggleRight,
  Trash2,
  MessageCircle,
  MessageSquare,
  Download,
  Filter
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';
import { RWF } from '../../../app/priceConver';
import { handleClickWhatsapp } from '../../../app/ProductWhasapp';
import { notifyApi } from '../../../app/notify';
import SmsComposeModal from './SmsComposeModal';

// Import jsPDF and autoTable with proper types
import jsPDF from 'jspdf';

// Import autoTable function separately
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

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  price_at_time: number;
  created_at: string;
  total_item_price: number;
  color?: Array<{ name: string; hex: string }>;
  delivery?: string;
}

interface Cart {
  id: number;
  user_id: number;
  fname: string;
  lname: string;
  phone?: string;
  email: string;
  is_active: boolean;
  created_at: string;
  items: CartItem[];
  total_items: number;
  total_price: number;
}

const CartAdmin: React.FC = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [filteredCarts, setFilteredCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // SMS compose modal — lets the admin edit the default message before sending
  const [smsTarget, setSmsTarget] = useState<Cart | null>(null);
  const [sendingSms, setSendingSms] = useState(false);
  
  // Date filtering states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Pagination state — carts come back newest-item-added-first from the server
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [totalCount, setTotalCount] = useState(0);
  const [overallStats, setOverallStats] = useState({ total_items_all: 0, total_value_all: 0, active_users_count: 0 });

  useEffect(() => {
    fetchCarts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    applyDateFilter();
  }, [carts, startDate, endDate]);

  const fetchCarts = async (page: number = 1) => {
    try {
      setLoading(true);
      const skip = (page - 1) * pageSize;
      const response = await mainAxios.get(`/cart/all?skip=${skip}&limit=${pageSize}`);
      setCarts(response.data.carts || []);
      setTotalCount(response.data.total_count || 0);
      setOverallStats({
        total_items_all: response.data.total_items_all || 0,
        total_value_all: response.data.total_value_all || 0,
        active_users_count: response.data.active_users_count || 0,
      });
    } catch (error) {
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredCarts(carts);
      return;
    }

    const filtered = carts.filter(cart => {
      const cartDate = new Date(cart.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        end.setHours(23, 59, 59, 999);
        return cartDate >= start && cartDate <= end;
      } else if (start) {
        return cartDate >= start;
      } else if (end) {
        end.setHours(23, 59, 59, 999);
        return cartDate <= end;
      }
      return true;
    });

    setFilteredCarts(filtered);
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredCarts(carts);
  };

  const generatePDFReport = async () => {
    setGeneratingReport(true);
    try {
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Current date for report
      const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Add logo placeholder
      doc.setFillColor(59, 130, 246);
      doc.rect(20, 15, 30, 30, 'F');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('LOGO', 35, 32, { align: 'center' });

      // Report header
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('CART MANAGEMENT REPORT', pageWidth / 2, 30, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${reportDate}`, pageWidth / 2, 40, { align: 'center' });
      
      // Date range info
      if (startDate || endDate) {
        const start = startDate ? new Date(startDate).toLocaleDateString() : 'Beginning';
        const end = endDate ? new Date(endDate).toLocaleDateString() : 'Present';
        doc.text(`Date Range: ${start} - ${end}`, pageWidth / 2, 48, { align: 'center' });
      }

      // Summary statistics
      const totalCarts = filteredCarts.length;
      const totalItems = filteredCarts.reduce((sum, cart) => sum + cart.total_items, 0);
      const totalValue = filteredCarts.reduce((sum, cart) => sum + cart.total_price, 0);
      const activeUsers = new Set(filteredCarts.map(cart => cart.user_id)).size;

      let yPosition = 70;

      // Summary section
      doc.setFillColor(243, 244, 246);
      doc.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SUMMARY OVERVIEW', 28, yPosition);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Carts: ${totalCarts}`, 28, yPosition + 8);
      doc.text(`Total Items: ${totalItems}`, 100, yPosition + 8);
      doc.text(`Total Value: ${RWF.format(totalValue)}`, 150, yPosition + 8);
      doc.text(`Active Users: ${activeUsers}`, 28, yPosition + 16);

      yPosition += 35;

      // Detailed cart data
      if (filteredCarts.length > 0) {
        // Prepare table data
        const tableData = filteredCarts.map((cart, index) => [
          (index + 1).toString(),
          cart.id.toString(),
          `${cart.fname} ${cart.lname}`,
          cart.email,
          cart.phone || 'N/A',
          cart.total_items.toString(),
          RWF.format(cart.total_price),
          cart.is_active ? 'Active' : 'Inactive',
          new Date(cart.created_at).toLocaleDateString()
        ]);

        // Table headers
        const headers = [
          '#',
          'Cart ID',
          'Customer Name',
          'Email',
          'Phone',
          'Items',
          'Total Value',
          'Status',
          'Created Date'
        ];

        // Add table using autoTable
        doc.autoTable({
          startY: yPosition,
          head: [headers],
          body: tableData,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 2,
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [243, 244, 246]
          },
          margin: { left: 20, right: 20 }
        });

        // Get the final Y position after the table
        const finalY = doc.lastAutoTable?.finalY || yPosition + 100;

        // Add items breakdown for each cart if there's space
        if (finalY < pageHeight - 50) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('ITEMS BREAKDOWN', 28, finalY + 5);
          
          let currentY = finalY + 15;
          
          for (const cart of filteredCarts.slice(0, 2)) {
            if (currentY > pageHeight - 100) {
              doc.addPage();
              currentY = 20;
            }
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`Cart ${cart.id} - ${cart.fname} ${cart.lname}`, 28, currentY);
            
            currentY += 8;
            
            if (cart.items && cart.items.length > 0) {
              const itemData = cart.items.map(item => [
                item.product_name.substring(0, 30),
                item.quantity.toString(),
                RWF.format(item.price_at_time),
                RWF.format(item.total_item_price)
              ]);
              
              doc.autoTable({
                startY: currentY,
                head: [['Product', 'Qty', 'Unit Price', 'Total']],
                body: itemData,
                theme: 'grid',
                styles: { fontSize: 7 },
                headStyles: {
                  fillColor: [107, 114, 128],
                  textColor: 255
                },
                margin: { left: 28, right: 20 },
                tableWidth: 150
              });
              
              currentY = (doc.lastAutoTable?.finalY || currentY) + 15;
            } else {
              doc.setFont('helvetica', 'italic');
              doc.text('No items in cart', 28, currentY);
              currentY += 15;
            }
            
            if (currentY > pageHeight - 50) {
              doc.addPage();
              currentY = 20;
            }
          }
        }
      } else {
        // No data message
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text('No cart data available for the selected criteria.', pageWidth / 2, yPosition + 20, { align: 'center' });
      }

      // Add footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 10);
        doc.text(`Generated by Cart Management System`, 25, pageHeight - 10);
      }

      // Save the PDF
      const fileName = `carts-report-${new Date().toISOString().split('T')[0]}.pdf`;
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
      
      // Report header
      doc.setFillColor(30, 41, 59); 
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('UMUKAMEZI CART REPORT', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 32, { align: 'center' });

      let yPosition = 60;

      // Summary section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORT SUMMARY', 20, yPosition);
      
      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const totalCarts = filteredCarts.length;
      const totalItems = filteredCarts.reduce((sum, cart) => sum + cart.total_items, 0);
      const totalValue = filteredCarts.reduce((sum, cart) => sum + cart.total_price, 0);
      const activeCarts = filteredCarts.filter(cart => cart.is_active).length;
      
      doc.text(`• Total Carts: ${totalCarts}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Active Carts: ${activeCarts}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Inactive Carts: ${totalCarts - activeCarts}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Total Items: ${totalItems}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Total Cart Value: ${RWF.format(totalValue)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Average Cart Value: ${RWF.format(totalCarts > 0 ? totalValue / totalCarts : 0)}`, 25, yPosition);
      
      yPosition += 15;

      // Detailed cart information
      filteredCarts.forEach((cart, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Cart header
        doc.setFillColor(243, 244, 246);
        doc.rect(20, yPosition, pageWidth - 40, 12, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`CART ${index + 1}: #${cart.id} - ${cart.fname} ${cart.lname}`, 25, yPosition + 8);
        
        yPosition += 20;

        // Customer info
        doc.setFont('helvetica', 'normal');
        doc.text(`Customer: ${cart.fname} ${cart.lname}`, 25, yPosition);
        doc.text(`Email: ${cart.email}`, 25, yPosition + 6);
        doc.text(`Phone: ${cart.phone || 'N/A'}`, 25, yPosition + 12);
        doc.text(`User ID: ${cart.user_id}`, 100, yPosition);
        doc.text(`Status: ${cart.is_active ? 'Active' : 'Inactive'}`, 100, yPosition + 6);
        doc.text(`Created: ${new Date(cart.created_at).toLocaleDateString()}`, 100, yPosition + 12);
        
        yPosition += 25;

        // Items table
        if (cart.items && cart.items.length > 0) {
          const itemData = cart.items.map(item => [
            item.product_name.substring(0, 35),
            item.quantity.toString(),
            RWF.format(item.price_at_time),
            RWF.format(item.total_item_price),
            item.delivery || 'Standard'
          ]);

          doc.autoTable({
            startY: yPosition,
            head: [['Product Name', 'Quantity', 'Unit Price', 'Total', 'Delivery']],
            body: itemData,
            theme: 'grid',
            styles: { fontSize: 7 },
            headStyles: {
              fillColor: [107, 114, 128],
              textColor: 255
            },
            margin: { left: 20, right: 20 }
          });

          yPosition = (doc.lastAutoTable?.finalY || yPosition) + 10;
        } else {
          doc.text('No items in this cart', 25, yPosition);
          yPosition += 15;
        }

        // Cart total
        doc.setFont('helvetica', 'bold');
        doc.text(`Cart Total: ${RWF.format(cart.total_price)} (${cart.total_items} items)`, pageWidth - 30, yPosition, { align: 'right' });
        
        yPosition += 20;

        // Separator
        if (index < filteredCarts.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(20, yPosition, pageWidth - 20, yPosition);
          yPosition += 10;
        }
      });

      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 10);
        doc.text(`Confidential - Cart Management Report`, 25, pageHeight - 10);
      }

      const fileName = `detailed-carts-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error generating detailed PDF report:', error);
      alert('Failed to generate detailed PDF report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const toggleCartStatus = async (cartId: number, currentStatus: boolean) => {
    try {
      await mainAxios.put(`/cart/toggle/${cartId}`, null, {
        params: { is_active: !currentStatus }
      });
      setCarts(carts.map(cart =>
        cart.id === cartId ? { ...cart, is_active: !currentStatus } : cart
      ));
    } catch (error) {
      console.error('Error toggling cart status:', error);
    }
  };

  const removeCartItem = async (cartId: number, itemId: number) => {
    if (!window.confirm('Are you sure you want to remove this item from the cart?')) {
      return;
    }

    try {
      await mainAxios.delete(`/cart/delete/${itemId}`);
      setCarts(prev => prev.map(cart => 
        cart.id === cartId 
          ? {
              ...cart,
              items: cart.items.filter(item => item.id !== itemId),
              total_items: cart.total_items - (cart.items.find(item => item.id === itemId)?.quantity || 0),
              total_price: cart.total_price - (cart.items.find(item => item.id === itemId)?.total_item_price || 0)
            }
          : cart
      ));

      if (selectedCart && selectedCart.id === cartId) {
        setSelectedCart(prev => prev ? {
          ...prev,
          items: prev.items.filter(item => item.id !== itemId),
          total_items: prev.total_items - (prev.items.find(item => item.id === itemId)?.quantity || 0),
          total_price: prev.total_price - (prev.items.find(item => item.id === itemId)?.total_item_price || 0)
        } : null);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      alert('Failed to remove cart item');
    }
  };

  const viewCartDetails = async (cart: Cart) => {
    try {
      if (!cart.items || cart.items.length === 0) {
        const response = await mainAxios.get(`/cart/${cart.id}`);
        setSelectedCart(response.data);
      } else {
        setSelectedCart(cart);
      }
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const closeModal = () => {
    setSelectedCart(null);
    setShowDetailsModal(false);
  };

  const handleWhatsAppMessage = (cart: Cart) => {
    const itemsList = cart.items.map(item => 
      `• ${item.product_name} (Qty: ${item.quantity}) - ${RWF.format(item.total_item_price)}`
    ).join('\n');

    const message = `🛒 Hello ${cart.fname}, here is your cart summary:\n\n${itemsList}\n\nTotal items: ${cart.total_items}\nTotal price: ${RWF.format(cart.total_price)}\n\nThank you for shopping with us!`;

    handleClickWhatsapp("Cart Information", cart.phone || "250781691713", message);
  };

  const buildDefaultSmsMessage = (cart: Cart) => {
    const itemsList = cart.items.map(item =>
      `${item.product_name} (Qty: ${item.quantity}) - ${RWF.format(item.total_item_price)}`
    ).join(', ');

    return `Hello ${cart.fname}, your cart: ${itemsList}. Total: ${RWF.format(cart.total_price)}. - Umukamezi`;
  };

  const openSmsCompose = (cart: Cart) => {
    if (!cart.phone) return;
    setSmsTarget(cart);
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
        <span className="ml-2 text-gray-600">Loading carts...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Cart Management</h2>
          <p className="text-gray-600 mt-1">
            Showing {filteredCarts.length} of {totalCount} cart{totalCount !== 1 ? 's' : ''} • {' '}
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
              disabled={filteredCarts.length === 0 || generatingReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {generatingReport ? 'Generating...' : 'Download Report'}
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={generatePDFReport}
                disabled={generatingReport || filteredCarts.length === 0}
                className="w-full text-left hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md disabled:opacity-50"
              >
                📊 Summary Report (PDF)
              </button>
              <button
                onClick={generateDetailedPDFReport}
                disabled={generatingReport || filteredCarts.length === 0}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md disabled:opacity-50"
              >
                📋 Detailed Report (PDF)
              </button>
            </div>
          </div>

          <button
            onClick={() => fetchCarts(currentPage)}
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
              Showing carts from {startDate || 'the beginning'} to {endDate || 'now'}
            </div>
          )}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Total Carts</p>
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-green-600" />
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
                {RWF.format(overallStats.total_value_all)}
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

      {/* Cart Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cart Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Info
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
            {filteredCarts.map((cart) => (
              <tr key={cart.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">ID: {cart.id}</p>
                    <p className="text-sm text-gray-600">{cart.items?.length || 0} item{cart.items?.length !== 1 ? 's' : ''}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cart.fname} {cart.lname}
                    </p>
                    <p className="text-sm text-gray-600">{cart.email}</p>
                    {cart.phone && (
                      <div 
                        onClick={() => handleWhatsAppMessage(cart)}
                        className="text-xs text-blue-600 flex items-center gap-1 mt-1 cursor-pointer hover:underline"
                      >
                        <PhoneCall className="w-3 h-3" />
                        {cart.phone}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">UID: {cart.user_id}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cart.total_items} items
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      {RWF.format(cart.total_price)}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleCartStatus(cart.id, cart.is_active)}
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        cart.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {cart.is_active ? (
                        <ToggleRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 mr-1" />
                      )}
                      {cart.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDate(cart.created_at)}
                </td>
                <td className="px-4 py-4 space-x-2 flex xl:flex-row gap-3">
                  <button
                    onClick={() => viewCartDetails(cart)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  {cart.phone && (
                    <button
                      onClick={() => handleWhatsAppMessage(cart)}
                      className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </button>
                  )}
                  {cart.phone && (
                    <button
                      onClick={() => openSmsCompose(cart)}
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

      {filteredCarts.length === 0 && !loading && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {carts.length === 0 ? 'No carts found.' : 'No carts match your filter criteria.'}
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
      {totalCount > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Cart Details Modal */}
      {showDetailsModal && selectedCart && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cart Details - {selectedCart.fname} {selectedCart.lname}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Cart ID: {selectedCart.id} • User ID: {selectedCart.user_id}
              </p>
            </div>

            <div className="p-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Name:</span> {selectedCart.fname} {selectedCart.lname}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedCart.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedCart.phone || 'Not provided'}</p>
                    <p><span className="text-gray-600">User ID:</span> {selectedCart.user_id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cart Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Total Items:</span> {selectedCart.items?.length || 0}</p>
                    <p><span className="text-gray-600">Total Value:</span> {RWF.format(selectedCart.total_price)}</p>
                    <p><span className="text-gray-600">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        selectedCart.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedCart.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    <p><span className="text-gray-600">Created:</span> {formatDate(selectedCart.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <h4 className="font-medium text-gray-900 mb-4">
                Cart Items ({selectedCart.items?.length || 0})
              </h4>
              <div className="space-y-4">
                {selectedCart.items?.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                          <span className="text-sm text-gray-500">ID: {item.product_id}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-2">
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-medium">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Unit Price:</span>
                            <span className="ml-2 font-medium">{RWF.format(item.price_at_time)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {RWF.format(item.total_item_price)}
                            </span>
                          </div>
                          {item.delivery && (
                            <div>
                              <span className="text-gray-600">Delivery:</span>
                              <span className="ml-2 font-medium">{item.delivery}</span>
                            </div>
                          )}
                        </div>

                        {/* Colors */}
                        {item.color && item.color.length > 0 && (
                          <div className="mt-2">
                            <span className="text-gray-600 text-sm">Selected Colors:</span>
                            <div className="flex gap-1 mt-1">
                              {item.color.map((color, index) => (
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
                        onClick={() => removeCartItem(selectedCart.id, item.id)}
                        className="ml-4 flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(!selectedCart.items || selectedCart.items.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No items in this cart
                </div>
              )}

              {/* Cart Total */}
              {selectedCart.items && selectedCart.items.length > 0 && (
                <div className="flex justify-between items-center p-4 border-t border-gray-200 mt-6">
                  <div>
                    <p className="font-semibold text-gray-900">Cart Total</p>
                    <p className="text-sm text-gray-600">{selectedCart.items.length} item{selectedCart.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <p className="font-bold text-2xl text-green-600">
                    {RWF.format(selectedCart.total_price)}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              {selectedCart.phone && (
                <button
                  onClick={() => handleWhatsAppMessage(selectedCart)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send WhatsApp
                </button>
              )}
              {selectedCart.phone && (
                <button
                  onClick={() => openSmsCompose(selectedCart)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send SMS
                </button>
              )}
              <button
                onClick={closeModal}
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

export default CartAdmin;