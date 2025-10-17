import Package from '../assets/icons/package.png';
import Offer from '../assets/icons/offer.png';
import Sprayer from '../assets/icons/spray-bottle.png';


const WhyUs = () => {
    return (
        <div className="bg-[var(--color-primary)] py-6 flex justify-center items-center gap-y-6 px-8">
            <div className="w-[30%] max-w-[30%] h-30 flex justify-center items-center gap-x-6 border-r-2 border-[var(--color-white)] px-8 mr-4">
                <div>
                    <img src={Package} alt="" className="w-[100px]" />
                </div>
                <div>
                    <h3 className="text-white text-xl">Enjoy Fast Delivery</h3>
                    <p className="text-white text-md">Get your products delivered to your doorstep in no time.</p>
                </div>
            </div>
            <div className="w-[30%] max-w-[30%] h-30 flex justify-center items-center gap-x-6 border-r-2 border-[var(--color-white)] px-8 mr-4">
                <div>
                    <img src={Offer} alt="" className="w-[120px]" />
                </div>
                <div>
                    <h3 className="text-white text-xl">Discount Club Offers</h3>
                    <p className="text-white text-md">Join our club and enjoy exclusive discounts on your favorite products.</p>
                </div>
            </div>
            <div className="w-[30%] max-w-[30%] h-30 flex justify-center items-center gap-x-6 px-8">
                <div>
                    <img src={Sprayer} alt="" className="w-[66px]" />
                </div>
                <div>
                    <h3 className="text-white text-xl">Assorted Products</h3>
                    <p className="text-white text-md">Explore a wide range of products tailored to your needs.</p>
                </div>
            </div>
 
        </div>
    )

}

export default WhyUs;