import Topbar from '../components/Topbar';
import { useState } from 'react';
import Footer from '../components/Footer';
import Logo from '../assets/images/logo-l.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';

const Register = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    
    // Set title
    window.document.title = "Register | The Cleaning Supplies Co.";

    /**
     * Handle user registration
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Early validation
        if (!fullname || !email || !password || !confirmPassword) {
            toast.error('Please fill in all fields.');
            return;
        }
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        
        setLoading(true);
        
        // Build payload
        const payload = {
            fullName: fullname,
            email: email,
            password: password
        };
        
        console.log('Registration payload:', payload);
        
        try {
            // Make API call with await
            const response = await axiosInstance.post('/auth/register', payload);
            console.log('Registration successful:', response.data);
            
            // Show success message
            toast.success('Registration successful! Please check your email for verification.');
            
            // Optionally: Redirect to login or home page
            setTimeout(() => {
                navigate('/check-email');
            }, 5000);
            
        } catch (error) {
            console.error("Registration error:", error);
            
            // Extract error message from response
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                
                // Try to get specific error message from API response
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.status === 409) {
                    errorMessage = 'Email already exists. Please use a different email.';
                } else if (error.response.status === 400) {
                    errorMessage = 'Invalid registration data. Please check your inputs.';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                errorMessage = 'Network error. Please check your internet connection.';
            } else {
                // Something happened in setting up the request
                console.error('Request setup error:', error.message);
            }
            
            // Show error toast
            toast.error(errorMessage);
        } finally {
            // Reset loading state whether successful or not
            setLoading(false);
        }
    };

    return (
        <>
            <Topbar />
            <div className="flex items-center justify-center my-6">
                <img 
                    src={Logo} 
                    alt="TCSC Logo" 
                    className="w-36 md:w-48 cursor-pointer" 
                    onClick={() => navigate('/')}
                />
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-md w-[90%] max-w-full md:w-lg md:max-w-lg p-4 md:py-6 md:px-12 mx-4 my-8 md:my-8 md:mx-auto flex flex-col justify-center items-center">
                <h2 className="text-3xl md:text-4xl text-[var(--color-primary)] font-bold">
                    Create Account
                </h2>
                
                <form onSubmit={handleRegister} className="w-full">
                    {/* Form fields remain the same */}
                    <div className="my-4">
                        <label htmlFor="fullname" className="text-gray-600">Fullname:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="text"
                                name="fullname"
                                placeholder=""
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="my-4">
                        <label htmlFor="email" className="text-gray-600">Email:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="text"
                                name="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="my-4">
                        <label htmlFor="password" className="text-gray-600">Password:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="password"
                                name="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="my-4">
                        <label htmlFor="confirmPassword" className="text-gray-600">Confirm Password:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder=""
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    
                    
                    <div className="mt-8 mb-4">
                        <button 
                            type="submit" 
                            className="btn-primary-sm w-full"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                    
                    <div className="my-4">
                        <p className="text-lg text-gray-600 text-center font-medium">
                            Already have an account?{' '}
                            <span 
                                onClick={() => navigate('/login')} 
                                className="cursor-pointer font-medium text-[var(--color-primary)]"
                            >
                                Login
                            </span>
                        </p>               
                    </div>
                    
                    <div>
                        <p className="text-sm text-gray-600 text-center mt-6">
                            By continuing you agree to our <strong>Terms and Conditions</strong>
                        </p>
                    </div>
                </form>
            </div>
            
            <Footer />
        </>
    );
};

export default Register;