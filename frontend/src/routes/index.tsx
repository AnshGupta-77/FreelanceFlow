import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Dashboard, Clients, Projects, Schedule } from "../pages";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/clients"
          element={
            <DashboardLayout>
              <Clients />
            </DashboardLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          }
        />
        <Route
          path="/schedule"
          element={
            <DashboardLayout>
              <Schedule />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
