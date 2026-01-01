import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Package,
  Pause,
  SkipForward,
  XCircle,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Download,
  Bell,
  RefreshCw,
  ChevronDown,
  MoreVertical,
  TrendingUp,
  Clock
} from 'lucide-react';

// Mock data for subscriptions
const mockSubscriptions = [
  {
    id: 'sub-1',
    name: 'Discount Club Premium',
    type: 'discount_club',
    status: 'active',
    next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    amount: 4999, // $49.99 in cents
    currency: 'GBP',
    interval: 'monthly',
    payment_method: 'credit_card',
    card_last4: '4242',
    benefits: ['20% discount on all orders', 'Free shipping', 'Priority support'],
    upcoming_charge: 4999,
    deliveries: [
      { date: new Date(Date.now() + 7 * 86400000).toISOString(), status: 'scheduled' },
      { date: new Date(Date.now() + 37 * 86400000).toISOString(), status: 'pending' }
    ]
  },
  {
    id: 'sub-2',
    name: 'Office Supplies Replenishment',
    type: 'recurring_order',
    status: 'active',
    next_billing_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    amount: 12500, // $125.00 in cents
    currency: 'GBP',
    interval: 'bi_monthly',
    payment_method: 'bank_transfer',
    items: [
      { name: 'Premium Paper', quantity: 10, unit: 'reams' },
      { name: 'Black Ink Cartridges', quantity: 4, unit: 'packs' },
      { name: 'Sticky Notes', quantity: 5, unit: 'packs' }
    ],
    upcoming_charge: 12500,
    deliveries: [
      { date: new Date(Date.now() + 14 * 86400000).toISOString(), status: 'scheduled' }
    ]
  },
  {
    id: 'sub-3',
    name: 'Coffee Supply Subscription',
    type: 'recurring_order',
    status: 'paused',
    next_billing_date: new Date(Date.now() + 60 * 86400000).toISOString(),
    amount: 8500, // $85.00 in cents
    currency: 'GBP',
    interval: 'monthly',
    payment_method: 'paypal',
    items: [
      { name: 'Colombian Dark Roast', quantity: 5, unit: 'lbs' },
      { name: 'Paper Filters', quantity: 2, unit: 'boxes' }
    ],
    upcoming_charge: 0,
    pause_until: new Date(Date.now() + 30 * 86400000).toISOString(),
    deliveries: []
  }
];

