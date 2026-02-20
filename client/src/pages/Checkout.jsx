import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { orderService } from '../api/services';
import toast from 'react-hot-toast';

// Card payment component with Stripe hooks
const CardPaymentForm = ({ shippingAddress, cart, cartTotal, clearCart, navigate, setCurrentStep }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleCardPayment = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        try {
            const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (error) {
                toast.error(error.message);
                setLoading(false);
                return;
            }

            const orderData = {
                orderItems: cart.items.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.images[0]
                })),
                shippingAddress,
                paymentMethod: {
                    id: stripePaymentMethod.id,
                    type: 'card'
                },
                totalPrice: cartTotal,
                isPaid: true,
                paidAt: new Date()
            };

            await orderService.createOrder(orderData);

            toast.success('Order placed successfully!', {
                icon: '🎉',
                style: {
                    borderRadius: '12px',
                    background: '#10b981',
                    color: '#fff',
                },
            });

            clearCart();
            navigate('/orders');
        } catch (error) {
            const errData = error.response?.data;
            const errMsg = errData?.errors ? errData.errors[0].message : (errData?.message || 'Payment failed');
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleCardPayment}>
            <div className="mb-6 p-4 bg-white rounded-xl border-2 border-gray-200 focus-within:border-accent-500 transition-colors">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#111827',
                                '::placeholder': {
                                    color: '#9ca3af',
                                },
                            },
                        },
                    }}
                />
            </div>
            <div className="flex gap-4">
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(2)}
                    className="btn-outline flex-1"
                >
                    Back
                </motion.button>
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || !stripe}
                    className="btn-primary flex-1"
                >
                    {loading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                </motion.button>
            </div>
        </form>
    );
};

