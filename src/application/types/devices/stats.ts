

/**
 * Dashboard-level aggregation of device counts and average readings.
 */
export interface MainStatsDTO {
  total_devices: number;
  active_devices: number;
  /** System-wide average battery voltage */
  avg_voltage: number;
  /** System-wide average charging current */
  avg_current: number;
  /** System-wide average power output */
  avg_power: number;
}
