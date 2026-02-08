import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../api/services';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        stock: '',
        images: ['']
    });

    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Toys', 'Beauty', 'Other'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error('Fetch products error:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                const response = await productService.updateProduct(editingProduct._id, formData);
                console.log('Update response:', response);
                toast.success('✅ Product updated!');
            } else {
                const response = await productService.createProduct(formData);
                console.log('Create response:', response);
                toast.success('🎉 Product created!');
            }
            resetForm();
            await fetchProducts();
        } catch (error) {
            console.error('Submit error:', error);
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || error.message || 'Operation failed';
            toast.error(errorMessage);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            images: product.images
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await productService.deleteProduct(id);
            toast.success('🗑️ Product deleted!');
            await fetchProducts();
        } catch (error) {
            console.error('Delete error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
            toast.error(errorMessage);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: 'Electronics',
            stock: '',
            images: ['']
        });
        setEditingProduct(null);
        setShowModal(false);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Add Button */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-primary-950">Product Management</h1>
                        <p className="text-gray-600 mt-2">Manage your store inventory</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openAddModal}
                        className="btn-primary flex items-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        Add New Product
                    </motion.button>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card group relative"
                        >
                            <div className="overflow-hidden rounded-xl mb-4">
                                <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                            </div>

                            <span className="inline-block bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                                {product.category}
                            </span>

                            <h3 className="font-bold text-lg mb-2 text-primary-950">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-accent-600 font-bold text-xl">${product.price}</span>
                                <span className={`text-sm px-2 py-1 rounded ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    Stock: {product.stock}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEdit(product)}
                                    className="btn-outline flex-1 py-2 text-sm"
                                >
                                    ✏️ Edit
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDelete(product._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition flex-1 text-sm font-semibold"
                                >
                                    🗑️ Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Modal for Add/Edit */}
                <AnimatePresence>
                    {showModal && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={resetForm}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            >
                                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                        <h2 className="text-2xl font-bold text-primary-950">
                                            {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                                        </h2>
                                        <button
                                            onClick={resetForm}
                                            className="text-gray-400 hover:text-gray-600 text-2xl"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Product Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter product name"
                                                    required
                                                    className="input-field"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Price ($) *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        required
                                                        step="0.01"
                                                        min="0"
                                                        className="input-field"
                                                        value={formData.price}
                                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Stock *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        required
                                                        min="0"
                                                        className="input-field"
                                                        value={formData.stock}
                                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Category *
                                                </label>
                                                <select
                                                    className="input-field"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                >
                                                    {categories.map((cat) => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Description *
                                                </label>
                                                <textarea
                                                    placeholder="Enter product description"
                                                    required
                                                    className="input-field"
                                                    rows="3"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Image URL *
                                                </label>
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com/image.jpg"
                                                    required
                                                    className="input-field"
                                                    value={formData.images[0]}
                                                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-6">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                className="btn-primary flex-1"
                                            >
                                                {editingProduct ? 'Update Product' : 'Create Product'}
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="button"
                                                onClick={resetForm}
                                                className="btn-outline flex-1"
                                            >
                                                Cancel
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminProducts;
