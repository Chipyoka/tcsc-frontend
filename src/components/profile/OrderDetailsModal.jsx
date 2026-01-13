import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axiosInstance from '../../api/axiosInstance';  // adjust path if needed

export default function OrderDetailsModal({ orderId, isOpen, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tip, setTip] = useState("");

  // Fetch order details
  useEffect(() => {
    if (!isOpen) return; // only fetch if modal is open
    if (!orderId) {
      setError("Order ID is required.");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setTip("Check your internet.");
        }, 5000);
        setError("");
        const { data } = await axiosInstance.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load order details."
        );
      } finally {
        setLoading(false);
        setTip("");
      }
    };

    fetchOrder();
  }, [orderId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-sm font-medium">Order Details</h2>

          <div onClick={onClose} className="bg-gray-50 hover:bg-gray-100 p-2  rounded-full h-8 w-8 flex items-center justify-center">
            <button
              className="text-gray-500 hover:text-gray-600 font-bold"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {loading && (
             <div className="px-6 md:px-36 py-12 flex flex-col gap-4 items-center justify-center min-h-[40dvh] w-full bg-white ">
              <div className="loader"></div>
                <p className="text-center text-gray-400">Loading details...</p>
              { loading && (
                <p className="text-center text-xs text-gray-400" >{tip ?? ""}</p>
              )
            
              }
            </div>
          )}
          {error && (
              <p className="text-red-400 text-center items-center justify-center flex flex-col min-h-[40dvh] font-medium py-4 bg-red-50/70">
                {error}
                <br />
                <span className="text-xs font-normal">Try again later</span>
                </p>
            )}

          {order && (
            <div className="space-y-4">
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Customer:</strong> {order.customer_name}
              </p>
              <p>
                <strong>Email:</strong> {order.customer_email}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> ${order.total}
              </p>

              <div>
                <strong>Items:</strong>
                <ul className="list-disc list-inside">
                  {order.items?.map((item) => (
                    <li key={item.id}>
                      {item.name} x {item.quantity} - ${item.price}
                    </li>
                  ))}
                </ul>
              </div>

              {order.notes && (
                <p>
                  <strong>Notes:</strong> {order.notes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

OrderDetailsModal.propTypes = {
  orderId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
