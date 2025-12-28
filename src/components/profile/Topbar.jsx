import Favicon from '../../assets/icons/fav-3.png';
import { LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profile.store.js';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/auth.store.js';
import { toast } from 'react-toastify';

const Topbar = () => {
    const { nav, setNav } = useProfileStore();
    const { logout } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const navigate = useNavigate();

    // navitems
    const navItems = [
        { name: 'Home', link: '#' },
        { name: 'Orders', link: '#' },
        { name: 'Payments', link: '#' },
        { name: 'Subscriptions', link: '#' },
        { name: 'Settings', link: '#' },
    ];

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
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
        <div className="relative w-full h-16 bg-white shadow-md flex items-center px-4 md:px-6 mt-4 justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
                <img src={Favicon} alt="Favicon" className="h-10 w-10 md:h-12 md:w-12" />
                <h4 className="text-lg font-semibold text-gray-600">My Account</h4>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
                <>
                    <div className="w-1/2">
                        <ul className="flex items-center justify-center gap-6 md:gap-8 ml-8 md:ml-12 text-gray-400">
                            {navItems.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleNavClick(item.name)}
                                    className={item.name === nav ?
                                        "cursor-default text-(--color-primary) pb-1 border-b-2 border-(--color-primary) transition-all duration-200" :
                                        "cursor-pointer hover:text-gray-600 pb-1 border-b-2 border-transparent hover:border-gray-200 transition-all duration-200"}
                                >
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-(--color-danger) hover:text-(--color-danger-h) py-2 px-3 hover:bg-red-100 rounded-sm flex gap-2 items-center cursor-pointer transition-all duration-200"
                            disabled={loading}
                        >
                            <LogOut className="h-5 w-5" />
                            {loading ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                </>
            )}

            {/* Mobile Hamburger Menu Button */}
            {isMobile && (
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-8 w-8" />
                    )}
                </button>
            )}

            {/* Mobile Menu Overlay */}
            {isMobile && isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Slide-in Menu */}
                    <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
                        <div className="flex flex-col h-full pt-16">
                            {/* Navigation Items */}
                            <div className="flex-1 px-4 py-6">
                                <ul className="space-y-4">
                                    {navItems.map((item, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => handleNavClick(item.name)}
                                                className={`w-full text-left px-4 py-3 transition-all duration-200 ${item.name === nav ?
                                                    'text-(--color-primary) bg-(--color-primary-light) border-l-2 border-(--color-primary)' :
                                                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {item.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Logout Button */}
                            <div className="border-t border-gray-200 p-4">
                                <button
                                    onClick={handleLogoutClick}
                                    disabled={loading}
                                    className="w-full text-(--color-danger) hover:text-(--color-danger-h) hover:bg-red-50 py-3 px-4 rounded-lg flex items-center justify-start gap-3 cursor-pointer transition-all duration-200 disabled:opacity-50"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium">
                                        {loading ? 'Logging out...' : 'Logout'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Topbar;