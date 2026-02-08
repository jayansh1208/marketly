import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();

    const cards = [
        {
            title: 'Manage Products',
            description: 'Add, edit, or delete products',
            icon: '📦',
            link: '/admin/products',
            gradient: 'from-accent-500 to-accent-600'
        },
        {
            title: 'Manage Orders',
            description: 'View and update order status',
            icon: '🛍️',
            link: '/admin/orders',
            gradient: 'from-secondary-500 to-secondary-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-primary-950 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600 text-lg">Welcome back, {user?.name}! 👋</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={card.link}>
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="relative overflow-hidden rounded-2xl shadow-xl p-8 bg-white border border-gray-100"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`} />
                                    <div className="relative z-10">
                                        <div className="text-6xl mb-4">{card.icon}</div>
                                        <h2 className="text-2xl font-bold text-primary-950 mb-2">{card.title}</h2>
                                        <p className="text-gray-600">{card.description}</p>
                                        <motion.div
                                            className="mt-4 flex items-center gap-2 text-accent-600 font-semibold"
                                            whileHover={{ x: 5 }}
                                        >
                                            Get Started
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
