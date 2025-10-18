const Newsletter = () => {
    return(
        <section className="my-20 px-6 md:px-12 flex flex-col justify-center items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold max-w-full md:max-w-[50%] text-[var(--color-primary)] md:text-center">Discover smarter ways to manage your cleaning supplies.</h2>
            <p className="text-lg md:text-center max-w-full md:max-w-[50%] ">Get actionable insights, cost-saving strategies, and product updates tailored for professional environments.</p>
            <div className="mt-6 flex items-center gap-2 bg-white border-2 border-gray-300 rounded-lg px-3 py-4 md:py-2 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)] focus-within:border-[var(--color-primary)]">
                 <input
                    type="email"
                    name="email"
                    placeholder="Enter you email address"
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                    required
                />

                <button className="hidden md:block btn-primary-sm">Subscribe</button>
            </div>
                <button className=" w-full md:hidden btn-primary-sm">Subscribe</button>
        </section>
    )
}

export default Newsletter;