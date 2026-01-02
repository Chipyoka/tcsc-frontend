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

import { Info, CheckCircle2, Loader2, X, ChevronRight } from "lucide-react";

const Profile = () => {
    const [pageLoading, setPageLoading] = useState(true);
    const { nav, setNav } = useProfileStore();
    const navigate = useNavigate();
    const { setProductCategory, productCategory } = useNavStore();

    // set title
    window.document.title = "Profile | The Cleaning Supplies Co.";

    useEffect(() => {
        setTimeout(() => {
            setPageLoading(false);
        }
        , 1500);
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
                <div className="w-full no-scrollbar h-[calc(100dvh-100px)] flex flex-col justify-start items-center overflow-y-auto scrollbar-hide">

                    {nav === "Home" && <Home/>}
                    {/* {nav === "Orders" && <OrdersTable/>}
                    {nav === "Payments" && <PaymentsTable/>}
                    {nav === "Subscriptions" && <SubscriptionSection/>}
                    {nav === "Settings" && <Settings/>} */}

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
        </>
    )
}

export default Profile;