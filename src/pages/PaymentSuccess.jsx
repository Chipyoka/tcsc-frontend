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
                const response = await axiosInstance.post(`/stripe/verify-session`, {
                    sessionId,
                });
                
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
                        <button className="btn-primary-sm" onClick={() => navigate("/contact-us")}>
                            <span className="hidden md:inline-block">Contact</span> Support
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                    <div className="bg-white rounded-sm  max-w-md w-full p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Verification Failed</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="space-y-3">
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
                        onClick={() => navigate("/contact-us")}
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
                        <div className="bg-blue-50 border border-blue-200 rounded-sm p-6 mb-8">
                            <div className="flex items-center justify-center gap-4">
                                <Loader2 className="w-6 h-6 text-(--color-primary) animate-spin" />
                                <p className="text-(--color-primary) font-medium">Verifying your payment...</p>
                            </div>
                        </div>
                    )}

                    {/* Success Banner */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-sm p-8 mb-8 text-white text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">Success!</h1>
                            <p className="text-lg opacity-90 max-w-2xl">
                                Thank you for your order
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1  gap-8">
                        {/* Left Column - Order Details */}
                        <div className="lg:col-span-2">
                            {/* Order Info Card */}
                            <div className="bg-white rounded-sm  border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Order Information</h2>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-sm">
                                        Confirmed
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Order Number</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {orderDetails?.order_number || `ORD-${Date.now()}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Order Date</p>
                                        <p className="text-lg font-medium text-gray-800">
                                            {formatDate(new Date())}
                                        </p>
                                    </div>
                                
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Order Total</p>
                                        <p className="text-2xl font-bold text-[var(--color-primary)]">
                                            {orderDetails?.amount || '0.00'}
                                        </p>
                                    </div>
                                </div>

                                {/* Email Confirmation */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-sm border border-blue-100">
                                    <div className="flex items-start gap-3">
                                        <div>
                                            <p className="font-medium text-(--color-primary) mb-1">Confirmation Sent</p>
                                            <p className="text-sm text-(--color-primary)">
                                                A confirmation email has been sent to <span className="font-medium">{user?.email}</span>. 
                                              
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Information */}
                            <div className="bg-white rounded-sm  border border-gray-200 p-6 mb-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Information</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div>
                                            <p className="font-medium text-gray-800">Estimated Delivery</p>
                                            <p className="text-gray-600">{getEstimatedDelivery()}</p>
                                            <p className="text-sm text-gray-500 mt-1">Standard delivery: 3-5 business days</p>
                                        </div>
                                    </div>

                                    {orderDetails?.hasSubscriptions && (
                                        <div className="flex items-start gap-3">
                                            <div>
                                                <p className="font-medium text-gray-800">Subscription Active</p>
                                                <p className="text-gray-600">Your subscription is now active</p>
                                                <p className="text-sm text-green-600 mt-1">
                                                    Next delivery scheduled in 30 days. You can manage your subscription from your account.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 p-4 bg-gray-50 rounded-sm">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Note:</span> You will receive tracking information via email once your order ships.
                                            For any questions about your order, please contact our support team.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 justify-end">
                        <button 
                        onClick={()=>{navigate('/profile')}}
                        className="-full md:-fit btn-primary-outlined-sm">
                            Visit Profile
                        </button>
                        <button 
                        onClick={handleGoHome}
                        className="-full md:-fit btn-primary-sm">
                            Go to home
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <FooterSmall />
        </div>
    );
};

export default PaymentSuccess;