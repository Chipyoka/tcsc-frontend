import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  Download,
  CreditCard,
  Building,
  Banknote,
  Wallet,
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
  Receipt,
  ExternalLink
} from 'lucide-react';

// Mock data for payments
const mockPayments = Array.from({ length: 30 }, (_, i) => ({
  id: `payment-${i + 1}`,
  payment_number: `PAY-${String(i + 2000).padStart(6, '0')}`,
  reference: `INV-${String(i + 3000).padStart(4, '0')}`,
  date: new Date(Date.now() - i * 172800000).toISOString(), // Every 2 days
  amount: (Math.random() * 2000 + 100) * 100, // In cents
  currency: ['USD', 'EUR', 'GBP'][i % 3],
  status: ['completed', 'pending', 'failed', 'refunded'][i % 4],
  method: ['credit_card', 'bank_transfer', 'paypal', 'account_credit'][i % 4],
  linked_orders: Math.floor(Math.random() * 3) + 1,
  notes: i % 5 === 0 ? 'Partial payment' : null
}));

const PaymentsTable = ({ tenantId, userId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, [tenantId, userId]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setPayments(mockPayments);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort payments
  const filteredAndSortedPayments = useMemo(() => {
    let filtered = [...payments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Apply method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

    return filtered;
  }, [payments, searchTerm, statusFilter, methodFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPayments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPayments, currentPage, itemsPerPage]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle },
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock },
      failed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
      refunded: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: RefreshCw }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment method icon
  const PaymentMethodIcon = ({ method }) => {
    const icons = {
      credit_card: CreditCard,
      bank_transfer: Building,
      paypal: Wallet,
      account_credit: Banknote
    };
    
    const Icon = icons[method] || CreditCard;
    const labels = {
      credit_card: 'Credit Card',
      bank_transfer: 'Bank Transfer',
      paypal: 'PayPal',
      account_credit: 'Account Credit'
    };

    return (
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-gray-500" />
        <span className="text-sm text-gray-700">{labels[method]}</span>
      </div>
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle payment actions
  const handleViewDetails = (payment) => {
    console.log('View payment details:', payment.id);
  };

  const handleDownloadReceipt = (payment) => {
    console.log('Download receipt for:', payment.id);
  };

  const handleViewLinkedOrders = (payment) => {
    console.log('View linked orders for:', payment.id);
  };

  if (loading) {
    return (
       <div className="px-6 md:px-36 py-12 flex items-center justify-center min-h-[50dvh] w-full bg-white rounded-lg border border-gray-200 mt-4">
                <p className="text-center text-gray-400">Loading your payments...</p>
        </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200 mt-4">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Payment Ledger</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAndSortedPayments.length} transactions • Financial transparency and reconciliation
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search payment or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={fetchPayments}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="account_credit">Account Credit</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>

          {/* Financial Summary */}
          <div className="ml-auto flex items-center gap-4 text-sm">
            <div className="text-gray-600">
              Balance: <span className="font-semibold text-green-600">$4,238.50</span>
            </div>
            <div className="text-gray-600">
              Outstanding: <span className="font-semibold text-yellow-600">$1,250.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('payment_number')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Payment #
                  {sortConfig.key === 'payment_number' && (
                    <ChevronDown size={12} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Date & Time
                  {sortConfig.key === 'date' && (
                    <ChevronDown size={12} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Amount
                  {sortConfig.key === 'amount' && (
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
            {paginatedPayments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No payments found matching your criteria</p>
                  {(searchTerm || statusFilter !== 'all' || methodFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setMethodFilter('all');
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Clear all filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{payment.payment_number}</div>
                    {payment.notes && (
                      <div className="text-xs text-yellow-600 mt-1">{payment.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{payment.reference}</div>
                    <div className="text-xs text-gray-500">{payment.linked_orders} linked order(s)</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-6 py-4">
                    <PaymentMethodIcon method={payment.method} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadReceipt(payment)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                        title="Download Receipt"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleViewLinkedOrders(payment)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                        title="View Linked Orders"
                      >
                        <ExternalLink size={16} />
                      </button>
                      {payment.status === 'completed' && (
                        <button
                          onClick={() => console.log('Get proof of payment:', payment.id)}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-sm transition-colors"
                          title="Proof of Payment"
                        >
                          <Receipt size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAndSortedPayments.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedPayments.length)}
            </span>{' '}
            of <span className="font-medium">{filteredAndSortedPayments.length}</span> payments
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                  className={`px-3 py-1.5 text-sm rounded-sm ${
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
              className="p-2 border border-gray-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Footer Notes */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <div>
            • Payment receipts available for download 24 hours after completion
            • Refunds processed within 5-7 business days
            • Contact support for payment reconciliation issues
          </div>
          <button
            onClick={() => console.log('Export to CSV')}
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800"
          >
            <Download size={12} />
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTable;