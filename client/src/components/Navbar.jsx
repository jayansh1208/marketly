import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from './CartDrawer';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="navbar-glass"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2"
                            >
                                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                                        </linearGradient>
                                    </defs>
                                    <g transform="translate(32, 32)">
                                        <path d="M-12,-6 L-15,12 L15,12 L12,-6 Z" fill="url(#logoGrad)" />
                                        <path d="M-9,-6 C-9,-12 9,-12 9,-6" fill="none" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" />
                                        <text x="0" y="4" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle" fill="white">M</text>
                                    </g>
                                </svg>
                                <span className="text-2xl font-bold gradient-text">
                                    Marketly
                                </span>
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/products">Products</NavLink>

                            {isAuthenticated ? (
                                <>
                                    <NavLink to="/orders">Orders</NavLink>
                                    {isAdmin && <NavLink to="/admin">Admin</NavLink>}

                                    {/* Cart Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCartDrawerOpen(true)}
                                        className="relative text-gray-700 hover:text-accent-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <AnimatePresence>
                                            {cartCount > 0 && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
                                                >
                                                    {cartCount}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>

                                    {/* Profile Dropdown */}
                                    <div className="relative">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                            className="flex items-center gap-2 text-gray-700 hover:text-accent-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">{user?.name}</span>
                                        </motion.button>

                                        <AnimatePresence>
                                            {profileDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50"
                                                >
                                                    <Link
                                                        to="/profile"
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                                    >
                                                        Profile
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            setProfileDropdownOpen(false);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        Logout
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login">Login</NavLink>
                                    <Link to="/register">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="btn-primary py-2 px-6"
                                        >
                                            Register
                                        </motion.button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-3">
                                <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                                <MobileNavLink to="/products" onClick={() => setMobileMenuOpen(false)}>Products</MobileNavLink>
                                {isAuthenticated ? (
                                    <>
                                        <MobileNavLink
                                            onClick={() => {
                                                setCartDrawerOpen(true);
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            Cart ({cartCount})
                                        </MobileNavLink>
                                        <MobileNavLink to="/orders" onClick={() => setMobileMenuOpen(false)}>Orders</MobileNavLink>
                                        {isAdmin && (
                                            <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</MobileNavLink>
                                        )}
                                        <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</MobileNavLink>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="block w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</MobileNavLink>
                                        <MobileNavLink to="/register" onClick={() => setMobileMenuOpen(false)}>Register</MobileNavLink>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Cart Drawer */}
            <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
        </>
    );
};

// Helper Components
const NavLink = ({ to, children }) => (
    <Link to={to} className="relative group">
        <span className="text-gray-700 hover:text-accent-600 transition-colors font-medium">
            {children}
        </span>
        <motion.span
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-600 group-hover:w-full transition-all duration-300"
        />
    </Link>
);

const MobileNavLink = ({ to, onClick, children }) => {
    if (!to) {
        return (
            <button
                onClick={onClick}
                className="block w-full text-left text-gray-700 hover:text-accent-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
                {children}
            </button>
        );
    }

    return (
        <Link
            to={to}
            onClick={onClick}
            className="block text-gray-700 hover:text-accent-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
        >
            {children}
        </Link>
    );
};

export default Navbar;
