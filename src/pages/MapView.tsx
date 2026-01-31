import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { AlertCircle, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [deviceSearch, setDeviceSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<typeof devices>([]);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 5;

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

  // Use search results if searching, otherwise use all devices
  const displayDevices = deviceSearch ? searchResults : devices;

  // Pagination
  const totalPages = Math.ceil(displayDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDevices = displayDevices.slice(startIndex, startIndex + itemsPerPage);

  // Search devices using backend API
  useEffect(() => {
    const searchDevices = async () => {
      if (!deviceSearch.trim()) {
        setSearchResults([]);
        setCurrentPage(1);
        return;
      }

      setIsSearching(true);
      try {
        const results = await devicesAPI.searchDevices(deviceSearch);
        setSearchResults(results);
        setCurrentPage(1);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchDevices, 300);
    return () => clearTimeout(debounce);
  }, [deviceSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        setSearchError('Location not found. Try a different search term.');
      }
    } catch (error) {
      setSearchError('Failed to search location. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Device Map</h1>
        <p className="text-gray-600 mt-2">
          Locations of all your ESP32 devices
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location (e.g., Kannur, Kerala)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Search size={20} />
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
        {searchError && (
          <p className="text-red-600 text-sm mt-2">{searchError}</p>
        )}
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
            <MapController center={center} />
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

      {/* Device List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            All Devices ({devices.length})
          </h2>
        </div>

        {/* Device Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              placeholder="Search by device name or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* Device List */}
        {displayDevices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No devices found matching your search.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedDevices.map((device) => (
                <div
                  key={device.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{device.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">MAC:</span> {device.mac}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {device.installedLocation || 'Not specified'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                          device.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : device.status === 'inactive'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {device.status}
                        </span>
                      </p>
                      {device.latitude && device.longitude && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <MapPin size={14} />
                          {device.latitude.toFixed(6)}, {device.longitude.toFixed(6)}
                        </p>
                      )}
                    </div>
                    {device.latitude && device.longitude && (
                      <a
                        href={`https://www.google.com/maps/?q=${device.latitude},${device.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
                      >
                        View on Map →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, displayDevices.length)} of {displayDevices.length} devices
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
