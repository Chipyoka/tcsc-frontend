import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/products/ProductCard";
import axiosInstance from "../api/axiosInstance";

const SearchPage = () => {
    const { q } = useParams();

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!q) return;

        setQuery(q);

        const searchProduct = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/products/search?q=${encodeURIComponent(q)}`);
                console.log("Search Results: ", response.data);

                if (response.data && response.data.success) {
                    setResults(response.data.data || []);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Error searching product: ", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        searchProduct();
    }, [q]);

    return (
        <>
            <Topbar />
            <Navbar />

            <section className="my-8 px-4">
                {loading ? (
                    <div className="text-lg text-center text-gray-500 flex gap-4 flex-col justify-center items-center min-h-[40dvh]">
                       <div className="loader"></div>
                        <p>Searching Products...</p>
                    </div>
                ) : (
                    <div>
                        <p className="mb-4">
                            Products found for "<strong>{query}</strong>"
                        </p>

                        {results.length === 0 ? (
                            <p>No products matched your search.</p>
                        ) : (
                            <div className={`px-8 pb-6 md:px-12 gap-y-20 my-12 mx-auto gap-x-14 flex ${results.length < 3 ? "justify-start" :"justify-evenly"} items-start flex-wrap `}>
                                {results.map((product) => (
                                    <ProductCard key={product.id || product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>

            <Footer />
        </>
    );
};

export default SearchPage;