const CheckoutForm = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'card', 'upi'
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: ''
    });

    const steps = [
        { number: 1, name: 'Cart', icon: '🛒' },
        { number: 2, name: 'Shipping', icon: '📦' },
        { number: 3, name: 'Payment', icon: '💳' }
    ];

    const handleShippingSubmit = (e) => {
        if (e) e.preventDefault();
        const { fullName, address, city, postalCode, country, phone } = shippingAddress;
        if (!fullName || !address || !city || !postalCode || !country || !phone) {
            toast.error('Please fill in all shipping fields');
            return;
        }
        setCurrentStep(3);
    };

    const handleCODOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                orderItems: cart.items.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price, // FIX: Extract price from product object
                    image: item.product.images[0]
                })),
                shippingAddress,
                paymentMethod: 'cod',
                totalPrice: cartTotal,
                isPaid: false,
                paidAt: null
            };

            await orderService.createOrder(orderData);

            toast.success('🎉 Order Received! We will deliver soon!', {
                duration: 3000,
                style: {
                    borderRadius: '12px',
                    background: '#10b981',
                    color: '#fff',
                    fontSize: '16px',
                    padding: '16px',
                },
            });

            clearCart();

            // Redirect to orders page after 2 seconds
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        } catch (error) {
            const errData = error.response?.data;
            const errMsg = errData?.errors ? errData.errors[0].message : (errData?.message || 'Order failed');
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleUPIPayment = async () => {
        setLoading(true);
        try {
            // Simulate UPI payment (in real app, integrate with payment gateway)
            const orderData = {
                orderItems: cart.items.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.images[0]
                })),
                shippingAddress,
                paymentMethod: {
                    type: 'upi'
                },
                totalPrice: cartTotal,
                isPaid: true,
                paidAt: new Date()
            };

            await orderService.createOrder(orderData);

            toast.success('UPI Payment Successful!', {
                icon: '✅',
                style: {
                    borderRadius: '12px',
                    background: '#10b981',
                    color: '#fff',
                },
            });

            clearCart();
            navigate('/orders');
        } catch (error) {
            const errData = error.response?.data;
            const errMsg = errData?.errors ? errData.errors[0].message : (errData?.message || 'Payment failed');
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                    <button onClick={() => navigate('/products')} className="btn-primary">
                        Continue Shopping
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Step Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${currentStep >= step.number
                                            ? 'bg-accent-500 text-white shadow-glow'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {step.icon}
                                    </div>
                                    <p className={`mt-2 font-semibold ${currentStep >= step.number ? 'text-accent-600' : 'text-gray-500'}`}>
                                        {step.name}
                                    </p>
                                </motion.div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-24 h-1 mx-4 transition-all duration-500 ${currentStep > step.number ? 'bg-accent-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="card-glass"
                                >
                                    <h2 className="text-2xl font-bold text-primary-950 mb-6">Review Your Cart</h2>
                                    <div className="space-y-4 mb-6">
                                        {cart.items.map((item) => (
                                            <div key={item.product._id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                                                    <p className="text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-accent-600">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setCurrentStep(2)}
                                        className="btn-primary w-full"
                                    >
                                        Continue to Shipping
                                    </motion.button>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="card-glass"
                                >
                                    <h2 className="text-2xl font-bold text-primary-950 mb-6">Shipping Address</h2>
                                    <div className="space-y-4 mb-6">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="input-field"
                                            value={shippingAddress.fullName}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Street Address"
                                            className="input-field"
                                            value={shippingAddress.address}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="City"
                                                className="input-field"
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Postal Code"
                                                className="input-field"
                                                value={shippingAddress.postalCode}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Country"
                                                className="input-field"
                                                value={shippingAddress.country}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                className="input-field"
                                                value={shippingAddress.phone}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setCurrentStep(1)}
                                            className="btn-outline flex-1"
                                        >
                                            Back
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleShippingSubmit}
                                            className="btn-primary flex-1"
                                        >
                                            Continue to Payment
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="card-glass"
                                >
                                    <h2 className="text-2xl font-bold text-primary-950 mb-6">Payment Method</h2>

                                    {/* Payment Method Selection */}
                                    <div className="space-y-3 mb-6">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'cod'
                                                ? 'border-accent-500 bg-accent-50'
                                                : 'border-gray-200 hover:border-accent-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl">💵</div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
                                                    <p className="text-sm text-gray-600">Pay when you receive</p>
                                                </div>
                                                {paymentMethod === 'cod' && <div className="text-accent-500 text-2xl">✓</div>}
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => setPaymentMethod('card')}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'card'
                                                ? 'border-accent-500 bg-accent-50'
                                                : 'border-gray-200 hover:border-accent-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl">💳</div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900">Credit/Debit Card</h3>
                                                    <p className="text-sm text-gray-600">Secure payment via Stripe</p>
                                                </div>
                                                {paymentMethod === 'card' && <div className="text-accent-500 text-2xl">✓</div>}
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'upi'
                                                ? 'border-accent-500 bg-accent-50'
                                                : 'border-gray-200 hover:border-accent-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl">📱</div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900">UPI Payment</h3>
                                                    <p className="text-sm text-gray-600">Pay via UPI apps</p>
                                                </div>
                                                {paymentMethod === 'upi' && <div className="text-accent-500 text-2xl">✓</div>}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Card Payment Form - Only load Stripe when needed */}
                                    {paymentMethod === 'card' && (
                                        import.meta.env.VITE_STRIPE_PUBLIC_KEY ? (
                                            <Elements stripe={loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)}>
                                                <CardPaymentForm
                                                    shippingAddress={shippingAddress}
                                                    cart={cart}
                                                    cartTotal={cartTotal}
                                                    clearCart={clearCart}
                                                    navigate={navigate}
                                                    setCurrentStep={setCurrentStep}
                                                />
                                            </Elements>
                                        ) : (
                                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium">
                                                Stripe is not currently configured for this environment. Please choose another payment method.
                                            </div>
                                        )
                                    )}

                                    {/* COD Confirmation */}
                                    {paymentMethod === 'cod' && (
                                        <div className="flex gap-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setCurrentStep(2)}
                                                className="btn-outline flex-1"
                                            >
                                                Back
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleCODOrder}
                                                disabled={loading}
                                                className="btn-primary flex-1"
                                            >
                                                {loading ? 'Processing...' : 'Place Order'}
                                            </motion.button>
                                        </div>
                                    )}

                                    {/* UPI Payment */}
                                    {paymentMethod === 'upi' && (
                                        <div>
                                            <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                                                <p className="text-center text-gray-700 mb-2">Scan QR or use UPI ID</p>
                                                <p className="text-center font-mono text-sm text-gray-600">store@upi</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setCurrentStep(2)}
                                                    className="btn-outline flex-1"
                                                >
                                                    Back
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleUPIPayment}
                                                    disabled={loading}
                                                    className="btn-primary flex-1"
                                                >
                                                    {loading ? 'Processing...' : 'Confirm Payment'}
                                                </motion.button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-glass h-fit sticky top-24"
                    >
                        <h3 className="text-xl font-bold text-primary-950 mb-6">Order Summary</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cart.items.length} items)</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-semibold">FREE</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                <span className="text-lg font-bold text-primary-950">Total</span>
                                <span className="text-2xl font-bold text-accent-600">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
                            <p className="text-sm text-accent-800">
                                {paymentMethod === 'cod' && '💵 Cash on Delivery'}
                                {paymentMethod === 'card' && '🔒 Secure checkout powered by Stripe'}
                                {paymentMethod === 'upi' && '📱 UPI Payment'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Export CheckoutForm directly - no global Stripe wrapper needed
export default CheckoutForm;
