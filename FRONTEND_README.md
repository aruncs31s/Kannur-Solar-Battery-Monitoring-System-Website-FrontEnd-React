# Solar Battery Monitoring System - Frontend

A modern React + Vite + Tailwind CSS frontend for monitoring ESP32 devices and their voltage readings in a solar battery system.

## Features

- **User Authentication**: Secure login and registration system with JWT
- **Dashboard**: Real-time voltage readings visualization with charts
- **Device Management**: Add, view, and manage ESP32 devices
- **Map View**: Visualize device locations on an interactive map
- **Admin Panel**: System statistics and device management
- **User Profile**: Manage account settings and change password
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Maps**: Leaflet + React-Leaflet
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Language**: TypeScript

## Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios HTTP client with interceptors
│   ├── auth.ts            # Authentication API endpoints
│   ├── users.ts           # User API endpoints
│   └── devices.ts         # Device API endpoints
├── components/
│   ├── Layout.tsx         # Main layout wrapper
│   ├── Navigation.tsx      # Navigation bar
│   ├── ProtectedRoute.tsx  # Route protection component
│   ├── FormComponents.tsx  # Reusable form components
│   └── Cards.tsx          # Reusable card components
├── pages/
│   ├── Login.tsx          # Login page
│   ├── Register.tsx       # Registration page
│   ├── Dashboard.tsx      # Main dashboard with charts
│   ├── Devices.tsx        # Device management page
│   ├── MapView.tsx        # Device map page
│   ├── Profile.tsx        # User profile page
│   └── Admin.tsx          # Admin panel
├── store/
│   ├── authStore.ts       # Authentication state (Zustand)
│   └── devicesStore.ts    # Devices state (Zustand)
├── App.tsx                # Main app component with routes
└── main.tsx               # Application entry point
```

## Installation

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8080/api/v1
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Integration

The frontend communicates with the backend API at `http://localhost:8080/api/v1`. Make sure your backend is running before starting the development server.

### Key API Endpoints Used

- `POST /auth/login` - User login
- `POST /users/` - User registration
- `GET /users/{id}` - Get user details
- `PUT /users/{id}` - Update user
- `GET /esp/devices` - List all devices
- `POST /esp/devices` - Create device
- `PUT /esp/devices/{id}` - Update device
- `DELETE /esp/devices/{id}` - Delete device
- `GET /esp/devices/{id}/readings` - Get voltage readings

## Features in Detail

### Dashboard
- Display system statistics (total devices, active/inactive)
- Real-time voltage reading charts
- Device list with status indicators
- Auto-refreshing data

### Devices
- Add new ESP32 devices with coordinates
- View all devices in a grid layout
- Delete devices
- Filter and search devices (future enhancement)

### Map
- Interactive map showing device locations
- Click on markers to view device details
- Link to Google Maps for each device
- Auto-centering based on device locations

### Admin Panel
- System health overview
- Device status statistics
- Device management table
- Quick actions for data export and reporting

### Profile
- View and edit user information
- Change password securely
- Security tips

## Useful Features

1. **JWT Token Management**: Automatic token refresh and logout on 401
2. **Form Validation**: Client-side validation on all forms
3. **Error Handling**: User-friendly error messages
4. **Loading States**: Visual feedback during API calls
5. **Responsive Design**: Mobile-first approach
6. **Dark Mode Ready**: Tailwind CSS classes for future dark mode

## Development Tips

### Adding New Pages

1. Create a new file in `src/pages/`
2. Add the route in `App.tsx`
3. Use the `Layout` component to maintain consistent navigation

### API Calls

All API calls go through the `client` in `src/api/client.ts`, which automatically:
- Adds authentication headers
- Handles 401 errors (redirects to login)
- Uses the base URL from env variables

Example:
```typescript
import { devicesAPI } from '../api/devices';

const devices = await devicesAPI.getAllDevices();
```

### State Management

Use Zustand stores for global state:
```typescript
import { useAuthStore } from '../store/authStore';

const { user, isAuthenticated, logout } = useAuthStore();
```

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure your backend has CORS enabled for `http://localhost:5173`

### 404 API Errors
Check that the `VITE_API_URL` in `.env` matches your backend URL

### Token Expiry
Tokens are stored in localStorage. Clear it and login again if experiencing auth issues

## Future Enhancements

- Dark mode toggle
- Real-time data updates with WebSocket
- Device grouping and filtering
- Advanced charts and analytics
- Export data as PDF/CSV
- Multi-language support
- Two-factor authentication
- Device firmware update management

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please check the backend API documentation or contact the development team.
