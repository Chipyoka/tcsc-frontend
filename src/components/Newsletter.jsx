import {ArrowRight} from 'lucide-react';
import axiosInstance from "../api/axiosInstance";

import {useState, useEffect} from 'react';
import {toast} from 'react-toastify';

const Newsletter = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async(e) => {
            e.preventDefault();

            // setloading
            setLoading(true);


            // check email
            if(!email){
                toast.error("Email is required");
                return;
            }

            try {
                const response = await axiosInstance.post('/newsletter/subscribe',{
                    email: email,
                });

                console.log("Newsletter Response:", response.data)
                toast.success("Newsletter Subscription Successful!")
                
            } catch (error) {
                console.log("Error Subscribing to Newletters: ", error);
                toast.error("Newsletter Subscription Failed !")
                
            }finally{
                setLoading(false);
                setEmail("");
            }

    }
    return(
        <section className="bg-[var(--color-gray-1)] mt-0 pb-20 px-6 md:px-12 flex flex-col justify-center items-center gap-6 pt-16 md:pt-24 border-t-24 border-[var(--color-primary)]">
            <h2 className="text-3xl md:text-4xl font-bold max-w-full md:max-w-[50%] text-[var(--color-primary)] md:text-center">Discover smarter ways to manage your cleaning supplies.</h2>
            <p className="text-lg md:text-center max-w-full md:max-w-[50%] ">Get actionable insights, cost-saving strategies, and product updates tailored for professional environments.</p>
                <form 
                    onSubmit={handleSubscribe} 
                    className="  h-36 md:h-fit flex flex-col justify-between mt-6  bg-white border-2 border-gray-300 rounded-lg px-3 py-4 md:py-2 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)] "

                >
                    <div 
                    className="w-full flex items-center gap-2"
                    >

                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter you email address"
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                                required
                            />

                            <button 
                                type="submit"
                                className="hidden md:block btn-primary-sm" 
                                disabled={loading}
                            >
                               {loading ? 'Subcribing...' : "Subscribe"}
                            </button>
                    </div>
                    <button 
                        type="submit"
                        className=" w-full mt-6 flex items-center justify-center md:hidden btn-primary-sm"
                        disabled={loading}
                    
                    >
                        {loading ? 'Subcribing...' : "Subscribe"}
                        {/* <span> <ArrowRight  className="w-5 h-5 ml-2"/></span> */}
                    </button>
                </form>
        </section>
    )
}

export default Newsletter;