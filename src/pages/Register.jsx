import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Logo from '../assets/images/logo-l.png';

import {useNavigate} from 'react-router-dom';


const Register = () => {

    const navigate = useNavigate();
    // set title
    window.title = "Login | The Cleaning Supplies Co.";

    return(
        <>
            <Topbar/>
            {/* <Navbar/> */}
            <div className="flex items-center justify-center my-6">
                <img src={Logo} alt="TCSC Logo" className="w-36 md:w-48" onClick={()=>{ navigate('/')}}/>
            </div>
            <div className=" bg-gray-50 border border-gray-200 rounded-md w-[90%] max-w-full md:w-lg md:max-w-lg p-4 md:py-6 md:px-12 mx-4 my-8 md:my-8 md:mx-auto flex flex-col justify-center items-center">
               <h2 className="text-3xl md:text-4xl text-[var(--color-primary)] font-bold">Create Account</h2>
               {/* <p className="text-gray-600 my-2">An amazing shopping experience awaits</p> */}

               <form action="" className="w-full">
                    <div className="my-4">

                        <label htmlFor="firstName" className="text-gray-600">First name:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="text"
                                name="firstName"
                                placeholder=""
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>
        
                    <div className="my-4">

                        <label htmlFor="lastName" className="text-gray-600">Last name:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="text"
                                name="lastName"
                                placeholder=""
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="my-4">

                        <label htmlFor="email" className="text-gray-600">Email:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="email"
                                name="email"
                                placeholder=""
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
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
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="my-4">

                        <label htmlFor="confrimPassword" className="text-gray-600">Confirm Password:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="password"
                                name="confirmpassword"
                                placeholder=""
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-8 mb-4">
                        <button className="btn-primary-sm w-full ">Register</button>
                    </div>
                
                    <div className="my-4">
                        <p className="text-lg text-gray-600 text-center font-medium">Already have an account? <a href="/login" className="font-medium text-[var(--color-primary)]">Login</a></p>               
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

export default Register;