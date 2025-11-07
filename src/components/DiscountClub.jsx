import {Check} from 'lucide-react';
import Delivery from '../assets/images/delivery.png';

const DiscountClub = () => {
    return(
        <section className="bg-[var(--color-accent-1)] mt-6 p-6 md:p-16  gap-12 flex flex-col md:flex-row justify-between items-center border-b-24 border-[var(--color-primary)]">
              <aside className="max-w-full md:max-w-1/2 rounded-2xl">
                <img src={Delivery} alt="We will deliver to your door step" className="w-full h-full rounded-lg md:rounded-2xl" />
            </aside>
            <aside className="max-w-full md:max-w-1/2 rounded-2xl">
                <h4 
                className="text-[var(--color-accent-2)] md:text-2xl font-semibold my-2 md:my-4 uppercase">
                    There is more we're offering
                </h4>
                <h2 className="text-4xl md:text-5xl font-medium text-white">Join the Discount Club</h2>
                <p className="text-lg mt-6 md:max-w-[96%] max-w-full text-white">
                    Simplify your shopping with our exclusive subscription service, designed to save you money and make
                    your life easier. As a Discount Club member, you'll enjoy exclusive savings, Buy now pay later access
                    and the convenience of having your cleaning supplies delivered right to your doorstep—no more
                    worrying about running out or keeping track of your stock!
                  
                </p>
                <h4 className="text-xl text-white mt-6 mb-4 font-bold">  Flexible plans to choose from:</h4>
                <ul className="flex flex-wrap gap-y-2 gap-x-4 font-medium text-sm">
                    <li className="flex gap-2 px-4 py-2 border-3 border-white rounded-lg cursor-default hover:shadow-lg transition-all duration-300 text-white">
                        <div>
                            <Check/>
                        </div>
                        Monthly
                    </li>
                    <li className="flex gap-2 px-4 py-2 border-3 border-white rounded-lg cursor-default hover:shadow-lg transition-all duration-300 text-white">
                        <div>
                            <Check/>
                        </div>
                        Every 2 Months
                    </li>
                    <li className="flex gap-2 px-4 py-2 border-3 border-white rounded-lg cursor-default hover:shadow-lg transition-all duration-300 text-white">
                        <div>
                            <Check/>
                        </div>
                        Every 3 Months
                    </li>
                    <li className="flex gap-2 px-4 py-2 border-3 border-white rounded-lg cursor-default hover:shadow-lg transition-all duration-300 text-white">
                        <div>
                            <Check/>
                        </div>
                        Every 6 Months
                    </li>
                
                </ul>
                <p className="italic font-medium text-lg text-white mt-4">
                     Sit back, relax, and let us take care of the rest!
                </p>

                <div className="mt-6">
                    <button className="btn-primary-outlined-lg-2 w-full md:w-fit hover:shadow-lg transition-all duration-300">Join Now !</button>
                </div>
            </aside>
          
        </section>
    )
}

export default DiscountClub;