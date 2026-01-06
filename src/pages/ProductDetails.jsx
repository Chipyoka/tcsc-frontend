import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cart.store';
import { useNavStore } from "../store/nav.store.js";
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import BestSelling from '../components/BestSelling';
import DiscountClub from '../components/DiscountClub';
import Footer from "../components/Footer";
import FAQSection from "../components/FAQSection";

import Mastercard from '../assets/icons/mastercard.png';
import Visa from '../assets/icons/visa.png';
import Gpay from '../assets/icons/gpay.png';
import Amex from '../assets/icons/amex.png';
import Apay from '../assets/icons/apay.png';
import L from '../assets/images/default_product.png';
import useAuthStore from '../store/auth.store.js';

const ProductDetails = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const addSubscription = useCartStore((state) => state.addSubscription);
  const { selectedProductId, productCategory } = useNavStore();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState("one-time");
  const [frequency, setFrequency] = useState("weekly");
  const {isAuthenticated, user} = useAuthStore();

  // Fetch product from backend
  useEffect(() => {
    if (!selectedProductId) return;

    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/products/${selectedProductId}`);
        const backendProduct = response.data.data;

        if (!isMounted) return;

        const firstVariant = backendProduct.variants?.find(v => v.active) || backendProduct.variants?.[0];

        setProduct({
          id: backendProduct.id,
          name: backendProduct.name,
          price: firstVariant ? firstVariant.price_amount / 100 : 0,
          sku: firstVariant?.sku || backendProduct.sku,
          shortDesc: backendProduct.description,
          media: backendProduct.media || [],
          attributes: backendProduct.attributes || [],
          variants: backendProduct.variants || [],
          description_html: backendProduct.description_html || '',
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => { isMounted = false; };
  }, [selectedProductId]);

  // Set document title
  useEffect(() => {
    if (product?.name) {
      window.document.title = `${product.name} | The Cleaning Supplies Co.`;
    }
  }, [product?.name]);




  if (!product) return <p className="p-6 text-red-500">Product not found.</p>;

  const primaryImage = product.media?.[0]?.storage_path
    ? product.media[0].storage_path.replace(
        '/upload/',
        '/upload/f_auto,q_auto,w_400,h_400,c_fit/'
      )
    : L;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      sku: product.sku,
      quantity,
      isSubscription: purchaseType === "subscription",
      frequency: purchaseType === "subscription" ? frequency : null,
    });

    if (purchaseType === "subscription") {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      addSubscription({
        productId: product.id,
        userId: user.id, 
        frequency,
      });
    }

    toast.success('Product added to cart!');
  };

  const handleToShopping = () => {
    if (!productCategory?.subcat) {
      navigate('/');
      return;
    }

    navigate(
      `/products/${productCategory.cat}/${productCategory.subcat}/${productCategory.slug}`
    );
  };


  return (
    <>
      <Topbar />
      <Navbar />

      {loading ?(
          <div className="px-6 md:px-36 py-12 flex flex-col gap-4 items-center justify-center min-h-[100dvh]">
            <div className="loader"></div>
              <p className="text-center text-gray-400">Loading product's page...</p>
          </div>
      ) : (
      <>
      
          <div className="p-6 md:px-12 max-w-full">
            <p className="text-gray-500 text-sm cursor-pointer" onClick={handleToShopping}>
              Shop / {product?.name}
            </p>
          </div>

          <section className="px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-center items-start gap-x-6 md:gap-x-16 w-full max-w-full p-2 md:p-6">
              {/* Product image */}
              <div className="relative border border-gray-200 rounded-lg h-[50%] overflow-hidden flex items-center justify-center mb-4 bg-[var(--color-white)]">
                <img
                  src={primaryImage}
                  alt={product?.name}
                  className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = L; }}
                />
              </div>

              {/* Product info */}
              <div className="w-full md:w-1/2 max-w-full md:max-w-1/2">
                <h2 className="text-2xl md:text-4xl font-medium text-[var(--color-primary)]">
                  {product?.name}
                </h2>

                <p className="text-md md:text-lg text-gray-600 my-4 w-full md:w-[80%]">
                  {product?.shortDesc}
                </p>

                <h3 className="font-bold text-2xl md:text-4xl text-[var(--color-primary)]">
                  £{product?.price.toFixed(2)}
                </h3>

                {/* Quantity control */}
                <div className="border border-[var(--color-primary)] text-[var(--color-primary)] rounded-md px-4 py-2 w-fit text-xl font-medium my-6 flex justify-start items-center gap-x-8">
                  <button className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-4 w-6 h-6" onClick={() => setQuantity(quantity + 1)}>+</button>
                  {quantity}
                  <button className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-4 w-6 h-6" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : quantity)}>-</button>
                </div>

                {/* Purchase type */}
                <div className="flex flex-col gap-y-3 mb-4">
                  <label className="font-semibold text-gray-700 text-lg">Purchase Option</label>
                  <div className="flex gap-x-6">
                    <label className="flex items-center gap-x-2">
                      <input type="radio" name="purchaseType" value="one-time" checked={purchaseType === "one-time"} onChange={() => setPurchaseType("one-time")} className="w-5 h-5 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)] cursor-pointer" />
                      One-time purchase
                    </label>
                    <label className="flex items-center gap-x-2">
                      <input type="radio" name="purchaseType" value="subscription" checked={purchaseType === "subscription"} onChange={() => setPurchaseType("subscription")} className="w-5 h-5 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)] cursor-pointer" />
                      Subscribe
                    </label>
                  </div>
                </div>

                {/* Frequency dropdown */}
                {/* {purchaseType === "subscription" && (
                  <div className="flex flex-col my-6">
                    <label className="font-semibold text-gray-700 text-lg mb-1">Delivery Frequency</label>
                    <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="border border-gray-300 rounded-md px-4 py-4 w-[200px]">
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Every 2 Weeks</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )} */}
                {purchaseType === "subscription" && (
                  <>
                    <div className="text-gray-600 flex flex-col my-6 bg-gray-50 rounded-sm px-6 py-2 w-full md:w-fit border border-amber-200">
                      <p>This product will be added to your <b>cart</b>, <br /> Then it will be added to your <b>recurring orders after checkout</b>.</p>
                      <p className="t-sm">You can <b>edit or cancel </b> this subscription in your profile page.</p>
                    </div>

                    <p className="mt-2 mb-4 italic text-gray-400 text-sm">You have to checkout in order to complete this subscription.</p>
                  </>
                )}

                {/* Add to cart */}
                <div className="text-sm flex justify-start gap-6 items-center">
                  <button onClick={handleAddToCart} className="btn-primary-sm w-full md:w-70 flex items-center gap-x-4 justify-center">
                    <ShoppingCart /> {purchaseType === 'one-time' ? "Add to Cart" : "Add & Subscribe"}
                  </button>

                  {/* <button className="text-[var(--color-primary)] mt-2 flex gap-x-2 items-center border-3 border-[var(--color-primary)] px-4 py-2 rounded-lg">
                    <Heart className="w-7 h-7" />
                  </button> */}
                </div>

                {/* Accepted payments */}
                <div className="bg-white p-4 md:p-6 my-2 rounded-sm flex flex-col items-start justify-start gap-x-1">
                  <p>We accept:</p>
                  <div className="flex flex-wrap items-center justify-start gap-4 mt-2">
                      {[Visa, Mastercard, Amex, Gpay, Apay].map((icon, idx) => (
                        <div
                          key={idx}
                          className="w-12 flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={icon}
                            alt=""
                            className="max-h-full max-w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                </div>

            
              </div>
            </div>

            {/* Long description */}
            {product.description_html && (
              <>
              <div className="w-full my-6 md:px-16">
                <h3 className="text-2xl md:text-4xl font-medium text-[var(--color-primary)]">Description</h3>
                <div className="text-md md:text-lg my-4 text-gray-600" dangerouslySetInnerHTML={{ __html: product?.description_html }} />
                {/* Product attributes */}
                  {product?.attributes.length > 0 && (
                    <div className="my-6 bg-gray-50 rounded-sm border border-gray-100 px-4 py-3">
                      <h3 className="font-semibold text-lg text-gray-600 mb-2">Product Attributes:</h3>
                      <ul className="text-gray-600 text-md">
                        {product?.attributes.map((attr, idx) => (
                          <li key={idx} className="py-4 border-b border-gray-200"><span className="font-medium ">{attr?.name}:</span> {attr?.value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
                </>
            )}

          </section>
       </>
      )}


      <BestSelling />
      <DiscountClub />
      <FAQSection />
      <Footer />
    </>
  );
};

export default ProductDetails;
