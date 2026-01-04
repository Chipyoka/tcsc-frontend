import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/profile/Topbar.jsx";
import MostTopbar from "../components/Topbar.jsx";
import Home from "../components/profile/Home.jsx";
import OrdersTable from "../components/profile/OrdersTable.jsx";
import PaymentsTable from "../components/profile/PaymentsTable.jsx";
import SubscriptionSection from "../components/profile/SubscriptionsSection.jsx";
import Settings from "../components/profile/Settings.jsx";
import FooterSmall from "../components/FooterSmall.jsx";
import { useProfileStore } from "../store/profile.store.js";
import { useNavStore } from '../store/nav.store.js';
import useAuthStore from '../store/auth.store.js';


import axiosInstance from '../api/axiosInstance'; 

import { Info, CheckCircle2, Loader2, X, ChevronRight } from "lucide-react";

const Profile = () => {
    const [pageLoading, setPageLoading] = useState(true);
     const {accessToken, user} = useAuthStore();
    const { nav, setNav, setAddress, address } = useProfileStore();
    const navigate = useNavigate();
    const { setProductCategory, productCategory } = useNavStore();

    // set title
    window.document.title = "Profile | The Cleaning Supplies Co.";

    // Handle page loading
    useEffect(() => {
        setTimeout(() => {
            setPageLoading(false);
        }
        , 1500);
    }, []);

    // Fetch addresses
    useEffect(() => {
          if (!accessToken) {
            return;
            }
        const fetchAddresses = async () => {
            try {
                  const response = await axiosInstance.get('/profile/addresses');
                  console.log("Fetched Addresses:", response);
                  console.log("Fetched Addresses:", response.data[0]);

                  const saveAddress = {
                    loading: false,
                    status: "found",
                    data: response.data[0],
                  }

                  setAddress(saveAddress);
                  console.log("Saved Address:", saveAddress);

            } catch (error) {
                console.error("Error fetching addresses:",error);
            }
        }

        fetchAddresses()
    }, []);

    const handleContinueShopping = () => {
      if(!productCategory.subcat){
          navigate('/');
        }
       navigate(
        `/products/${productCategory?.cat.tag}/${productCategory.subcat.subcat}/${productCategory.slug.subsub}`
      )
    };

    if (pageLoading) {
        return (
              <div className="px-6 md:px-36 py-12 flex items-center justify-center min-h-[100dvh]">
                <p className="text-center text-gray-400">Loading your profile...</p>
            </div>
        )
    }
    return(
        <>
     
        <div className="min-h-[98dvh]  flex flex-col justify-between bg-gray-50 text-gray-500">
            <MostTopbar/>
            <div className="min-h-[98dvh] max-w-[1284px] w-full mx-auto flex flex-col md:flex-row items-start justify-start md:justify-between gap-6 px-2 md:px-0 py-4">

                <Topbar/>
              <div className="w-full">

                {/* Warning of missing shipping information */}

                {address.status !== "found" && (
                    <div className="w-full drop-shadow-sm rounded-sm mx-auto z-50 bg-amber-50 px-4 py-3 border border-amber-200">
                        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-y-4 md:items-center">
                            <div>
                                <h4 className="font-medium text-(--color-warning)">Complete your profile</h4>
                                <p className="text-sm text-gray-500">Kindly provide missing shipping information for smooth order processing.</p>
                            </div>
                            <button
                                onClick={()=>setNav("Settings")}
                            className="cursor-pointer bg-(--color-warning) text-white rounded-sm px-4 py-2">Click here</button>
                        </div>
                    </div>
                )}

                <div className="w-full no-scrollbar h-[calc(100dvh-100px)] flex flex-col justify-start items-center overflow-y-auto scrollbar-hide">

                    {nav === "Home" && <Home/>}
                    {nav === "Orders" && <OrdersTable/>}
                    {/* {nav === "Payments" && <PaymentsTable/>} */}
                    {nav === "Subscriptions" && <SubscriptionSection/>}
                    {nav === "Settings" && <Settings/>}

                    {/* Continue shopping section */}
                    <div className="bg-white border border-gray-200 rounded-md w-[90%] max-w-full md:w-full p-6 md:py-4 mx-4 my-4 md:mx-auto flex flex-col justify-start items-start gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-700 ">Finished for now?</h2>
                            <p className="text-gray-600 text-lg w-full md:w-[80%]">
                                Continue exploring our platform and effortlessly add more products to your cart as your needs evolve.                            
                            </p>
                        </div>
                        <div>
                            <button type="button" className="w-full md:w-fit btn-primary-sm" onClick={handleContinueShopping}>Continue Shopping</button>
                            <button type="button" className="w-full md:w-fit btn-primary-outlined-sm" onClick={() => navigate("/cart")}>Go to Cart</button>
                        </div>

                        <div>
                            <p onClick={() => navigate("/")} className="text-sm font-medium text-(--color-primary) border-b-2 border-transparent hover:text-(--color-primary-h) transition duration-300 ease-in-out cursor-pointer">Go to Home <ChevronRight className="h-4 w-4 inline border-none hover:border-none" /></p>
                        </div>
                    </div>
                    <FooterSmall/>
                </div>
              </div>
            </div>
        </div>
        </>
    )
}

export default Profile;