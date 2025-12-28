import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-l-w.png";
import Topbar from "../components/profile/Topbar.jsx";
import MostTopbar from "../components/Topbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";
import { useProfileStore } from "../store/profile.store.js";

import { Info, CheckCircle2, Loader2, X } from "lucide-react";

const Profile = () => {
    const [pageLoading, setPageLoading] = useState(true);
    const { nav, setNav } = useProfileStore();

    useEffect(() => {
        setTimeout(() => {
            setPageLoading(false);
        }
        , 1500);
    }, []);


    // set title
    window.document.title = "Profile | The Cleaning Supplies Co.";

    if (pageLoading) {
        return (
              <div className="px-6 md:px-36 py-12 flex items-center justify-center min-h-[100dvh]">
                <p className="text-center text-gray-400">Loading your profile...</p>
            </div>
        )
    }
    return(
        <>
        <div className="min-h-[100dvh] flex flex-col justify-between bg-gray-50">
            <MostTopbar/>
            <div className="min-h-[98dvh] max-w-[1024px] w-full mx-auto">
                <Topbar/>
                <FooterSmall/>
            </div>
        </div>
        </>
    )
}

export default Profile;