import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 gradient-text">Marketly</h3>
                        <p className="text-gray-400">
                            Your premium online shopping destination for quality products.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-white transition">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-white transition">
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="text-gray-400 hover:text-white transition">
                                    Orders
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-400">Contact Us</li>
                            <li className="text-gray-400">Shipping Info</li>
                            <li className="text-gray-400">Returns</li>
                            <li className="text-gray-400">FAQ</li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                                📘
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                                🐦
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                                📷
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Marketly. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
