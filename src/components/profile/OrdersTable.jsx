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
  RefreshCw
} from 'lucide-react';

// Mock data - replace with actual API call
const mockOrders = Array.from({ length: 25 }, (_, i) => ({
  id: `order-${i + 1}`,
  order_number: `ORD-${String(i + 1000).padStart(6, '0')}`,
  status: ['completed', 'processing', 'pending', 'cancelled'][i % 4],
  placed_at: new Date(Date.now() - i * 86400000).toISOString(),
  total_amount: (Math.random() * 1000 + 50) * 100, // In cents
  payment_status: ['paid', 'pending', 'failed'][i % 3],
  currency: 'USD',
  item_count: Math.floor(Math.random() * 5) + 1
}));

const OrdersTable = ({ tenantId, userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'placed_at', direction: 'desc' });
  const itemsPerPage = 10;

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [tenantId, userId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

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
      if (sortConfig.key === 'placed_at') {
        return sortConfig.direction === 'asc'
          ? new Date(a.placed_at) - new Date(b.placed_at)
          : new Date(b.placed_at) - new Date(a.placed_at);
      }
      if (sortConfig.key === 'total_amount') {
        return sortConfig.direction === 'asc'
          ? a.total_amount - b.total_amount
          : b.total_amount - a.total_amount;
      }
      return 0;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle },
      processing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: RefreshCw },
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', icon: XCircle },
      draft: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', icon: FileText }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge
  const PaymentBadge = ({ status }) => {
    const paymentConfig = {
      paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      failed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    };

    const config = paymentConfig[status] || paymentConfig.pending;

    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const handleDownloadDocuments = (order) => {
    console.log('Download documents for:', order.id);
    // Trigger document download
  };

  const handleReorder = (order) => {
    console.log('Reorder items from:', order.id);
    // Add items to cart
  };

  const handleRequestRefund = (order) => {
    console.log('Request refund for:', order.id);
    // Open refund request modal
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

  // Handle bulk actions
  const handleBulkDownload = () => {
    console.log('Bulk download for:', Array.from(selectedOrders));
    // Implement bulk document download
  };

  if (loading) {
    return (
       <div className="px-6 md:px-36 py-12 flex items-center justify-center min-h-[60dvh] w-full bg-white rounded-lg border border-gray-200 mt-4">
                <p className="text-center text-gray-400">Loading your orders...</p>
        </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 mt-4">
      {/* Table Header with Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAndSortedOrders.length} orders found
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.size > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-md">
            <span className="text-sm font-medium text-blue-700">
              {selectedOrders.size} order(s) selected
            </span>
            <button
              onClick={handleBulkDownload}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download size={14} />
              Download All
            </button>
            <button
              onClick={() => setSelectedOrders(new Set())}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>
          </div>
        )}
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
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                  onClick={() => handleSort('placed_at')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Date
                  {sortConfig.key === 'placed_at' && (
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
                  <p className="text-gray-500">No orders found matching your criteria</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
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
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                    <div className="text-xs text-gray-500">{order.item_count} item(s)</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(order.placed_at)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PaymentBadge status={order.payment_status} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(order.total_amount, order.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadDocuments(order)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Download Documents"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleReorder(order)}
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Reorder"
                      >
                        <ShoppingCart size={16} />
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
                      ? 'bg-blue-600 text-white'
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
        <div className="flex items-center justify-between">
          <div>
            • Orders can be reordered up to 30 days after completion
            • Refund requests available within 14 days
          </div>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-800"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;