import { useNavigate } from 'react-router-dom';
import { X, Info, Calendar, Tag, RefreshCw } from 'lucide-react';
import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Visa from '../assets/icons/visa.png';
import Gpay from '../assets/icons/gpay.png';
import Amex from '../assets/icons/amex.png';
import Apay from '../assets/icons/apay.png';
import Mastercard from '../assets/icons/mastercard.png';
import L from '../assets/images/default_product.png'
import useCartStore from '../store/cart.store';
import { useState, useEffect } from 'react';
import { useNavStore } from '../store/nav.store.js';
import { toast } from 'react-toastify';

const Cart = () => {
  window.document.title = "My Cart | The Cleaning Supplies Co.";
  const navigate = useNavigate();
  const { setProductCategory, productCategory } = useNavStore();

  // --- Zustand store ---
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getOneTimeSubtotal = useCartStore((state) => state.getOneTimeSubtotal);
  const getSubscriptionSubtotal = useCartStore((state) => state.getSubscriptionSubtotal);
  const getOneTimeItems = useCartStore((state) => state.getOneTimeItems);
  const getSubscriptionItems = useCartStore((state) => state.getSubscriptionItems);
  const getCartSummary = useCartStore((state) => state.getCartSummary);
  const clearSubscriptions = useCartStore((state) => state.clearSubscriptions);
  const clearOneTimeItems = useCartStore((state) => state.clearOneTimeItems);
  const hasMixedItems = useCartStore((state) => state.hasMixedItems);

  const [vatRate] = useState(0.2); // 20% VAT for UK
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState({});

  // Calculate totals
  const oneTimeSubtotal = getOneTimeSubtotal();
  const subscriptionSubtotal = getSubscriptionSubtotal();
  const subtotal = getSubtotal();
  const vat = subtotal * vatRate;
  const total = subtotal + vat;
  
  const cartSummary = getCartSummary();

  // Toggle subscription details
  const toggleSubscriptionDetails = (cartItemId) => {
    setShowSubscriptionDetails(prev => ({
      ...prev,
      [cartItemId]: !prev[cartItemId]
    }));
  };

  const handleContinueShopping = () => {
    if (!productCategory?.subcat) {
      navigate('/');
      return;
    }

    navigate(
      `/products/${productCategory?.cat?.tag}/${productCategory?.subcat?.subcat}/${productCategory?.slug?.subsub}`
    );
  };

  const handleRemoveItem = (cartItemId) => {
    try {
      removeItem(cartItemId);
      toast.success('Product removed from cart.');
    } catch (error) {
      toast.warning('Failed to remove product.');
      console.error("Error removing product from cart:", error);
    }
  };

  const handleClearSubscriptions = () => {
    if (window.confirm('Remove all subscription items from cart?')) {
      clearSubscriptions();
      toast.info('Subscription items removed');
    }
  };

  const handleClearOneTimeItems = () => {
    if (window.confirm('Remove all one-time purchase items from cart?')) {
      clearOneTimeItems();
      toast.info('One-time items removed');
    }
  };

  // Format frequency display
  const formatFrequency = (item) => {
    if (!item.isSubscription) return null;
    
    const interval = item.intervalCount > 1 ? `${item.intervalCount} ${item.frequency}s` : item.frequency;
    return `Every ${interval}`;
  };

  // Calculate subscription savings
  const calculateSubscriptionSavings = (item) => {
    if (!item.isSubscription || !item.discountPercentage || item.discountPercentage <= 0) {
      return null;
    }
    
    const monthlyPrice = item.price * item.quantity;
    const discountAmount = monthlyPrice * (item.discountPercentage / 100);
    
    return {
      discountPercentage: item.discountPercentage,
      savings: discountAmount,
      discountedPrice: monthlyPrice - discountAmount
    };
  };

  return (
    <>
      <Topbar />
      <Navbar />
      <section className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">
            My Cart
          </h1>
          <p className="text-gray-600 mb-8">
            {cartSummary.totalItems} item{cartSummary.totalItems !== 1 ? 's' : ''} in your cart
            {cartSummary.hasSubscriptions && ' (includes subscription items)'}
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              {/* Cart Summary Banner */}
              {hasMixedItems() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-800">Mixed Cart Detected</h3>
                      <p className="text-sm text-blue-700">
                        Your cart contains both one-time purchases and subscription items.
                        You can checkout both together.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearSubscriptions}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Clear Subscriptions
                      </button>
                      <button
                        onClick={handleClearOneTimeItems}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                      >
                        Clear One-Time
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* One-Time Items Section */}
              {getOneTimeItems().length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      One-Time Purchases
                    </h2>
                    <span className="text-gray-600">
                      {getOneTimeItems().reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-lg  border border-gray-200 overflow-hidden">
                    {getOneTimeItems().map((item) => (
                      <div key={item.cartItemId} className="p-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={item.image || L}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">SKU: {item.sku || 'N/A'}</p>
                                <p className="font-bold text-lg text-[var(--color-primary)] mt-2">
                                  £{(item.price * item.quantity).toFixed(2)}
                                  <span className="text-sm font-normal text-gray-500 ml-2">
                                    (£{item.price.toFixed(2)} each)
                                  </span>
                                </p>
                              </div>
                              
                              <button
                                onClick={() => handleRemoveItem(item.cartItemId)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Remove item"
                              >
                                <X size={20} />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscription Items Section */}
              {getSubscriptionItems().length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <RefreshCw size={20} />
                      Subscription Items
                    </h2>
                    <span className="text-gray-600">
                      {getSubscriptionItems().length} subscription{getSubscriptionItems().length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-lg  border border-gray-200 overflow-hidden">
                    {getSubscriptionItems().map((item) => {
                      const savings = calculateSubscriptionSavings(item);
                      
                      return (
                        <div key={item.cartItemId} className="p-4 border-b border-gray-100 last:border-b-0">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden relative">
                              <img
                                src={item.image || L}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                SUBSCRIBE
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                      <Calendar size={14} />
                                      {formatFrequency(item)}
                                    </span>
                                    
                                    {savings && (
                                      <span className="inline-flex items-center gap-1 text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                        <Tag size={14} />
                                        Save {savings.discountPercentage}%
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="mt-2">
                                    <p className="font-bold text-lg text-[var(--color-primary)]">
                                      £{(item.price * item.quantity).toFixed(2)}
                                      {savings && (
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                          (Regular: £{(savings.discountedPrice * item.quantity).toFixed(2)})
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      £{item.price.toFixed(2)} each • {item.quantity} item{item.quantity !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                  
                                  {savings && (
                                    <div className="mt-2 p-2 bg-green-50 rounded border border-green-100">
                                      <p className="text-sm text-green-700">
                                        You save £{savings.savings.toFixed(2)} per delivery with this subscription
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                  <button
                                    onClick={() => handleRemoveItem(item.cartItemId)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    aria-label="Remove subscription"
                                  >
                                    <X size={20} />
                                  </button>
                                  
                                  <button
                                    onClick={() => toggleSubscriptionDetails(item.cartItemId)}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                  >
                                    {showSubscriptionDetails[item.cartItemId] ? 'Hide Details' : 'View Details'}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Subscription Details */}
                              {showSubscriptionDetails[item.cartItemId] && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <h4 className="font-medium text-gray-700 mb-2">Subscription Details</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-600">Plan ID:</p>
                                      <p className="font-medium">{item.subscriptionPlanId?.substring(0, 8)}...</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Frequency:</p>
                                      <p className="font-medium capitalize">{item.frequency}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Next Billing:</p>
                                      <p className="font-medium">
                                        {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Status:</p>
                                      <p className="font-medium text-green-600">Active after checkout</p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-3">
                                    You can manage or cancel this subscription anytime from your account page.
                                  </p>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                  >
                                    +
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => {
                                    // This would navigate to change subscription frequency
                                    toast.info('Changing subscription frequency would be implemented here');
                                  }}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                  Change Frequency
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty Cart State */}
              {items.length === 0 && (
                <div className="bg-white rounded-lg  border border-gray-200 p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <X size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Looks like you haven't added any products to your cart yet. Start shopping to find amazing cleaning supplies!
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-primary-sm px-8 py-3"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {items.length > 0 && (
              <div className="lg:w-1/3">
                <div className="sticky top-24">
                  <div className="bg-white rounded-lg  border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                    
                    {/* One-Time Purchase Summary */}
                    {getOneTimeItems().length > 0 && (
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <h3 className="font-medium text-gray-700 mb-3">One-Time Purchases</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Items ({cartSummary.oneTimeCount})</span>
                            <span>£{oneTimeSubtotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Subscription Summary */}
                    {getSubscriptionItems().length > 0 && (
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          Subscriptions
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Recurring
                          </span>
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subscription items ({cartSummary.subscriptionCount})</span>
                            <span>£{subscriptionSubtotal.toFixed(2)}</span>
                          </div>
                          {getSubscriptionItems().some(item => item.discountPercentage > 0) && (
                            <div className="flex justify-between text-green-600">
                              <span>Subscription savings</span>
                              <span>-£{(
                                getSubscriptionItems()
                                  .filter(item => item.discountPercentage > 0)
                                  .reduce((sum, item) => {
                                    const monthlyPrice = item.price * item.quantity;
                                    return sum + (monthlyPrice * (item.discountPercentage / 100));
                                  }, 0)
                              ).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Totals */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>£{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 flex items-center gap-1">
                          VAT (20%)
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.gov.uk/vat-rates"
                            title="Read More"
                          >
                            <Info size={16} className="text-gray-400 hover:text-gray-600" />
                          </a>
                        </span>
                        <span>£{vat.toFixed(2)}</span>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>£{total.toFixed(2)}</span>
                        </div>
                        {getSubscriptionItems().length > 0 && (
                          <p className="text-sm text-gray-600 mt-2">
                            * Subscription items will be billed {getSubscriptionItems()[0]?.frequency || 'monthly'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-8 space-y-3">
                      <button
                        onClick={() => navigate('/checkout')}
                        className="w-full btn-primary-sm py-3 text-lg"
                      >
                        Proceed to Checkout
                      </button>
                      <button
                        onClick={handleContinueShopping}
                        className="w-full btn-primary-outlined-sm py-3"
                      >
                        Continue Shopping
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-6">
                      <span className="text-red-600">*</span> Shipping will be calculated during checkout based on your location.
                    </p>
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="bg-white rounded-lg  border border-gray-200 p-6 mt-6">
                    <h3 className="font-medium text-gray-700 mb-4">We Accept</h3>
                    <div className="flex flex-wrap gap-4">
                      {[Visa, Mastercard, Amex, Gpay, Apay].map((icon, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-8 flex items-center justify-center overflow-hidden border border-gray-200 rounded"
                        >
                          <img
                            src={icon}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      All payments are securely processed through Stripe.
                    </p>
                  </div>
                  
                  {/* Subscription Info */}
                  {getSubscriptionItems().length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
                      <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                        <RefreshCw size={18} />
                        Subscription Benefits
                      </h3>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li>• Free shipping on all subscription orders</li>
                        <li>• Save up to 20% compared to one-time purchases</li>
                        <li>• Modify, skip, or cancel anytime</li>
                        <li>• Never run out of essential supplies</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Cart;