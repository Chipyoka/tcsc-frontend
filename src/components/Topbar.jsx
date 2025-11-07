const Topbar = () => {
    return(
        <div className="bg-[var(--color-primary)] text-[var(--color-white)] px-6 md:px-12 py-4 md:py-4 flex justify-center md:justify-between items-center">
           <div>
             <p className="text-sm text-center md:text-left md:text-lg text-[var(--color-white)] font-medium cursor-default">Smart Solutions for Everyday Cleaning</p>
           </div>
           <div className="hidden md:flex justify-end items-center gap-x-4">
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