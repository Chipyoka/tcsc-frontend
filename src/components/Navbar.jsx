import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import Logo from '../assets/images/logo-l.png';
import { Search, UserCircle, ShoppingCart, Menu, X, ChevronRight } from "lucide-react";

import {useNavStore} from '../store/nav.store.js';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {setProductCategory} = useNavStore();

  const navigate = useNavigate();

  // categories turned into navigation links as filters
  const navLinks = [
    {tag: "Disinfectants", slug:"disinfectants"},
    {tag: "Floor Cleaners", slug:"floor-cleaners"},
    {tag: "Washroom Cleaners", slug:"washroom-cleaners"},
    {tag: "Sanitizers", slug:"sanitizers"},
    {tag: "Handwash Cleaners", slug:"handwash-cleaners"},
    {tag: "Cleaning Cloths", slug:"cleaning-cloths"},
  ];

  const handleToProducts = (link) =>{
    if(!link) return;

    navigate(`/products/${link.slug}`)
    setProductCategory(link.tag);
    setMenuOpen(false);
    // alert(link.tag)

  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-center items-center bg-[var(--color-white)] px-12 py-6">
        {/* logo + categories */}
        <div className="flex justify-start gap-x-12 items-center w-[30%]">
          <div>
            <img src={Logo} alt="TCSC Logo" width="200px"  onClick={()=> {navigate(`/`)}} />
          </div>
        </div>

        {/* search */}
        <div className="w-[60%]">
          <div className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-lg px-3 py-3 w-full max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
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
            <button className="btn-primary-outlined-sm" onClick={() => {navigate('/login')}}>Signup</button>
          </div>
        </div>
      </nav>

      {/* Desktop Bottom Menu */}
      <div className="hidden md:flex md:px-12 md:py-4 md:bg-[var(--color-primary)]">
        <ul className="flex justify-center gap-x-30 items-center text-xl text-[var(--color-white)]">
          {navLinks.map((link, i) => (
            <li 
              key={i} 
              className="cursor-pointer"
              onClick={()=> {handleToProducts(link)}}
            >{link.tag}</li>
          ))}
        </ul>
      </div>

      {/* ---------------- Mobile Navbar ---------------- */}
      <nav className="sticky top-0 z-50 w-full md:hidden flex justify-between items-center bg-[var(--color-white)] px-6 py-4 shadow-sm">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo} alt="TCSC Logo" className="w-36" onClick={()=> {navigate(`/`)}}/>
        </div>

        {/* Right: Cart + Hamburger */}
        <div className="flex items-center gap-4">
          <ShoppingCart className="w-9 h-9 text-[var(--color-primary)] cursor-pointer" />

          {/* Hamburger button */}
          <button
            className="p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-9 h-9 text-[var(--color-primary)]" /> : <Menu className="w-9 h-9 text-[var(--color-primary)]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-[var(--color-white)] shadow-lg transform transition-transform duration-300 z-100
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between p-4 mb-6">
                 <div className="flex items-center">
          <img src={Logo} alt="TCSC Logo" className="w-36" onClick={()=> {navigate(`/`)}} />
            </div>
          <button onClick={() => setMenuOpen(false)}>
            <ChevronRight className="w-9 h-9 text-[var(--color-primary)]" />
          </button>
        </div>
            <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-4 mt-2 mx-6 mb-4">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="search"
                placeholder="Find a product..."
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>
        <ul className="flex flex-col gap-6 p-6 text-lg text-[var(--color-primary)]">
          {/* Nav Links */}
          {navLinks.map((link, i) => (
            <li 
              key={i} 
              className="cursor-pointer hover:text-[var(--color-primary-dark)]"
              onClick={()=> {handleToProducts(link)}}
            >{link.tag}</li>
          ))}

          {/* Profile */}
          <li className="flex items-center gap-2 mt-2">
             <button className="btn-primary-outlined-sm w-full mt-4 flex items-center justify-center gap-4">
                <UserCircle className="w-8 h-8 text-[var(--color-primary)]" />
                Profile
            </button>
            
          </li>

          {/* Signup button */}
          <li>
            <button className="btn-primary-sm w-full mt-4" onClick={() => {navigate('/login')}}>Signup</button>
          </li>
        </ul>
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
