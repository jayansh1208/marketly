import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Cart = () => {
    const { cart, loading, updateQuantity, removeItem, cartTotal } = useCart();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md"
                >
                    <EmptyState
                        icon="🛒"
                        title="Your cart is empty"
                        message="Start shopping to add items to your cart"
                        action={
                            <Link to="/products" className="btn-primary">
                                Browse Products
                            </Link>
                        }
                    />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-primary-950 mb-8"
                >
                    Shopping Cart
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item, index) => (
                            <motion.div
                                key={item.product._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card-glass flex gap-4 p-6"
                            >
                                <div className="overflow-hidden rounded-xl">
                                    <motion.img
                                        whileHover={{ scale: 1.1 }}
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-32 h-32 object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-xl text-primary-950 mb-2">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-accent-600 font-bold text-lg mb-3">
                                        ${item.price}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition"
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                                                className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => removeItem(item.product._id)}
                                            className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                                        >
                                            🗑️ Remove
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold text-2xl text-accent-600">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <div className="card-glass sticky top-24 p-6">
                            <h2 className="text-2xl font-bold text-primary-950 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cart.items.length} items)</span>
                                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-semibold">FREE</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                    <span className="text-lg font-bold text-primary-950">Total</span>
                                    <span className="text-3xl font-bold text-accent-600">
                                        ${cartTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/checkout')}
                                className="btn-primary w-full text-lg py-4"
                            >
                                Proceed to Checkout
                            </motion.button>

                            <Link
                                to="/products"
                                className="block text-center text-accent-600 hover:text-accent-700 font-semibold mt-4"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
