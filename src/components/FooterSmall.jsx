const FooterSmall = () => {
    return (
        <div className="flex justify-center items-center w-full text-sm text-gray-400 py-6">
                <ul className="flex flex-col md:flex-row gap-4 md:gap-12 justify-center items-center">
                    <li className="hover:underline"><a href="/legal-terms">Shipping and Return Policy</a></li>
                    <li className="hover:underline"><a href="/legal-terms">Terms and Conditions</a></li>
                    <li className=" hover:underline"><a href="/contact-us">Contact Support</a></li>
                    {/* <li className="hover:underline"><a href="#">About</a></li> */}
                </ul>
        </div>
    )
}

export default FooterSmall;