import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Devices } from './pages/Devices';
import { MyDevices } from './pages/MyDevices';
import { DeviceDetail } from './pages/DeviceDetail';
import { DeviceReadingsHistory } from './pages/DeviceReadingsHistory';
import { DeviceStateHistory } from './pages/DeviceStateHistory';
import { AllReadings } from './pages/AllReadings';
import { MapView } from './pages/MapView';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { AuditLogs } from './pages/AuditLogs';
import { Configuration } from './pages/Configuration';
import { Versions } from './pages/Versions';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { initAuth } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <Layout>
                <Devices />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-devices"
          element={
            <ProtectedRoute>
              <Layout>
                <MyDevices />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <DeviceDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices/:id/history"
          element={
            <ProtectedRoute>
              <Layout>
                <DeviceReadingsHistory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices/:id/state-history"
          element={
            <ProtectedRoute>
              <Layout>
                <DeviceStateHistory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/readings"
          element={
            <ProtectedRoute>
              <Layout>
                <AllReadings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Layout>
                <MapView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <Admin />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuration"
          element={
            <ProtectedRoute>
              <Layout>
                <Configuration />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/versions"
          element={
            <ProtectedRoute>
              <Layout>
                <Versions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit"
          element={
            <ProtectedRoute>
              <Layout>
                <AuditLogs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
