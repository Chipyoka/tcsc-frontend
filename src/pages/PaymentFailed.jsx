import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Logo from "../assets/images/logo-l-w.png";
import FooterSmall from "../components/FooterSmall.jsx";
import { useNavStore } from "../store/nav.store.js";
import { X, Loader2, AlertTriangle, CreditCard, Shield, RefreshCw, ShoppingCart, Home, ArrowLeft, AlertCircle } from "lucide-react";
import axiosInstance from '../api/axiosInstance';
import useAuthStore from "../store/auth.store";


const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [failureDetails, setFailureDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [retrying, setRetrying] = useState(false);
    const [error, setError] = useState(null);
    const { productCategory } = useNavStore();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/failed?session_id=${sessionId}` } });
            return;
        }

        // Fetch failure details from backend
        const fetchFailureDetails = async () => {
            if (!sessionId) {
                setLoading(false);
                return;
            }

            try {
                // Call backend to get session details
                const response = await axiosInstance.get(`/payments/check-session?session_id=${sessionId}`);
                
                if (response.data.success) {
                    setFailureDetails(response.data);
                    
                    // Extract failure reason from Stripe response
                    if (response.data.session?.last_payment_error) {
                        setError(response.data.session.last_payment_error.message);
                    } else if (response.data.session?.payment_status === 'unpaid') {
                        setError("Payment was not completed");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch session details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFailureDetails();

        // Set page title
        window.document.title = `Payment Failed | The Cleaning Supplies Co.`;
    }, [sessionId, navigate, isAuthenticated]);

    /**
     * Handle retry payment - redirects to checkout
     */
    const handlePaymentRetry = () => {
        setRetrying(true);
        
        // Navigate back to checkout to retry
        setTimeout(() => {
            navigate('/checkout');
        }, 1000);
    };

    /**
     * Handle load order summary retry.
     */
    const handleRetryLoad = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const handleGoToCart = () => {
        navigate('/cart');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleContactSupport = () => {
        navigate('/contact-us');
    };

    const handleBackToCheckout = () => {
        navigate('/checkout');
    };

    // Common payment failure reasons and solutions
    const failureReasons = [
        {
            title: "Insufficient Funds",
            description: "Your card was declined due to insufficient funds.",
            solution: "Check your account balance or use a different payment method."
        },
        {
            title: "Card Declined",
            description: "Your card issuer declined the transaction.",
            solution: "Contact your bank or use a different card."
        },
        {
            title: "Expired Card",
            description: "The card you used has expired.",
            solution: "Update your card details or use a different card."
        },
        {
            title: "Security Check Failed",
            description: "Additional verification was required but not completed.",
            solution: "Try again and complete any security checks from your bank."
        }
    ];

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
                    <p className="text-gray-600 text-lg">Loading payment details...</p>
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
                        onClick={handleContactSupport}
                    >
                        <span className="hidden md:inline-block">Contact</span> Support
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-4 md:px-36 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Error Banner */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl p-8 mb-8 text-white text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                <X className="w-12 h-12" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">Payment Failed</h1>
                            <p className="text-lg opacity-90 max-w-2xl">
                                We couldn't process your payment. Your order has been saved and no charges were applied.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Error Details */}
                        <div className="lg:col-span-2">
                            {/* Error Details Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                        Failed
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-red-800 mb-1">Payment Error</p>
                                                    <p className="text-red-700">{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Session Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Session ID</p>
                                            <p className="text-lg font-mono text-gray-800 break-all">
                                                {sessionId?.substring(0, 20)}...
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Time</p>
                                            <p className="text-lg font-medium text-gray-800">
                                                {new Date().toLocaleTimeString('en-GB', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Status</p>
                                            <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                                Payment Failed
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Amount</p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {failureDetails?.session?.amount_total 
                                                    ? `£${(failureDetails.session.amount_total / 100).toFixed(2)}`
                                                    : 'N/A'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Common Issues */}
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 mb-4">Common Payment Issues</h3>
                                        <div className="space-y-3">
                                            {failureReasons.map((reason, index) => (
                                                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start gap-3">
                                                        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-medium text-gray-800">{reason.title}</p>
                                                            <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
                                                            <p className="text-sm text-green-700 mt-2">
                                                                <span className="font-medium">Solution:</span> {reason.solution}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Safety Assurance */}
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-green-800 mb-1">Your Order is Safe</p>
                                                <p className="text-sm text-green-700">
                                                    No charges have been applied to your card. Your cart items have been saved, 
                                                    and you can retry payment or modify your order at any time.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Retry Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Try Again</h2>
                                
                                <div className="space-y-4">
                                    {/* Primary Retry */}
                                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-blue-800 mb-2">Retry Payment</h3>
                                                <p className="text-blue-700">
                                                    Use the same payment method or choose a different one
                                                </p>
                                            </div>
                                            <button
                                                onClick={handlePaymentRetry}
                                                disabled={retrying}
                                                className="btn-primary-sm px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {retrying ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                                                        Redirecting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw className="w-5 h-5 inline mr-2" />
                                                        Retry Now
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Alternative Options */}
                                    <div>
                                        <h3 className="font-medium text-gray-800 mb-4">Other Options</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                onClick={handleGoToCart}
                                                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Modify Cart</p>
                                                        <p className="text-sm text-gray-600">Add or remove items</p>
                                                    </div>
                                                </div>
                                            </button>
                                            
                                            <button
                                                onClick={handleBackToCheckout}
                                                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Checkout Again</p>
                                                        <p className="text-sm text-gray-600">Update shipping details</p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Support & Help */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Quick Actions Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <button
                                            onClick={handlePaymentRetry}
                                            disabled={retrying}
                                            className="btn-primary-sm w-full flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {retrying ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Retrying...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-5 h-5" />
                                                    Retry Payment
                                                </>
                                            )}
                                        </button>
                                        
                                        <button
                                            onClick={handleGoToCart}
                                            className="btn-primary-outlined-sm w-full flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            View Cart
                                        </button>
                                        
                                        <button
                                            onClick={handleBackToCheckout}
                                            className="btn-primary-outlined-sm w-full flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                            Back to Checkout
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
                                    <h3 className="font-bold text-lg text-gray-800 mb-4">Need Immediate Help?</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Our support team is here to help you complete your purchase.
                                    </p>
                                    <button
                                        onClick={handleContactSupport}
                                        className="btn-primary-sm w-full"
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

                                {/* Payment Security Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Shield className="w-6 h-6 text-green-600" />
                                        <h4 className="font-bold text-gray-800">Payment Security</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Your payment security is our priority. All transactions are:
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>256-bit SSL encrypted</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>PCI DSS compliant</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>No card details stored</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>Powered by Stripe</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Common Solutions Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h4 className="font-bold text-gray-800 mb-3">Quick Fixes</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Check your card expiry date</li>
                                        <li>• Ensure sufficient funds</li>
                                        <li>• Try a different card</li>
                                        <li>• Contact your bank</li>
                                        <li>• Clear browser cache and try again</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Banner */}
                    <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-amber-800">Important Notice</h3>
                                    <p className="text-amber-700">
                                        If you continue experiencing payment issues, please contact your bank or card issuer.
                                        They can provide specific details about why the transaction was declined.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleContactSupport}
                                className="btn-primary-outlined-sm whitespace-nowrap"
                            >
                                Get Help Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <FooterSmall />
        </div>
    );
};

export default PaymentFailed;