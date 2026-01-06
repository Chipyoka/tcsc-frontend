import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-l.png";
import Mastercard from '../assets/icons/mastercard.png';
import Visa from '../assets/icons/visa.png';
import Gpay from '../assets/icons/gpay.png';
import Amex from '../assets/icons/amex.png';
import Apay from '../assets/icons/apay.png';
import { Info, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import useCartStore from "../store/cart.store";
import useCheckoutStore from "../store/checkout.store";
import { useNavStore } from "../store/nav.store";

import {
  validateUKPhone,
  validateUKPostcode,
  validateCardNumber,
  validateExpiry,
  validateCVV,
} from "../utils/validation";

const Checkout = () => {
  window.document.title = "Checkout | The Cleaning Supplies Co.";
  const navigate = useNavigate();
  const { setShipping, setOrder, clearCheckout } = useCheckoutStore();
  const { getSubtotal, getTotalItems, items, subscriptions, clearCart } = useCartStore();
  const { setProductCategory } = useNavStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [noItems, setNoItems] = useState(true);
  const [status, setStatus] = useState("processing");

  const subtotal = getSubtotal();
  const vatRate = 0.2;
  const vat = subtotal * vatRate;
  const totalItems = getTotalItems();

  // shipping fee state
  const [shippingFee, setShippingFee] = useState(0);

  // Route protection: redirect to /cart if no items
  useEffect(() => {
    setTimeout(() => {
        setPageLoading(false);
    }, 1000);
    if (items.length > 0) {
      setNoItems(false);
    }
  }, [items, navigate]);

  // --- Shipping Data ---
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    streetAddress: "",
    country: "uk",
    postcode: "",
    town: "",
    phone: "",
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
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.firstName) newErrors.firstName = "First name required";
    if (!formData.lastName) newErrors.lastName = "Last name required";
    if (!formData.streetAddress) newErrors.streetAddress = "Street required";
    if (!formData.postcode) newErrors.postcode = "Postcode required";
    else if (!validateUKPostcode(formData.postcode))
      newErrors.postcode = "Invalid UK postcode";
    if (!formData.town) newErrors.town = "Town required";
    if (!formData.phone) newErrors.phone = "Phone required";
    else if (!validateUKPhone(formData.phone))
      newErrors.phone = "Invalid UK phone number";
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
      orderId: "ORD-" + Math.floor(Math.random() * 1000000),
      shipping: formData,
      totals: { subtotal, vat, shippingFee, total },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subscriptions: subscriptions || [],
    };
    
    setOrder(orderData);
    setStep(2); // Go directly to confirmation step
  };

  const handleReturnToShipping = () => {
    setStep(1);
  };

  // Construct Stripe payload
  const constructStripePayload = () => {
    // This is the payload that should be sent to your backend
    // Your backend will then use this to create a Stripe Checkout Session
    const payload = {
      customerDetails: {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        address: {
          line1: formData.streetAddress,
          city: formData.town,
          postal_code: formData.postcode,
          country: 'GB'
        },
        phone: formData.phone,
        shipping: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: {
            line1: formData.streetAddress,
            city: formData.town,
            postal_code: formData.postcode,
            country: 'GB'
          }
        }
      },
      orderDetails: {
        orderId: "ORD-" + Math.floor(Math.random() * 1000000),
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price * 100, // Convert to cents/pence
          quantity: item.quantity,
          image: item.image
        })),
        subscriptions: subscriptions.map(sub => ({
          subscriptionId: sub.id,
          name: sub.name,
          price: sub.price * 100,
          interval: sub.interval
        })),
        totals: {
          subtotal: subtotal * 100,
          vat: vat * 100,
          shipping: shippingFee * 100,
          total: total * 100
        }
      },
      metadata: {
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        shippingTown: formData.town,
        totalItems: totalItems
      }
    };
    
    return payload;
  };

  const handleProceedToPay = async () => {
    setLoading(true);
    
    try {
      // Construct the payload
      const stripePayload = constructStripePayload();
      
      // Log the payload (for debugging)
      console.log("Stripe payload:", stripePayload);
      
      // In a real implementation, you would send this to your backend
      // Example:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(stripePayload),
      // });
      // 
      // const { url } = await response.json();
      // if (url) {
      //   window.location.href = url; // Redirect to Stripe Checkout
      // }
      
      // For now, simulate API call and show success
      setTimeout(() => {
        setLoading(false);
        // This would typically redirect to Stripe Checkout URL
        // window.location.href = "https://checkout.stripe.com/pay/...";
        
        // For demo purposes, show success message
        setStatus("success");
      }, 1500);
      
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
      alert("Payment processing failed. Please try again.");
    }
  };

  const handleFinish = () => {
    clearCart();
    setShippingFee(0);
    clearCheckout();
    setTimeout(() => {
        navigate("/");
    }, 5000);
  };

  // --- RENDER HELPERS ---
  const renderInput = (label, name, type = "text") => (
    <div className="my-2 w-full">
      <label htmlFor={name} className="text-gray-600">
        {label}:<span className="text-red-600">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        className={`w-full border rounded-md px-3 py-3 md:py-4 text-sm outline-none ${
          errors[name]
            ? "border-red-400 ring-1 ring-red-400"
            : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
              step > i ? "bg-[var(--color-primary)]" : step === i + 1 ? "bg-[var(--color-primary)]" : "bg-gray-300"
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

  if (pageLoading) return (
    <div className="px-6 md:px-36 py-12 flex flex-col gap-4 items-center justify-center min-h-[100dvh]">
      <div className="loader"></div>
      <p className="text-center text-gray-400">Please wait...</p>
    </div>
  );
  
  if (noItems) return (
    <div className="px-6 md:px-36 py-12 flex flex-col items-center justify-center min-h-[100dvh]">
      <p className="text-center text-gray-500 text-lg my-6 ">You can't checkout with no items</p>
      <button className="btn-primary-outlined-sm" onClick={()=>{navigate('/cart')}}>Go to cart</button>
    </div>
  );

  return (
    <div className="px-6 md:px-36 py-12 bg-gray-100 min-h-[100dvh]">
      <img src={Logo} alt="Logo" className="w-48 cursor-pointer" onClick={() => navigate("/")} />
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mt-6">Checkout</h2>
      <p className="text-gray-400 my-4 cursor-pointer"><a href="/">Home</a> / <a href="/cart">Cart</a> / Shipping & Confirmation</p>
      {renderSteps()}

      <div className="flex flex-col-reverse md:flex-row gap-12">
        {/* LEFT SECTION */}
        <div className="bg-white rounded-lg w-full md:w-2/3 mx-auto p-6">
          {step === 1 && (
            <form onSubmit={handleShippingSubmit}>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
                Shipping Information
              </h3>
              {renderInput("Email", "email", "email")}
              <div className="flex flex-col md:flex-row gap-4">
                {renderInput("First name", "firstName")}
                {renderInput("Last name", "lastName")}
              </div>
              {renderInput("Street address", "streetAddress")}
              <div className="flex flex-col md:flex-row gap-4">
                {renderInput("Postcode", "postcode")}
                {renderInput("Town/City", "town")}
              </div>
              {renderInput("Phone", "phone", "tel")}
              {shippingFee > 0 && (
                <p className="text-sm text-gray-600 my-6">
                  Estimated Shipping: <strong>£{shippingFee.toFixed(2)}</strong>
                </p>
              )}
              <div className="my-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-sm w-full md:w-fit mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Confirmation"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                  Order Confirmation
                </h3>
                <button
                  onClick={handleReturnToShipping}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Shipping
                </button>
              </div>
              
              {/* Shipping Information (Read-only) */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-700 mb-3">Shipping Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{formData.streetAddress}</p>
                    <p className="font-medium">{formData.town}, {formData.postcode}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary (Read-only) */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg text-gray-700 mb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">£{shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (20%)</span>
                    <span className="font-medium">£{vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-lg">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Status/CTA */}
              <div className="text-center pt-6 border-t border-gray-200">
                {status === "processing" && (
                  <>
                    <button
                      onClick={handleProceedToPay}
                      disabled={loading}
                      className="btn-primary-sm w-full md:w-auto px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Pay"
                      )}
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                      You will be redirected to Stripe's secure checkout page
                    </p>
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
                      Return to Home
                    </button>
                  </>
                )}
                
                {status === "failed" && (
                  <>
                    <p className="text-red-600 font-semibold mb-4">
                      Payment failed. Please try again.
                    </p>
                    <button 
                      onClick={() => {
                        setStatus("processing");
                        handleProceedToPay();
                      }} 
                      className="btn-primary-sm bg-red-600"
                    >
                      Retry Payment
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Cart Summary - Hidden in confirmation step */}
        {step === 1 && (
          <div className="rounded-lg max-w-full md:max-w-sm">
            <div className="bg-white p-4 md:p-6 rounded-lg max-w-full w-full md:max-w-2xl h-fit max-h-[80dvh]">
              <h3 className="text-[var(--color-primary)] font-semibold text-xl my-2 flex justify-between items-center">
                Items
                <span className="font-normal text-lg hover:underline">
                  <a href="/cart">Edit in Cart</a>
                </span>
              </h3>
              <p className="text-xs text-gray-500 font-medium p-2 bg-gray-100">
                You have <strong>{totalItems || "0"} </strong> items
              </p>
              <div className="my-2 overflow-y-auto h-[50%] py-4 no-scrollbar">
                {items.length > 0 ? (
                  items.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-start gap-6 py-4 border-t border-gray-200"
                    >
                      <div className="flex justify-center items-center border border-gray-200 rounded-lg max-w-[90px] md:max-w-[120px] overflow-hidden mb-4 bg-[var(--color-white)]">
                        <img
                          src={product.image || "../src/assets/images/default_product.png"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-90 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex items-start justify-between gap-x-8 w-[60%]">
                        <div>
                          <h3 className="text-[var(--color-primary)] font-normal text-sm md:text-lg max-w-[160px] md:max-w-lg truncate">
                            {product.name || "-"}
                          </h3>
                          <h3 className="text-[var(--color-primary)] font-bold text-md md:text-lg mt-1">
                            £{product.price.toFixed(2)}
                          </h3>
                          <p className="text-gray-500">Quantity: {product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-[70%] justify-center items-center">
                    <p className="text-lg text-gray-600 font-medium">Your cart is empty!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-white p-4 md:p-6 my-2 md:my-2 rounded-sm">
              <h3 className="text-[var(--color-primary)] font-semibold text-xl my-4">Total</h3>
              <div>
                <div className="flex items-center justify-between py-2">
                  <p>Subtotal</p>
                  <p>£{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p>Shipping</p>
                  <p>£{shippingFee.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <p className="flex items-center gap-x-2">
                    VAT (20%)
                    <a target="_blank" href="https://www.gov.uk/vat-rates">
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" title="Read More" />
                    </a>
                  </p>
                  <p>£{vat.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-4 font-bold">
                  <p>Total</p>
                  <p>£{total.toFixed(2)}</p>
                </div>
                <p className="text-gray-500 font-normal text-sm">
                  <span className="text-red-600">*</span> Select a town to calculate shipping
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;