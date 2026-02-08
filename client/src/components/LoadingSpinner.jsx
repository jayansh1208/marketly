import { motion } from 'framer-motion';

const LoadingSpinner = ({ type = 'spinner' }) => {
    if (type === 'skeleton-products') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-soft"
                    >
                        <div className="skeleton h-64 w-full" />
                        <div className="p-4 space-y-3">
                            <div className="skeleton h-6 w-3/4" />
                            <div className="skeleton h-4 w-1/2" />
                            <div className="skeleton h-8 w-1/3" />
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    if (type === 'skeleton-card') {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="space-y-4">
                    <div className="skeleton h-8 w-1/2" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-5/6" />
                </div>
            </div>
        );
    }

    // Default spinner
    return (
        <div className="flex items-center justify-center py-20">
            <motion.div
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="relative"
            >
                <div className="w-16 h-16 border-4 border-accent-200 border-t-accent-600 rounded-full" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary-500 rounded-full"
                />
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;
