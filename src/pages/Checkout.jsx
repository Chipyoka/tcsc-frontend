import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-l.png";
import Visa from "../assets/icons/visa.webp";
import Mastercard from "../assets/icons/mastercard.jpg";
import { Info, CheckCircle2, Loader2 } from "lucide-react";
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
  const { setShipping, setPaymentMethod, setOrder, clearCheckout } = useCheckoutStore();
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

  // --- Payment Data ---
  const [selectedPayment, setSelectedPayment] = useState("visa");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCardChange = (e) =>
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });

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

  const validateCard = () => {
    if (!cardDetails.name) return "Cardholder name required";
    if (!validateCardNumber(cardDetails.cardNumber)) return "Invalid card number";
    if (!validateExpiry(cardDetails.expiry)) return "Invalid expiry date";
    if (!validateCVV(cardDetails.cvv)) return "Invalid CVV";
    return null;
  };

  // --- HANDLERS ---
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!validateShipping()) return;
    setShipping(formData);
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const cardError = validateCard();
    if (cardError) {
      alert(cardError);
      return;
    }
    setLoading(true);
    setPaymentMethod(selectedPayment);

    const orderData = {
      orderId: "ORD-" + Math.floor(Math.random() * 1000000),
      shipping: formData,
      payment: { method: selectedPayment, cardDetails },
      totals: { subtotal, vat, shippingFee, total },
      items,
      subscriptions,
    };

    console.log("Complete order: ", orderData);
    setOrder(orderData);

    setTimeout(() => {
      setStatus(Math.random() > 0.1 ? "success" : "failed");
      setStep(3);
      setLoading(false);
    }, 2500);
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
        onChange={handleChange}
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
      {["Shipping", "Payment", "Confirmation"].map((label, i) => (
        <div key={i} className="flex flex-col items-center w-1/3">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
              step > i ? "bg-[var(--color-primary)]" : "bg-gray-300"
            }`}
          >
            {step > i ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
          </div>
          <p
            className={`text-sm mt-2 font-medium ${
              step > i ? "text-[var(--color-primary)]" : "text-gray-400"
            }`}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );

  if (pageLoading) return (
        <div className="px-6 md:px-36 py-12 flex items-center justify-center min-h-[100dvh]">
            <p className="text-center text-gray-400">Please wait...</p>
        </div>
    )
  if (noItems) return (
        <div className="px-6 md:px-36 py-12 flex flex-col items-center justify-center min-h-[100dvh]">
            <p className="text-center text-gray-500 text-lg my-6 ">You can't checkout with no items</p>
            <button className="btn-primary-outlined-sm" onClick={()=>{navigate('/cart')}}>Go to cart</button>
        </div>
    )
  
  return (
    <div className="px-6 md:px-36 py-12 bg-gray-100 min-h-[100dvh]">
      <img src={Logo} alt="Logo" className="w-48 cursor-pointer" onClick={() => navigate("/")} />
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mt-6">Checkout</h2>
      {renderSteps()}

      <div className="flex flex-col-reverse md:flex-row gap-12">
        {/* LEFT SECTION */}
        <div className="bg-white rounded-lg w-full md:w-2/3 p-6">
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
                    disabled={loading}
                    className="btn-primary-sm w-full md:w-fit mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Payment"}
              </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit}>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
                Payment Method
              </h3>

              {["visa", "mastercard"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-4 border p-4 rounded-md cursor-pointer mb-3 ${
                    selectedPayment === method
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={selectedPayment === method}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <img
                    src={method === "visa" ? Visa : Mastercard}
                    alt={method}
                    className="w-12 h-auto"
                  />
                  <span className="font-medium capitalize">{method}</span>
                </label>
              ))}

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="text-[var(--color-primary)] font-semibold mb-3">
                  Enter Card Details
                </h4>
                <input
                  type="text"
                  name="name"
                  placeholder="Cardholder Name"
                  value={cardDetails.name}
                  onChange={handleCardChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  maxLength={19}
                  className="w-full border border-gray-300 rounded-md px-3 py-3 mb-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-4 my-6">
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    maxLength={5}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    name="cvv"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    maxLength={4}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className=" flex btn-primary-sm w-full md:w-fit disabled:opacity-50 disabled:cursor-not-allowed my-20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Payment"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              {status === "processing" && (
                <>
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Processing your order...</p>
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
                  <button onClick={() => setStep(2)} className="btn-primary-sm bg-red-600">
                    Retry Payment
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Cart Summary */}
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
      </div>
    </div>
  );
};

export default Checkout;
