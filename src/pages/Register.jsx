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

    const [passwordScore, setPasswordScore] = useState(0);

    const navigate = useNavigate();
    
    window.document.title = "Register | The Cleaning Supplies Co.";

    const evaluatePasswordStrength = (value) => {
        let score = 0;
        if (value.length >= 8) score++;
        if (value.length >= 12) score++;
        if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
        if (/\d/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;
        setPasswordScore(score);
    };

    const getStrengthMeta = () => {
        if (passwordScore <= 1) return { label: 'Weak', width: '20%', color: 'bg-red-500' };
        if (passwordScore === 2) return { label: 'Fair', width: '40%', color: 'bg-orange-400' };
        if (passwordScore === 3) return { label: 'Good', width: '60%', color: 'bg-yellow-400' };
        if (passwordScore === 4) return { label: 'Strong', width: '80%', color: 'bg-green-400' };
        return { label: 'Very Strong', width: '100%', color: 'bg-green-600' };
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!fullname || !email || !password || !confirmPassword) {
            toast.error('Please fill in all fields.');
            return;
        }
        
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long.');
            return;
        }
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        
        setLoading(true);
        
        const payload = {
            fullName: fullname,
            email: email,
            password: password
        };
        
        try {
            const response = await axiosInstance.post('/auth/register', payload);
            toast.success('Registration successful! Please check your email for verification.');
            setTimeout(() => { navigate('/check-email'); }, 5000);
        } catch (error) {
            let errorMessage = 'Registration failed. Please try again.';
            if (error.response?.data?.message) errorMessage = error.response.data.message;
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const strength = getStrengthMeta();

    return (
        <>
            <Topbar />
            <div className="flex items-center justify-center my-6">
                <img src={Logo} alt="TCSC Logo" className="w-36 md:w-48 cursor-pointer" onClick={() => navigate('/')} />
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-md w-[90%] max-w-full md:w-lg md:max-w-lg p-4 md:py-6 md:px-12 mx-4 my-8 md:my-8 md:mx-auto flex flex-col justify-center items-center">
                <h2 className="text-3xl md:text-4xl text-[var(--color-primary)] font-bold">Create Account</h2>
                
                <form onSubmit={handleRegister} className="w-full">
                    <div className="my-4">
                        <label htmlFor="fullname" className="text-gray-600">Fullname:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className="flex-1 outline-none text-sm text-gray-700 w-full" required disabled={loading} />
                        </div>
                    </div>

                    <div className="my-4">
                        <label htmlFor="email" className="text-gray-600">Email:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 outline-none text-sm text-gray-700 w-full" required disabled={loading} />
                        </div>
                    </div>

                    <div className="my-4">
                        <label htmlFor="password" className="text-gray-600">Password:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); evaluatePasswordStrength(e.target.value); }} className="flex-1 outline-none text-sm text-gray-700 w-full" required disabled={loading} />
                        </div>
                        {password && (
                            <div className="mt-2">
                                <div className="w-full h-2 bg-gray-200 rounded">
                                    <div className={`h-2 rounded ${strength.color}`} style={{ width: strength.width }}></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Strength: <strong>{strength.label}</strong></p>
                            </div>
                        )}
                    </div>

                    <div className="my-4">
                        <label htmlFor="confirmPassword" className="text-gray-600">Confirm Password:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="flex-1 outline-none text-sm text-gray-700 w-full" required disabled={loading} />
                        </div>
                    </div>

                    <div className="mt-8 mb-4">
                        <button type="submit" className="btn-primary-sm w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                    </div>

                    <div className="my-4">
                        <p className="text-lg text-gray-600 text-center font-medium">Already have an account? <span onClick={() => navigate('/login')} className="cursor-pointer font-medium text-[var(--color-primary)]">Login</span></p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 text-center mt-6">By continuing you agree to our <strong>Terms and Conditions</strong></p>
                    </div>
                </form>
            </div>
            
            <Footer />
        </>
    );
};

export default Register;
