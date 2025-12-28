import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import Logo from '../assets/images/logo-l.png';
import { Search, UserCircle, ShoppingCart, Menu, X, ChevronRight, ChevronDown, ArrowRight } from "lucide-react";

import {useNavStore} from '../store/nav.store.js';
import useCartStore from '../store/cart.store.js';
import { navLinks } from "../data/categories";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {setProductCategory} = useNavStore();
  const totalItems = useCartStore((state) => state.getTotalItems());


  const navigate = useNavigate();

  // categories turned into navigation links as filters
  // const navLinks = [
  //   {tag: "Cleaning & Disinfecting Chemicals", slug:"disinfectants"},
  //   {tag: "Cleaning Tools & Accessories", slug:"floor-cleaners"},
  //   {tag: "Hand Wash & Soaps", slug:"washroom-cleaners"},
  //   {tag: "Waste Management", slug:"sanitizers"},
  //   {tag: "Equipment & Safety", slug:"handwash-cleaners"},
  //   {tag: "Wholesale Deals", slug:"handwash-cleaners"}
  // ];

  const handleToProducts = (cat,subcat,subsub) =>{
    if(!cat) return;

    console.log('Navigating to cat:', cat);
    console.log('Navigating to subcat:', subcat);
    console.log('Navigating to subsub:', subsub);

    navigate(`/products/${cat.slug}/${subcat.slug}/${subsub.slug}`);
    setProductCategory({
      cat: cat.tag,
      subcat: subcat ? subcat.tag : null,
      slug: subsub ? subsub.tag : null,
    });
    setMenuOpen(false);
    // alert(link.tag)

  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-center items-center bg-[var(--color-white)] px-12 py-4">
        {/* logo + categories */}
        <div className="flex justify-start gap-x-12 items-center w-[30%]">
          <div className="cursor-pointer">
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
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <ShoppingCart className="w-9 h-9 text-[var(--color-primary)]" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>

          <div>
            <button 
              className="btn-primary-outlined-sm" 
              onClick={() => {navigate('/login')}}
            >
              Signup
            </button>
          </div>
        </div>
      </nav>

          {/* Desktop Bottom Menu */}
      <div className="hidden md:flex md:justify-center md:px-10 md:py-2 md:bg-[var(--color-primary)]">
        <ul className="flex justify-center gap-x-12 items-center text-sm md:text-[1.0rem] text-[var(--color-white)] relative">
          {navLinks.map((link, i) => (
            <li
              key={i}
              className="relative group cursor-pointer"
            >
              <span
                // onClick={() => handleToProducts(link)}
                className="flex items-center px-3 py-2 hover:text-[var(--color-accent)]"
              >
                {link.tag}   
                <span><ChevronDown className="w-4 h-4 ml-1" /></span>
              </span>

              {/* MEGA MENU */}
              {link.children && (
                <div
                  className={`
                    absolute top-full hidden group-hover:flex
                    bg-white text-black shadow-xl px-8 pb-20 pt-12 rounded-sm
                    z-50 transition-all duration-300 ease-in-out
                    ${i > navLinks.length / 2 ? 'right-0' : 'left-0'}
                  `}
                >
                  <div className="flex items-start gap-12 mb-12">
                    {link.children.map((sub, j) => (
                      <div key={j} className="flex flex-col w-62 border-r border-gray-200 last:border-white">
                        <h4 className="font-semibold text-[var(--color-primary)] mb-4 cursor-default pb-1">
                          {sub.tag}
                        </h4>
                        {sub.children && (
                          <ul className="space-y-3">
                            {sub.children.map((subsub, k) => (
                              <li
                                key={k}
                                onClick={() => handleToProducts(link,sub,subsub)}
                                className="text-lg text-gray-500 hover:text-gray-900 cursor-pointer"
                              >
                                {subsub.tag}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
              
                    ))}
                  </div>
                
                  {/* Invisible hover bridge to prevent flicker */}
                  <div className="absolute -top-4 left-0 w-full h-4"></div>


                    <div className="absolute bottom-6 left-8 w-full h-12">
                      <p className="text-sm font-medium p-4 w-fit bg-gray-100">
                        <span className="text-[var(--color-secondary)]">Enjoy 20%</span> off as a Discount Club Member 
                        <span className=" ml-6 py-2 px-4 w-fit bg-[var(--color-accent-1)] rounded-sm text-[var(--color-white)] font-bold transition-all duration-300">Learn More</span></p>
                    </div>
                  
                </div>
              )}
            </li>
          ))}
          {/* <li className="cursor-pointer">Bulk Orders</li> */}
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
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <ShoppingCart className="w-9 h-9 text-[var(--color-primary)]" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

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
        <ul className="flex flex-col md:justify-center gap-6 p-6 text-lg text-[var(--color-primary)]">
          {/* Nav Links */}
          {navLinks.map((link, i) => (
            <li 
              key={i} 
              className="cursor-pointer hover:text-[var(--color-primary-dark)] flex items-center justify-between"
              onClick={()=> {handleToProducts(link, link.children, link.children.children)}}
            >{link.tag} <span><ChevronRight className="w-4 h-4 " /></span></li>
          ))}
          {/* <li  className="cursor-pointer hover:text-[var(--color-primary-dark)]">
            Bulk Orders
          </li> */}

          {/* Profile */}
          {/* <li className="flex items-center gap-2 mt-2">
             <button className="btn-primary-outlined-sm w-full mt-4 flex items-center justify-center gap-4">
                <UserCircle className="w-8 h-8 text-[var(--color-primary)]" />
                Profile
            </button>
            
          </li> */}

          {/* Signup button */}
          <li className="border-t border-gray-300 pt-8 mt-4">
            <button 
              onClick={() => {navigate('/login')}}
              className="btn-primary-sm w-full mt-4 flex items-center justify-center " 
            >
              Create an Account
              <span> <ArrowRight  className="w-5 h-5 ml-2"/></span>
            </button>
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
