import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  Download,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ChevronDown,
  FileText,
  RefreshCw,
  CreditCard,
  Package,
  MapPin,
  Percent
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance'; // Adjust path as needed

import OrderDetailsModal from "./OrderDetailsModal";

const OrdersTable = ({ tenantId, userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const itemsPerPage = 10;

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch orders from actual API
  useEffect(() => {
    fetchOrders();
  }, [tenantId, userId]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/profile/orders');
      console.log("Fetched Orders:", response.data);
      setOrders(response.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform and enhance order data for UI
  const enhancedOrders = useMemo(() => {
    return orders.map(order => {
      // Base structure from API (current fields)
      const baseOrder = {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount || 0,
        status: order.status || 'draft',
        created_at: order.created_at,
        // Currency from backend when available, default to USD
        currency: order.currency || 'GBP'
      };

      // Conditionally add fields that might come in future API updates
      // This makes the frontend ready for schema extensions
      const enhancedOrder = { ...baseOrder };

      // Payment status (if/when backend adds it)
      if (order.payment_status !== undefined) {
        enhancedOrder.payment_status = order.payment_status;
      } else {
        // Default based on order status
        enhancedOrder.payment_status = order.status === 'completed' ? 'paid' : 'pending';
      }

      // Placed date (if/when backend adds it)
      if (order.placed_at !== undefined) {
        enhancedOrder.placed_at = order.placed_at;
      } else {
        // Fallback to created_at
        enhancedOrder.placed_at = order.created_at;
      }

      // Item count (if/when backend adds it)
      if (order.item_count !== undefined) {
        enhancedOrder.item_count = order.item_count;
      } else {
        // Mock for now - can be removed when backend provides this
        enhancedOrder.item_count = Math.floor(Math.random() * 5) + 1;
      }

      // Additional amount fields (when backend adds them)
      if (order.subtotal_amount !== undefined) {
        enhancedOrder.subtotal_amount = order.subtotal_amount;
      }
      if (order.shipping_amount !== undefined) {
        enhancedOrder.shipping_amount = order.shipping_amount;
      }
      if (order.taxes_amount !== undefined) {
        enhancedOrder.taxes_amount = order.taxes_amount;
      }
      if (order.discounts_amount !== undefined) {
        enhancedOrder.discounts_amount = order.discounts_amount;
      }

      // Address information (when backend adds it)
      if (order.billing_address_id !== undefined) {
        enhancedOrder.billing_address_id = order.billing_address_id;
      }
      if (order.shipping_address_id !== undefined) {
        enhancedOrder.shipping_address_id = order.shipping_address_id;
      }

      return enhancedOrder;
    });
  }, [orders]);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...enhancedOrders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (sortConfig.key === 'created_at' || sortConfig.key === 'placed_at') {
        return sortConfig.direction === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
      if (sortConfig.key === 'total_amount' || sortConfig.key === 'subtotal_amount') {
        return sortConfig.direction === 'asc'
          ? (aValue || 0) - (bValue || 0)
          : (bValue || 0) - (aValue || 0);
      }
      return 0;
    });

    return filtered;
  }, [enhancedOrders, searchTerm, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: { 
        bg: 'bg-green-50', 
        text: 'text-green-700', 
        border: 'border-green-200', 
        icon: CheckCircle,
        label: 'Completed'
      },
      processing: { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-200', 
        icon: RefreshCw,
        label: 'Processing'
      },
      pending: { 
        bg: 'bg-yellow-50', 
        text: 'text-yellow-700', 
        border: 'border-yellow-200', 
        icon: Clock,
        label: 'Pending'
      },
      pending_payment: { 
        bg: 'bg-yellow-50', 
        text: 'text-yellow-700', 
        border: 'border-yellow-200', 
        icon: Clock,
        label: 'Pending'
      },
      cancelled: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-600', 
        border: 'border-gray-300', 
        icon: XCircle,
        label: 'Cancelled'
      },
      draft: { 
        bg: 'bg-gray-50', 
        text: 'text-gray-500', 
        border: 'border-gray-200', 
        icon: FileText,
        label: 'Draft'
      }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <div className="flex flex-col gap-1">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
          <Icon size={12} />
          {config.label}
        </span>
        {/* Additional status info if available in future */}
        {status === 'processing' && (
          <span className="text-xs text-gray-500">Estimated: 3-5 days</span>
        )}
      </div>
    );
  };

  // Payment status badge - conditionally rendered
  const PaymentBadge = ({ status }) => {
    if (!status) return null;
    
    const paymentConfig = {
      paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle },
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock },
      failed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
      refunded: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: RefreshCw }
    };

    const config = paymentConfig[status] || paymentConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return '-';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
    });
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle order actions
  const handleViewDetails = (order) => {
    console.log('View order details:', order.id);
    // Navigate to order detail page or open modal
  };

  const handleView = (id) => {
    setSelectedOrderId(id);
    setModalOpen(true);
  };

  const handleDownloadDocuments = (order) => {
    console.log('Download documents for:', order.id);
    // Trigger document download
  };

  const handleReorder = (order) => {
    console.log('Reorder items from:', order.id);
    // Add items to cart
  };

  // Select all orders on current page
  const handleSelectAll = () => {
    const newSelected = new Set(selectedOrders);
    if (paginatedOrders.every(order => selectedOrders.has(order.id))) {
      paginatedOrders.forEach(order => newSelected.delete(order.id));
    } else {
      paginatedOrders.forEach(order => newSelected.add(order.id));
    }
    setSelectedOrders(newSelected);
  };

  if (loading) {
    return (
      <div className="px-6 md:px-36 py-12 flex flex-col gap-4 items-center justify-center min-h-[60dvh] w-full bg-white rounded-lg border border-gray-200 mt-4">
        <div className="loader"></div>
        <p className="text-center text-gray-400">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-36 py-12 flex flex-col items-center justify-center min-h-[60dvh] w-full bg-white rounded-lg border border-gray-200 mt-4">
        <AlertCircle className="h-12 w-12 text-red-300 mb-3" />
        <p className="text-center text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 bg-(--color-primary) text-white rounded-md hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 mt-4">
      {/* Table Header with Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Order History</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAndSortedOrders.length} order{filteredAndSortedOrders.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="draft">Draft</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={paginatedOrders.length > 0 && paginatedOrders.every(order => selectedOrders.has(order.id))}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('order_number')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Order Number
                  {sortConfig.key === 'order_number' && (
                    <ChevronDown size={12} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Date
                  {sortConfig.key === 'created_at' && (
                    <ChevronDown size={12} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('total_amount')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Total
                  {sortConfig.key === 'total_amount' && (
                    <ChevronDown size={12} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders found.</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-(--color-primary) hover:shadow-sm text-sm"
                    >
                      Clear search
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => {
                        const newSelected = new Set(selectedOrders);
                        if (selectedOrders.has(order.id)) {
                          newSelected.delete(order.id);
                        } else {
                          newSelected.add(order.id);
                        }
                        setSelectedOrders(newSelected);
                      }}
                      className="rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                   </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{formatDate(order.placed_at)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PaymentBadge status={order.payment_status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total_amount, order.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                         onClick={() => handleView(order.id)}
                        className="p-1.5 flex items-center text-sm gap-1 text-gray-500 hover:text-(--color-primary) hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    
                    
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAndSortedOrders.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)}
            </span>{' '}
            of <span className="font-medium">{filteredAndSortedOrders.length}</span> orders
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    currentPage === pageNum
                      ? 'bg-(--color-primary) text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Table Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <div className="flex items-start gap-y-4 md:items-center justify-between flex-col md:flex-row">
          <div>
            • Refund requests available within 14 days
          </div>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-800"
          >
            <RefreshCw size={12} />
            Refresh Orders
          </button>
        </div>
      </div>

      
      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default OrdersTable;