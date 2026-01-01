import { useRef, useEffect , useState} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./products/ProductCard";
import axiosInstance from "../api/axiosInstance";

const BestSelling = () => {
    const scrollRef = useRef(null);

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
                const response = await axiosInstance.get('/products');
                console.log('Best-selling products response:', response.data);

                // data is an array of products, we slice and get top 6
                const products = response.data.data; // <-- access the array inside 'data'

                // Take top 6
                setBestSellers(products.slice(0, 6));
                console.log('Best-selling products set in state:', products.slice(0, 6));
                
            } catch (error) {
                console.error('Error fetching best-selling products:', error);
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
