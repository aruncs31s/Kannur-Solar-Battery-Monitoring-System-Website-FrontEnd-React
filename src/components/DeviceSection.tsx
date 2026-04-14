import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Cpu, Hash, TrendingUp } from "lucide-react";
import { Section } from "./Section";
import { MinimalDeviceDTO } from "../domain/entities/Device";
import { ListWithTotalCount } from "../application/types/api";

interface DeviceTypeFilterOption {
  id: number;
  name: string;
}

interface DeviceSectionProps {
  devices: ListWithTotalCount<MinimalDeviceDTO>;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  title?: string;
  showViewAllLink?: boolean;
  typeFilters?: DeviceTypeFilterOption[];
  selectedTypeId?: number | "all";
  onTypeChange?: (typeId: number | "all") => void;
  filterLoading?: boolean;
}

export const DeviceSection = ({
  devices,
  currentPage,
  onPageChange,
  pageSize = 6,
  title = "Devices",
  showViewAllLink = true,
  typeFilters = [],
  selectedTypeId = "all",
  onTypeChange,
  filterLoading = false,
}: DeviceSectionProps) => {
  const totalCount = devices.total_count;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const deviceList = devices.list;

  const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = totalCount === 0 ? 0 : Math.min((currentPage - 1) * pageSize + deviceList.length, totalCount);

  return (
    <Section
      title={title}
      icon={Cpu}
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
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">Filter devices by type</p>
        <select
          value={selectedTypeId}
          onChange={(event) => {
            if (!onTypeChange) {
              return;
            }

            const nextValue = event.target.value === "all" ? "all" : parseInt(event.target.value, 10);
            onTypeChange(nextValue);
          }}
          className="min-w-56 px-3 py-2 border border-border-primary rounded-lg bg-surface-secondary text-text-primary"
          disabled={filterLoading || !onTypeChange}
        >
          <option value="all">All Types</option>
          {typeFilters.map((typeFilter) => (
            <option key={typeFilter.id} value={typeFilter.id}>
              {typeFilter.name}
            </option>
          ))}
        </select>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-12">
          <Cpu className="mx-auto text-warning mb-4" size={64} />
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            No Devices Found
          </h3>
          <p className="text-text-secondary mb-6">
            You have not added any devices yet.
          </p>
          <Link
            to="/devices"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-colors shadow-lg hover:shadow-primary-500/20"
          >
            <Cpu size={20} />
            View All Devices
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deviceList.map((device) => (
              <Link key={device.id} to={`/devices/${device.id}`}>
                <div className="border border-border-primary rounded-2xl p-5 hover:shadow-xl hover:border-primary-500 transition-all bg-surface-secondary h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-lg text-text-primary line-clamp-2">
                      {device.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-surface-tertiary text-text-secondary whitespace-nowrap">
                      {device.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary bg-surface-tertiary rounded-lg px-3 py-2 w-fit">
                    <Hash size={14} />
                    <span>Device #{device.id}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-tertiary">
              Showing {showingFrom}-{showingTo} of {totalCount}
            </p>

            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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