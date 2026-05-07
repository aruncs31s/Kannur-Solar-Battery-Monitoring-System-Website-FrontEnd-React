# State Management & Utilities

## Overview
This document covers state management using Zustand and utility functions available in the application.

---

## State Management (Zustand)

The application uses [Zustand](https://github.com/pmndrs/zustand) for state management - a lightweight alternative to Redux.

### Why Zustand?

- **Simple**: Minimal boilerplate
- **Lightweight**: ~1KB gzipped
- **Fast**: No unnecessary re-renders
- **TypeScript**: Full type safety
- **Flexible**: Works with React hooks

---

## Available Stores

### 1. Authentication Store (`src/store/authStore.ts`)

Manages user authentication state.

#### State

```typescript
interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

#### Actions

```typescript
{
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  initAuth: () => void;
}
```

#### Usage

```typescript
import { useAuthStore } from '../store/authStore';

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuthStore();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Features

- **Persistent Storage**: Token stored in localStorage
- **Auto-initialization**: Checks localStorage on app load
- **Type-safe**: Full TypeScript support

#### Implementation Details

```typescript
// Login flow
const token = await authAPI.login(credentials);
setToken(token); // Stores in localStorage and updates state

// Logout flow
logout(); // Removes from localStorage and clears state

// Initialize on app load
useEffect(() => {
  initAuth(); // Reads from localStorage
}, []);
```

---

### 2. Devices Store (`src/store/devicesStore.ts`)

Manages devices state for caching and performance.

#### State

```typescript
interface DevicesStore {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
}
```

#### Actions

```typescript
{
  setDevices: (devices: Device[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
```

#### Usage

```typescript
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';

function DevicesList() {
  const { devices, isLoading, error, setDevices, setLoading, setError } = useDevicesStore();
  
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const data = await devicesAPI.getAllDevices();
        setDevices(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, []);
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  return <div>{/* Render devices */}</div>;
}
```

#### Benefits

- **Prevents redundant API calls**: Cache devices in state
- **Shared across components**: Multiple components can access same data
- **Performance**: Reduces network requests

---

### 3. Theme Store (`src/store/themeStore.ts`)

Manages dark/light theme preference.

#### State

```typescript
interface ThemeStore {
  isDark: boolean;
}
```

#### Actions

```typescript
{
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}
```

#### Usage

```typescript
import { useThemeStore } from '../store/themeStore';

function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

#### Features

- **Persistence**: Theme saved to localStorage
- **Auto-apply**: Theme applied immediately on change
- **Hydration**: Restored on app load

#### Implementation Details

```typescript
// Persisted to localStorage with key 'theme-storage'
persist(
  (set) => ({
    isDark: false,
    toggleTheme: () => set((state) => {
      const newIsDark = !state.isDark;
      // Apply theme to document
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDark: newIsDark };
    }),
  }),
  { name: 'theme-storage' }
)
```

---

### 4. Search Store (`src/store/searchStore.ts`)

Manages search state across the application.

#### Typical Usage Pattern

```typescript
import { useSearchStore } from '../store/searchStore';

function SearchableList() {
  const { query, setQuery } = useSearchStore();
  
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <List items={filteredItems} />
    </>
  );
}
```

---

## Utility Functions

### Performance Config (`src/utils/performanceConfig.ts`)

Utilities for optimizing performance and reducing memory usage.

#### 1. Reduced Motion Detection

```typescript
export const prefersReducedMotion = () => boolean
```

Checks if user prefers reduced motion (accessibility).

**Usage:**
```typescript
const shouldAnimate = !prefersReducedMotion();
```

#### 2. Animation Variants

Predefined animation configurations that respect user preferences.

```typescript
export const animationVariants = {
  fadeIn: { initial, animate, transition },
  slideUp: { initial, animate, transition },
  scale: { initial, animate, transition }
}
```

**Usage with Framer Motion:**
```typescript
import { motion } from 'framer-motion';
import { animationVariants } from '../utils/performanceConfig';

