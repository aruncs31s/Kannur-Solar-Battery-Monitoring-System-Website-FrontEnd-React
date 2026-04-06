/**
 * Formatter utilities for Profile page
 * Responsibility: Single - providing formatting functions
 */

export const useProfileFormatters = () => {
  const getDeviceStatusIcon = (state: number) => {
    switch (state) {
      case 1:
        return 'check';
      case 0:
        return 'x';
      default:
        return 'alert';
    }
  };

  const getDeviceStatusText = (state: number) => {
    switch (state) {
      case 1:
        return 'Active';
      case 0:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getActivityColor = (action: string): string => {
    if (action.includes('login')) return 'text-info-600';
    if (action.includes('create')) return 'text-success-600';
    if (action.includes('delete')) return 'text-error-600';
    if (action.includes('update')) return 'text-warning-600';
    return 'text-text-secondary';
  };

  return {
    getDeviceStatusIcon,
    getDeviceStatusText,
    formatTimestamp,
    getActivityColor,
  };
};
