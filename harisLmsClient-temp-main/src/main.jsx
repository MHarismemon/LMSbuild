// main.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import RefrshHandler from './RefrshHandler';
import {
  ClassSection,
  Dashboard,
  UserManagementStaff,
  App,
  SuperAdminLayout,
  LoginForm,
  UserManagementGuardian,
  UserManagementStudent,
  ApprovedLeave,
  RejectedLeave,
  EditStudent,
  ViewStudent,
  AddStudent,
  UserManagementTeacher,
  SuperAdminDashboard,
  SuperAdminBatch,
  SuperAdminUser
} from './index';
import './index.css';

// PrivateRoute component to ensure routes are protected
const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Refresh handler to manage role-based redirects on authentication */}
        <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Branch Admin Routes */}
          <Route
            path="/branch-admin/*"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                element={<App />}
              />
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="class-section" element={<ClassSection />} />
            <Route path="user-management/teacher" element={<UserManagementTeacher />} />
            <Route path="user-management/staff" element={<UserManagementStaff />} />
            <Route path="user-management/guardian" element={<UserManagementGuardian />} />
            <Route path="user-management/student" element={<UserManagementStudent />} />
            <Route path="user-management/student-add" element={<AddStudent />} />
            <Route path="user-management/student-view/:id" element={<ViewStudent />} />
            <Route path="user-management/student-edit/:id" element={<EditStudent />} />
            <Route path="leave-management/approved-leaves" element={<ApprovedLeave />} />
            <Route path="leave-management/rejected-leaves" element={<RejectedLeave />} />

            <Route path="user-management/student" element={<UserManagementStudent />} />
          </Route>

          {/* Super Admin Routes */}
          <Route
            path="/super-admin/*"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                element={<SuperAdminLayout />}
              />
            }
          >
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="branch" element={<SuperAdminBatch />} />
            <Route path="user" element={<SuperAdminUser />} />
          </Route>

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
