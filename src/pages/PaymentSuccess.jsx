import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../assets/images/logo-l-w.png";
import FooterSmall from "../components/FooterSmall.jsx";
import { useNavStore } from "../store/nav.store.js";
import { CheckCircle2, Loader2, Check, Package, Calendar, Mail, Shield, Home, ShoppingBag } from "lucide-react";
import axiosInstance from '../api/axiosInstance';
import useAuthStore from "../store/auth.store";
import useCartStore from "../store/cart.store";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState(null);
    const { productCategory } = useNavStore();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const { clearCart } = useCartStore();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/success?session_id=${sessionId}` } });
            return;
        }

        // Clear cart on success page load
        clearCart();

        // Verify payment with backend
        const verifyPayment = async () => {
            if (!sessionId) {
                setError("No session ID found");
                setVerifying(false);
                setLoading(false);
                return;
            }

            try {
                // Call backend to verify session
                const response = await axiosInstance.get(`/stripe/verify-session?session_id=${sessionId}`);
                
                if (response.data.success) {
                    setOrderDetails(response.data);
                    
                    // If subscription was purchased, show special message
                    if (response.data.hasSubscriptions) {
                        setTimeout(() => {
                            // Show subscription welcome modal or message
                            console.log("Subscription purchased:", response.data);
                        }, 1000);
                    }
                } else {
                    setError(response.data.message || "Payment verification failed");
                }
            } catch (err) {
                console.error("Verification error:", err);
                setError("Failed to verify payment. Please check your orders page.");
            } finally {
                setVerifying(false);
                setLoading(false);
            }
        };

        verifyPayment();

        // Set page title
        window.document.title = `Order Confirmed | The Cleaning Supplies Co.`;
    }, [sessionId, navigate, isAuthenticated, clearCart]);

    /**
     * Handle redirect to products with last viewed category in effect.
     */
    const handleToShopping = () => {
        if (!productCategory?.subcat) {
        navigate('/');
        return;
        }

        navigate(
        `/products/${productCategory?.cat?.tag}/${productCategory?.subcat?.subcat}/${productCategory?.slug?.subsub}`
        );
    };

    const handleViewOrders = () => {
        navigate('/orders');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calculate estimated delivery date (3-5 business days)
    const getEstimatedDelivery = () => {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 business days minimum
        return formatDate(deliveryDate);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <div className="bg-[var(--color-primary)] flex justify-between items-center px-4 md:px-36 py-4">
                    <div className="py-2 rounded-sm">
                        <img src={Logo} alt="Logo" className="w-36 md:w-40 cursor-pointer" onClick={() => navigate("/")} />
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                    <div className="loader mb-6"></div>
                    <p className="text-gray-600 text-lg">Loading order details...</p>
                </div>
                <FooterSmall />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <div className="bg-[var(--color-primary)] flex justify-between items-center px-4 md:px-36 py-4">
                    <div className="py-2 rounded-sm">
                        <img src={Logo} alt="Logo" className="w-36 md:w-40 cursor-pointer" onClick={() => navigate("/")} />
                    </div>
                    <div>
                        <button className="btn-primary-sm" onClick={() => navigate("/contact")}>
                            <span className="hidden md:inline-block">Contact</span> Support
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                    <div className="bg-white rounded-xl shadow-sm max-w-md w-full p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Verification Failed</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="space-y-3">
                            <button 
                                onClick={() => navigate('/orders')}
                                className="btn-primary-sm w-full"
                            >
                                Check My Orders
                            </button>
                            <button 
                                onClick={handleGoHome}
                                className="btn-primary-outlined-sm w-full"
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>
                <FooterSmall />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-[var(--color-primary)] flex justify-between items-center px-4 md:px-36 py-4">
                <div className="py-2 rounded-sm">
                    <img 
                        src={Logo} 
                        alt="Logo" 
                        className="w-36 md:w-40 cursor-pointer" 
                        onClick={handleGoHome} 
                    />
                </div>
                <div>
                    <button 
                        className="btn-primary-sm"
                        onClick={() => navigate("/contact")}
                    >
                        <span className="hidden md:inline-block">Contact</span> Support
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-4 md:px-36 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Verification Status */}
                    {verifying && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <div className="flex items-center justify-center gap-4">
                                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                <p className="text-blue-700 font-medium">Verifying your payment...</p>
                            </div>
                        </div>
                    )}

                    {/* Success Banner */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 mb-8 text-white text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">Payment Successful!</h1>
                            <p className="text-lg opacity-90 max-w-2xl">
                                Thank you for your order. {orderDetails?.hasSubscriptions 
                                    ? "Your subscription is now active and your first order is being processed."
                                    : "Your order is being processed and will be shipped soon."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Order Details */}
                        <div className="lg:col-span-2">
                            {/* Order Info Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Order Information</h2>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                        Confirmed
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Order Number</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {orderDetails?.order_id || `ORD-${Date.now()}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Order Date</p>
                                        <p className="text-lg font-medium text-gray-800">
                                            {formatDate(new Date())}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                                        <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-green-600" />
                                            Stripe • Card
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Order Total</p>
                                        <p className="text-2xl font-bold text-[var(--color-primary)]">
                                            £{orderDetails?.amount || '0.00'}
                                        </p>
                                    </div>
                                </div>

                                {/* Email Confirmation */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-blue-800 mb-1">Confirmation Sent</p>
                                            <p className="text-sm text-blue-700">
                                                A confirmation email has been sent to <span className="font-medium">{user?.email}</span>. 
                                                Check your inbox for order details and tracking information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Information</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Package className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-800">Estimated Delivery</p>
                                            <p className="text-gray-600">{getEstimatedDelivery()}</p>
                                            <p className="text-sm text-gray-500 mt-1">Standard delivery: 3-5 business days</p>
                                        </div>
                                    </div>

                                    {orderDetails?.hasSubscriptions && (
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-800">Subscription Active</p>
                                                <p className="text-gray-600">Your subscription is now active</p>
                                                <p className="text-sm text-green-600 mt-1">
                                                    Next delivery scheduled in 30 days. You can manage your subscription from your account.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Note:</span> You will receive tracking information via email once your order ships.
                                            For any questions about your order, please contact our support team.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Items</h2>
                                
                                <div className="space-y-4">
                                    {/* Sample items - Replace with actual order items */}
                                    {[
                                        { id: 1, name: "Eco-Friendly All-Purpose Cleaner", price: 12.99, quantity: 2, isSubscription: false },
                                        { id: 2, name: "Monthly Glass Cleaner Subscription", price: 29.99, quantity: 1, isSubscription: true },
                                        { id: 3, name: "Microfibre Cleaning Cloths (Pack of 6)", price: 18.50, quantity: 1, isSubscription: false },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                                        {item.isSubscription && (
                                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                                Subscription
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-gray-800">
                                                    £{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-600">£{item.price.toFixed(2)} each</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Items Total</span>
                                            <span>£65.47</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span>£3.50</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">VAT (20%)</span>
                                            <span>£13.79</span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex justify-between text-xl font-bold">
                                                <span>Total</span>
                                                <span className="text-[var(--color-primary)]">£82.76</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Actions & Support */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Next Steps Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4">Next Steps</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-blue-800">Check your email</p>
                                                <p className="text-sm text-blue-700">Order confirmation sent</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <Package className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-green-800">Track your order</p>
                                                <p className="text-sm text-green-700">Tracking info coming soon</p>
                                            </div>
                                        </div>
                                        {orderDetails?.hasSubscriptions && (
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                                <Calendar className="w-5 h-5 text-purple-600" />
                                                <div>
                                                    <p className="font-medium text-purple-800">Manage subscription</p>
                                                    <p className="text-sm text-purple-700">In your account settings</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4">What would you like to do?</h3>
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleViewOrders}
                                            className="btn-primary-sm w-full flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            View All Orders
                                        </button>
                                        <button
                                            onClick={handleToShopping}
                                            className="btn-primary-outlined-sm w-full flex items-center justify-center gap-2"
                                        >
                                            <Package className="w-5 h-5" />
                                            Continue Shopping
                                        </button>
                                        <button
                                            onClick={handleGoHome}
                                            className="btn-primary-outlined-sm w-full flex items-center justify-center gap-2"
                                        >
                                            <Home className="w-5 h-5" />
                                            Return Home
                                        </button>
                                    </div>
                                </div>

                                {/* Support Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4">Need Help?</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Have questions about your order or need assistance with your subscription?
                                    </p>
                                    <button
                                        onClick={() => navigate("/contact-us")}
                                        className="btn-primary-outlined-sm w-full"
                                    >
                                        Contact Support
                                    </button>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Email:</span> support@cleaningsupplies.co.uk
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="font-medium">Phone:</span> +44 20 7123 4567
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Mon-Fri, 9am-5pm GMT
                                        </p>
                                    </div>
                                </div>

                                {/* Security Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Shield className="w-6 h-6 text-green-600" />
                                        <h4 className="font-bold text-gray-800">Secure Payment</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Your payment was processed securely through Stripe. All transactions are encrypted and PCI compliant.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <FooterSmall />
        </div>
    );
};

export default PaymentSuccess;