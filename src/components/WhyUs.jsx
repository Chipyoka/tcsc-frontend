import Package from '../assets/icons/package.png';
import Offer from '../assets/icons/offer.png';
import Sprayer from '../assets/icons/spray-bottle.png';


const WhyUs = () => {
    return (
        <div className="bg-[var(--color-primary)] py-6 flex flex-col md:flex-row justify-center items-center gap-y-6 px-2 md:px-8">
            <div className="w-full md:w-[30%] max-w-full md:max-w-[30%] h-30 flex justify-center items-center gap-x-6 md:border-r-2 border-[var(--color-white)] px-4 md:px-8 md:mr-4">
                <div>
                    <img src={Package} alt="" className="w-[100px]" />
                </div>
                <div>
                    <h3 className="text-white text-xl font-bold">Reliable Delivery</h3>
                    <p className="text-white text-sm md:text-md">Your orders get delivered within one working day of dispatch.</p>
                </div>
            </div>
            <div className="w-full md:w-[30%] max-w-full md:max-w-[30%] h-30 flex justify-center items-center gap-x-6 md:border-r-2 border-[var(--color-white)] px-4 md:px-8 md:mr-4">
                <div>
                    <img src={Offer} alt="" className="w-[100px]" />
                </div>
                <div>
                    <h3 className="text-white text-xl font-bold">Discount Club Offers</h3>
                    <p className="text-white text-sm md:text-md">We have exclusive discounts on your wholesale orders.</p>
                </div>
            </div>
            <div className="w-full md:w-[30%] max-w-full md:max-w-[30%] h-30 flex justify-center items-center gap-x-6 px-4 md:px-8">
                <div>
                    <img src={Sprayer} alt="" className="w-[66px] mr-6 md:mr-0" />
                </div>
                <div>
                    <h3 className="text-white text-xl font-bold">Assorted Products</h3>
                    <p className="text-white text-sm md:text-md">We offer a wide range of products tailored for every industry.</p>
                </div>
            </div>
 
        </div>
    )

}

export default WhyUs;