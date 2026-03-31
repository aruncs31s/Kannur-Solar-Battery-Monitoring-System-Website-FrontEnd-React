import { useCallback, useEffect, useMemo, useState } from "react";
import { devicesAPI } from "../../../api/devices";
import { SolarDeviceView } from "../../../domain/entities/Device";
import { ListWithTotalCount } from "../../../application/types/api";

export interface MyDevicesDataSource {
  getMySolarDevices: () => Promise<SolarDeviceView[]>;
  searchDevices: (query: string) => Promise<SolarDeviceView[]>;
}

const isSolarDeviceView = (value: unknown): value is SolarDeviceView => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<SolarDeviceView>;
  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.charging_current === "number" &&
    typeof item.battery_voltage === "number" &&
    typeof item.status === "string"
  );
};

const defaultDataSource: MyDevicesDataSource = {
  getMySolarDevices: () => devicesAPI.getMySolarDevices(),
  searchDevices: async (query: string) => {
    const results = (await devicesAPI.searchDevices(query)) as unknown[];
    return results.filter(isSolarDeviceView);
  },
};

export interface MyDevicesStats {
  totalDevices: number;
  activeDevices: number;
  averageVoltage: number;
  totalPower: number;
}

interface UseMyDevicesDataOptions {
  searchQuery: string;
  dataSource?: MyDevicesDataSource;
}

export const useMyDevicesData = ({
  searchQuery,
  dataSource = defaultDataSource,
}: UseMyDevicesDataOptions) => {
  const [solarDevices, setSolarDevices] = useState<SolarDeviceView[]>([]);
  const [searchResults, setSearchResults] = useState<SolarDeviceView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const devices = await dataSource.getMySolarDevices();
      const sortedSolarDevices = [...devices].sort((a, b) => b.id - a.id);
      setSolarDevices(sortedSolarDevices);
      setError("");
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError("Failed to load your devices");
    } finally {
      setLoading(false);
    }
  }, [dataSource]);

  const searchSolarDevices = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const results = await dataSource.searchDevices(query);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
      }
    },
    [dataSource],
  );

  useEffect(() => {
    void fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    void searchSolarDevices(searchQuery);
  }, [searchQuery, searchSolarDevices]);

  const stats = useMemo<MyDevicesStats>(() => {
    const totalDevices = solarDevices.length;
    const activeDevices = solarDevices.filter(
      (solarDevice) => solarDevice.status === "active",
    ).length;

    if (totalDevices === 0) {
      return {
        totalDevices,
        activeDevices,
        averageVoltage: 0,
        totalPower: 0,
      };
    }

    const averageVoltage =
      solarDevices.reduce((sum, device) => sum + device.battery_voltage, 0) /
      totalDevices;
    const totalPower = solarDevices.reduce(
      (sum, device) => sum + device.charging_current * device.battery_voltage,
      0,
    );

    return {
      totalDevices,
      activeDevices,
      averageVoltage,
      totalPower,
    };
  }, [solarDevices]);

  const displayDevices = useMemo(() => {
    if (!searchQuery.trim()) {
      return solarDevices;
    }

    return searchResults;
  }, [searchQuery, searchResults, solarDevices]);

  const displayDevicesList = useMemo<ListWithTotalCount<SolarDeviceView>>(
    () => ({
      list: displayDevices,
      total_count: displayDevices.length,
    }),
    [displayDevices],
  );

  return {
    loading,
    error,
    setError,
    solarDevices,
    displayDevices,
    displayDevicesList,
    stats,
    fetchDevices,
  };
};
