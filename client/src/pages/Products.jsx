import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../api/services';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: 'All',
        minPrice: '',
        maxPrice: '',
        sort: 'latest'
    });

    const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Toys', 'Beauty', 'Other'];

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = { ...filters };
            if (params.category === 'All') delete params.category;
            const response = await productService.getProducts(params);
            setProducts(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-8 text-primary-950"
                >
                    Discover Products
                </motion.h1>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-glass mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="text"
                            placeholder="🔍 Search products..."
                            className="input-field"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                        <select
                            className="input-field"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Min Price"
                            className="input-field"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            className="input-field"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        />
                        <select
                            className="input-field"
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                        >
                            <option value="latest">Latest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </motion.div>

                {/* Products Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <LoadingSpinner type="skeleton-products" />
                        </motion.div>
                    ) : products.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <EmptyState
                                icon="🔍"
                                title="No products found"
                                message="Try adjusting your filters to find what you're looking for"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="products"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {products.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    layout
                                >
                                    <Link to={`/products/${product._id}`} className="block group">
                                        <motion.div
                                            whileHover={{
                                                y: -10,
                                                rotateX: 5,
                                                rotateY: 5,
                                            }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            className="product-card relative"
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            {/* Stock Badge */}
                                            {product.stock < 10 && product.stock > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-3 right-3 z-10 badge-secondary"
                                                >
                                                    Only {product.stock} left!
                                                </motion.div>
                                            )}
                                            {product.stock === 0 && (
                                                <div className="absolute top-3 right-3 z-10 badge bg-red-500 text-white">
                                                    Out of Stock
                                                </div>
                                            )}

                                            <div className="overflow-hidden rounded-t-2xl">
                                                <motion.img
                                                    whileHover={{ scale: 1.15 }}
                                                    transition={{ duration: 0.5 }}
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-64 object-cover"
                                                />
                                            </div>

                                            <div className="p-5">
                                                <p className="text-sm text-accent-600 font-semibold mb-2">
                                                    {product.category}
                                                </p>
                                                <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-accent-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-2xl font-bold text-accent-600">
                                                            ${product.price}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Stock: {product.stock}
                                                        </p>
                                                    </div>
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        whileHover={{ opacity: 1, scale: 1 }}
                                                        className="bg-accent-500 text-white p-3 rounded-xl shadow-lg"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Products;
