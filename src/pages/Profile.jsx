import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-l-w.png";
import FooterSmall from "../components/FooterSmall.jsx";
import { useNavStore } from "../store/nav.store.js";

import { Info, CheckCircle2, Loader2, X } from "lucide-react";

const Profile = () => {
    return(
        <>
            <h2>Hello user...</h2>
        </>
    )
}

export default Profile;