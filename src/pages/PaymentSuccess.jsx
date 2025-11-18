import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-l-w.png";
import FooterSmall from "../components/FooterSmall.jsx";

import { Info, CheckCircle2, Loader2, Check } from "lucide-react";

const PaymentSuccess = () => {

    // Set page title
    window.document.title = `Payment Success | The Cleaning Supplies Co.`;
    
    const navigate = useNavigate();
    return(
        <>
            {/* header */}
            <div className=" bg-[var(--color-primary)] flex justify-between items-center md:px-36 py-4">
                <div className=" py-2 px-6 rounded-sm">
                     <img src={Logo} alt="Logo" className="w-36 md:w-40 cursor-pointer" onClick={() => navigate("/")} />
                </div>
                <div>
                    <button className="btn-primary-sm"><span className="hidden md:inline-block">Contact</span> Support</button>
                </div>
            </div>
            <div className="px-3 md:px-36 py-12 bg-gray-100 min-h-[100dvh] flex flex-col justify-start items-center">
                <div className="bg-white w-full  max-w-2xl rounded-t-md mb-2 p-8 border-dashed border-2 border-gray-200">
                    <div className="flex justify-center items-center gap-x-6">

                    <div className="bg-[var(--color-success)] p-2 rounded-full w-10 h-10 justify-center items-center flex">
                            <Check className="text-white mx-auto w-6 h-6 font-bold" />
                    </div>
                    <p className="font-semibold text-2xl text-gray-400 sp">Thank You !</p>
                    </div>
             
                </div>
                <div className="bg-white w-full max-w-2xl text-gray-400 rounded-b-lg mb-2 p-5 md:p-8 border-dashed border-2 border-gray-200">
                    <div className="my-2 flex justify-center items-center">
                        {/* <p className="text-xs">ORDER ID</p> */}
                        <p className="text-lg w-fit px-2.5 py-2 bg-gray-100 rounded-sm">
                            ORDER # :  <span className="text-gray-500">OD-XXX-XXX</span></p>
                    </div>
                    <p className="text-gray-400 text-center">Your order payment was successful.</p>

                    {/* order summary */}
                    <div>
                        <p className="uppercase text-xs mt-12 mb-4">Order Summary</p>
                    </div>
                    <div>
                        <div className="bg-gray-50">
                           <div className="px-1 md:px-4 flex justify-between items-center border-b border-gray-100 hover:border-gray-200  py-4">
                            <p className="w-[60%] md:w-[70%] truncate">My Awesome product name</p>
                            <p className="w-[30%] md:w-[20%] truncate ml-4 md:ml-8">£120,000.00</p>
                           </div>
                       
                        </div>
                    </div>

                </div>

                <div className="mt-12 mb-6">
                    <button className="btn-primary-outlined-lg w-full md:w-fit">Continue Shopping</button>
                </div>
            </div>

            <div>
                {/* footer */}
                <FooterSmall />
            </div>
        </>
    )
}

export default PaymentSuccess;