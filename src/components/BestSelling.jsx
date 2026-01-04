import { useRef, useEffect , useState} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./products/ProductCard";

import {useReadyStore} from "../store/ready.store.js";

import axiosInstance from "../api/axiosInstance";
import axios from 'axios';

const BestSelling = () => {
    const scrollRef = useRef(null);

    const {setBestSellersReady} = useReadyStore();

    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    // smooth scroll handler
    const scroll = (direction) => {
        const container = scrollRef.current;
        const scrollAmount = 280 * 1; // scroll 2 card widths
        container.scrollBy({
            left: direction === "left" ? - scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    /**
     * Fetch best-selling products from the backend API, We get regular slice just six for viewing on this section
     */
    useEffect(() => {
       

        const fetchBestSellers = async () => {
            try {
                setLoading(true);

                const response = await axiosInstance.get('/products', {
                    timeout: 55000, // 55s hard timeout
                });

                const products = response?.data?.data ?? [];

                setBestSellers(products.slice(0, 6));
                console.log("Best sellers: ", response.data);
                // console.log("Fetched products: ", products)
                // console.log("Fetched BS products ONE: ", products[0])


                // if (products[0].undefined){
                //     console.log("BS Yes")
                //     setBestSellersReady(false);
                    
                // }else{
                //     // Update global readiness state
                //     setBestSellersReady(true);
                // }
                
            } catch (error) {
                setBestSellersReady(false);
                if (axios.isAxiosError(error)) {
                    if (error.code === 'ECONNABORTED') {
                        console.error('Request timed out while fetching best sellers');
                    } else if (error.response) {
                        console.error(
                            'Server error while fetching best sellers:',
                            error.response.status,
                            error.response.data
                        );
                    } else {
                        console.error('Network or client error:', error.message);
                    }
                } else if (error.name === 'CanceledError') {
                    console.warn('Best sellers request was aborted');
                } else {
                    console.error('Unexpected error:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();

    }, []);


    return (
        <section className="my-12 mx-auto px-4 flex flex-col justify-center items-center">
            <h2 className="text-4xl md:text-5xl text-[var(--color-primary)] font-bold my-6">
                Top Bulk Orders
            </h2>

           
            {/* Product list */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto scroll-smooth no-scrollbar gap-x-6 w-full max-w-[300px] md:max-w-[1280px] px-4 mt-4"
            >
                {bestSellers.map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-[280px]">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Navigation buttons below */}
            <div className="flex justify-center items-center gap-6 mt-12">
                <button
                    onClick={() => scroll("left")}
                    className="p-3 rounded-full text-[var(--color-primary)] transition-all shadow-md"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={() => scroll("right")}
                    className="p-3 rounded-full text-[var(--color-primary)] transition-all shadow-md"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </section>
    );
};

export default BestSelling;
