# State Management

This application uses **Zustand** for state management. Zustand is a small, fast, and scalable state management solution that provides a simpler alternative to Redux.

## Stores Location

All Zustand stores are located in `src/store/`.

## Available Stores

### 1. Authentication Store (`authStore.ts`)

Manages user authentication state and session.

#### State

```typescript
interface AuthStore {
  token: string | null;          // JWT authentication token
  user: User | null;             // Current user object
  isAuthenticated: boolean;      // Authentication status
  isLoading: boolean;            // Loading state during auth check
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  initAuth: () => void;
}
```

#### Actions

##### `setToken(token: string)`
- Stores JWT token in localStorage
- Updates store state with token
- Sets `isAuthenticated` to true
- Sets `isLoading` to false

##### `setUser(user: User)`
- Updates current user information
- Called after successful login/registration

##### `logout()`
- Removes token from localStorage
- Clears user data from store
- Sets `isAuthenticated` to false
- Redirects user to login (handled by components)

##### `initAuth()`
- Called on app initialization
- Checks for existing token in localStorage
- Sets authentication state based on token presence
- Sets `isLoading` to false after check

#### Usage Example

```typescript
import { useAuthStore } from '@/store/authStore';

function LoginComponent() {
  const { setToken, setUser, isAuthenticated } = useAuthStore();
  
  const handleLogin = async (credentials) => {
    const token = await authAPI.login(credentials);
    setToken(token);
    
    const user = await usersAPI.getCurrentUser();
    setUser(user);
  };
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return <LoginForm onSubmit={handleLogin} />;
}
```

#### Persistence

The auth token is persisted in `localStorage` with the key `'token'`. The store rehydrates on app initialization via `initAuth()`.

---

### 2. Theme Store (`themeStore.ts`)

Manages application theme (dark/light mode).

#### State

```typescript
interface ThemeStore {
  isDark: boolean;               // Dark mode enabled
  toggleTheme: () => void;       // Toggle between themes
  setTheme: (isDark: boolean) => void;  // Set specific theme
}
```

#### Actions

##### `toggleTheme()`
- Toggles between dark and light mode
- Immediately applies theme to DOM by adding/removing 'dark' class
- Persists preference to localStorage

##### `setTheme(isDark: boolean)`
- Sets a specific theme (dark or light)
- Immediately applies theme to DOM
- Persists preference to localStorage

#### Usage Example

```typescript
import { useThemeStore } from '@/store/themeStore';

function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
```

#### Persistence

The theme preference is automatically persisted using Zustand's `persist` middleware with the storage key `'theme-storage'`. The theme is rehydrated on app load and immediately applied to the DOM.

#### Theme Application

The store directly manipulates the DOM by adding/removing the `'dark'` class on `document.documentElement`. This works with Tailwind CSS's dark mode configuration:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',  // Uses 'dark' class on html element
  // ...
}
```

---

### 3. Devices Store (`devicesStore.ts`)

Caches device data and manages loading/error states.

#### State

```typescript
interface DevicesStore {
  devices: Device[];             // Cached devices
  isLoading: boolean;            // Loading state
  error: string | null;          // Error message
  setDevices: (devices: Device[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
```

#### Actions

##### `setDevices(devices: Device[])`
- Updates the cached devices list
- Called after successful API fetch

##### `setLoading(loading: boolean)`
- Sets loading state
- Used to show/hide loading indicators

##### `setError(error: string | null)`
- Sets error message
- null clears the error
- Used for error handling and display

#### Usage Example

```typescript
import { useDevicesStore } from '@/store/devicesStore';
import { devicesAPI } from '@/api/devices';

function DevicesList() {
  const { devices, isLoading, error, setDevices, setLoading, setError } = useDevicesStore();
  
  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await devicesAPI.getAllDevices();
        setDevices(data);
      } catch (err) {
        setError('Failed to load devices');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, []);
  
  if (isLoading) return <LoadingState />;
  if (error) return <div>Error: {error}</div>;
  
  return <DeviceList devices={devices} />;
}
```

#### Cache Strategy

The devices store provides a simple cache mechanism. Components can:
1. Check if devices are already loaded
2. Use cached data if available
3. Fetch fresh data when needed
4. Update cache after mutations (create/update/delete)

---

### 4. Search Store (`searchStore.ts`)

Manages global search query state.

#### State

```typescript
interface SearchState {
  query: string;                 // Current search query
  setQuery: (query: string) => void;
}
```

#### Actions

##### `setQuery(query: string)`
- Updates the search query
- Used by search components

#### Usage Example

```typescript
import { useSearchStore } from '@/store/searchStore';

function SearchBar() {
  const { query, setQuery } = useSearchStore();
  
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

function SearchResults() {
  const { query } = useSearchStore();
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (query) {
      // Perform search with query
      searchDevices(query).then(setResults);
    }
  }, [query]);
  
  return <ResultsList results={results} />;
}
```

#### Use Cases

The search store is useful for:
- Maintaining search state across components
- Syncing search input with results display
- Preserving search query during navigation
- Implementing search history (can be extended)

---

## Zustand Benefits

### Why Zustand?

1. **Simple API**: Easy to learn and use
2. **Small Bundle Size**: ~1KB gzipped
3. **No Boilerplate**: Less code than Redux
4. **TypeScript Support**: Full type safety
5. **Middleware Support**: Persist, devtools, etc.
6. **React Hooks**: Natural integration with React
7. **No Provider Needed**: Unlike Context or Redux

### Store Creation Pattern

All stores follow this pattern:

```typescript
import { create } from 'zustand';

interface MyStore {
  // State
  value: string;
  // Actions
  setValue: (value: string) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  // Initial state
  value: '',
  // Action implementations
  setValue: (value) => set({ value }),
}));
```

### Using Stores in Components

```typescript
// Use the entire store
const store = useMyStore();

