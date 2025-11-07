import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./products/ProductCard";

const BestSelling = () => {
    const scrollRef = useRef(null);

    const sampleProducts = [
        { id: 1, name: "I am Product 1", price: 19.99, image: "" },
        { id: 2, name: "I am Product 2", price: 29.99, image: "" },
        { id: 3, name: "I am Product 3", price: 39.99, image: "" },
        { id: 4, name: "I am Product 4", price: 49.99, image: "" },
        { id: 5, name: "I am Product 5", price: 59.99, image: "" },
        { id: 6, name: "I am Product 6", price: 69.99, image: "" },
    ];

    // smooth scroll handler
    const scroll = (direction) => {
        const container = scrollRef.current;
        const scrollAmount = 280 * 1; // scroll 2 card widths
        container.scrollBy({
            left: direction === "left" ? - scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

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
                {sampleProducts.map((product) => (
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
