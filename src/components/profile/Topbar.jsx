import Favicon from '../../assets/icons/fav-3.png';
import { 
  LogOut, 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  CreditCard, 
  Repeat, 
  Settings 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profile.store.js';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/auth.store.js';
import { toast } from 'react-toastify';

const Topbar = () => {
    const { nav, setNav } = useProfileStore();
    const { logout, user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Changed to 1024 for sidebar layout

    const navigate = useNavigate();

    // navitems with icons
    const navItems = [
        { name: 'Home', link: '#', icon: Home },
        { name: 'Orders', link: '#', icon: ShoppingBag },
        // { name: 'Payments', link: '#', icon: CreditCard },
        { name: 'Subscriptions', link: '#', icon: Repeat },
        { name: 'Settings', link: '#', icon: Settings },
    ];

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024); // Changed breakpoint
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        setLoading(true);
        try {
            setTimeout(() => {
                logout();
                navigate('/');
                setLoading(false);
            }, 2500);
            toast.success('Logout successful!');
        } catch (error) {
            toast.error('Logout failed. Please try again.');
            console.error("Logout error:", error);
        }
    };

    const handleNavClick = (itemName) => {
        setNav(itemName);
        if (isMobile) {
            setIsMenuOpen(false);
        }
    };

    const handleLogoutClick = () => {
        if (isMobile) {
            setIsMenuOpen(false);
        }
        handleLogout();
    };

    return (
        <div className="border border-gray-200 rounded-md relative w-full md:w-1/4 h-18 md:h-[80dvh] bg-white flex flex-col items-start px-4 md:px-6 mt-4 justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 mt-4 w-full">
                <img src={Favicon} alt="Favicon" className="h-10 w-10 md:h-12 md:w-12" />
                <h4 className="text-lg font-semibold text-gray-600 truncate overflow-ellipsis">
                    My Account
                    <br />
                    <p 
                    className="text-sm text-gray-400 font-normal max-w-[80%] truncate"
                    >{user?.fullName ?? ""}</p>
                </h4>
                
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
                <>
                    <div className="h-fit mt-6 w-full border-t border-gray-200 pt-6">
                        <ul className="flex flex-col items-start justify-start gap-2 ml-2 text-gray-400">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <li
                                        key={index}
                                        onClick={() => handleNavClick(item.name)}
                                        className={`w-full cursor-pointer transition-all duration-200 ${item.name === nav ?
                                            "text-(--color-primary) bg-blue-50 border-l-2 border-(--color-primary)" :
                                            "hover:text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-md">
                                            <Icon className="h-5 w-5" />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="h-1/2 flex items-end mb-6 w-full">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full text-(--color-danger) hover:text-(--color-danger-h) py-3 px-4 hover:bg-red-50 rounded-md flex gap-3 items-center cursor-pointer transition-all duration-200"
                            disabled={loading}
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-medium">
                                {loading ? 'Logging out...' : 'Logout'}
                            </span>
                        </button>
                    </div>
                </>
            )}

            {/* Mobile Hamburger Menu Button - Now positioned appropriately */}
            {isMobile && (
                <>
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {isMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/50 z-40"
                                onClick={() => setIsMenuOpen(false)}
                            />

                            {/* Slide-in Menu */}
                            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
                                <div className="flex flex-col h-full">
        

                                    {/* Navigation Items */}
                                    <div className="flex-1 px-2 py-6 mt-12">
                                        <ul className="space-y-1">
                                            {navItems.map((item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                    <li key={index}>
                                                        <button
                                                            onClick={() => handleNavClick(item.name)}
                                                            className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 flex items-center gap-3 ${item.name === nav ?
                                                                'text-(--color-primary) bg-blue-50' :
                                                                'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                                }`}
                                                        >
                                                            <Icon className="h-5 w-5" />
                                                            <span className="text-sm font-medium">{item.name}</span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                    {/* Logout Button */}
                                    <div className="border-t border-gray-200 p-4">
                                        <button
                                            onClick={handleLogoutClick}
                                            disabled={loading}
                                            className="w-full text-(--color-danger) hover:text-(--color-danger-h) hover:bg-red-50 py-3 px-4 rounded-md flex items-center justify-start gap-3 cursor-pointer transition-all duration-200 disabled:opacity-50"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span className="font-medium text-sm">
                                                {loading ? 'Logging out...' : 'Logout'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Mobile Content - Shows when menu is closed */}
      
        </div>
    );
};

export default Topbar;