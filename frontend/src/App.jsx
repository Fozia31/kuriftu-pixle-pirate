import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import GuestPortal from './components/GuestPortal';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Guest Protected Routes */}
            <Route
              path="/experience"
              element={
                <ProtectedRoute allowedRoles={['GUEST']}>
                  <GuestPortal />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['EXECUTIVE_ADMIN', 'ROOM_MANAGER', 'SPA_MANAGER']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
