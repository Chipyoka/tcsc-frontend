import { ArrowRight, Check } from 'lucide-react';

const Hero = () => {
    return (
        <>
                 <section className="relative h-fit md:h-[70vh] flex items-center justify-center text-white">
            <div className="absolute inset-0 bg-[url('../assets/images/discount-club.avif')] bg-cover bg-center opacity-100 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-[var(--color-primary-d)]/80"></div>

           
            <div className="relative z-10 md:text-center">
                {/* <h4 className="md:text-2xl my-2 md:my-4 font-semibold uppercase text-[var(--color-accent-2)]">our Commitment to Nature</h4> */}
               <div className="flex flex-col justify-start items-start md:justify-center md:items-center py-16 px-6 md:px-0">
                    <h2 className="text-4xl md:text-5xl font-semibold text-white">The Discount Club.</h2>
                <p className="text-lg mt-6 md:max-w-[60%] max-w-full text-white">
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
                        Weekly
                    </li>
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
              
                
                </ul>
                <p className="italic font-medium text-lg text-white mt-4">
                     Sit back, relax, and let us take care of the rest!
                </p>
               </div>
            </div>
        </section>
        </>
    )
}

export default Hero;