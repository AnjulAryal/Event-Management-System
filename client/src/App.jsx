import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Login from './pages/Login';
import Signup from "./pages/signup";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';
import RegisteredEvents from './pages/user/RegisteredEvents';
import Speakers from './pages/user/Speakers';
import UserFeedback from './pages/user/UserFeedback';
import HelpSupport from './pages/HelpSupport';
import { Toaster } from 'react-hot-toast';
import UpdatePassword from './pages/UpdatePassword';
import AdminSpeakersEdit from './pages/admin/AdminSpeakersEdit';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvent";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminSpeakers from "./pages/admin/AdminSpeakers";
import AdminEvent from "./pages/admin/AdminEvent";
import AdminHelpSupport from "./pages/admin/AdminHelpsupport";

function AppContent({ open, setOpen, isMobile }) {
  const location = useLocation();
  const authRoutes = ['/login', '/signup', '/reset-password', '/update-password'];
  const isAuthPage = authRoutes.includes(location.pathname);

  const SIDEBAR_W = 240;

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      {!isAuthPage && <Navbar open={open} setOpen={setOpen} isMobile={isMobile} />}

      {/* Main Content */}
      <main
        className={`flex-grow ${!isAuthPage ? 'pt-16 md:pt-0' : ''}`}
        style={{
          marginLeft: !isMobile && open && !isAuthPage ? `${SIDEBAR_W}px` : "0px",
          transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
          minHeight: "100vh",
        }}
      >
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          {/* Admin Protected Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-events" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEvents />
            </ProtectedRoute>
          } />
          <Route path="/admin-feedback" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminFeedback />
            </ProtectedRoute>
          } />
          <Route path="/admin-speakers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSpeakers />
            </ProtectedRoute>
          } />
          <Route path="/admin-speakers-edit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSpeakersEdit />
            </ProtectedRoute>
          } />
          <Route path="/admin-help" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminHelpSupport />
            </ProtectedRoute>
          } />

          {/* User Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['user']}>
              <RegisteredEvents />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-events" element={
            <ProtectedRoute allowedRoles={['user']}>
              <RegisteredEvents />
            </ProtectedRoute>
          } />
          <Route path="/speakers" element={
            <ProtectedRoute allowedRoles={['user']}>
              <Speakers />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserFeedback />
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute allowedRoles={['user']}>
              <HelpSupport />
            </ProtectedRoute>
          } />

          {/* Catch-all or undefined routes */}
          <Route path="/register" element={<h1>Register Page (Under Dev)</h1>} />
        </Routes>
        {!isAuthPage && <Footer />}
      </main>
    </div>
  );
}
function App() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setOpen(false);
      else setOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <Router>
      <AppContent open={open} setOpen={setOpen} isMobile={isMobile} />
    </Router>
  );
}

export default App;