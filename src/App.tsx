import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Devices } from "./pages/devices/Devices";
import { MyDevices } from "./pages/my-devices/MyDevices";
import { MyMicrocontrollers } from "./pages/my-microcontrollers/MyMicrocontrollers";
import { DeviceDetail } from "./pages/device-detail/DeviceDetail";
import { DeviceReadingsHistory } from "./pages/device-readings-history/DeviceReadingsHistory";
import { DeviceStateHistory } from "./pages/device-state-history/DeviceStateHistory";
import { AllReadings } from "./pages/all-readings/AllReadings";
import { MapView } from "./pages/map-view/MapView";
import { Locations } from "./pages/locations/Locations";
import { Profile } from "./pages/profile/Profile";
import { Admin } from "./pages/admin/Admin";
import { AdminDeviceManagement } from "./pages/admin/AdminDeviceManagement";
import { AdminUserManagement } from "./pages/admin/AdminUserManagement";
import { AdminDeviceTypeManagement } from "./pages/admin/AdminDeviceTypeManagement";
import { AdminESPDeviceManagement } from "./pages/admin/AdminESPDeviceManagement";
import { AuditLogs } from "./pages/audit-logs/AuditLogs";
import { Configuration } from "./pages/configuration/Configuration";
import { Versions } from "./pages/versions/Versions";
import { LocationDetails } from "./pages/location-details/LocationDetails";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MCDeviceDetail } from "./pages/microcontroller-detail/MicrocontrollerDetail";
import { NotFound } from "./pages/not-found/NotFound";
import { ApiError } from "./pages/api-error/ApiError";

function App() {
  const { initAuth } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
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
          path="/my-microcontrollers"
          element={
            <ProtectedRoute>
              <Layout>
                <MyMicrocontrollers />
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
          path="/devices/mc/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <MCDeviceDetail />
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
          path="/locations"
          element={
            <ProtectedRoute>
              <Layout>
                <Locations />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/locations/:id/devices"
          element={
            <ProtectedRoute>
              <Layout>
                <LocationDetails />
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
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout>
                <Admin />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/devices"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout>
                <AdminDeviceManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout>
                <AdminUserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/device-types"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout>
                <AdminDeviceTypeManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/esp-devices"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout>
                <AdminESPDeviceManagement />
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
        <Route path="/server-error" element={<ApiError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
