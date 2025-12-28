import {useEffect, useState} from 'react';


import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Logo from '../assets/images/logo-l.png';

import {useNavigate} from 'react-router-dom';
import useAuthStore from '../store/auth.store.js';

import { toast } from 'react-toastify';


const Login = () => {
    const { login } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate();
    // set title
    window.document.title = "Login | The Cleaning Supplies Co.";

    const handleLogin = (e) => {
        e.preventDefault();

        // validate inputs
        if(!email || !password){
            toast.error('Please fill in all fields.');
            return;
        }

        const user ={
            email: email,
            name: "John Doe"
        }

        const token =  "my-token"; // get token from backend
        try {
            toast.success('Login successful!');

            // api call here to login user

            // introduce small delay
            setTimeout(() => {
                login(user, token);
                navigate('/profile');
            }, 1500);

        } catch (error) {
            console.error("Login error:", error);
            toast.error('Login failed. Please try again.');
        }
    }

    return(
        <>
            <Topbar/>
            {/* <Navbar/> */}
            <div className="flex items-center justify-center my-6">
                <img src={Logo} alt="TCSC Logo" className="w-36 md:w-48" onClick={()=>{ navigate('/')}}/>
            </div>
            <div className=" bg-gray-50 border border-gray-200 rounded-md w-[90%] max-w-full md:w-lg md:max-w-lg p-4 md:py-6 md:px-12 mx-4 my-8 md:my-8 md:mx-auto flex flex-col justify-center items-center">
               <h2 className="text-3xl md:text-4xl text-[var(--color-primary)] font-bold">Login</h2>
               {/* <p className="text-gray-600 my-2">Enjoy the full shopping experience</p> */}

               <form onSubmit={handleLogin} className="w-full">
                    <div className="my-4">

                        <label htmlFor="email" className="text-gray-600">Email:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="email"
                                name="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="my-4">

                        <label htmlFor="Password" className="text-gray-600">Password:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="password"
                                name="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items center">
                        <p className="text-gray-600 ">Forgot Password? <a href="#" className="font-medium text-[var(--color-primary)]">Reset</a></p>
                        
                    </div>
                    <div className="mt-8 mb-4">
                        <button type="submit" className="btn-primary-sm w-full ">Login</button>
                    </div>
                
                    <div className="my-4">
                        <p className="text-lg text-gray-600 text-center font-medium">Don't have an account? <span onClick={()=>{navigate('/register')}} className="cursor-pointer font-medium text-[var(--color-primary)]">Signup</span></p>               
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 text-center mt-6">By continuing you agree to our <strong>Terms and Conditions</strong></p>
                    </div>
               </form>
              
            </div>
            <Footer/>
        </>
    )
}

export default Login;