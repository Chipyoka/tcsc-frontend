import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  X,
  CheckCircle,
  Clock,
  RefreshCw,
  XCircle,
  Package,
  MapPin,
  CreditCard,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

/**
 * Order Details Modal
 * Designed to align visually and architecturally with OrdersTable
 */
export default function OrderDetailsModal({ orderId, isOpen, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tip, setTip] = useState("");

  /* ----------------------------------
   * Helpers (mirrors OrdersTable)
   * ---------------------------------- */

  const formatCurrency = (amount, currency = "USD") => {
    if (amount === undefined || amount === null) return "-";
    const numeric = Number(amount);
    if (Number.isNaN(numeric)) return "-";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(numeric / 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatusBadge = ({ status }) => {
    const config = {
      completed: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: CheckCircle,
        label: "Completed",
      },
      processing: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: RefreshCw,
        label: "Processing",
      },
      pending_payment: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: Clock,
        label: "Pending Payment",
      },
      cancelled: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-300",
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const badge = config[status] || config.pending_payment;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}
      >
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  /* ----------------------------------
   * Data Fetch
   * ---------------------------------- */

  useEffect(() => {
    if (!isOpen) return;
    if (!orderId) {
      setError("Order ID is required.");
      return;
    }

    let tipTimer;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        setOrder(null);

        tipTimer = setTimeout(() => {
          setTip("This is taking longer than usual. Please check your connection.");
        }, 5000);

        const { data } = await axiosInstance.get(`/orders/${orderId}`);
        setOrder(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details.");
      } finally {
        clearTimeout(tipTimer);
        setTip("");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isOpen]);

  if (!isOpen) return null;

  /* ----------------------------------
   * Render
   * ---------------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Order Details</h2>
            {order?.order_number && (
              <p className="text-sm text-gray-500">{order.order_number}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[40dvh] gap-3">
              <div className="loader"></div>
              <p className="text-gray-400">Loading order details...</p>
              {tip && <p className="text-xs text-gray-400">{tip}</p>}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center min-h-[40dvh] bg-red-50 rounded-sm p-6">
              <p className="text-red-600 font-medium">{error}</p>
              <span className="text-xs text-gray-500 mt-1">
                Please try again later.
              </span>
            </div>
          )}

          {order && (
            <div className="space-y-6 text-gray-700">
              {/* Meta */}
              <div className="flex flex-wrap gap-4 items-center">
                <StatusBadge status={order.status} />
                <span className="text-sm text-gray-500">
                  Placed on <span className="font-bold text-(--color-primary)">{formatDate(order.placed_at || order.created_at)} </span>
                </span>
              </div>

              {/* Financial Summary */}
              <div className="bg-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 border border-gray-200 rounded-sm p-4">
                <div>
                  <p className="text-xs text-gray-500">Subtotal</p>
                  <p className="font-medium">
                    {formatCurrency(order.subtotal_amount, order.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shipping</p>
                  <p className="font-medium">
                    {formatCurrency(order.shipping_amount, order.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tax</p>
                  <p className="font-medium">
                    {formatCurrency(order.taxes_amount, order.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(order.total_amount, order.currency)}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Package size={16} /> Items
                </h3>
                <div className="divide-y divide-gray-300 border border-gray-200 rounded-sm">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} • SKU: {item.sku}
                        </p>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(
                          item.line_total_amount,
                          order.currency
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <MapPin size={16} /> Shipping Address
                  </h3>
                  <div className="border border-gray-200 rounded-sm p-4 text-sm text-gray-600">
                    <p className="font-medium">
                      {order.shipping_address.full_name}
                    </p>
                    <p>{order.shipping_address.line1}</p>
                    {order.shipping_address.line2 && (
                      <p>{order.shipping_address.line2}</p>
                    )}
                    <p>
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-600">If any of the information is incorrect, kindly contact support</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-sm border border-gray-300 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

OrderDetailsModal.propTypes = {
  orderId: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
