import Greeting from "./Greeting.jsx";

import { useProfileStore } from '../../store/profile.store.js';
import {ArrowRight, ChevronRight} from "lucide-react";
const Home = () => {
    const { nav, setNav } = useProfileStore();
    return (
        <>
            <div
                className="bg-white border border-gray-200 rounded-md w-[90%] max-w-full md:w-full p-6 md:py-4 mx-4 my-4 md:mx-auto flex flex-col justify-start items-start gap-6"

            >
                <div
                    className="w-full flex justify-between items-center bg-gradient-to-r from-blue-50 to-white rounded-sm px-2 py-6 md:py-8 md:px-6"
                >
                    <Greeting showTime={false}/>
                </div>

                {/* quick links */}
                <div className="w-full">
                    <h3 className="text-gray-500 font-semibold text-sm mb-4">Quick Links</h3>
        

                    <div className= "flex flex-col gap-2 my-2">
                        <div onClick={() => setNav("Orders")} className="bg-gray-100 rounded-sm w-full py-3 px-2 border border-transparent hover:border-gray-300 cursor-pointer flex justify-between items-center">
                            <p className="text-gray-500 font-medium text-lg">Find newest order</p>
                            <ChevronRight className="h-5 w-5 text-gray-400"/>
                        </div>
                        {/* <div onClick={() => setNav("Payments")} className=" bg-gray-100 rounded-sm w-full py-3 px-2 border border-transparent hover:border-gray-300 cursor-pointer flex justify-between items-center">
                            <p className="text-gray-500 font-medium text-lg">View all orders</p>
                            <ChevronRight className="h-5 w-5 text-gray-400"/>
                        </div> */}

                        <div onClick={() => setNav("Subscriptions")} className="bg-gray-100 rounded-sm w-full py-3 px-2 border border-transparent hover:border-gray-300 cursor-pointer flex justify-between items-center">
                            <p className="text-gray-500 font-medium text-lg">View active subscriptions</p>
                            <ChevronRight className="h-5 w-5 text-gray-400"/>
                        </div>
                        <div onClick={() => setNav("Settings")} className="bg-gray-100 rounded-sm w-full py-3 px-2 border border-transparent hover:border-gray-300 cursor-pointer flex justify-between items-center">
                            <p className="text-gray-500 font-medium text-lg">Update your profile</p>
                            <ChevronRight className="h-5 w-5 text-gray-400"/>
                        </div>
                    </div>

                

                
                </div>

                {/* <div className="bg-amber-50 px-4 py-3 text-amber-600 w-full">
                    Profile page under construction. Check back in a few hours. <br />
                    <p className="font-bold">Thank you for understanding.</p>
                
                </div> */}
            </div>
        </>
    )
};

export default Home;