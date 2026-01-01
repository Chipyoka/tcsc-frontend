import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Topbar from '../components/Topbar';

const CheckEmail = () => {
    const navigate = useNavigate();

     // set title
     window.document.title = "Verify Your Email | The Cleaning Supplies Co.";
    return (
        <>
            <Topbar/>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">    

            <div className="bg-white border border-gray-200 rounded-md w-full max-w-md p-6 md:py-8 md:px-10 flex flex-col justify-center items-center text-center">
                <h2 className="text-3xl md:text-4xl text-[var(--color-primary)] font-bold mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-6 text-lg">Please check your email and click on the provided link to verify your account.</p>
                <p className="text-gray-600 w-fit px-2 py-1 bg-gray-100">If you don't see the email, please check your <b>spam</b> or <b>junk</b> folder.</p>

                 <div className="mt-8 hover:bg-blue-50 px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out">
                    <p onClick={() => navigate("/")} className="text-sm font-medium text-(--color-primary) border-b-2 border-transparent hover:text-(--color-primary-h) transition duration-300 ease-in-out cursor-pointer">Return Home <ChevronRight className="h-4 w-4 inline border-none hover:border-none" /></p>
                </div>
            </div>
        </div>
        </>
    );
}   
export default CheckEmail;