import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDevicesStore } from '../../store/devicesStore';
import { devicesAPI } from '../../api/devices';
import { AlertCircle, MapPin, Search, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { DeviceStateBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';



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
  const { isDark } = useThemeStore();
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

        // Set default center (can be updated to use geocoding for addresses later)
        setCenter([11.2588, 75.7804]); // Kannur coordinates as default
      } catch (err) {
        console.error('Failed to fetch devices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const devicesWithCoords = devices; // All devices (no coordinate filtering available)

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Device Map</h1>
          <p className="page-subtitle">
            Locations and status of all your connected devices
          </p>
        </div>
      </div>

      {/* Global Location Search */}
      <div className="card" style={{ padding: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location (e.g., Kannur, Kerala)"
              className="input"
            />
          </div>
          <Button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            variant="primary"
          >
            {searching ? <div className="spinner-sm" /> : <Search size={18} />}
            {searching ? 'Searching...' : 'Search Location'}
          </Button>
        </form>
        {searchError && (
          <p style={{ color: 'var(--error)', fontSize: '0.8125rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertCircle size={14} /> {searchError}
          </p>
        )}
      </div>


      {devicesWithCoords.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertCircle className="mx-auto" size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            No devices with coordinates found
          </p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Add latitude and longitude to devices to see them on the map
          </p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden', height: '500px' }}>

          <MapContainer
            center={center}
            zoom={13}
            className="h-full w-full"
            style={{ 
              filter: isDark ? 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)' : 'none',
              background: 'var(--bg-secondary)'
            }}
          >
            <MapController center={center} />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {devicesWithCoords.map((device, index) => (
              <Marker
                key={device.id}
                position={[11.2588 + (index * 0.001), 75.7804 + (index * 0.001)]} // Offset each device slightly
                icon={defaultIcon}
              >
                <Popup className="dark:leaflet-popup">
                  <div style={{ minWidth: '220px', padding: '0.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Zap size={14} style={{ color: 'var(--text-accent)' }} /> {device.name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={12} /> {device.address || 'Address not listed'}
                    </div>
                    
                    <div className="divider" style={{ margin: '0.75rem 0' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</span>
                      <DeviceStateBadge state={device.device_state} />
                    </div>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      fullWidth 
                      onClick={() => window.location.href = `/devices/${device.id}`}
                    >
                      View Details <ChevronRight size={14} />
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Device List Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="section-title">All Devices</h2>
            <p className="section-desc">Manage and locate your {devices.length} registered devices</p>
          </div>
        </div>
        
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Device List Search */}
          <div style={{ position: 'relative' }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              placeholder="Search by device name or location..."
              className="input pl-10"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="spinner-sm" />
              </div>
            )}
          </div>

          {/* List Content */}
          {displayDevices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-muted)' }}>No devices found matching your search.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {paginatedDevices.map((device) => (
                <div
                  key={device.id}
                  className="card-interactive"
                  onClick={() => {
                    // Logic to center map on this device if coords existed
                    setDeviceSearch(device.name);
                  }}
                  style={{ padding: '1rem', background: 'var(--surface-secondary)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={14} style={{ color: 'var(--text-accent)' }} />
                        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{device.name}</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MAC</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{device.mac_address}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{device.address || 'Not specified'}</span>
                      </div>
                      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <MapPin size={12} /> Coordinates not available
                      </div>
                    </div>
                    <DeviceStateBadge state={device.device_state} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-secondary)', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, displayDevices.length)} of {displayDevices.length}
              </p>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} /> Prev
                </Button>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        border: '1px solid',
                        background: currentPage === page ? 'var(--primary-500)' : 'transparent',
                        color: currentPage === page ? '#fff' : 'var(--text-secondary)',
                        borderColor: currentPage === page ? 'var(--primary-500)' : 'var(--border-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
