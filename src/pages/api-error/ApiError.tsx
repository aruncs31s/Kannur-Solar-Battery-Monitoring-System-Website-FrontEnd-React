import { motion } from 'framer-motion';
import { ServerCrash, RefreshCw } from 'lucide-react';

export const ApiError = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full card p-8 text-center"
            >
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-full inline-block mb-6">
                    <ServerCrash size={48} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Service Unavailable</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    We are currently experiencing technical difficulties or the server is down. Please try again later.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="inline-flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                    <RefreshCw size={20} />
                    Try Again
                </button>
            </motion.div>
        </div>
    );
};
