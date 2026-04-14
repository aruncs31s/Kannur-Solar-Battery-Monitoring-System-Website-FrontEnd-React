import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { devicesAPI } from "../api/devices";
import { FormField } from "./FormComponents";
import {
  CreateDeviceDTO,
  CreateSensorDeviceDTO,
  CreateSolarDeviceDTO,
  DeviceSearchResultDTO,
} from "../domain/entities/Device";

interface DeviceTypeOption {
  id: number;
  name: string;
}

type DeviceKind = "solar" | "sensor" | "microcontroller";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceAdded: () => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

const inferDeviceKind = (typeName: string): DeviceKind => {
  const normalized = typeName.toLowerCase();

  if (normalized.includes("solar") || normalized.includes("mppt")) {
    return "solar";
  }

  if (
    normalized.includes("esp32") ||
    normalized.includes("esp8266") ||
    normalized.includes("microcontroller") ||
    normalized.includes("arduino")
  ) {
    return "microcontroller";
  }

  return "sensor";
};

export const AddDeviceModal = ({
  isOpen,
  onClose,
  onDeviceAdded,
  onError,
  onSuccess,
}: AddDeviceModalProps) => {
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeOption[]>([]);
  const [microcontrollers, setMicrocontrollers] = useState<DeviceSearchResultDTO[]>([]);
  const [microcontrollerSearch, setMicrocontrollerSearch] = useState("");
  const [showMicrocontrollerDropdown, setShowMicrocontrollerDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    typeId: 0,
    ip_address: "",
    address: "",
    city: "",
    connected_microcontroller_id: null as number | null,
  });

  const microcontrollerInputRef = useRef<HTMLInputElement>(null);

  const selectedType = useMemo(
    () => deviceTypes.find((type) => type.id === formData.typeId),
    [deviceTypes, formData.typeId],
  );

  const deviceKind = useMemo<DeviceKind>(
    () => inferDeviceKind(selectedType?.name || ""),
    [selectedType],
  );

  const showIpField = deviceKind === "microcontroller";
  const showConnectedMicrocontrollerField = deviceKind === "solar";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchDeviceTypes = async () => {
      try {
        const types = await devicesAPI.getDeviceTypes();
        setDeviceTypes(types.map((type) => ({ id: type.id, name: type.name })));
      } catch (err) {
        console.error("Failed to fetch device types:", err);
      }
    };

    void fetchDeviceTypes();
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      typeId: 0,
      ip_address: "",
      address: "",
      city: "",
      connected_microcontroller_id: null,
    });
    setMicrocontrollerSearch("");
    setMicrocontrollers([]);
    setShowMicrocontrollerDropdown(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "typeId") {
        return {
          ...prev,
          typeId: value ? parseInt(value, 10) : 0,
          ip_address: "",
          connected_microcontroller_id: null,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    if (name === "typeId") {
      setMicrocontrollerSearch("");
      setMicrocontrollers([]);
      setShowMicrocontrollerDropdown(false);
    }
  };

  const handleMicrocontrollerSearch = async (query: string) => {
    setMicrocontrollerSearch(query);

    if (!query.trim()) {
      setMicrocontrollers([]);
      setShowMicrocontrollerDropdown(false);
      setFormData((prev) => ({ ...prev, connected_microcontroller_id: null }));
      return;
    }

    try {
      const results = await devicesAPI.searchMicrocontrollers(query);
      setMicrocontrollers(results);
      setShowMicrocontrollerDropdown(true);
    } catch (err) {
      console.error("Failed to search microcontrollers:", err);
      setMicrocontrollers([]);
      setShowMicrocontrollerDropdown(false);
    }
  };

  const selectMicrocontroller = (microcontroller: DeviceSearchResultDTO) => {
    setFormData((prev) => ({
      ...prev,
      connected_microcontroller_id: microcontroller.id,
    }));
    setMicrocontrollerSearch(microcontroller.name);
    setShowMicrocontrollerDropdown(false);
    microcontrollerInputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");
    onSuccess("");

    if (!formData.name.trim() || !formData.typeId) {
      onError("Please provide device name and type");
      return;
    }

    // if (showIpField && !formData.ip_address.trim()) {
    //   onError("IP address is required for ESP32/ESP8266 microcontrollers");
    //   return;
    // }

    setSubmitting(true);

    try {
      if (deviceKind === "solar") {
        const payload: CreateSolarDeviceDTO = {
          name: formData.name.trim(),
          device_type_id: formData.typeId,
          address: formData.address.trim(),
          city: formData.city.trim(),
          connected_microcontroller_id:
            formData.connected_microcontroller_id || 0,
        };

        if (!payload.connected_microcontroller_id) {
          delete (payload as { connected_microcontroller_id?: number }).connected_microcontroller_id;
        }

        await devicesAPI.createSolarDevice(payload);
      } else if (deviceKind === "microcontroller") {
        const payload: CreateDeviceDTO = {
          name: formData.name.trim(),
          type: formData.typeId,
          ip_address: formData.ip_address.trim(),
          mac_address: "",
          firmware_version_id: 1,
          address: formData.address.trim(),
          city: formData.city.trim(),
        };

        await devicesAPI.createDevice(payload);
      } else {
        const payload: CreateSensorDeviceDTO = {
          name: formData.name.trim(),
          type: formData.typeId,
          address: formData.address.trim(),
          city: formData.city.trim(),
        };

        await devicesAPI.createSensorDevice(payload);
      }

      onSuccess("Device added successfully");
      onDeviceAdded();
      resetForm();
      onClose();
    } catch (err: any) {
      onError(err.response?.data?.error || "Failed to add device");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-primary flex justify-between items-center">
          <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Plus size={24} />
            Add Device
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Device Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Device name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Device Type *
              </label>
              <select
                name="typeId"
                value={formData.typeId || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface-secondary text-text-primary"
                required
              >
                <option value="">Select device type</option>
                {deviceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {showIpField && (
              <FormField
                label="IP Address"
                name="ip_address"
                value={formData.ip_address}
                onChange={handleInputChange}
                placeholder="192.168.1.100"
                // required
              />
            )}

            <FormField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Building A, Floor 1"
            />

            <FormField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Kannur"
            />

            {showConnectedMicrocontrollerField && (
              <div className="relative md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Connected Microcontroller <span className="text-xs text-text-tertiary">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    ref={microcontrollerInputRef}
                    type="text"
                    value={microcontrollerSearch}
                    onChange={(e) => handleMicrocontrollerSearch(e.target.value)}
                    onFocus={() => setShowMicrocontrollerDropdown(microcontrollers.length > 0)}
                    onBlur={() => setTimeout(() => setShowMicrocontrollerDropdown(false), 200)}
                    placeholder="Search microcontrollers..."
                    className="w-full px-4 py-2 pl-10 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface-secondary text-text-primary"
                  />
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  />
                </div>
                {showMicrocontrollerDropdown && microcontrollers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-surface-primary border border-border-primary rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {microcontrollers.map((mc) => (
                      <div
                        key={mc.id}
                        onClick={() => selectMicrocontroller(mc)}
                        className="px-4 py-2 hover:bg-surface-secondary cursor-pointer text-text-primary"
                      >
                        {mc.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-success hover:opacity-90 disabled:opacity-60 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              {submitting ? "Adding..." : "Add Device"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};