function AnimatedComponent() {
  return (
    <motion.div {...animationVariants.fadeIn}>
      Content
    </motion.div>
  );
}
```

#### 3. Data Limits

Constants for managing data size.

```typescript
export const dataLimits = {
  MAX_READINGS: 100,           // Maximum readings in memory
  MAX_DEVICES_DISPLAY: 50,     // Maximum devices to display
  REFRESH_INTERVAL: 30000,     // 30 seconds
  STALE_DATA_THRESHOLD: 300000 // 5 minutes
}
```

**Usage:**
```typescript
import { dataLimits } from '../utils/performanceConfig';

// Limit readings
const limitedReadings = readings.slice(0, dataLimits.MAX_READINGS);

// Auto-refresh
useEffect(() => {
  const interval = setInterval(fetchData, dataLimits.REFRESH_INTERVAL);
  return () => clearInterval(interval);
}, []);
```

#### 4. Limit Array Size

```typescript
export const limitArraySize = <T>(array: T[], maxSize: number): T[]
```

Prevents memory bloat by limiting array size.

**Usage:**
```typescript
const limitedData = limitArraySize(hugeArray, 100);
```

#### 5. Debounce

```typescript
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void
```

Delays function execution until after wait time has elapsed since last call.

**Usage:**
```typescript
import { debounce } from '../utils/performanceConfig';

const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

// In component
<input onChange={(e) => debouncedSearch(e.target.value)} />
```

**Perfect for:**
- Search inputs
- Resize handlers
- Scroll handlers
- API calls triggered by user input

#### 6. Throttle

```typescript
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void
```

Ensures function is called at most once per time period.

**Usage:**
```typescript
import { throttle } from '../utils/performanceConfig';

const throttledScroll = throttle(() => {
  handleScroll();
}, 100);

window.addEventListener('scroll', throttledScroll);
```

**Perfect for:**
- Scroll events
- Mouse move events
- Window resize
- Real-time data updates

#### 7. Clean Stale Data

```typescript
export const cleanStaleData = <T extends { timestamp?: number | string }>(
  data: T[],
  thresholdMs?: number
): T[]
```

Removes old data based on timestamp.

**Usage:**
```typescript
import { cleanStaleData, dataLimits } from '../utils/performanceConfig';

// Remove data older than 5 minutes
const freshData = cleanStaleData(readings, dataLimits.STALE_DATA_THRESHOLD);

// Custom threshold (10 minutes)
const recentData = cleanStaleData(readings, 600000);
```

---

## Best Practices

### 1. Store Selection

**Use stores for:**
- ✅ Authentication state
- ✅ Theme preferences
- ✅ Global UI state (modals, notifications)
- ✅ Cached API data (used across multiple components)
- ✅ User preferences

**Don't use stores for:**
- ❌ Local component state (use `useState`)
- ❌ Form state (use `useState` or form libraries)
- ❌ Temporary UI state (loading, errors in single component)
- ❌ Derived state (compute from existing state)

### 2. Store Organization

```typescript
// ✅ Good - Focused store
interface DevicesStore {
  devices: Device[];
  setDevices: (devices: Device[]) => void;
}

// ❌ Bad - God store
interface AppStore {
  devices: Device[];
  users: User[];
  settings: Settings;
  theme: Theme;
  // ... too many concerns
}
```

### 3. Selector Pattern

```typescript
// ✅ Good - Select only what you need
function MyComponent() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  // Component only re-renders when isAuthenticated changes
}

// ❌ Bad - Select entire store
function MyComponent() {
  const authStore = useAuthStore();
  // Component re-renders on ANY store change
}
```

### 4. Performance Optimization

```typescript
// Use debounce for search
const debouncedSearch = debounce(searchAPI.search, 300);

// Use throttle for frequent events
const throttledUpdate = throttle(updateData, 1000);

// Limit array sizes
const displayData = limitArraySize(allData, dataLimits.MAX_DEVICES_DISPLAY);

// Clean stale data periodically
useEffect(() => {
  const interval = setInterval(() => {
    const fresh = cleanStaleData(readings);
    setReadings(fresh);
  }, 60000); // Every minute
  
  return () => clearInterval(interval);
}, [readings]);
```

### 5. Memory Management

```typescript
// ✅ Good - Cleanup
useEffect(() => {
  const interval = setInterval(fetchData, 30000);
  return () => clearInterval(interval); // Cleanup
}, []);

