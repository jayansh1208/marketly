import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cart, removeItem, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="drawer-overlay"
                        onClick={handleOverlayClick}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="drawer-panel"
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-primary-950">
                                    Shopping Cart
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {!cart || !cart.items || cart.items.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center justify-center h-full text-center"
                                    >
                                        <div className="text-6xl mb-4">🛒</div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                                        <p className="text-gray-500 mb-6">Add some products to get started!</p>
                                        <button onClick={onClose} className="btn-primary">
                                            Continue Shopping
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {cart.items.map((item, index) => (
                                                <motion.div
                                                    key={item.product._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="flex gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                                                >
                                                    {/* Product Image */}
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />

                                                    {/* Product Info */}
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                                            {item.product.name}
                                                        </h3>
                                                        <p className="text-accent-600 font-bold mb-2">
                                                            ${item.price}
                                                        </p>

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                                    className="px-3 py-1 text-gray-600 hover:text-accent-600 font-bold"
                                                                >
                                                                    −
                                                                </motion.button>
                                                                <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                                    className="px-3 py-1 text-gray-600 hover:text-accent-600 font-bold"
                                                                >
                                                                    +
                                                                </motion.button>
                                                            </div>

                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => removeItem(item.product._id)}
                                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                            >
                                                                Remove
                                                            </motion.button>
                                                        </div>
                                                    </div>

                                                    {/* Item Total */}
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            {/* Footer with Total and Checkout */}
                            {cart && cart.items && cart.items.length > 0 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="border-t border-gray-200 p-6 bg-gray-50"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-semibold text-gray-700">Total:</span>
                                        <motion.span
                                            key={cartTotal}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            className="text-2xl font-bold text-accent-600"
                                        >
                                            ${cartTotal.toFixed(2)}
                                        </motion.span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCheckout}
                                        className="w-full btn-primary"
                                    >
                                        Proceed to Checkout
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
