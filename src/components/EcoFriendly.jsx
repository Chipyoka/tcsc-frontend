import Eco from '../assets/images/eco-friendly.jpg'

const EcoFriendly = () => {
    return(
        <section className ="mb-16 mt-12 md:mt-36 mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-12">
            <aside className="max-w-full md:max-w-1/2 p-2 md:p-4">
                <h4 className="md:text-2xl my-2 md:my-4 font-semibold uppercase text-gray-400">our Commitments</h4>
                <h2 className=" text-4xl md:text-5xl font-medium text-[var(--color-primary)]">A Cleaner Future: For You and the Planet.</h2>
                <p className="text-lg mt-6 md:max-w-[90%] max-w-full">
                    At The Cleaning Supplies Co., sustainability isn’t a trend, it’s a responsibility. 
                    We continuously source and promote eco-friendly products that reduce environmental 
                    impact without compromising performance.   
                    <span className="hidden md:inline-block">
                        From biodegradable cleaning agents to recyclable 
                        packaging, our approach ensures every purchase supports a cleaner tomorrow. 
                        Together with our partners, we’re lowering carbon footprints, encouraging mindful
                        consumption, and redefining what it means to clean responsibly.
                    </span>
                </p>
            </aside>
            <aside className="max-w-full md:max-w-1/2 p-2 md:p-4 ">
                <img src={Eco} alt="Eco friendly" className="w-full h-full object-cover rounded-lg md:rounded-2xl"/>
            
            </aside>
        </section>
    )
}

export default EcoFriendly;