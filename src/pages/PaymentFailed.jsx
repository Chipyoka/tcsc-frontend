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
                    <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-sm p-8 mb-8 text-white text-center">
                        <div className="flex flex-col items-center">
                           
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">Payment Failed</h1>
                            <p className="text-lg opacity-90 max-w-2xl">
                                We couldn't process your payment, no charges were applied.
                            </p>
                  
                        </div>
                    </div>
                    <div class="px-4">
                        <h3 className="font-medium text-gray-600 mb-2">The payment process was likely cancelled or one of the reasons below happened</h3>
                    </div>
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white rounded-sm border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-red-50 p-3 rounded-lg">
                                <CreditCard className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                <h3 className="font-medium text-gray-700 mb-2">Insufficient Funds</h3>
                                <p className="text-gray-600 text-sm">
                                    Your account doesn't have enough available balance to complete this transaction.
                                </p>
                                </div>
                            </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-sm border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-amber-50 p-3 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                <h3 className="font-medium text-gray-700 mb-2">Card Details Incorrect</h3>
                                <p className="text-gray-600 text-sm">
                                    Check card number, expiry date, and CVV. Even small typos can cause failures.
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>

                    <div class="my-6">
                        <button onClick={()=>{navigate("/")}} className="btn-primary-outlined-sm w-full md:w-fit">Return Home</button>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <FooterSmall />
        </div>
    );
};

export default PaymentFailed;