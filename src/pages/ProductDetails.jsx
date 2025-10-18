import {useState} from 'react';
import {useNavStore} from '../store/nav.store.js';
import { ShoppingCart, Heart, Check } from 'lucide-react';

import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import BestSelling from '../components/BestSelling';
import DiscountClub from '../components/DiscountClub';
import Footer from "../components/Footer";
import FAQSection from "../components/FAQSection";

const ProductDetails = () =>{

    const [pageTitle, setPageTitle] = useState("Loading...");
    const {selectedProductId} = useNavStore();
    const [product, setProduct] = useState({});

    window.document.title = `${pageTitle} | The Cleaning Supplies Co.`;
    
    return(
        <>
            <Topbar />
            <Navbar />
            <div className="p-6 md:px-12 max-w-full">
                <p>Shop / category / product name</p>
            </div>

            <section className="px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-center items-start gap-x-6 md:gap-x-16 w-full max-w-full p-2 md:p-6">
                    {/* Product image */}
                    <div 
                        className="relative border border-gray-200 rounded-lg h-[50%] overflow-hidden flex items-center justify-center mb-4 bg-[var(--color-white)]"

                    >
                        <img 
                            src={product.image || '../src/assets/images/default_product.png'} 
                            alt={product.name || 'product'}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-90 group-hover:scale-105"

                        
                        />
                    </div>

                    {/* product info */}
                    <div className="w-full md:w-1/2 max-w-full md:max-w-1/2">
                        <h2 className="text-2xl md:text-4xl font-medium text-[var(--color-primary)]">{product.name || 'Product Name'}</h2>
                        <p className="text-md md:text-lg text-gray-600 my-4 w-full md:w-[80%]">
                            {
                                product.shortDesc 
                                || 
                                "This will be the short description of the product to give a peek to the users viewing it."
                            }
                        </p>

                        <h3 className="font-bold text-2xl md:text-4xl  text-[var(--color-primary)]">£{product.price || '0.00'}</h3>

                        <div className="border  border-[var(--color-primary)] text-[var(--color-primary)] rounded-md px-4 py-2 w-fit text-xl font-medium my-6 flex justify-start items-center gap-x-8 gap-y-2">
                            <button className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-4 w-6 h-6">+</button> 
                            {1}
                            <button className="rounded-sm hover:bg-gray-200 flex justify-center items-center p-4 w-6 h-6">-</button>
                        </div>

                        {/* add to cart buttons */}
                         <div className="text-sm flex justify-start gap-6 items-center">
                            <button className="btn-primary-sm  flex gap-x-2 items-center">
                                <ShoppingCart />
                                Add to Cart
                            </button>

                            <button className=" text-[var(--color-primary)] mt-2 flex gap-x-2 items-center border-3 border-[var(--color-primary)] px-4 py-2 rounded-lg">
                                <Heart className="w-7 h-7" />
                            </button>
                        </div>
                        
                    </div>
                </div>

                {/* Long description with features */}
                <div className="w-full md:w-[80%] my-6 md:px-16">
                    <h3 className="text-2xl md:text-4xl font-medium text-[var(--color-primary)]">Description</h3>

                    <p className="text-md md:text-lg my-4 text-gray-600">
                        The Cleaning Supplies Co. is Hertfordshire’s trusted partner 
                        for professional-grade cleaning solutions. We help small businesses 
                        and organizations maintain clean, compliant, and efficient environments 
                        through reliable supply, expert advice, and sustainable products. 
                        Built on competence, consistency, and care — we make cleanliness a 
                        seamless part of your operations.
                        The Cleaning Supplies Co. is Hertfordshire’s trusted partner 
                        for professional-grade cleaning solutions. We help small businesses 
                        and organizations maintain clean, compliant, and efficient environments 
                        through reliable supply, expert advice, and sustainable products. 
                        Built on competence, consistency, and care — we make cleanliness a 
                        seamless part of your operations.
                    </p>

                    <div>
                        { product?.features?.length < 1 ? (
                            <div className="my-6">
                                <p className="flex justify-start items-center gap-x-2 text-gray-600 font-medium text-lg"><Check/> This is an example of a feature </p>
                            </div>
                        ) : (
                            <div className="my-6">
                                <p>Experience Quality.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <BestSelling/>
            <DiscountClub/>
            <FAQSection/>
            <Footer/>
        </>
    )
}

export default ProductDetails;