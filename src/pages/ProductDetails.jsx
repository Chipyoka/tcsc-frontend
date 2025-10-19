import { useState } from 'react';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cart.store'; // your Zustand store

import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import BestSelling from '../components/BestSelling';
import DiscountClub from '../components/DiscountClub';
import Footer from "../components/Footer";
import FAQSection from "../components/FAQSection";

import Visa from '../assets/icons/visa.webp';
import Mastercard from '../assets/icons/mastercard.jpg'

const ProductDetails = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const addSubscription = useCartStore((state) => state.addSubscription);

  const [pageTitle, setPageTitle] = useState("Loading...");
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState("one-time"); // 'one-time' | 'subscription'
  const [frequency, setFrequency] = useState("weekly");

  // Simulated auth state (replace with real auth check later)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // sample product
  const [product] = useState({
    id: 1,
    name: "Multi-Surface Cleaner",
    price: 12.99,
    image: "../src/assets/images/default_product.png",
    sku: "MSC-500ML",
    shortDesc:
      "High-performance surface cleaner ideal for home or commercial use.",
  });

  window.document.title = `${product?.name || 'loading...'} | The Cleaning Supplies Co.`;

const handleAddToCart = () => {
    // Add product to regular cart for checkout, even if subscription
    addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        sku: product.sku,
        quantity,
        isSubscription: purchaseType === "subscription", // optional flag for checkout logic
        frequency: purchaseType === "subscription" ? frequency : null,
    });

    // If subscription, add metadata to subscriptions store
    if (purchaseType === "subscription") {
        if (!isLoggedIn) {
        navigate("/login");
        return;
        }

        addSubscription({
        productId: product.id,
        userId: user.id, // from auth store/context
        frequency,
        });
    }

    // TODO: show UI feedback (toast/banner) for add-to-cart
    };


  return (
    <>
      <Topbar />
      <Navbar />

      <div className="p-6 md:px-12 max-w-full">
        <p>Shop / category / product name</p>
      </div>

      <section className="px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-center items-start gap-x-6 md:gap-x-16 w-full max-w-full p-2 md:p-6">
          {/* Product image */}
          <div className="relative border border-gray-200 rounded-lg h-[50%] overflow-hidden flex items-center justify-center mb-4 bg-[var(--color-white)]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-90 group-hover:scale-105"
            />
          </div>

          {/* Product info */}
          <div className="w-full md:w-1/2 max-w-full md:max-w-1/2">
            <h2 className="text-2xl md:text-4xl font-medium text-[var(--color-primary)]">
              {product.name}
            </h2>

            <p className="text-md md:text-lg text-gray-600 my-4 w-full md:w-[80%]">
              {product.shortDesc}
            </p>

            <h3 className="font-bold text-2xl md:text-4xl text-[var(--color-primary)]">
              £{product.price.toFixed(2)}
            </h3>

            {/* Quantity control */}
            <div className="border border-[var(--color-primary)] text-[var(--color-primary)] rounded-md px-4 py-2 w-fit text-xl font-medium my-6 flex justify-start items-center gap-x-8">
              <button
                className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-4 w-6 h-6"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
              {quantity}
              <button
                className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-4 w-6 h-6"
                onClick={() =>
                  setQuantity(quantity > 1 ? quantity - 1 : quantity)
                }
              >
                -
              </button>
            </div>

            {/* Purchase type */}
            <div className="flex flex-col gap-y-3 mb-4">
              <label className="font-semibold text-gray-700 text-lg">
                Purchase Option
              </label>
              <div className="flex gap-x-6">
                <label className="flex items-center gap-x-2">
                  <input
                    type="radio"
                    name="purchaseType"
                    value="one-time"
                    checked={purchaseType === "one-time"}
                    onChange={() => setPurchaseType("one-time")}
                    className="w-5 h-5 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)] cursor-pointer"
                  />
                  One-time purchase
                </label>
                <label className="flex items-center gap-x-2">
                  <input
                    type="radio"
                    name="purchaseType"
                    value="subscription"
                    checked={purchaseType === "subscription"}
                    onChange={() => setPurchaseType("subscription")}
                     className="w-5 h-5 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)] cursor-pointer"
                  />
                  Subscribe
                </label>
              </div>
            </div>

            {/* Frequency dropdown - only visible if subscription */}
            {purchaseType === "subscription" && (
              <div className="flex flex-col my-6">
                <label className="font-semibold text-gray-700 text-lg mb-1">
                  Delivery Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-4 w-[200px]"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Every 2 Weeks</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}


            {/* Add to cart or sign up */}
            <div className="text-sm flex justify-start gap-6 items-center">
              <button
                onClick={handleAddToCart}
                className="btn-primary-sm flex gap-x-2 items-center"
              >
                <ShoppingCart />
                {purchaseType == 'one-time' ? "Add to Cart" : "Sign Up"}
              </button>

              <button className="text-[var(--color-primary)] mt-2 flex gap-x-2 items-center border-3 border-[var(--color-primary)] px-4 py-2 rounded-lg">
                <Heart className="w-7 h-7" />
              </button>
            </div>

            {/* Accepted payments */}
            <div className="bg-white my-6 md:my-8 rounded-sm flex items-center justify-start gap-x-2">
                <p>We accept:</p>
                <div className="flex items-center justify-start gap-x-2">
                    <div className="w-12 overflow-hidden"><img src={Visa} alt="Visa" /></div>
                    <div className="w-12 overflow-hidden"><img src={Mastercard} alt="Mastercard" /></div>
                </div>
            </div>
          </div>
        </div>

        {/* Long description */}
        <div className="w-full md:w-[80%] my-6 md:px-16">
          <h3 className="text-2xl md:text-4xl font-medium text-[var(--color-primary)]">
            Description
          </h3>

          <p className="text-md md:text-lg my-4 text-gray-600">
            The Cleaning Supplies Co. is Hertfordshire’s trusted partner for
            professional-grade cleaning solutions. We help small businesses and
            organizations maintain clean, compliant, and efficient environments
            through reliable supply, expert advice, and sustainable products.
          </p>

          <div className="my-6">
            <p className="flex justify-start items-center gap-x-2 text-gray-600 font-medium text-lg">
              <Check /> This is an example of a feature
            </p>
          </div>
        </div>
      </section>

      <BestSelling />
      <DiscountClub />
      <FAQSection />
      <Footer />
    </>
  );
};

export default ProductDetails;
