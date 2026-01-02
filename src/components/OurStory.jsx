import { ArrowRight } from 'lucide-react';

const OurStory = () => {
    return(
        <section className="relative h-fit md:h-[70vh] flex items-center justify-center text-white">
            <div className="absolute inset-0 bg-[url('../assets/images/image_3.avif')] bg-cover bg-center opacity-70 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-[var(--color-primary-d)]/80"></div>

           
            <div className="relative z-10 md:text-center">
                {/* <h4 className="md:text-2xl my-2 md:my-4 font-semibold uppercase text-[var(--color-accent-2)]">our Commitment to Nature</h4> */}
               <div className="flex flex-col justify-start items-start md:justify-center md:items-center py-16 px-6 md:px-0">
                    <h2 className="text-4xl md:text-5xl md:text-center font-semibold text-white">Professional cleaning supplies. Without the wait.</h2>
                    <p className="mt-3 text-lg w-full my-2 md:w-[60%]">
                       Created by cleaning industry small business owners to give schools, 
                       care homes, councils, and cleaners fast access to 
                       affordable solutions at scale—because downtime isn’t an option. 
                
                    </p>
                    <div className="mt-6">
                        <button className="btn-primary-outlined-lg bg-none w-full md:w-fit flex items-center justify-center hover:shadow-lg transition-all duration-300">
                            Book a call with us
                            <span> <ArrowRight  className="w-5 h-5 ml-2"/></span>
                        </button>
                    </div>
               </div>
            </div>
        </section>
    )
}

export default OurStory;