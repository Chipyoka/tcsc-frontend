
import Office from '../assets/images/office.avif';
import School from '../assets/images/school.avif';
import Res from '../assets/images/restaurant.avif';
import Hos from '../assets/images/hospital.avif';



const BestCategory = () => {
    return (
        <section className="py-6 md:py-12 flex flex-col-reverse md:flex-row justify-center items-start gap-x-8 mt-4 md:mt-12">
              

                <div className="max-w-lg h-[80dvh] flex flex-col justify-center gap-4">

                    {/* Hide on mobile */}
                     <div className="hidden md:inline-block relative h-[80%] overflow-hidden md:rounded-lg">
                        <img src="https://res.cloudinary.com/dsqvrrzov/image/upload/q_auto,dpr_auto/v1766929039/office_wicrau.avif" alt="Mop" className="object-cover w-[2200px] h-full" />
                        <div className="z-10 absolute bottom-2 left-4 bg-white w-fit border-b-4 px-4 py-2 border-[var(--color-accent-1)] rounded-t-md text-[var(--color-primary)] cursor-default transition-all duration-300 ease-in-out">
                            Councils & Commercial Buildings
                        </div>
                    </div>

                    {/* show on mobile */}
                     <div className="md:hidden  relative h-[80%] overflow-hidden md:rounded-lg">
                        <img src="https://res.cloudinary.com/dsqvrrzov/image/upload/q_auto,dpr_auto/v1766929031/restaurant_wprglr.avif" alt="Mop" className="object-cover w-[2200px] h-full" />
                        <div className="z-10 absolute bottom-2 left-4 bg-white w-fit border-b-4 px-4 py-2 border-[var(--color-accent-1)] rounded-t-md text-[var(--color-primary)] cursor-default transition-all duration-300 ease-in-out">
                            Restaurants & Hospitality
                        </div>
                    </div>

                     <div className="relative h-[80%] overflow-hidden md:rounded-lg">
                        <img src="https://res.cloudinary.com/dsqvrrzov/image/upload/q_auto,dpr_auto/v1766929030/school_ojjfdk.avif" alt="School Premises" className="object-cover w-[2200px] h-full" />
                        <div className="z-10 absolute bottom-2 left-4 bg-white w-fit border-b-4 px-4 py-2 border-[var(--color-accent-1)] rounded-t-md text-[var(--color-primary)] cursor-default transition-all duration-300 ease-in-out">
                            Educational Facilities
                        </div>

                    </div>
                </div>
               
                <div className="max-w-lg h-[50dvh] md:h-[80dvh] flex flex-col justify-center gap-4 my-3 md:my-0">
                     <div className="relative h-[100%] overflow-hidden md:rounded-lg">
                        <img src="https://res.cloudinary.com/dsqvrrzov/image/upload/q_auto,dpr_auto/v1766929030/hospital_z1ryoi.avif" alt="Mop" className="object-cover w-[2200px] h-full" />
                        <div className="z-10 absolute bottom-2 left-4 bg-white w-fit border-b-4 px-4 py-2 border-[var(--color-accent-1)] rounded-t-md text-[var(--color-primary)] cursor-default transition-all duration-300 ease-in-out">
                            Healthcare & Laboratory 
                        </div>

                    </div>
                
                </div>

                <div className="max-w-lg h-[80dvh] flex flex-col justify-between gap-4">
                <div className="p-4 md:p-2">
                    <h3 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-4">For Every Workplace.</h3>
                     <p className="text-[var(--color-black)] text-xl">We supply smart cleaning solutions on wholesale for every industry.</p>
                 </div>

                 {/* Hide on mobile */}
                     <div className="hidden md:inline-block relative h-[60%] overflow-hidden md:rounded-lg">
                        <img src="https://res.cloudinary.com/dsqvrrzov/image/upload/q_auto,dpr_auto/v1766929031/restaurant_wprglr.avif" alt="Mop" className=" object-cover  h-full" />
                        <div className="z-10 absolute bottom-2 left-4 bg-white w-fit border-b-4 px-4 py-2 border-[var(--color-accent-1)] 
                        rounded-t-md text-[var(--color-primary)] cursor-default transition-all duration-300 ease-in-out">Restaurants & Hospitality</div>
                    </div>

                    {/* show on mobile */}
                    {/*  */}
                     <div className="md:hidden relative h-[60%] overflow-hidden md:rounded-lg">
                        <img src="https://res.cloudinary.com/dsqvrrzov/image/upload/q_auto,dpr_auto/v1766929039/office_wicrau.avif" alt="Mop" className=" object-cover h-full" />
                        <div 
                            className="z-10 absolute bottom-2 left-4 bg-white w-fit border-b-4 px-4 py-2 border-[var(--color-accent-1)] rounded-t-md 
                            text-[var(--color-primary)] cursor-default transition-all duration-300 ease-in-out">
                                Councils & Commercial Buildings</div>
                    </div>
                </div>
               
           
        </section>

        // <section className="py-6 md:py-12 flex flex-col md:flex-row justify-center items-center gap-x-12 mt-4 md:mt-12">
        //      <div className="h-[550px] max-w-[500px] flex flex-col justify-between items-center p-6 md:py-1 gap-y-6">
        //         <div className=" md:p-2">
        //             <h3 className="text-4xl md:text-5xl font-bold text-[var(--color-black)] text-[var(--color-primary)] mb-4">Smart Solutions.</h3>
        //             <p className="text-[var(--color-black)] text-xl">Discover the ultimate cleaning experience for every workplace.</p>
        //         </div>
        //         <div className="h-[80%] overflow-hidden rounded-xl">
        //             <img src={Mop} alt="Mop" className="object-cover w-[2200px] h-full" />
        //         </div>
        //     </div>
        //     <div className="md:h-[550px] max-w-full md:max-w-[820px] mx-6 md:mx-0  overflow-hidden rounded-xl">
        //         <img src={Cloths} alt="Cleaning cloths" className="object-cover md:w-full h-full" />
        //     </div>
        // </section>
    )
}

export default BestCategory;