import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sun, TrendingUp } from 'lucide-react';
import { Section } from './Section';
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
    <Section
      title={title}
      icon={Sun}
      headerAction={
        showViewAllLink && (
          <Link
            to="/devices"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-semibold transition-colors"
          >
            View All
            <TrendingUp size={16} />
          </Link>
        )
      }
    >
      {totalCount === 0 ? (
        <div className="text-center py-12">
          <Sun className="mx-auto text-warning mb-4" size={64} />
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            No Solar Devices Found
          </h3>
          <p className="text-text-secondary mb-6">
            You haven't added any solar devices yet.
          </p>
          <Link
            to="/devices"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-colors shadow-lg hover:shadow-primary-500/20"
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
            <p className="text-sm text-text-tertiary">
              Showing {showingFrom}-{showingTo} of {totalCount}
            </p>

            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-border-primary px-3 py-2 text-sm font-medium text-text-secondary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-surface-secondary transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm font-medium text-text-primary px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 rounded-lg border border-border-primary px-3 py-2 text-sm font-medium text-text-secondary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-surface-secondary transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </Section>
  );
};