import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import ProductCard from "../components/products/ProductCard";
import axiosInstance from "../api/axiosInstance";
import { useNavStore } from "../store/nav.store.js";

const Products = () => {
  const { productCategory } = useNavStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
     * Fetch products by category
     */
    useEffect(() => {
        const fetchProducts = async () => {
          setLoading(true);

          const categoryId = productCategory.slug.id;
          if (!categoryId){
            console.error("Category Id not found");
            return
          }

          console.log("Cat Id:", categoryId);
            try {   
                const response = await axiosInstance.get(`/products/category/${categoryId}`);
                console.log('ProductsByCat response:', response.data);

                // data is an array of products
                const products = response.data.data; // <-- access the array inside 'data'

              setProducts(products);
              setLoading(false)
                
            } catch (error) {
                console.error('Error fetching best-selling products:', error);
                setLoading(false)
            } 
        };

        fetchProducts();
    }, [productCategory]);


  const [visibleCount, setVisibleCount] = useState(8);
  const totalProducts = products.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, totalProducts));
  };

  window.document.title = `${productCategory.cat.tag} | The Cleaning Supplies Co.`;

  return (
    <>
      <Topbar />
      <Navbar />

      <section>
        <div className="py-16 px-6 md:px-12 bg-[var(--color-accent-1)] text-white capitalize">
          {/* breadcrumb */}
          <p className="font-medium">
            <a href="/">Home / </a> {productCategory.cat.tag ?? "-"} / {productCategory.subcat.subcat ?? "-"} / {productCategory.slug.subsub ?? "-"}
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold my-4">
            {productCategory.slug.subsub ?? "-"}
          </h1>
        </div>

        {/* filter and total fetched products */}
        <div className="flex flex-wrap justify-between items-center my-6 gap-y-4 px-6 md:px-12">
          <p>
            Total Products: {Math.min(visibleCount, totalProducts)} /{" "}
            {totalProducts}
          </p>
          {/* <div className="w-full md:w-[30%]">
            <div className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-lg px-3 py-3 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
              <select
                name="sort"
                id=""
                className="outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
              >
                <option value="latest">Sort products</option>
                <option value="latest">Latest</option>
                <option value="low-to-high">Low to High</option>
                <option value="high-to-low">High to Low</option>
              </select>
            </div>
          </div> */}
        </div>

        {/* product list */}
        { loading ? (
            <div className="px-6 md:px-36 py-6 flex items-center justify-center min-h-[20dvh]">
                <p className="text-center text-gray-400">Loading products...</p>
            </div>
        ) : (
          <>
            <div className="px-8 pb-6 md:px-20 gap-y-20 my-12 mx-auto gap-x-14 flex justify-start items-start flex-wrap ">
              {products.slice(0, visibleCount).map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {totalProducts < 1 && (
               <div className="px-2 my-4 mb-12 md:px-36  flex flex-col items-center justify-center">
                  <h4 className="text-xl my-2 font-medium text-gray-600">Products Not Found</h4>
                  <p className=" w-[90%] text-center text-gray-400">We are still expanding our catalog, kindly check back in a few days.</p>
              </div>
            )}
            </>
        )}

        {/* Load More Button */}
        {visibleCount < totalProducts && (
          <div className="flex justify-center items-center mt-10 mb-20 px-6 ">
            <button
              onClick={handleLoadMore}
              className="btn-primary-outlined-sm w-full md:w-fit"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      <Newsletter />
      <Footer />
    </>
  );
};

export default Products;
