import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {X} from 'lucide-react';
import Visa from '../assets/icons/visa.webp';
import Mastercard from '../assets/icons/mastercard.jpg'

const Cart = () => {
    // set window title
    window.document.title = "My Cart | The Cleaning Supplies Co.";


    const sampleProducts = [
        // { id: 1, name: "I am Product 1", price: 19.99, image: "" },
        // { id: 2, name: "I am Product 2", price: 29.99, image: "" },
        // { id: 3, name: "I am Product 3", price: 39.99, image: "" },
        // { id: 4, name: "I am Product 4", price: 49.99, image: "" },
        // { id: 5, name: "I am Product 5", price: 59.99, image: "" },
        // { id: 6, name: "I am Product 6", price: 69.99, image: "" },
    ];
    return(
        <>
            <Topbar/>
            <Navbar/>
            <section className="bg-gray-100 flex py-12 justify-center items-center">
                <div className="px-4 w-full md:w-6xl flex flex-wrap items-start justify-start gap-x-8">
                    <div className="bg-white p-4 md:p-6 rounded-lg max-w-full w-full md:max-w-2xl h-[80dvh] max-h-[80dvh] ">
                        <h3 className="text-[var(--color-primary)] font-bold text-xl md:text-3xl my-4">My Cart</h3>
                        <div className="my-2 overflow-y-auto h-[90%] py-4">
                            {sampleProducts?.map((product) => (
                                <div key={product.id} className="flex items-center justify-start gap-6 py-4 border-t border-gray-200">
                                    <div>
                                        {/* image */}
                                        <div 
                                            className="flex justify-center items-center border border-gray-200 rounded-lg max-w-[100px] md:max-w-[150px] overflow-hidden flex items-center justify-center mb-4 bg-[var(--color-white)]"

                                        >
                                            <img 
                                                src={product.image || '../src/assets/images/default_product.png'} 
                                                alt={product.name || 'product'}
                                                className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-90 group-hover:scale-105"    
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between gap-x-8 w-[60%]">
                                        {/* info */}
                                        <div>
                                        <h3 className="text-[var(--color-primary)] font-normal text-sm md:text-lg max-w-[160px] md:max-w-lg truncate">
                                                {product.name || '-'}
                                            </h3>
                                            <h3 className="text-[var(--color-primary)] font-bold text-md md:text-lg mt-1">£{product.price}</h3>

                                            <div className="border  border-[var(--color-primary)] text-[var(--color-primary)] rounded-md px-2 py-2 w-fit text-sm font-medium my-4 flex justify-start items-center gap-x-2 gap-y-2">
                                                <button className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-2 w-4 h-4">+</button> 
                                                {1}
                                                <button className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-2 w-4 h-4">-</button>
                                            </div>
                                        </div>
                                    
                                        <div className="text-gray-400 flex justify-center items-center w-10 h-10 rounded-sm p-2 hover:bg-gray-100 transitions-all duration-300">
                                            <X/>
                                        </div>
                                    </div>
                                
                                </div>
                            ))}

                            {sampleProducts?.length < 1 && (
                                <div className="flex h-[70%] justify-center items-center">
                                    <p className="text-lg text-gray-600 font-medium">Your cart is empty !</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* cart summaries */}
                    <div className="  rounded-lg max-w-full md:max-w-sm ">
                        <div className="bg-white p-4 md:p-6 my-2 md:my-0 rounded-sm">
                            <h3 className="text-[var(--color-primary)] font-bold text-xl md:text-3xl my-4">Total</h3>
                            <div>
                                <div className="flex items-center justify-between py-2">
                                    <p>Subtotal</p>
                                    <p>£0.00</p>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                    <p>VAT</p>
                                    <p>£0.00</p>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-4 font-bold">
                                    <p>Total</p>
                                    <p>£0.00</p>
                                </div>
                                

                                <p className="text-gray-500 font-normal text-sm"><span className="text-red-600">*</span> Shipping is calculated in the next checkout step.</p>
                            </div>
                            <div className="mt-6">
                                <button className="w-full btn-primary-sm">Checkout</button>
                                <button className="w-full btn-primary-outlined-sm">Continue Shopping</button>
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
            <Footer/>
        </>
    )
}

export  default Cart;