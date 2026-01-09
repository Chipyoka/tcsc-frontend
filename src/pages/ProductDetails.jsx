import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Check, Info, Calendar } from 'lucide-react';
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
  const { isAuthenticated, user } = useAuthStore();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState("one-time");
  const [frequency, setFrequency] = useState("monthly");
  const [availableSubscriptionPlans, setAvailableSubscriptionPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  // Fetch product and subscription plans
  useEffect(() => {
    if (!selectedProductId) return;

    let isMounted = true;

    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Fetch product details
        const productResponse = await axiosInstance.get(`/products/${selectedProductId}`);
        const backendProduct = productResponse.data.data;

        console.log("Fetched Product:", backendProduct);

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

        // Fetch available subscription plans for this product
        try {
          const plansResponse = await axiosInstance.get('/subscription/plans', {
            timeout: 6000,
          });

          console.log("Fetched Plans:", plansResponse);
          
          if (plansResponse.data.success) {
            setAvailableSubscriptionPlans(plansResponse.data.data || []);
            if (plansResponse.data.data.length > 0) {
              setSelectedPlanId(plansResponse.data.data[0].id);
              setFrequency(plansResponse.data.data[0].interval_type);
            }
          }
        } catch (planError) {
          console.warn("Could not fetch subscription plans:", planError);
          // Continue without subscription plans
        }

      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductData();

    return () => { isMounted = false; };
  }, [selectedProductId]);

  // Set document title
  useEffect(() => {
    if (product?.name) {
      window.document.title = `${product.name} | The Cleaning Supplies Co.`;
    }
  }, [product?.name]);

  const primaryImage = product.media?.[0]?.storage_path
    ? product.media[0].storage_path.replace(
        '/upload/',
        '/upload/f_auto,q_auto,w_400,h_400,c_fit/'
      )
    : L;

  const handleAddToCart = () => {
    if (purchaseType === "subscription") {
      // Validate subscription requirements
      if (!isAuthenticated) {
        toast.error("Please login to subscribe");
        navigate("/login");
        return;
      }
      
      if (!selectedPlanId) {
        toast.error("Please select a subscription plan");
        return;
      }

      // Find selected plan details
      const selectedPlan = availableSubscriptionPlans.find(plan => plan.id === selectedPlanId);
      if (!selectedPlan) {
        toast.error("Selected subscription plan not found");
        return;
      }

      // Add to cart as subscription item
      addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: primaryImage,
          sku: product.sku,
          variantId: product.variants?.[0]?.id || null,
          quantity: quantity,
          isSubscription: purchaseType === "subscription",
          subscriptionPlanId: selectedPlanId,
          stripePriceId: selectedPlan.stripe_price_id,
          frequency: selectedPlan.interval_type,
          intervalCount: selectedPlan.interval_count,
          discountPercentage: selectedPlan.discount_percentage
        });

      // Also add to subscription store
      // addSubscription({
      //   productId: product.id,
      //   name: product.name,
      //   price: product.price,
      //   quantity: quantity,
      //   frequency: selectedPlan.interval_type,
      //   intervalCount: selectedPlan.interval_count,
      //   subscriptionPlanId: selectedPlanId,
      //   stripePriceId: selectedPlan.stripe_price_id,
      //   image: primaryImage,
      // });

      // toast.success(`Added to cart as ${selectedPlan.interval_type} subscription!`);

    } else {
      // One-time purchase
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        variantId: product.variants?.[0]?.id || null,
        image: primaryImage,
        sku: product.sku,
        quantity,
        isSubscription: false,
      });

      // toast.success('Product added to cart!');
    }
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

  // Calculate subscription savings
  const calculateSubscriptionSavings = (plan) => {
    if (!plan || !plan.discount_percentage || plan.discount_percentage <= 0) return null;
    
    const monthlyPrice = product.price * quantity;
    const discountAmount = monthlyPrice * (plan.discount_percentage / 100);
    const discountedPrice = monthlyPrice - discountAmount;
    
    return {
      discountPercentage: plan.discount_percentage,
      originalPrice: monthlyPrice,
      discountedPrice: discountedPrice,
      savingsPerMonth: discountAmount,
    };
  };

  if (loading) return (
    <div className="px-6 md:px-36 py-12 flex flex-col gap-4 items-center justify-center min-h-[100dvh]">
      <div className="loader"></div>
      <p className="text-center text-gray-400">Loading product's page...</p>
    </div>
  );

  if (!product) return <p className="p-6 text-red-500">Product not found.</p>;

  return (
    <>
      <Topbar />
      <Navbar />

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
              <button 
                className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-4 w-6 h-6"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
              {quantity}
              <button 
                className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-4 w-6 h-6"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : quantity)}
              >
                -
              </button>
            </div>

            {/* Purchase type selector */}
            <div className="flex flex-col gap-y-3 mb-6">
              <label className="font-semibold text-gray-700 text-lg">Purchase Option</label>
              <div className="flex gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPurchaseType("one-time")}
                  className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${purchaseType === "one-time" 
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" 
                    : "border-gray-300 text-gray-700 hover:border-gray-400"}`}
                >
                  One-time purchase
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info("Please login to subscribe");
                      navigate("/login");
                      return;
                    }
                    setPurchaseType("subscription");
                  }}
                  className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${purchaseType === "subscription" 
                    ? "border-green-600 bg-green-600 text-white" 
                    : "border-gray-300 text-gray-700 hover:border-gray-400"}`}
                >
                  Subscribe & Save
                </button>
              </div>
            </div>

            {/* Subscription plan selection */}
            {purchaseType === "subscription" && (
              <div className="mb-6">
                <label className="font-semibold text-gray-700 text-lg mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Delivery Frequency
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableSubscriptionPlans.map((plan) => {
                    const savings = calculateSubscriptionSavings(plan);
                    
                    return (
                      <div
                        key={plan.id}
                        onClick={() => {
                          setSelectedPlanId(plan.id);
                          setFrequency(plan.interval_type);
                        }}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedPlanId === plan.id 
                          ? "border-green-600 bg-green-50" 
                          : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800 capitalize">
                              {plan.interval_type} Delivery
                            </h4>
                            <p className="text-sm text-gray-600">{plan.description}</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border ${selectedPlanId === plan.id 
                              ? "border-green-600 bg-green-600" 
                              : "border-gray-300"}`}>
                              {selectedPlanId === plan.id && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {savings && (
                          <div className="mt-3 p-2 bg-green-100 rounded-md">
                            <p className="text-sm text-green-800 font-medium">
                              Save {savings.discountPercentage}% • £{savings.savingsPerMonth.toFixed(2)} per delivery
                            </p>
                            <p className="text-xs text-green-700">
                              £{savings.originalPrice.toFixed(2)} → £{savings.discountedPrice.toFixed(2)}
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-2 text-xs text-gray-500">
                          {plan.interval_count > 1 ? `Every ${plan.interval_count} ${plan.interval_type}s` : `Every ${plan.interval_type}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {availableSubscriptionPlans.length === 0 && (
                  <div className="text-gray-500 italic text-sm">
                    No subscription plans available for this product.
                  </div>
                )}

                {/* Subscription benefits */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Subscription Benefits</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Free shipping on all subscription orders</li>
                    <li>• Easy cancellation anytime from your account</li>
                    <li>• Skip or modify deliveries as needed</li>
                    <li>• Priority customer support</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Add to cart button */}
            <div className="text-sm flex justify-start gap-6 items-center">
              <button 
                onClick={handleAddToCart} 
                className={`btn-primary-sm w-full md:w-70 flex items-center gap-x-4 justify-center ${purchaseType === "subscription" ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                <ShoppingCart /> 
                {purchaseType === 'one-time' ? "Add to Cart" : "Subscribe Now"}
              </button>
            </div>

            {/* Accepted payments */}
            <div className="bg-white p-4 md:p-6 my-6 rounded-sm flex flex-col items-start justify-start gap-x-1">
              <p className="text-gray-600 mb-2">We accept:</p>
              <div className="flex flex-wrap items-center justify-start gap-4 mt-2">
                {[Visa, Mastercard, Amex, Gpay, Apay].map((icon, idx) => (
                  <div key={idx} className="w-12 flex items-center justify-center overflow-hidden">
                    <img src={icon} alt="" className="max-h-full max-w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Long description */}
        {product.description_html && (
          <div className="w-full my-6 md:px-16">
            <h3 className="text-2xl md:text-4xl font-medium text-[var(--color-primary)]">Description</h3>
            <div className="text-md md:text-lg my-4 text-gray-600" dangerouslySetInnerHTML={{ __html: product?.description_html }} />
            
            {/* Product attributes */}
            {product?.attributes.length > 0 && (
              <div className="my-6 bg-gray-50 rounded-sm border border-gray-100 px-4 py-3">
                <h3 className="font-semibold text-lg text-gray-600 mb-2">Product Attributes:</h3>
                <ul className="text-gray-600 text-md">
                  {product?.attributes.map((attr, idx) => (
                    <li key={idx} className="py-4 border-b border-gray-200">
                      <span className="font-medium">{attr?.name}:</span> {attr?.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <BestSelling />
      <DiscountClub />
      <FAQSection />
      <Footer />
    </>
  );
};

export default ProductDetails;