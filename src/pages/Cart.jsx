import { useNavigate } from 'react-router-dom';
import { X, Info } from 'lucide-react';
import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Visa from '../assets/icons/visa.webp';
import L from '../assets/images/default_product.png'
import Mastercard from '../assets/icons/mastercard.jpg';
import useCartStore from '../store/cart.store';
import { useState } from 'react';
import { useNavStore } from '../store/nav.store.js';

const Cart = () => {
  window.document.title = "My Cart | The Cleaning Supplies Co.";
  const navigate = useNavigate();
  const { setProductCategory } = useNavStore();

  // --- Zustand store ---
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const [vatRate] = useState(0.2); // 20% VAT for UK

  const subtotal = getSubtotal();
  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  const handleContinueShopping = () => {
    setProductCategory('All');
    navigate('/products/all');
  };

  return (
    <>
      <Topbar />
      <Navbar />
      <section className="bg-gray-100 flex py-12 justify-center items-start">
        <div className="px-4 w-full md:w-6xl flex flex-wrap items-start justify-start gap-x-8">
          {/* Cart Items */}
          <div className="bg-white p-4 md:p-6 rounded-lg max-w-full w-full md:max-w-2xl h-[80dvh] max-h-[80dvh]">
            <h3 className="text-[var(--color-primary)] font-bold text-xl md:text-3xl my-4">My Cart</h3>
            <div className="my-2 overflow-y-auto h-[90%] py-4">
              {items.length > 0 ? (
                items.map((product) => (
                  <div key={product.id} className="flex items-center justify-start gap-6 py-4 border-t border-gray-200">
                    <div className="flex justify-center items-center border border-gray-200 rounded-lg max-w-[100px] md:max-w-[150px] overflow-hidden mb-4 bg-[var(--color-white)]">
                      <img
                        src={product.image || L}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-90 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-x-8 w-[60%]">
                      <div>
                        <h3 className="text-[var(--color-primary)] font-normal text-sm md:text-lg max-w-[160px] md:max-w-lg truncate">
                          {product.name || '-'}
                        </h3>
                        <h3 className="text-[var(--color-primary)] font-bold text-md md:text-lg mt-1">£{product.price.toFixed(2)}</h3>

                        <div className="border border-[var(--color-primary)] text-[var(--color-primary)] rounded-md px-2 py-2 w-fit text-sm font-medium my-4 flex justify-start items-center gap-x-2 gap-y-2">
                          <button
                            className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-2 w-4 h-4"
                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                          >
                            +
                          </button>
                          {product.quantity}
                          <button
                            className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-2 w-4 h-4"
                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                          >
                            -
                          </button>
                        </div>
                      </div>

                      <div
                        className="text-gray-400 flex justify-center items-center w-10 h-10 rounded-sm p-2 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                        onClick={() => removeItem(product.id)}
                      >
                        <X />
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

          {/* Cart Summary */}
          <div className="rounded-lg max-w-full md:max-w-sm">
            <div className="bg-white p-4 md:p-6 my-2 md:my-0 rounded-sm">
              <h3 className="text-[var(--color-primary)] font-bold text-xl md:text-3xl my-4">Total</h3>
              <div>
                <div className="flex items-center justify-between py-2">
                  <p>Subtotal</p>
                  <p>£{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <p className="flex items-center gap-x-2">
                    VAT (20%)
                    <a 
                        target="_blank"
                        href="https://www.gov.uk/vat-rates"
                    ><Info className="w-4 h-4 text-gray-400 hover:text-gray-600" title="Read More"/></a>
                    </p>
                  <p>£{vat.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-4 font-bold">
                  <p>Total</p>
                  <p>£{total.toFixed(2)}</p>
                </div>
                <p className="text-gray-500 font-normal text-sm">
                  <span className="text-red-600">*</span> Shipping is calculated in the next checkout step.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {items.length > 0 && (
                     <button className="w-full btn-primary-sm" onClick={() => navigate('/checkout')}>Checkout</button>
                )}
                <button className="w-full btn-primary-outlined-sm" onClick={handleContinueShopping}>Continue Shopping</button>
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 my-2 rounded-sm flex items-center justify-start gap-x-2">
              <p>We accept:</p>
              <div className="flex items-center justify-start gap-x-2">
                <div className="w-10 overflow-hidden"><img src={Visa} alt="Visa" /></div>
                <div className="w-10 overflow-hidden"><img src={Mastercard} alt="Mastercard" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Cart;
