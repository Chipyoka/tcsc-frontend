import { useEffect, useState } from "react";
import { ChevronRight, CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Topbar from '../components/Topbar';
import axiosInstance from '../api/axiosInstance'; // or your preferred HTTP client

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [countdown, setCountdown] = useState(5);
    const [canResend, setCanResend] = useState(true);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Set title
    useEffect(() => {
        window.document.title = "Verify Your Email | The Cleaning Supplies Co.";
    }, []);

    // Extract token from URL
    const token = searchParams.get('token');

    // Handle email verification
    useEffect(() => {
        if (!token) {
            setVerificationStatus('error');
            setErrorMessage('Invalid verification link. No token provided.');
            return;
        }

        verifyEmailToken(token);
    }, [token]);

    // Countdown timer for auto-redirect
 // Countdown timer for auto-redirect
    useEffect(() => {
        if (verificationStatus === 'success' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (verificationStatus === 'success' && countdown === 0) {
            navigate('/');
        }
    }, [verificationStatus, countdown, navigate]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (resendCooldown === 0) {
            setCanResend(true);
        }
    }, [resendCooldown]);


    const verifyEmailToken = async (token) => {
        try {
       const response = await axiosInstance.get(
            '/auth/verify-email',
            {
                token,
            }
        );


            if (response.status === 200) {
                setVerificationStatus('success');
                // Clear token from URL for security
                window.history.replaceState({}, '', '/verify-email');
            }
        } catch (error) {
            setVerificationStatus('error');
            
            // Handle specific error messages from backend
            if (error.response?.data?.message) {
                const message = error.response.data.message;
                if (message.includes('expired')) {
                    setErrorMessage('This verification link has expired. Please request a new one.');
                    setCanResend(true);
                } else if (message.includes('invalid')) {
                    setErrorMessage('Invalid verification link. Please check the link or request a new one.');
                    setCanResend(true);
                } else {
                    setErrorMessage(message);
                }
            } else {
                setErrorMessage('An error occurred during verification. Please try again.');
            }
        }
    };

    // Handle email resend
    const handleResendVerification = async () => {
            if (!canResend || resendCooldown > 0) return;

            try {
                // 
                // await axiosInstance.post('/profile/send-verification-email', {
                //     email: localStorage.getItem('pendingVerificationEmail') // Store email during registration
                // });
                console.log("Resend email Triggered");
                
                setCanResend(false);
                setResendCooldown(60); // 60 second cooldown
                setErrorMessage(''); // Clear previous errors
                setVerificationStatus('stall');
                
                // Show success message (you could add a toast notification here)
                // alert('New verification email sent! Please check your inbox.');
            } catch (error) {
                setErrorMessage('Failed to resend verification email. Please try again later.');
            }
        };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <>
            <Topbar />
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
                <div className="bg-white border border-gray-200 rounded-md w-full max-w-md p-6 md:py-8 md:px-10 flex flex-col justify-center items-center text-center">
                    
                    {/* Header Icon */}
                    <div className={`mb-4 p-3 rounded-full ${
                        verificationStatus === 'stall' ? 'bg-gray-50' :
                        verificationStatus === 'verifying' ? 'bg-blue-50' :
                        verificationStatus === 'success' ? 'bg-green-50' :
                        'bg-red-50'
                    }`}>
                        {verificationStatus === 'stall' && (
                            <Mail className="h-8 w-8 text-gray-600" />
                        )}
                        {verificationStatus === 'verifying' && (
                            <Loader2 className="h-8 w-8 text-(--color-primary) animate-spin" />
                        )}
                        {verificationStatus === 'success' && (
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        )}
                        {verificationStatus === 'error' && (
                            <XCircle className="h-8 w-8 text-red-500" />
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl text-[var(--color-primary)] font-bold mb-3">
                        {verificationStatus === 'stall' && 'Check Your Email'}
                        {verificationStatus === 'verifying' && 'Verifying Your Email'}
                        {verificationStatus === 'success' && 'Email Verified!'}
                        {verificationStatus === 'error' && 'Verification Failed'}
                    </h2>

                    {/* Status Messages */}
                    {verificationStatus === 'stall' && (
                        <>
                            <p className="text-gray-600 mb-3 text-lg">
                                Please check your mailbox for a new verification link...
                            </p>

                             {/* Return to Home */}
                            <div className="w-full mt-4">
                                <button 
                                    onClick={handleGoHome}
                                    className="w-full rounded-sm hover:bg-blue-50 py-4 text-sm mt-2 font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-h)] transition duration-300 ease-in-out"
                                >
                                    Return Home <ChevronRight className="h-4 w-4 inline border-none hover:border-none" />
                                </button>
                            </div>
                           
                        </>
                    )}

                    {verificationStatus === 'verifying' && (
                        <>
                            <p className="text-gray-600 mb-3 text-lg">
                                Please wait while we verify your email address...
                            </p>
                            <p className="t-sm my-2 text-gray-400">Almost done...</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                                <div className="bg-(--color-primary) h-1.5 rounded-full animate-pulse"></div>
                            </div>
                        </>
                    )}

                    {verificationStatus === 'success' && (
                        <>
                            <p className="text-gray-600 mb-4 text-lg">
                                Your email has been successfully verified!
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Redirecting to homepage in {countdown} seconds...
                            </p>

                            <div className="flex flex-col gap-4 w-full">

                            <button
                                onClick={handleGoToLogin}
                               className="w-full btn-primary-sm"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={handleGoHome}
                                className="hover:bg-blue-50 py-4 text-sm mt-2 font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-h)] transition duration-300 ease-in-out"
                            >
                                Return Home Now <ChevronRight className="h-4 w-4 inline" />
                            </button>
                            </div>
                        </>
                    )}

                    {verificationStatus === 'error' && (
                        <>
                            <p className="text-gray-600 mb-4 text-lg">
                                {errorMessage}
                            </p>
                            
                            {/* Resend Button (only show if token expired/invalid) */}
                            {canResend && (
                                <button
                                    onClick={handleResendVerification}
                                    disabled={resendCooldown > 0}
                                    className={`  w-full btn-primary-sm ${
                                        resendCooldown > 0 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-h)]'
                                    }`}
                                >
                                    {resendCooldown > 0 
                                        ? `Resend Available in ${resendCooldown}s`
                                        : 'Resend Verification Email'
                                    }
                                </button>
                            )}

                            {/* Check Spam Folder Reminder */}
                            <p className="text-gray-600 w-fit px-2 py-1 mt-6 bg-gray-100">If you did not see the email, please check your <b>spam</b> or <b>junk</b> folder.</p>

                            {/* Return to Home */}
                            <div className="w-full mt-4">
                                <button 
                                    onClick={handleGoHome}
                                    className="w-full rounded-sm hover:bg-blue-50 py-4 text-sm mt-2 font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-h)] transition duration-300 ease-in-out"
                                >
                                    Return Home <ChevronRight className="h-4 w-4 inline border-none hover:border-none" />
                                </button>
                            </div>
                        </>
                    )}

                   
                </div>


            </div>
        </>
    );
};

export default VerifyEmail;