// Select specific state
const value = useMyStore((state) => state.value);

// Select specific actions
const { setValue } = useMyStore();

// Select multiple items
const { value, setValue } = useMyStore();
```

### Performance Optimization

Zustand automatically optimizes re-renders:

```typescript
// Only re-renders when 'value' changes
const value = useMyStore((state) => state.value);

// Re-renders on any state change
const store = useMyStore();
```

For better performance, select only what you need:

```typescript
// ✅ Good - minimal re-renders
const devices = useDevicesStore((state) => state.devices);

// ❌ Avoid - re-renders on any store change
const store = useDevicesStore();
const devices = store.devices;
```

---

## Middleware

### Persist Middleware

The theme store uses Zustand's persist middleware:

```typescript
import { persist } from 'zustand/middleware';

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      // Store implementation
    }),
    {
      name: 'theme-storage',           // localStorage key
      onRehydrateStorage: () => (state) => {
        // Called after rehydration
      },
    }
  )
);
```

**Features:**
- Automatic localStorage persistence
- Rehydration on app load
- Custom serialization support
- Partial persistence (can exclude fields)

### Adding DevTools (Development)

For debugging, you can add devtools middleware:

```typescript
import { devtools } from 'zustand/middleware';

export const useMyStore = create<MyStore>()(
  devtools(
    (set) => ({
      // Store implementation
    }),
    { name: 'MyStore' }
  )
);
```

---

## Best Practices

### 1. Organize by Domain

Each store handles a specific domain:
- `authStore`: Authentication
- `themeStore`: UI theme
- `devicesStore`: Device data
- `searchStore`: Search functionality

### 2. Keep Stores Focused

Don't put everything in one store. Create separate stores for different concerns.

### 3. Colocate Related State and Actions

Keep state and the actions that modify it together in the same store.

### 4. Use TypeScript

Define interfaces for type safety:

```typescript
interface MyStore {
  value: string;
  setValue: (value: string) => void;
}

export const useMyStore = create<MyStore>(...);
```

### 5. Avoid Derived State

Don't store computed values. Compute them in components:

```typescript
// ❌ Don't store derived state
const { devices, onlineDevices, offlineDevices } = useDevicesStore();

// ✅ Compute in component
const devices = useDevicesStore((state) => state.devices);
const onlineDevices = devices.filter(d => d.status === 'online');
const offlineDevices = devices.filter(d => d.status === 'offline');
```

### 6. Async Actions

Handle async operations in components or create async action helpers:

```typescript
// In component
const { setDevices, setLoading } = useDevicesStore();

useEffect(() => {
  const fetchDevices = async () => {
    setLoading(true);
    const data = await devicesAPI.getAllDevices();
    setDevices(data);
    setLoading(false);
  };
  fetchDevices();
}, []);
```

### 7. Reset State When Needed

Clear state on logout:

```typescript
const logout = () => {
  // Clear auth store
  useAuthStore.getState().logout();
  
  // Clear devices cache
  useDevicesStore.getState().setDevices([]);
  
  // Clear search
  useSearchStore.getState().setQuery('');
};
```

---

## Extending Stores

To add new stores:

1. Create a new file in `src/store/`
2. Define the store interface
3. Create the store using `create()`
4. Export the hook
5. Use in components

Example:

```typescript
// src/store/notificationsStore.ts
import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationsStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      { ...notification, id: Date.now().toString() }
    ]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));
```

---

## Testing Stores

Zustand stores are easy to test:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStore } from './authStore';

test('should set token', () => {
  const { result } = renderHook(() => useAuthStore());
  
  act(() => {
    result.current.setToken('test-token');
  });
  
  expect(result.current.token).toBe('test-token');
  expect(result.current.isAuthenticated).toBe(true);
});
```

---

## Migration from Other State Management

If migrating from Redux or Context:

### From Redux

```typescript
// Redux
const state = useSelector(state => state.auth);
const dispatch = useDispatch();
dispatch(setToken(token));

// Zustand
const { token, setToken } = useAuthStore();
setToken(token);
```

### From Context

```typescript
// Context
const { value, setValue } = useContext(MyContext);

// Zustand
const { value, setValue } = useMyStore();
```

Zustand is simpler with less boilerplate and better performance.
