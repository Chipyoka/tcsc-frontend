const Topbar = () => {
    return(
        <div className="bg-[var(--color-primary)] text-[var(--color-white)] px-12 py-6 flex justify-between items-center">
           <div>
             <p className="text-lg text-[var(--color-white)] font-medium cursor-default">Smart Solutions for Everyday Cleaning</p>
           </div>
           <div className="flex justify-end items-center gap-x-4">
                <p className="text-lg text-[var(--color-white)] font-medium cursor-pointer border-b-2 border-[var(--color-primary)] hover:border-[var(--color-white)]">
                    Get a Custom Quote
                </p>

                | 

                <p className="text-lg text-[var(--color-white)] font-medium cursor-pointer border-b-2 border-[var(--color-primary)] hover:border-[var(--color-white)]">Join the Discount Club</p>
           </div>
        </div>
    )
}

export default Topbar;