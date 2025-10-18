import { useState } from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import ProductCard from "../components/products/ProductCard";
import { useNavStore } from "../store/nav.store.js";

const Products = () => {
  const { productCategory } = useNavStore();

  const sampleProducts = [
    { id: 1, name: "I am Product 1", price: 19.99, image: "" },
    { id: 2, name: "I am Product 2", price: 29.99, image: "" },
    { id: 3, name: "I am Product 3", price: 39.99, image: "" },
    { id: 4, name: "I am Product 4", price: 49.99, image: "" },
    { id: 5, name: "I am Product 5", price: 59.99, image: "" },
    { id: 6, name: "I am Product 6", price: 69.99, image: "" },
    { id: 7, name: "I am Product 7", price: 79.99, image: "" },
    { id: 8, name: "I am Product 8", price: 89.99, image: "" },
    { id: 9, name: "I am Product 9", price: 99.99, image: "" },
    { id: 10, name: "I am Product 10", price: 109.99, image: "" },
  ];

  const [visibleCount, setVisibleCount] = useState(8);
  const totalProducts = sampleProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, totalProducts));
  };

  return (
    <>
      <Topbar />
      <Navbar />

      <section>
        <div className="py-16 px-6 md:px-12 bg-[var(--color-accent-1)] text-white capitalize">
          {/* breadcrumb */}
          <p className="font-medium">
            <a href="/">Home / </a> {productCategory ?? "-"}
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold my-4">
            {productCategory ?? "-"}
          </h1>
        </div>

        {/* filter and total fetched products */}
        <div className="flex flex-wrap justify-between items-center my-6 gap-y-4 px-6 md:px-12">
          <p>
            Total Products: {Math.min(visibleCount, totalProducts)} /{" "}
            {totalProducts}
          </p>
          <div className="w-full md:w-[30%]">
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
          </div>
        </div>

        {/* product list */}
        <div className="px-8 pb-6 md:px-20 gap-y-20 my-12 mx-auto gap-x-16 flex justify-start items-start flex-wrap ">
          {sampleProducts.slice(0, visibleCount).map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

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
