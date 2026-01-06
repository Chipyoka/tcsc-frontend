import React, { useState, useEffect } from 'react';
import {
  Pause,
  XCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

import useAuthStore from '../../store/auth.store.js';
import { useProfileStore } from "../../store/profile.store.js";

import axiosInstance from '../../api/axiosInstance'; 


const SubscriptionsSection = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState (false);
  const [expandedId, setExpandedId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const { setAddress, address } = useProfileStore();
  const { accessToken, user, updateUser } = useAuthStore();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get('/memberships/me', {
         timeout: 15000,
      });

      console.log("Fetched memberships: ", response.data);
      setMemberships(response.data);

    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out after 15 seconds');
        setTimedOut(true);
      } else {
        console.error('Failed to fetch memberships:', error);
      }
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
       <div className="px-6 md:px-36 py-12 flex flex-col gap-4 items-center justify-center min-h-[50dvh] w-full bg-white rounded-lg border border-gray-200 mt-4">
          <div className="loader"></div>
          <p className="text-center text-gray-400">Loading your subscriptions...</p>
        </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200 mt-4 ">
      {/* <h4 className="capitalize">Subcriptions and Memberships</h4> */}
      <div className="flex flex-col justify-center items-center min-h-[40dvh]">
        {!timedOut && (
          <>
            {memberships.length > 1 ? (
              <div>
                  <h4 className="capitalize">Subcriptions and Memberships</h4>
                  {memberships.map((m)=>(
                    <div key={m.id} className="rounded-sm bg-gray-50 border border-transparent hover:border-gray-200 text-gray-600">
                        <p>{m.name ?? "unknown"}</p>
                    </div>
                  ))}
              </div>
            ):(
              <div>
                <p>No subscriptions to show</p>
              </div>
            )}
          </>
        )}

        {/* Show service unavailable on timeout */}
        {timedOut && (
          <> 
            <p className="text-lg">Service unavailable.</p>
            <p className="t-sm text-gray-400">Our team is currently working on it.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsSection;