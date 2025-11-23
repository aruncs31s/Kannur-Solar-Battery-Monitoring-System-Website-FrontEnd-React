import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { AlertCircle, MapPin } from 'lucide-react';

// Fix Leaflet marker icon issue
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export const MapView = () => {
  const { devices, setDevices, setLoading } = useDevicesStore();
  const [center, setCenter] = useState<[number, number]>([10.3452, 75.8345]); // Kannur, India

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const response = await devicesAPI.getAllDevices();
        setDevices(response);

        // Calculate map center from devices
        if (response.length > 0) {
          const withCoords = response.filter((d) => d.latitude && d.longitude);
          if (withCoords.length > 0) {
            const avgLat = withCoords.reduce((sum, d) => sum + (d.latitude || 0), 0) / withCoords.length;
            const avgLng = withCoords.reduce((sum, d) => sum + (d.longitude || 0), 0) / withCoords.length;
            setCenter([avgLat, avgLng]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch devices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const devicesWithCoords = devices.filter((d) => d.latitude && d.longitude);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Device Map</h1>
        <p className="text-gray-600 mt-2">
          Locations of all your ESP32 devices
        </p>
      </div>

      {devicesWithCoords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">
            No devices with coordinates found
          </p>
          <p className="text-gray-500 mt-2">
            Add latitude and longitude to devices to see them on the map
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <MapContainer
            center={center}
            zoom={13}
            className="h-96 w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {devicesWithCoords.map((device) => (
              <Marker
                key={device.id}
                position={[device.latitude!, device.longitude!]}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="font-semibold text-gray-800">
                    {device.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {device.installedLocation}
                  </div>
                  <div className={`text-xs mt-2 px-2 py-1 rounded ${
                    device.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {device.status}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Device List for Map */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Devices with Locations ({devicesWithCoords.length})
        </h2>
        <div className="space-y-3">
          {devicesWithCoords.map((device) => (
            <div
              key={device.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{device.name}</h3>
                  <p className="text-sm text-gray-600">{device.installedLocation || 'Location not specified'}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/?q=${device.latitude},${device.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View on Google Maps →
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <MapPin size={14} />
                {device.latitude?.toFixed(6)}, {device.longitude?.toFixed(6)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
