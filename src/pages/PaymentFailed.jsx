import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-l-w.png";
import FooterSmall from "../components/FooterSmall.jsx";
import { useNavStore } from "../store/nav.store.js";

import { Info, CheckCircle2, Loader2, X } from "lucide-react";

const PaymentFailed = () => {
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [retrying, setRetrying] = useState(false);
    const { productCategory } = useNavStore();
    const navigate = useNavigate();

    useEffect(() => {
        const sampleItems = [
            { id: "OD-XXX-XXX", itemTotal: 2, total: 320.00 }
        ];
        
        setOrderData(sampleItems);
       

        // delay setting loading to false
        setTimeout(() => {
            setLoading(false);

        }, 2000);
    }, [])


    /**
     * Handle load order summary retry.
     */
    const handleRetry = () =>{
        setLoading(true);
           const sampleItems = [
            { id: "OD-XXX-XXX", itemTotal: 2, total: 320.00 }
        ];
        
        setOrderData(sampleItems);

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }
    /**
     * Handle payment retry.
     */
    const handlePaymentRetry = () =>{
        setRetrying(true);

        setTimeout(() => {
            setRetrying(false);
        }, 2000);
    }
    // Set page title
    window.document.title = `Failed | The Cleaning Supplies Co.`;


    
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

                    <div className="bg-[var(--color-warning)] p-2 rounded-full w-10 h-10 justify-center items-center flex">
                            <X className="text-white mx-auto w-6 h-6 font-bold" />
                    </div>
                    <p className="font-semibold text-2xl text-gray-500 sp">Payment Failed</p>
                    </div>
             
                </div>
                <div className="bg-white w-full max-w-2xl text-gray-500 rounded-b-lg mb-2 p-5 md:p-8 border-dashed border-2 border-gray-200">
                    <div className="my-2 flex flex-col justify-center items-center">
                        {/* <p className="text-xs">ORDER ID</p> */}
                        {/* <p className="text-lg w-fit px-2.5 py-2 bg-gray-100 rounded-sm">
                            ORDER # :  <span className="text-gray-700">OD-XXX-XXX</span></p> */}
                         <p className="text-gray-500 text-center md:max-w-[80%]">We couldn’t process your payment. Your order has been saved and no charges were applied.</p>
                    </div>

                    {/* order summary */}
                    <div>
                        <p className="uppercase text-xs mt-12 mb-4">Order Summary</p>
                    </div>

                    {/* map order data */}
                    <div>
                        <div className="bg-gray-50">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="loader"></div>
                                </div>
                            ) : (
                                <>
                                    { orderData.length < 1 ? (
                                        <p className="text-center text-sm py-4 text-red-400">We couldn’t load order summary <span onClick={handleRetry} className="underline cursor-pointer font-semibold">Retry</span></p>
                                    ) : (
                                        <div className="px-1 md:px-4 flex justify-between items-center border-b border-gray-100 hover:border-gray-200  py-4">
                                                <p className="w-[30%] truncate">
                                                    <span className="text-xs text-gray-600">Order #</span>
                                                    <br />
                                                    {orderData[0].id ?? '-'}
                                                </p>
                                                <p className="w-[30%] truncate text-center">
                                                    <span className="text-xs text-gray-600">Items</span>
                                                    <br />
                                                    0{orderData[0]?.itemTotal ?? '-'}
                                                </p>
                                                <p className="w-[30%] truncate ml-4 md:ml-8 text-right">
                                                    <span className="text-xs text-gray-600">Order Total</span>
                                                    <br />
                                                    £{orderData[0]?.total.toFixed(2) ?? '-'}
                                                </p>
                                        </div>
                                    )

                                    }
                                </>
                            )}
                                

                               

                         
                        
                      
                        </div>
                    </div>

                </div>

                <div className="w-full max-w-2xl mt-12 mb-6 flex flex-col gap-4 justify-center items-center">
                    <button 
                        className="btn-primary-lg w-full md:w-fit flex justify-center items-center gap-x-4"
                        onClick={()=>{handlePaymentRetry()}}
                    >
                     
                        {
                            retrying ? (
                                <> 
                                    <div className="btn-loader"></div>
                                    Retrying...
                                </>
                            ) : (
                                <> Retry Payment </>
                            )
                        }
                    </button>
                    
                    <button 
                    onClick={()=>{navigate("/cart")}}
                    className="w-full md:w-fit text-center pb-0.5 text-gray-600 border-b-2 border-gray-100 hover:border-gray-400">
                         <a href="/cart" >Use Another Payment Method</a>
                    </button>
                   
                </div>
            </div>

            <div>
                {/* footer */}
                <FooterSmall />
            </div>
        </>
    )
}

export default PaymentFailed;