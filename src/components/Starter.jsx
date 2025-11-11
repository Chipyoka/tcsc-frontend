import Eco from '../assets/images/starta_2.png'

const Starta = () => {
    return(
        <section className ="mb-16 mt-12 md:mt-8 mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-12">
         
            <aside className="max-w-full md:max-w-1/2 p-2 md:p-4">
                <h4 className="md:text-2xl my-2 md:my-4 font-semibold uppercase text-gray-400">Not sure what to order?</h4>
                <h2 className=" text-4xl md:text-5xl font-semibold text-[var(--color-primary)] w-full md:w-[70%]">Grab a custom Starta Pack.</h2>
                <p className="text-lg mt-6 md:max-w-[90%] max-w-full">
                    Simplify your first order with our curated bundles 
                    designed to help new businesses source the right cleaning essentials with
                     confidence. Whether you manage a small office or a large facility, we’ll 
                     tailor a pack to match your operations, budget, and cleaning needs.
            
                </p>
                <div className="md:my-12"></div>
                <button className="btn-primary-lg w-full hidden md:inline-block md:w-fit">Get Yours Now</button>
            </aside>
          

              <aside className="max-w-full md:max-w-1/2 p-2 md:p-4">
                <img src={Eco} alt="Eco friendly" className="w-full h-full object-cover rounded-lg md:rounded-2xl"/>
            </aside>
            <div className="my-4"></div>
            <button className="btn-primary-lg w-full md:w-fit md:hidden">Get Yours Now</button>
            
        </section>
    )
}

export default Starta;