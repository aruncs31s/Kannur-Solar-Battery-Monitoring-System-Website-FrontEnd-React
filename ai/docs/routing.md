# Routing Documentation

This application uses **React Router v6** for client-side routing. All routes are defined in `src/App.tsx`.

## Router Configuration

The application uses `BrowserRouter` with future flags enabled for compatibility:

```typescript
<BrowserRouter future={{ 
  v7_startTransition: true, 
  v7_relativeSplatPath: true 
}}>
  <Routes>
    {/* Route definitions */}
  </Routes>
</BrowserRouter>
```

## Route Protection

Most routes are protected and require authentication. Protected routes use the `ProtectedRoute` component wrapper.

### Protected Route Component

```typescript
<ProtectedRoute>
  <Layout>
    <PageComponent />
  </Layout>
</ProtectedRoute>
```

The `ProtectedRoute` component:
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Optionally checks for required roles (admin routes)
- Shows loading state during authentication check

## Layout Structure

Protected routes use a consistent layout:

```
┌─────────────────────────────────────┐
│          Navigation Bar             │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │    Page Content         │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

The `Layout` component provides:
- Navigation sidebar
- Header with user info
- Consistent spacing and styling
- Theme support

## Routes List

### Public Routes

Routes accessible without authentication:

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | `Login` | User login page |
| `/register` | `Register` | New user registration |

### User Routes

Routes for authenticated users:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Dashboard` | Main dashboard with overview |
| `/devices` | `Devices` | All devices list |
| `/devices/:id` | `DeviceDetail` | Individual device details |
| `/devices/mc/:id` | `MCDeviceDetail` | Microcontroller device details |
| `/devices/:id/history` | `DeviceReadingsHistory` | Device readings history |
| `/devices/:id/state-history` | `DeviceStateHistory` | Device state change history |
| `/my-devices` | `MyDevices` | User's solar devices |
| `/my-microcontrollers` | `MyMicrocontrollers` | User's microcontrollers |
| `/readings` | `AllReadings` | All sensor readings |
| `/map` | `MapView` | Geographical map of devices |
| `/locations` | `Locations` | All locations list |
| `/locations/:id/devices` | `LocationDetails` | Devices at a specific location |
| `/profile` | `Profile` | User profile management |
| `/configuration` | `Configuration` | System configuration |
| `/versions` | `Versions` | Version history |
| `/audit` | `AuditLogs` | System audit logs |

### Admin Routes

Routes requiring admin privileges:

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | `Admin` | Admin dashboard |
| `/admin/devices` | `AdminDeviceManagement` | Device administration |
| `/admin/users` | `AdminUserManagement` | User administration |
| `/admin/device-types` | `AdminDeviceTypeManagement` | Device type management |
| `/admin/esp-devices` | `AdminESPDeviceManagement` | ESP device management |

### Fallback Route

| Path | Behavior | Description |
|------|----------|-------------|
| `*` | Redirect to `/` | Any unmatched route redirects to dashboard |

## Route Parameters

### Device Routes

**Device Detail**: `/devices/:id`
- `:id` - Device ID (number)

**Microcontroller Detail**: `/devices/mc/:id`
- `:id` - Microcontroller device ID (number)

**Device History**: `/devices/:id/history`
- `:id` - Device ID (number)

**Device State History**: `/devices/:id/state-history`
- `:id` - Device ID (number)

### Location Routes

**Location Details**: `/locations/:id/devices`
- `:id` - Location ID (number)

## Navigation Examples

### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const goToDevice = (deviceId: number) => {
    navigate(`/devices/${deviceId}`);
  };
  
  const goBack = () => {
    navigate(-1); // Go back one page
  };
  
  const goToDashboard = () => {
    navigate('/');
  };
  
  return (
    <button onClick={() => goToDevice(42)}>
      View Device
    </button>
  );
}
```

### Link Components

```typescript
import { Link } from 'react-router-dom';

function DeviceCard({ device }) {
  return (
    <Link to={`/devices/${device.id}`}>
      {device.name}
    </Link>
  );
}
```

### NavLink for Active Styling

```typescript
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Dashboard
      </NavLink>
      <NavLink to="/devices">
        Devices
      </NavLink>
    </nav>
  );
}
```

## Route Hooks

### useParams

Access route parameters:

```typescript
import { useParams } from 'react-router-dom';

function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    loadDevice(id);
  }, [id]);
  
  return <div>Device {id}</div>;
}
```

### useNavigate

Navigate programmatically:

```typescript
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    await login();
    navigate('/dashboard');
  };
}
```

### useLocation

Access current location:

```typescript
import { useLocation } from 'react-router-dom';

