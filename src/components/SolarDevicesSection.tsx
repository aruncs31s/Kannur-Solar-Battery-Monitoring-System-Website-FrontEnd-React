import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sun, TrendingUp } from 'lucide-react';
import { SolarDeviceCard } from './SolarDeviceCard';
import { SolarDeviceView } from '../domain/entities/Device';
import { ListWithTotalCount } from '../application/types/api';

interface SolarDevicesSectionProps {
  devices: ListWithTotalCount<SolarDeviceView>;
  pageSize?: number;
  title?: string;
  showViewAllLink?: boolean;
}

export const SolarDevicesSection = ({
  devices,
  pageSize = 6,
  title = "Solar Devices",
  showViewAllLink = true
}: SolarDevicesSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalCount = devices.total_count;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [devices.list, totalCount, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedDevices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return devices.list.slice(start, start + pageSize);
  }, [currentPage, devices.list, pageSize]);

  const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalCount);

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <Sun className="text-white" size={24} />
          </div>
          {title}
        </h2>
        {showViewAllLink && (
          <Link
            to="/devices"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-semibold transition-colors"
          >
            View All
            <TrendingUp size={16} />
          </Link>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-12">
          <Sun className="mx-auto text-yellow-500 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No Solar Devices Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't added any solar devices yet.
          </p>
          <Link
            to="/devices"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
          >
            <Sun size={20} />
            View All Devices
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedDevices.map((device, idx) => (
              <SolarDeviceCard
                key={device.id}
                device={device}
                index={(currentPage - 1) * pageSize + idx}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {showingFrom}-{showingTo} of {totalCount}
            </p>

            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};