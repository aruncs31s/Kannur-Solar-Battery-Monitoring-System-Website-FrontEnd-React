/**
 * Performance optimization utilities for reducing memory usage
 */

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation variants with performance optimization
export const animationVariants = {
  // Use lighter animations or disable them if user prefers reduced motion
  fadeIn: prefersReducedMotion()
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
      },
  
  slideUp: prefersReducedMotion()
    ? {}
    : {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.3 },
      },

  scale: prefersReducedMotion()
    ? {}
    : {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.2 },
      },
};

// Data management utilities
export const dataLimits = {
  MAX_READINGS: 100, // Maximum readings to keep in memory
  MAX_DEVICES_DISPLAY: 50, // Maximum devices to display at once
  REFRESH_INTERVAL: 30000, // 30 seconds
  STALE_DATA_THRESHOLD: 300000, // 5 minutes
};

/**
 * Limit array size to prevent memory bloat
 */
export const limitArraySize = <T>(array: T[], maxSize: number): T[] => {
  if (array.length <= maxSize) return array;
  return array.slice(0, maxSize);
};

/**
 * Debounce function to limit function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function to limit function execution rate
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Clean up old data based on timestamp
 */
export const cleanStaleData = <T extends { timestamp?: number | string }>(
  data: T[],
  thresholdMs: number = dataLimits.STALE_DATA_THRESHOLD
): T[] => {
  const now = Date.now();
  return data.filter((item) => {
    if (!item.timestamp) return true;
    const itemTime = typeof item.timestamp === 'string' 
      ? new Date(item.timestamp).getTime() 
      : item.timestamp;
    return now - itemTime < thresholdMs;
  });
};