// ❌ Bad - No cleanup (memory leak)
useEffect(() => {
  setInterval(fetchData, 30000);
}, []);
```

---

## Advanced Patterns

### 1. Computed Values in Stores

```typescript
export const useDevicesStore = create<DevicesStore>((set, get) => ({
  devices: [],
  
  // Computed value
  get onlineDevices() {
    return get().devices.filter(d => d.status === 'online');
  },
  
  setDevices: (devices) => set({ devices })
}));
```

### 2. Async Actions in Stores

```typescript
export const useDevicesStore = create<DevicesStore>((set) => ({
  devices: [],
  isLoading: false,
  
  // Async action
  fetchDevices: async () => {
    set({ isLoading: true });
    try {
      const devices = await devicesAPI.getAllDevices();
      set({ devices, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  }
}));
```

### 3. Store Subscriptions

```typescript
// Subscribe to store changes outside React
const unsubscribe = useAuthStore.subscribe(
  (state) => state.isAuthenticated,
  (isAuthenticated) => {
    console.log('Auth changed:', isAuthenticated);
  }
);

// Cleanup
unsubscribe();
```

### 4. Middleware Pattern

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        // store implementation
      }),
      { name: 'my-store' }
    )
  )
);
```

---

## Testing Stores

### Unit Testing Zustand Stores

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStore } from '../store/authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store
    useAuthStore.setState({ token: null, isAuthenticated: false });
  });
  
  it('should set token', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setToken('test-token');
    });
    
    expect(result.current.token).toBe('test-token');
    expect(result.current.isAuthenticated).toBe(true);
  });
  
  it('should logout', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setToken('test-token');
      result.current.logout();
    });
    
    expect(result.current.token).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

---

## Common Pitfalls

### 1. Using Stores for Everything

```typescript
// ❌ Bad - Using store for local state
const { modalOpen, setModalOpen } = useUIStore();

// ✅ Good - Use local state
const [modalOpen, setModalOpen] = useState(false);
```

### 2. Not Cleaning Up Subscriptions

```typescript
// ❌ Bad
useEffect(() => {
  const interval = setInterval(updateData, 1000);
  // No cleanup!
}, []);

// ✅ Good
useEffect(() => {
  const interval = setInterval(updateData, 1000);
  return () => clearInterval(interval);
}, []);
```

### 3. Over-debouncing

```typescript
// ❌ Bad - Too long delay
const search = debounce(searchAPI.search, 2000); // 2 seconds feels slow

// ✅ Good - Responsive delay
const search = debounce(searchAPI.search, 300); // 300ms is ideal
```

### 4. Not Limiting Data

```typescript
// ❌ Bad - Unlimited growth
const [readings, setReadings] = useState([]);
useEffect(() => {
  const newReading = await fetchReading();
  setReadings([...readings, newReading]); // Grows forever!
}, []);

// ✅ Good - Limited size
const [readings, setReadings] = useState([]);
useEffect(() => {
  const newReading = await fetchReading();
  const updated = limitArraySize([...readings, newReading], 100);
  setReadings(updated);
}, []);
```

---

## Performance Monitoring

Monitor store performance:

```typescript
// Add timing to actions
const { setDevices } = useDevicesStore.getState();

console.time('setDevices');
setDevices(newDevices);
console.timeEnd('setDevices');
```

Track re-renders:

```typescript
import { useEffect, useRef } from 'react';

function useRenderCount() {
  const renders = useRef(0);
  useEffect(() => {
    renders.current++;
    console.log('Render count:', renders.current);
  });
}

function MyComponent() {
  useRenderCount();
  // ...
}
```

---

## Summary

- **Zustand**: Simple, fast state management
- **4 Stores**: Auth, Devices, Theme, Search
- **Performance Utils**: Debounce, throttle, data limits
- **Best Practices**: Use stores wisely, clean up, limit data
- **Testing**: Unit test stores independently

For more information on Zustand, see: https://github.com/pmndrs/zustand