function Breadcrumb() {
  const location = useLocation();
  
  return <div>Current path: {location.pathname}</div>;
}
```

### useSearchParams

Access and modify query parameters:

```typescript
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const updateQuery = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };
  
  return <SearchBar value={query} onChange={updateQuery} />;
}
```

## Authentication Flow

```
User visits protected route
        ↓
ProtectedRoute checks authentication
        ↓
   ┌────┴────┐
   │         │
Is Auth?    Not Auth
   │         │
   ↓         ↓
Show Page   Redirect to /login
            Store intended destination
                    ↓
              User logs in
                    ↓
          Redirect to intended destination
              (or dashboard)
```

### Login Redirect Example

```typescript
// In ProtectedRoute component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login, save intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// In Login component
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const handleLogin = async () => {
    await login();
    navigate(from, { replace: true }); // Go to intended page
  };
}
```

## Route Organization

Routes are organized by access level:

1. **Public Routes** (no protection)
   - Login
   - Register

2. **User Routes** (authentication required)
   - Dashboard
   - Devices
   - My Devices
   - Readings
   - Map
   - Profile
   - etc.

3. **Admin Routes** (authentication + admin role required)
   - Admin Dashboard
   - User Management
   - Device Type Management
   - ESP Device Management

## Adding New Routes

To add a new route:

1. Create the page component in `src/pages/`
2. Import it in `src/App.tsx`
3. Add route definition:

```typescript
// src/pages/MyNewPage.tsx
export function MyNewPage() {
  return <div>My New Page</div>;
}

// src/App.tsx
import { MyNewPage } from './pages/MyNewPage';

// In Routes:
<Route
  path="/my-new-page"
  element={
    <ProtectedRoute>
      <Layout>
        <MyNewPage />
      </Layout>
    </ProtectedRoute>
  }
/>
```

## Route Constants (Recommended)

For maintainability, consider creating route constants:

```typescript
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DEVICES: '/devices',
  DEVICE_DETAIL: (id: number) => `/devices/${id}`,
  MY_DEVICES: '/my-devices',
  // ... etc
};

// Usage
navigate(ROUTES.DEVICE_DETAIL(42));
<Link to={ROUTES.DEVICES}>Devices</Link>
```

## Lazy Loading (Code Splitting)

For better performance, consider lazy loading routes:

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Devices = lazy(() => import('./pages/Devices'));

<Route
  path="/"
  element={
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={<LoadingState />}>
          <Dashboard />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  }
/>
```

## Nested Routes

For complex layouts with sub-navigation:

```typescript
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<UserManagement />} />
  <Route path="devices" element={<DeviceManagement />} />
</Route>

// In AdminLayout component
function AdminLayout() {
  return (
    <div>
      <AdminNav />
      <Outlet /> {/* Child routes render here */}
    </div>
  );
}
```

## Route Transitions

For smooth page transitions, use Framer Motion:

```typescript
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Routes location={location}>
        {/* Route definitions */}
      </Routes>
    </motion.div>
  );
}
```

## Best Practices

1. **Use Nested Layouts**: Group routes with similar layouts
2. **Implement Route Guards**: Protect sensitive routes
3. **Handle 404s**: Provide fallback for unknown routes
4. **Use Route Constants**: Avoid hardcoding paths
5. **Lazy Load Heavy Routes**: Improve initial load time
6. **Preserve Scroll Position**: Use `ScrollToTop` component
7. **Type Route Params**: Use TypeScript for params
8. **Handle Loading States**: Show loading during route changes
9. **Implement Breadcrumbs**: Help users navigate
10. **Test Routes**: Ensure all routes work correctly

## Error Boundaries

Wrap routes in error boundaries for better error handling:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return <div>Error: {error.message}</div>;
}

<Route
  path="/devices"
  element={
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ProtectedRoute>
        <Layout>
          <Devices />
        </Layout>
      </ProtectedRoute>
    </ErrorBoundary>
  }
/>
```

## Scroll Restoration

Scroll to top on route change:

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// In App.tsx
<BrowserRouter>
  <ScrollToTop />
  <Routes>
    {/* Routes */}
  </Routes>
</BrowserRouter>
```

## Route Metadata

For SEO and page titles:

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/': 'Dashboard',
  '/devices': 'Devices',
  '/profile': 'Profile',
};

function usePageTitle() {
  const location = useLocation();
  
  useEffect(() => {
    const title = routeTitles[location.pathname] || 'Solar Monitor';
    document.title = `${title} - Solar Battery Monitoring`;
  }, [location]);
}
```
