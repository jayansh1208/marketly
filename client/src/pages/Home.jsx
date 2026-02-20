import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { productService } from '../api/services';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await productService.getProducts({ sort: 'latest' });
            setProducts(response.slice(0, 8));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary-950 via-accent-900 to-primary-900 text-white py-32 overflow-hidden">
                {/* Animated Background Elements - Optimized */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-7xl font-bold mb-6"
                    >
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
                            Marketly
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto"
                    >
                        Your premium online shopping destination. Discover quality products at unbeatable prices.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-accent-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl inline-flex items-center gap-3"
                            >
                                Shop Now
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-primary-950 mb-4">Featured Products</h2>
                    <p className="text-gray-600 text-lg">Handpicked selections just for you</p>
                </motion.div>

                {loading ? (
                    <LoadingSpinner type="skeleton-products" />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link to={`/products/${product._id}`} className="block group">
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="product-card"
                                    >
                                        <div className="overflow-hidden rounded-t-2xl">
                                            <motion.img
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.4 }}
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-64 object-cover"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-accent-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-2xl font-bold text-accent-600">
                                                    ${product.price}
                                                </p>
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileHover={{ opacity: 1, x: 0 }}
                                                    className="text-accent-600"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <Link to="/products">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline"
                        >
                            View All Products
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
