import Mop from '../assets/images/mop.jpg';
import Cloths from '../assets/images/cloths.png';
import Carex from '../assets/images/carex-2.png';


const BestCategory = () => {
    return (
        <section className="py-12 flex justify-center items-center gap-x-12 mt-12">
             <div className="h-[550px] max-w-[500px] flex flex-col justify-between items-center gap-y-6">
                <div className="p-6">
                    <h3 className="text-6xl font-bold text-[var(--color-black)] text-[var(--color-primary)] mb-4">The Best Ever</h3>
                    <p className="text-[var(--color-black)] text-xl">Discover the ultimate cleaning experience with our top-rated products.</p>
                </div>
                <div className="h-[80%] overflow-hidden rounded-4xl">
                    <img src={Mop} alt="Mop" className="object-cover w-[2200px] h-full" />
                </div>
            </div>
            <div className="h-[550px] max-w-[820px] overflow-hidden rounded-4xl">
                <img src={Cloths} alt="Cleaning cloths" className="object-cover w-full h-full" />
            </div>
           
            {/* <div className="h-[550px] max-w-[420px] overflow-hidden rounded-4xl">
                <img src={Carex} alt="Carex" className="object-cover w-full h-full" />
            </div> */}
        </section>
    )
}

export default BestCategory;