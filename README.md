# ESP Solar Monitor - Frontend

React frontend for monitoring ESP32 solar battery systems.

## Features

- 🔐 User authentication with JWT
- 📊 Dashboard with real-time statistics
- 🖥️ ESP device management
- 🗺️ Interactive map showing device locations
- 📈 Voltage trend charts
- 👤 User profile management
- ⚙️ Admin panel for device/user management

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand (state management)
- Axios (API calls)
- Recharts (charts)
- Leaflet (maps)
- Lucide React (icons)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### Run Development Server

```bash
npm run dev
```

The app will run on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Reusable components
├── pages/           # Page components
├── store/           # Zustand stores
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Pages

- `/login` - User authentication
- `/` - Dashboard with stats and charts
- `/devices` - ESP device list and management
- `/map` - Interactive map with device locations
- `/profile` - User profile
- `/admin` - Admin panel for device/user management

## API Integration

The frontend connects to the backend API at `http://localhost:8080/api/v1`

Ensure the backend is running before starting the frontend.
