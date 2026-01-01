import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-l.png";
import { Search, UserCircle, ShoppingCart, Menu, X, ChevronRight, ChevronDown, ArrowRight } from "lucide-react";

import { useCategoryStore } from "../store/category.store";
import {useNavStore} from '../store/nav.store.js';
import { buildNavTree } from "../utils/buildTree";
import axiosInstance from "../api/axiosInstance";
import useCartStore from "../store/cart.store";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { categories, setCategories, loading, setLoading } = useCategoryStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
    const {setProductCategory} = useNavStore();
  const navigate = useNavigate();

  // Fetch categories if not already loaded
  useEffect(() => {
    console.log("What we have for cats:", categories);
    if (categories.length) return; // already loaded from storage

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/categories");
        if (res.data.success) {
          const tree = buildNavTree(res.data.data);
          setCategories(tree);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categories.length, setCategories, setLoading]);

  // Handle navigation
  const handleToProducts = (cat, subcat, subsub) => {
    if (!cat) return;

    //   console.log('Navigating to cat:', cat);
  //   console.log('Navigating to subcat:', subcat);
  //   console.log('Navigating to subsub:', subsub);

    navigate(
      `/products/${cat.slug}/${subcat?.slug || ""}/${subsub?.slug || ""}`
    );

    // Optional: set some store state for active category if needed
    const categoryBody = {
       cat: {tag:cat.tag, id: cat.id},
      subcat: subcat ? {subcat:subcat.tag, id:subcat.id} : null,
      slug: subsub ? {subsub:subsub.tag, id:subsub.id} : null,
    }
    console.log("What i am sending:", categoryBody);

     setProductCategory(categoryBody);

    setMenuOpen(false);
  };

  //   const handleToProducts = (cat,subcat,subsub) =>{
  //   if(!cat) return;

  //   console.log('Navigating to cat:', cat);
  //   console.log('Navigating to subcat:', subcat);
  //   console.log('Navigating to subsub:', subsub);

  //   navigate(`/products/${cat.slug}/${subcat.slug}/${subsub.slug}`);
  //   setProductCategory({
  //     cat: cat.tag,
  //     subcat: subcat ? subcat.tag : null,
  //     slug: subsub ? subsub.tag : null,
  //   });
  //   setMenuOpen(false);
  //   // alert(link.tag)

  // }

  // if (loading) return <div>Loading categories...</div>;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-center items-center bg-[var(--color-white)] px-12 py-4">
        <div className="flex justify-start gap-x-12 items-center w-[30%]">
          <img src={Logo} alt="TCSC Logo" width="200px" className="cursor-pointer" onClick={() => navigate(`/`)} />
        </div>

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

        <div className="flex justify-end items-center gap-x-12 w-[30%]">
          <div className="cursor-pointer" onClick={() => navigate("/profile")}>
            <UserCircle className="w-9 h-9 text-[var(--color-primary)]" />
          </div>

          <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
            <ShoppingCart className="w-9 h-9 text-[var(--color-primary)]" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

          <button className="btn-primary-outlined-sm" onClick={() => navigate("/login")}>
            Signup
          </button>
        </div>
      </nav>

      {/* Desktop Bottom Menu */}
      <div className="hidden md:flex md:justify-center md:px-10 md:py-2 md:bg-[var(--color-primary)]">
        <ul className="flex justify-center gap-x-12 items-center text-sm md:text-[1rem] text-[var(--color-white)] relative">
          {categories.map((cat, i) => (
            <li key={cat.id} className="relative group cursor-pointer">
              <span className="flex items-center px-3 py-2 hover:text-[var(--color-accent)]">
                {cat.tag} <ChevronDown className="w-4 h-4 ml-1" />
              </span>

              {cat.children?.length > 0 && (
                <div
                  className={`absolute top-full hidden group-hover:flex bg-white text-black shadow-xl px-8 pb-20 pt-12 rounded-sm z-50 transition-all duration-300 ease-in-out ${i > categories.length / 2 ? 'right-0' : 'left-0'}`}
                >
                  <div className="flex items-start gap-12 mb-12">
                    {cat.children.map((sub) => (
                      <div key={sub.id} className="flex flex-col w-62 border-r border-gray-200 last:border-white">
                        <h4 className="font-semibold text-[var(--color-primary)] mb-4 cursor-default pb-1">
                          {sub.tag}
                        </h4>
                        {sub.children?.length > 0 && (
                          <ul className="space-y-3">
                            {sub.children.map((subsub) => (
                              <li
                                key={subsub.id}
                                onClick={() => handleToProducts(cat, sub, subsub)}
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

                  {/* Optional promotion block */}
                  <div className="absolute bottom-6 left-8 w-full h-12">
                    <p className="text-sm font-medium p-4 w-fit bg-gray-100">
                      <span className="text-[var(--color-secondary)]">Enjoy 20%</span> off as a Discount Club Member
                      <span className="ml-6 py-2 px-4 w-fit bg-[var(--color-accent-1)] rounded-sm text-[var(--color-white)] font-bold transition-all duration-300">Learn More</span>
                    </p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ---------------- Mobile Navbar ---------------- */}
      <nav className="sticky top-0 z-50 w-full md:hidden flex justify-between items-center bg-[var(--color-white)] px-6 py-4 shadow-sm">
        <img src={Logo} alt="TCSC Logo" className="w-36 cursor-pointer" onClick={() => navigate(`/`)} />

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
            <ShoppingCart className="w-9 h-9 text-[var(--color-primary)]" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

          <button className="p-2 rounded-md hover:bg-gray-100 transition" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-9 h-9 text-[var(--color-primary)]" /> : <Menu className="w-9 h-9 text-[var(--color-primary)]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Menu */}
      <div className={`fixed top-0 right-0 h-full w-full bg-[var(--color-white)] shadow-lg transform transition-transform duration-300 z-100 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between p-4 mb-6">
          <img src={Logo} alt="TCSC Logo" className="w-36 cursor-pointer" onClick={() => navigate(`/`)} />
          <button onClick={() => setMenuOpen(false)}>
            <ChevronRight className="w-9 h-9 text-[var(--color-primary)]" />
          </button>
        </div>

        <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-4 mt-2 mx-6 mb-4">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input type="search" placeholder="Find a product..." className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm" />
        </div>

        <ul className="flex flex-col gap-6 p-6 text-lg text-[var(--color-primary)]">
          {categories.map((cat) => (
            <li key={cat.id} className="cursor-pointer hover:text-[var(--color-primary-dark)] flex items-center justify-between">
              {cat.tag} <ChevronRight className="w-4 h-4" />
            </li>
          ))}

          <li className="border-t border-gray-300 pt-8 mt-4">
            <button onClick={() => navigate("/login")} className="btn-primary-sm w-full mt-4 flex items-center justify-center">
              Create an Account <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="fixed inset-0 bg-black opacity-30 z-40" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
};

export default Navbar;
