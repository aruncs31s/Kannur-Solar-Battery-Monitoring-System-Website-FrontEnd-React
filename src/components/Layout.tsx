import { motion } from 'framer-motion';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <Navigation />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative flex-1 max-w-7xl w-full mx-auto px-4 py-6 custom-scrollbar"
      >
        {children}
      </motion.main>
      
      <footer className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-gray-200 py-8 mt-auto border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-2 text-white">SKVMS</h3>
              <p className="text-sm text-gray-400">Solar Battery Monitoring System</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-white">Quick Links</h3>
              <ul className="space-y-1 text-sm text-gray-400">
                <li><a href="/devices" className="hover:text-blue-400 transition-colors">Devices</a></li>
                <li><a href="/readings" className="hover:text-blue-400 transition-colors">Readings</a></li>
                <li><a href="/audit" className="hover:text-blue-400 transition-colors">Audit Logs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-white">System Status</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-400">All Systems Operational</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-sm text-gray-400">&copy; 2026 Solar Battery Monitoring System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
