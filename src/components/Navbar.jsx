import Logo from '../assets/images/logo-l.png'
import { Search } from "lucide-react";
import { UserCircle } from "lucide-react";
import { ShoppingCart } from "lucide-react";


const Navbar = () => {
    return(
        <>
        <nav className="flex justify-center items-center bg-[var(--color-white)] px-12 py-6">
            {/* logo + categories */}
            <div className=" flex justify-start gap-x-12 items-center w-[30%]">
                <div>
                    <img src={Logo} alt="TCSC Logo" width="200px" />
                </div>
            </div>

            {/* search */}
            <div className="w-[60%]">
            <div className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-lg px-3 py-4 w-full max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)] focus-within:border-[var(--color-primary)]">
                <Search className="w-6 h-6 text-gray-500" />
                <input
                    type="search"
                    name="search"
                    placeholder="Find a product..."
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                />
            </div>

            </div>

            {/* cta */}
            <div className="flex justify-end items-center gap-x-12 w-[30%]">
                <div className="cursor-pointer">
                    <UserCircle className="w-9 h-9 text-[var(--color-primary)]" />
                </div>
                <div className="cursor-pointer">

                    <ShoppingCart className="w-9 h-9 text-[var(--color-primary)]" />
                </div>
                <div>
                    <button className="btn-primary-outlined-sm">Signup</button>
                </div>
            </div>
        </nav>
         <div className="px-12 py-4 bg-[var(--color-primary)]">
            <ul className=" flex justify-center gap-x-30 items-center text-xl text-[var(--color-white)]">
                <li className="cursor-pointer">Disinfectants</li>
                <li className="cursor-pointer">Floor Cleaners</li>
                <li className="cursor-pointer">Washroom Cleaners</li>
                <li className="cursor-pointer">Sanitizers</li>
                <li className="cursor-pointer">Handwash Cleaners</li>
                <li className="cursor-pointer">Cleaning Cloths</li>
            </ul>
        </div>
    </>
    )
}

export default Navbar;