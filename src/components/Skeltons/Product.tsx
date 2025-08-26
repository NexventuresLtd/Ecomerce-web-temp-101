// Skeleton Loader Component
import { motion } from 'framer-motion';
const SkeletonLoader: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-100 rounded-2xl overflow-hidden"
        >
            <div className="animate-pulse">
                <div className="bg-gray-300 h-48 w-full"></div>
                <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="h-10 bg-gray-300 rounded-2xl"></div>
                </div>
            </div>
        </motion.div>
    );
};
export default SkeletonLoader