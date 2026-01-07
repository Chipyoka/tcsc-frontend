import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-l.png";
import Mastercard from '../assets/icons/mastercard.png';
import Visa from '../assets/icons/visa.png';
import Gpay from '../assets/icons/gpay.png';
import Amex from '../assets/icons/amex.png';
import Apay from '../assets/icons/apay.png';
import { Info, CheckCircle2, Loader2, ArrowLeft, Calendar, Tag, Shield, Lock } from "lucide-react";
import useCartStore from "../store/cart.store";
import useCheckoutStore from "../store/checkout.store";
import useAuthStore from "../store/auth.store";
import { useProfileStore } from "../store/profile.store";
import { useNavStore } from "../store/nav.store";

import axiosInstance from '../api/axiosInstance'; 

import {
  validateUKPhone,
  validateUKPostcode,
  validateEmail,
} from "../utils/validation";

const Checkout = () => {
  window.document.title = "Checkout | The Cleaning Supplies Co.";
  const navigate = useNavigate();
  
  // Stores
  const { setShipping, setOrder, clearCheckout } = useCheckoutStore();
  const { 
    items, 
    clearCart, 
    getSubtotal, 
    getTotalItems, 
    getOneTimeItems, 
    getSubscriptionItems,
    getOneTimeSubtotal,
    getSubscriptionSubtotal,
    getCartSummary,
    prepareCheckoutPayload,
    validateCartForCheckout,
    hasMixedItems
  } = useCartStore();
  
  const { setProductCategory } = useNavStore();
  const { setAddress, address } = useProfileStore();
  const { accessToken, user, updateUser, isAuthenticated } = useAuthStore();

  // State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [noItems, setNoItems] = useState(true);
  const [status, setStatus] = useState("processing");
  const [validationError, setValidationError] = useState("");

  // Calculations
  const subtotal = getSubtotal();
  const vatRate = 0.2;
  const vat = subtotal * vatRate;
  const totalItems = getTotalItems();
  const cartSummary = getCartSummary();

  // shipping fee state
  const [shippingFee, setShippingFee] = useState(0);

  // --- AUTHENTICATION & ROUTE PROTECTION ---
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    // Check cart items
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    
    if (items.length > 0) {
      setNoItems(false);
      // Validate cart before allowing checkout
      const validation = validateCartForCheckout();
      if (!validation.valid) {
        setValidationError(validation.error);
        toast.error(validation.error);
        setTimeout(() => navigate("/cart"), 2000);
      }
    }
  }, [items, navigate, isAuthenticated]);

  // --- Shipping Data with Prefilled User Info ---
  const [formData, setFormData] = useState({
    email: user?.email || "",
    fullName: user?.full_name || "",
    streetAddress: address?.data?.line1 || "",
    country: "GB",
    postcode: address?.data?.postal_code || "",
    town: address?.data?.city || "",
    phone: address?.data?.phone || "",
  });
  
  const [errors, setErrors] = useState({});

  // --- Dynamic Shipping Calculation ---
  useEffect(() => {
    if (formData.town.trim()) {
      const town = formData.town.toLowerCase();
      let fee = 5; // base rate
      if (["london", "manchester", "birmingham"].includes(town)) fee = 3.5;
      else if (["glasgow", "leeds", "liverpool"].includes(town)) fee = 4.5;
      else if (["oxford", "cambridge", "reading"].includes(town)) fee = 4.0;
      else fee = 6; // remote/default
      setShippingFee(fee);
    } else {
      setShippingFee(0);
    }
  }, [formData.town]);

  const total = subtotal + vat + shippingFee;

  // --- VALIDATIONS ---
  const validateShipping = () => {
    let newErrors = {};
    
    if (!formData.email || !validateEmail(formData.email))
      newErrors.email = "Enter a valid email address";
    
    if (!formData.fullName?.trim())
      newErrors.fullName = "Full name is required";
    
    if (!formData.streetAddress?.trim())
      newErrors.streetAddress = "Street address is required";
    
    if (!formData.postcode?.trim())
      newErrors.postcode = "Postcode is required";
    else if (!validateUKPostcode(formData.postcode))
      newErrors.postcode = "Invalid UK postcode format";
    
    if (!formData.town?.trim())
      newErrors.town = "Town/City is required";
    
    if (!formData.phone?.trim())
      newErrors.phone = "Phone number is required";
    else if (!validateUKPhone(formData.phone))
      newErrors.phone = "Invalid UK phone number format";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- HANDLERS ---
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!validateShipping()) return;
    
    setShipping(formData);
    
    // Create order data for Stripe payload
    const orderData = {
      orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      shipping: formData,
      totals: { 
        subtotal, 
        vat, 
        shippingFee, 
        total,
        oneTimeSubtotal: getOneTimeSubtotal(),
        subscriptionSubtotal: getSubscriptionSubtotal()
      },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        isSubscription: item.isSubscription,
        subscriptionPlanId: item.subscriptionPlanId,
        stripePriceId: item.stripePriceId,
        frequency: item.frequency
      })),
    };
    
    setOrder(orderData);
    setStep(2);
  };

  const handleReturnToShipping = () => {
    setStep(1);
  };

  // Construct Stripe payload for backend
  const constructStripePayload = () => {
    const oneTimeItems = getOneTimeItems();
    const subscriptionItems = getSubscriptionItems();
    
    return {
      customerDetails: {
        userId: user?.id,
        email: formData.email,
        name: formData.fullName,
        address: {
          line1: formData.streetAddress,
          city: formData.town,
          postal_code: formData.postcode,
          country: 'GB'
        },
        phone: formData.phone,
        shipping: {
          name: formData.fullName,
          address: {
            line1: formData.streetAddress,
            city: formData.town,
            postal_code: formData.postcode,
            country: 'GB'
          }
        }
      },
      cartData: prepareCheckoutPayload(),
      metadata: {
        userId: user?.id,
        customerEmail: formData.email,
        customerName: formData.fullName,
        shippingTown: formData.town,
        totalItems: totalItems,
        hasSubscriptions: subscriptionItems.length > 0,
        hasOneTimeItems: oneTimeItems.length > 0,
        hasMixedItems: hasMixedItems()
      }
    };
  };

  const handleProceedToPay = async () => {
    setLoading(true);
    
    try {
      // Validate cart one more time
      const validation = validateCartForCheckout();
      if (!validation.valid) {
        setValidationError(validation.error);
        toast.error(validation.error);
        setLoading(false);
        return;
      }

      // Construct the payload
      const stripePayload = constructStripePayload();
      
      console.log("Stripe payload:", stripePayload);
      
      // Send to backend to create Stripe Checkout Session
      const { data } = await axiosInstance.post(
        '/stripe/create-checkout-session',
        stripePayload
      );

      if (data.success && data.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.data.url;
      } else {
        throw new Error(data.message || 'No checkout URL received');
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
      setStatus("failed");
      toast.error(`Payment processing failed: ${error.message}`);
    }
  };

  const handleFinish = () => {
    clearCart();
    setShippingFee(0);
    clearCheckout();
    setTimeout(() => {
      navigate("/profile");
    }, 2000);
  };

  // --- RENDER HELPERS ---
  const renderInput = (label, name, type = "text", placeholder = "") => (
    <div className="my-2 w-full">
      <label htmlFor={name} className="text-gray-600 font-medium">
        {label}:<span className="text-red-600">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
          errors[name]
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {errors[name] && (
        <span className="text-xs text-red-500 mt-1 block">{errors[name]}</span>
      )}
    </div>
  );

  const renderSteps = () => (
    <div className="flex justify-between items-center w-full md:w-[80%] mx-auto my-8">
      {["Shipping", "Confirmation"].map((label, i) => (
        <div key={i} className="flex flex-col items-center w-1/2">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-all ${
              step > i ? "bg-green-500" : step === i + 1 ? "bg-[var(--color-primary)]" : "bg-gray-300"
            }`}
          >
            {step > i ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
          </div>
          <p
            className={`text-sm mt-2 font-medium ${
              step > i || step === i + 1 ? "text-[var(--color-primary)]" : "text-gray-400"
            }`}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );

  // Format frequency display
  const formatFrequency = (item) => {
    if (!item.isSubscription) return null;
    const interval = item.intervalCount > 1 ? `${item.intervalCount} ${item.frequency}s` : item.frequency;
    return `Every ${interval}`;
  };

  if (pageLoading) return (
    <div className="px-6 md:px-36 py-12 flex flex-col gap-4 items-center justify-center min-h-[100dvh]">
      <div className="loader"></div>
      <p className="text-center text-gray-400">Loading checkout...</p>
    </div>
  );
  
  if (noItems) return (
    <div className="px-6 md:px-36 py-12 flex flex-col items-center justify-center min-h-[100dvh]">
      <p className="text-center text-gray-500 text-lg my-6">Your cart is empty</p>
      <button 
        className="btn-primary-outlined-sm" 
        onClick={() => navigate('/cart')}
      >
        Go to cart
      </button>
    </div>
  );

  if (validationError) return (
    <div className="px-6 md:px-36 py-12 flex flex-col items-center justify-center min-h-[100dvh]">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
        <p className="text-red-600 font-semibold text-lg mb-4">Cart Validation Error</p>
        <p className="text-gray-700 mb-6">{validationError}</p>
        <button 
          className="btn-primary-sm" 
          onClick={() => navigate('/cart')}
        >
          Return to Cart
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-8 lg:px-36 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <img 
          src={Logo} 
          alt="Logo" 
          className="w-48 cursor-pointer mb-6" 
          onClick={() => navigate("/")} 
        />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">Checkout</h2>
            <p className="text-gray-500 mt-2">
              <a href="/" className="hover:text-[var(--color-primary)]">Home</a> / 
              <a href="/cart" className="hover:text-[var(--color-primary)] mx-2">Cart</a> / 
              <span className="text-gray-700 font-medium">Shipping & Payment</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">
              Secure checkout • Your data is protected
            </span>
          </div>
        </div>

        {renderSteps()}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SECTION - Main Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {step === 1 ? (
                <form onSubmit={handleShippingSubmit}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Shipping Information
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Step 1 of 2
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-600 font-medium">
                          Email:<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                            errors.email ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          }`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-gray-600 font-medium">
                          Phone:<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                            errors.phone ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          }`}
                          placeholder="+44 20 7123 4567"
                        />
                        {errors.phone && (
                          <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-600 font-medium">
                        Full Name:<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                          errors.fullName ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                        placeholder="John Smith"
                      />
                      {errors.fullName && (
                        <span className="text-xs text-red-500 mt-1 block">{errors.fullName}</span>
                      )}
                    </div>

                    <div>
                      <label className="text-gray-600 font-medium">
                        Street Address:<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.streetAddress}
                        onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                        className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                          errors.streetAddress ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.streetAddress && (
                        <span className="text-xs text-red-500 mt-1 block">{errors.streetAddress}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-600 font-medium">
                          Town/City:<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.town}
                          onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                          className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                            errors.town ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          }`}
                          placeholder="London"
                        />
                        {errors.town && (
                          <span className="text-xs text-red-500 mt-1 block">{errors.town}</span>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-gray-600 font-medium">
                          Postcode:<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.postcode}
                          onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
                          className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                            errors.postcode ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          }`}
                          placeholder="SW1A 1AA"
                        />
                        {errors.postcode && (
                          <span className="text-xs text-red-500 mt-1 block">{errors.postcode}</span>
                        )}
                      </div>
                    </div>

                    {formData.town && shippingFee > 0 && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                        <p className="text-blue-700">
                          <span className="font-medium">Shipping to {formData.town}:</span> 
                          <span className="font-bold ml-2">£{shippingFee.toFixed(2)}</span>
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          Estimated delivery: 2-3 business days
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary-sm w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Continue to Confirmation"
                      )}
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Your information is secure and encrypted
                    </p>
                  </div>
                </form>
              ) : (
                /* STEP 2: CONFIRMATION */
                <div className="py-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Order Confirmation
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Review your order before payment
                      </p>
                    </div>
                    
                    <button
                      onClick={handleReturnToShipping}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors mt-4 md:mt-0"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Return to shipping
                    </button>
                  </div>

                  {/* Shipping Information */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg text-gray-700 mb-4 flex items-center gap-2">
                      Shipping Information
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-medium text-lg">{formData.email}</p>
                          <p className="text-gray-700">{formData.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ship to</p>
                          <p className="font-medium text-lg">{formData.fullName}</p>
                          <p className="text-gray-700">{formData.streetAddress}</p>
                          <p className="text-gray-700">{formData.town}, {formData.postcode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg text-gray-700 mb-4">Order Summary</h4>
                    
                    {/* One-Time Items */}
                    {getOneTimeItems().length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-700 mb-3">One-Time Purchases</h5>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          {getOneTimeItems().map(item => (
                            <div key={item.cartItemId} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 border border-gray-200 rounded overflow-hidden">
                                  <img src={item.image || L} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity} × £{item.price.toFixed(2)}</p>
                                </div>
                              </div>
                              <p className="font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subscription Items */}
                    {getSubscriptionItems().length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Subscription Items
                        </h5>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          {getSubscriptionItems().map(item => (
                            <div key={item.cartItemId} className="flex justify-between items-center py-3 border-b border-green-100 last:border-b-0">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 border border-gray-200 rounded overflow-hidden relative">
                                  <img src={item.image || L} alt={item.name} className="w-full h-full object-cover" />
                                  <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                    SUB
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                      {formatFrequency(item)}
                                    </span>
                                    {item.discountPercentage > 0 && (
                                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded flex items-center gap-1">
                                        <Tag size={10} />
                                        Save {item.discountPercentage}%
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity} × £{item.price.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
                                {item.discountPercentage > 0 && (
                                  <p className="text-sm text-green-600">
                                    Save £{((item.price * item.quantity * item.discountPercentage) / 100).toFixed(2)} per delivery
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Order Totals */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="space-y-3">
                        {getOneTimeItems().length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">One-Time Items ({getOneTimeItems().reduce((sum, item) => sum + item.quantity, 0)})</span>
                            <span>£{getOneTimeSubtotal().toFixed(2)}</span>
                          </div>
                        )}
                        
                        {getSubscriptionItems().length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subscription Items ({getSubscriptionItems().reduce((sum, item) => sum + item.quantity, 0)})</span>
                            <span>£{getSubscriptionSubtotal().toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between pt-3 border-t border-gray-200">
                          <span className="text-gray-600">Subtotal</span>
                          <span>£{subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span>£{shippingFee.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex items-center gap-1">
                            VAT (20%)
                            <a target="_blank" href="https://www.gov.uk/vat-rates" rel="noopener noreferrer">
                              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" title="VAT Information" />
                            </a>
                          </span>
                          <span>£{vat.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg">
                          <span>Total</span>
                          <span>£{total.toFixed(2)}</span>
                        </div>
                        
                        {getSubscriptionItems().length > 0 && (
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              * Subscription items will be billed {getSubscriptionItems()[0]?.frequency || 'monthly'} starting today.
                              You can cancel anytime from your account.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment CTA */}
                  <div className="text-center pt-6 border-t border-gray-200">
                    {status === "processing" && (
                      <>
                        <button
                          onClick={handleProceedToPay}
                          disabled={loading}
                          className="btn-primary-sm w-full md:w-auto px-12 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                              Creating Secure Checkout...
                            </>
                          ) : (
                            <>
                              <Lock className="w-5 h-5 inline mr-2" />
                              Proceed to Secure Payment
                            </>
                          )}
                        </button>
                        <p className="text-sm text-gray-500 mt-4">
                          You will be redirected to Stripe's secure checkout page
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                          {[Visa, Mastercard, Amex, Gpay, Apay].map((icon, idx) => (
                            <div key={idx} className="w-12 h-8 flex items-center justify-center">
                              <img src={icon} alt="" className="max-h-full max-w-full object-contain" />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {status === "success" && (
                      <>
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed</h3>
                        <p className="text-gray-600 mb-6">
                          Thank you for your purchase. A confirmation email has been sent.
                        </p>
                        <button onClick={handleFinish} className="btn-primary-sm">
                          View My Orders
                        </button>
                      </>
                    )}
                    
                    {status === "failed" && (
                      <>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                          <p className="text-red-600 font-semibold text-lg mb-2">Payment Failed</p>
                          <p className="text-gray-700">Please try again or contact support if the issue persists.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setStatus("processing");
                            handleProceedToPay();
                          }} 
                          className="btn-primary-sm bg-red-600 hover:bg-red-700"
                        >
                          Retry Payment
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION - Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  {hasMixedItems() && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Mixed Order:</span> Contains both one-time and subscription items
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({totalItems})</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formData.town ? `£${shippingFee.toFixed(2)}` : 'Calculate'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (20%)</span>
                    <span>£{vat.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {getSubscriptionItems().length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Subscription Benefits:</span> Save with recurring deliveries
                    </p>
                  </div>
                )}
              </div>
              
              {/* Security Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-gray-800">Secure Checkout</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>256-bit SSL encryption</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>PCI DSS compliant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Powered by Stripe</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Your data is never stored</span>
                  </li>
                </ul>
              </div>
              
              {/* Need Help Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about your order or need assistance?
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="btn-primary-outlined-sm w-full"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;