const SubscriptionsSection = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setSubscriptions(mockSubscriptions);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'GBP') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getIntervalLabel = (interval) => {
    const labels = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      bi_monthly: 'Every 2 months',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    };
    return labels[interval] || interval;
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle },
      paused: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: Pause },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', icon: XCircle },
      pending: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock }
    };

    const { bg, text, border, icon: Icon } = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text} ${border} border`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handlePauseSubscription = (subscriptionId, days) => {
    console.log(`Pause subscription ${subscriptionId} for ${days} days`);
    // Implement pause logic
  };

  const handleSkipDelivery = (subscriptionId, deliveryIndex) => {
    console.log(`Skip delivery ${deliveryIndex} for subscription ${subscriptionId}`);
    // Implement skip logic
  };

  const handleCancelSubscription = (subscriptionId) => {
    console.log(`Cancel subscription ${subscriptionId}`);
    setShowCancelConfirm(null);
    // Implement cancel logic
  };

  const handleUpdatePaymentMethod = (subscriptionId) => {
    console.log(`Update payment method for ${subscriptionId}`);
    // Implement payment method update
  };

  const handleDownloadInvoice = (subscriptionId, period) => {
    console.log(`Download invoice for ${subscriptionId} - ${period}`);
    // Implement invoice download
  };

  if (loading) {
    return (
       <div className="px-6 md:px-36 py-12 flex items-center justify-center min-h-[50dvh] w-full bg-white rounded-lg border border-gray-200 mt-4">
                <p className="text-center text-gray-400">Loading your subscriptions...</p>
        </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200 mt-4">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Active Subscriptions</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your recurring services, deliveries, and billing
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchSubscriptions}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="divide-y divide-gray-200">
        {subscriptions.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active subscriptions</p>
            <button
              onClick={() => console.log('Browse subscriptions')}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Browse available subscriptions →
            </button>
          </div>
        ) : (
          subscriptions.map((subscription) => (
            <div key={subscription.id} className="p-6 hover:bg-gray-50 transition-colors">
              {/* Subscription Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-600">
                          {subscription.name}
                        </h3>
                        {getStatusBadge(subscription.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {getIntervalLabel(subscription.interval)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CreditCard size={14} />
                          {subscription.payment_method === 'credit_card' 
                            ? `•••• ${subscription.card_last4}`
                            : subscription.payment_method.replace('_', ' ')}
                        </span>
                        {subscription.type === 'discount_club' && (
                          <span className="flex items-center gap-1.5 text-green-600">
                            <CheckCircle size={14} />
                            {subscription.benefits?.length || 0} benefits
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(subscription.amount, subscription.currency)}
                        </div>
                        <div className="text-sm text-gray-500">
                          per {subscription.interval === 'bi_monthly' ? '2 months' : subscription.interval}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedId(expandedId === subscription.id ? null : subscription.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm"
                      >
                        <ChevronDown 
                          size={20} 
                          className={`transition-transform ${expandedId === subscription.id ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === subscription.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Billing & Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Billing & Actions</h4>
                      
                      <div className="space-y-4">
                        {/* Next Billing */}
                        <div className="p-4 bg-blue-50 rounded-sm border border-blue-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-800">Next Billing Date</span>
                            <Bell size={16} className="text-blue-600" />
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {formatDate(subscription.next_billing_date)}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Upcoming charge: {formatCurrency(subscription.upcoming_charge, subscription.currency)}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          {subscription.status === 'active' && (
                            <>
                              <button
                                onClick={() => handlePauseSubscription(subscription.id, 30)}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <Pause size={16} />
                                Pause
                              </button>
                              <button
                                onClick={() => handleSkipDelivery(subscription.id, 0)}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <SkipForward size={16} />
                                Skip Next Delivery
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => handleUpdatePaymentMethod(subscription.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <CreditCard size={16} />
                            Update Payment
                          </button>
                          
                          {showCancelConfirm === subscription.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Confirm cancellation?</span>
                              <button
                                onClick={() => handleCancelSubscription(subscription.id)}
                                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-sm hover:bg-red-700"
                              >
                                Yes, Cancel
                              </button>
                              <button
                                onClick={() => setShowCancelConfirm(null)}
                                className="px-3 py-1.5 border border-gray-300 text-sm rounded-sm hover:bg-gray-50"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowCancelConfirm(subscription.id)}
                              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-sm text-sm font-medium hover:bg-red-50"
                            >
                              <XCircle size={16} />
                              Cancel Subscription
                            </button>
                          )}
                        </div>

                        {/* Documents */}
                        <div className="pt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleDownloadInvoice(subscription.id, 'last')}
                              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                              <Download size={12} />
                              Last Invoice
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(subscription.id, 'current')}
                              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                              <Download size={12} />
                              Current Period
                            </button>
                            <button
                              onClick={() => console.log('View all invoices')}
                              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                              View All
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Details */}
                    <div>
                      {subscription.type === 'recurring_order' ? (
                        <>
                          <h4 className="text-sm font-semibold text-gray-700 mb-4">Recurring Items</h4>
                          <div className="space-y-3">
                            {subscription.items?.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                                <div>
                                  <div className="font-medium text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-600">Regular delivery</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-gray-900">
                                    {item.quantity} {item.unit}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {subscription.interval}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Deliveries */}
                          {subscription.deliveries?.length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Deliveries</h4>
                              <div className="space-y-2">
                                {subscription.deliveries.map((delivery, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-sm">
                                    <div className="flex items-center gap-3">
                                      <Package size={16} className="text-gray-500" />
                                      <div>
                                        <div className="font-medium text-gray-900">
                                          Delivery #{index + 1}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {formatDate(delivery.date)}
                                        </div>
                                      </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                      delivery.status === 'scheduled' 
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                    }`}>
                                      {delivery.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <h4 className="text-sm font-semibold text-gray-700 mb-4">Membership Benefits</h4>
                          <ul className="space-y-2">
                            {subscription.benefits?.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
                                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                          
                          {/* Notifications */}
                          <div className="mt-6 p-4 bg-gray-50 rounded-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <Bell size={16} className="text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Notifications</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              You'll receive notifications 3 days before renewal and when benefits change.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            • Cancel anytime • No hidden fees • 24/7 subscription support
          </div>
          <button
            onClick={() => console.log('Contact support')}
            className="text-blue-600 hover:text-blue-800"
          >
            Need help? Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsSection;