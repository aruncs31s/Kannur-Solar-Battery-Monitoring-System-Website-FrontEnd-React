import { useCallback, useEffect, useMemo, useState } from "react";
import { devicesAPI } from "../../../api/devices";
import { MinimalDeviceDTO } from "../../../domain/entities/Device";
import { ListWithTotalCount } from "../../../application/types/api";
import { httpClient } from "../../../infrastructure/http/HttpClient";

const PAGE_SIZE = 6;

export interface DeviceTypeFilterOption {
  id: number;
  name: string;
}

interface GetMyDevicesParams {
  limit: number;
  offset: number;
  query?: string;
  typeId?: number;
  typeName?: string;
}

export interface MyDevicesDataSource {
  getMyDevices(params: GetMyDevicesParams): Promise<ListWithTotalCount<MinimalDeviceDTO>>;
  getDeviceTypes(): Promise<ListWithTotalCount<DeviceTypeFilterOption>>;
}

const defaultDataSource: MyDevicesDataSource = {
  getMyDevices: async ({ limit, offset, query, typeId, typeName }) => {
    const params = new URLSearchParams();
    params.append("limit", String(limit));
    params.append("offset", String(offset));

    if (query?.trim()) {
       params.append("q", query.trim());
    }

    if (typeof typeId === "number") {
      params.append("type_id", String(typeId));
      params.append("device_type_id", String(typeId));
    }

    if (typeName?.trim()) {
      params.append("type", typeName.trim());
      params.append("type_name", typeName.trim());
    }

    const response = await httpClient.get<any>(`/devices/my?${params.toString()}`);
    const rawList: any[] = Array.isArray(response)
      ? response
      : (response?.devices || response?.list || []);

    const minimalDevices: MinimalDeviceDTO[] = rawList.map((device) => ({
      id: device.id,
      name: device.name,
      type: device.type,
    }));

    // Fallback for older API shape that returns all devices without total_count.
    if (typeof response?.total_count !== "number") {
      return {
        list: minimalDevices.slice(offset, offset + limit),
        total_count: minimalDevices.length,
      };
    }

    return {
      list: minimalDevices,
      total_count: response.total_count,
    };
  },
  getDeviceTypes: async () => {
    try {
      const response = await httpClient.get<any>("/devices/type");
      const rawList: any[] = response?.list || response?.device_types || [];
      return {
        list: rawList.map((item) => ({
          id: item.id,
          name: item.name || `Type ${item.id}`,
        })),
        total_count: response?.total_count ?? rawList.length,
      };
    } catch {
      const fallback = await devicesAPI.getDeviceTypes();
      return {
        list: fallback.map((item) => ({ id: item.id, name: item.name })),
        total_count: fallback.length,
      };
    };
  },
};

export interface MyDevicesStats {
  totalDevices: number;
  solarDevices: number;
  sensorDevices: number;
  microcontrollers: number;
}

interface UseMyDevicesDataOptions {
  searchQuery: string;
  dataSource?: MyDevicesDataSource;
}

export const useMyDevicesData = ({
  searchQuery,
  dataSource = defaultDataSource,
}: UseMyDevicesDataOptions) => {
  const [devicesList, setDevicesList] = useState<ListWithTotalCount<MinimalDeviceDTO>>({
    list: [],
    total_count: 0,
  });
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeFilterOption[]>([]);
  const [deviceTypesLoading, setDeviceTypesLoading] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const selectedTypeName =
        selectedTypeId === "all"
          ? undefined
          : deviceTypes.find((type) => type.id === selectedTypeId)?.name;

      const result = await dataSource.getMyDevices({
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
        query: searchQuery,
        typeId: selectedTypeId === "all" ? undefined : selectedTypeId,
        typeName: selectedTypeName,
      });

      const normalizedQuery = searchQuery.trim().toLowerCase();
      const normalizedSelectedType = selectedTypeName?.trim().toLowerCase() || "";
      const filteredList = result.list.filter((device) => {
        const deviceName = device.name.toLowerCase();
        const deviceType = device.type.toLowerCase();

        const matchesQuery =
          !normalizedQuery ||
          deviceName.includes(normalizedQuery) ||
          deviceType.includes(normalizedQuery);

        const matchesType =
          selectedTypeId === "all" ||
          !normalizedSelectedType ||
          deviceType === normalizedSelectedType ||
          deviceType.includes(normalizedSelectedType) ||
          normalizedSelectedType.includes(deviceType);

        return matchesQuery && matchesType;
      });

      const shouldUseLocalFallback =
        (!!normalizedQuery || selectedTypeId !== "all") &&
        filteredList.length !== result.list.length;

      setDevicesList({
        list: [...(shouldUseLocalFallback ? filteredList : result.list)].sort((a, b) => b.id - a.id),
        total_count: shouldUseLocalFallback ? filteredList.length : result.total_count,
      });
      setError("");
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError("Failed to load your devices");
    } finally {
      setLoading(false);
    }
  }, [currentPage, dataSource, deviceTypes, searchQuery, selectedTypeId]);

  const fetchDeviceTypes = useCallback(async () => {
    setDeviceTypesLoading(true);
    try {
      const result = await dataSource.getDeviceTypes();
      setDeviceTypes(result.list);
    } catch (err) {
      console.error("Error fetching device types:", err);
    } finally {
      setDeviceTypesLoading(false);
    }
  }, [dataSource]);

  useEffect(() => {
    void fetchDeviceTypes();
  }, [fetchDeviceTypes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTypeId]);

  useEffect(() => {
    void fetchDevices();
  }, [fetchDevices]);

  const stats = useMemo<MyDevicesStats>(() => {
    const totalDevices = devicesList.total_count;

    const isSolar = (type: string) => type.toLowerCase().includes("solar");
    const isSensor = (type: string) => type.toLowerCase().includes("sensor");
    const isMicrocontroller = (type: string) => {
      const normalized = type.toLowerCase();
      return (
        normalized.includes("microcontroller") ||
        normalized.includes("controller") ||
        normalized.includes("esp") ||
        normalized.includes("arduino")
      );
    };

    if (totalDevices === 0) {
      return {
        totalDevices,
        solarDevices: 0,
        sensorDevices: 0,
        microcontrollers: 0,
      };
    }

    return {
      totalDevices,
      solarDevices: devicesList.list.filter((device) => isSolar(device.type)).length,
      sensorDevices: devicesList.list.filter((device) => isSensor(device.type)).length,
      microcontrollers: devicesList.list.filter((device) => isMicrocontroller(device.type)).length,
    };
  }, [devicesList]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(devicesList.total_count / PAGE_SIZE)),
    [devicesList.total_count],
  );

  const displayDevicesList = devicesList;

  return {
    loading,
    error,
    setError,
    displayDevicesList,
    stats,
    fetchDevices,
    currentPage,
    setCurrentPage,
    pageSize: PAGE_SIZE,
    totalPages,
    deviceTypes,
    deviceTypesLoading,
    selectedTypeId,
    setSelectedTypeId,
  };
};
