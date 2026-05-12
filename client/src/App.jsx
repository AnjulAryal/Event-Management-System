import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminNotifications from './components/AdminNotifications';
import UserNotifications from './components/UserNotifications';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Lazy-loaded pages (code-split — only loaded when visited)
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/signup'));
const PublicDashboard = lazy(() => import('./pages/PublicDashboard'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));

// User pages
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const RegisteredEvents = lazy(() => import('./pages/user/RegisteredEvents'));
const Speakers = lazy(() => import('./pages/user/Speakers'));
const UserFeedback = lazy(() => import('./pages/user/UserFeedback'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));
const CancelRegistration = lazy(() => import('./pages/user/help/CancelRegistration'));
const FindTickets = lazy(() => import('./pages/user/help/FindTickets'));
const RegisterEvent = lazy(() => import('./pages/user/help/RegisterEvent'));
const ContactOrganizer = lazy(() => import('./pages/user/help/ContactOrganizer'));
const CompleteRegistration = lazy(() => import('./pages/user/CompleteRegistration'));
const PaymentSuccess = lazy(() => import('./pages/user/PaymentSuccess'));
const EventDetails = lazy(() => import('./pages/user/EventDetails'));
const AllEvents = lazy(() => import('./pages/user/AllEvents'));
const UserProfile = lazy(() => import('./pages/user/UserProfile'));
const SpeakerDetail = lazy(() => import('./pages/user/SpeakerDetail'));
const PaymentHistory = lazy(() => import('./pages/user/PaymentHistory'));
const AttendedEvents = lazy(() => import('./pages/user/AttendedEvents'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvent'));
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'));
const AdminSpeakers = lazy(() => import('./pages/admin/AdminSpeakers'));
const AdminAddEvent = lazy(() => import('./pages/admin/AdminAddEvent'));
const AdminEditEvent = lazy(() => import('./pages/admin/AdminEditEvent'));
const AdminEventAttendees = lazy(() => import('./pages/admin/AdminEventAttendees'));
const AdminHelpsupport = lazy(() => import('./pages/admin/AdminHelpsupport'));
const Adminaddspeaker = lazy(() => import('./pages/admin/adminaddspeaker'));
const AdminViewDetails = lazy(() => import('./pages/admin/adminViewdetails'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminManageUsers = lazy(() => import('./pages/admin/AdminManageUsers'));
const AdminSpeakerProfile = lazy(() => import('./pages/admin/AdminSpeakerProfile'));
const AdminSpeakersEdit = lazy(() => import('./pages/admin/AdminSpeakersEdit'));

// Loading spinner for lazy-loaded pages
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div style={{
      width: 36, height: 36, border: '3px solid #e2e8f0',
      borderTopColor: '#5CB85C', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function AppContent({ open, setOpen, isMobile }) {
  const location = useLocation();

  // Get the user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const authRoutes = ['/login', '/reset-password', '/update-password', '/'];
  const isAuthPage = authRoutes.includes(location.pathname) || (location.pathname === '/signup' && !user);

  const SIDEBAR_W = 240;

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      {/* 
        Only show Navbar if:
        1. It's not an auth page AND
        2. A user is logged in
      */}
      {!isAuthPage && user && <Navbar open={open} setOpen={setOpen} isMobile={isMobile} />}
      {!isAuthPage && user?.isAdmin && <AdminNotifications />}
      {!isAuthPage && user && !user?.isAdmin && <UserNotifications />}

      {/* Main Content */}
      <main
        className={`relative flex flex-col flex-grow ${(!isAuthPage && user) ? 'pt-16 md:pt-0' : ''}`}
        style={{
          marginLeft: !isMobile && open && !isAuthPage && user ? `${SIDEBAR_W}px` : "0px",
          transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
          minHeight: "100vh",
        }}
      >
        <div className="flex-grow flex flex-col w-full">
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/" element={user ? <Navigate to={user.isAdmin ? "/admin-dashboard" : "/dashboard"} replace /> : <PublicDashboard />} />
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
            <Route path="/admin-add-speaker" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Adminaddspeaker />
              </ProtectedRoute>
            } />
            <Route path="/admin-speakers-edit/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSpeakersEdit />
              </ProtectedRoute>
            } />
            <Route path="/admin-add-event" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAddEvent />
              </ProtectedRoute>
            } />
            <Route path="/admin-edit-event/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEditEvent />
              </ProtectedRoute>
            } />
            <Route path="/admin-event-attendees/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEventAttendees />
              </ProtectedRoute>
            } />
            <Route path="/admin-help" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminHelpsupport />
              </ProtectedRoute>
            } />
            <Route path="/admin-view-details/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminViewDetails />
              </ProtectedRoute>
            } />
            <Route path="/admin-profile" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin-users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin-speaker-profile/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSpeakerProfile />
              </ProtectedRoute>
            } />

            {/* User Protected Routes */}
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
            <Route path="/attended-events" element={
              <ProtectedRoute allowedRoles={['user']}>
                <AttendedEvents />
              </ProtectedRoute>
            } />
            <Route path="/speakers" element={
              <ProtectedRoute allowedRoles={['user']}>
                <Speakers />
              </ProtectedRoute>
            } />
            <Route path="/speakers/:id" element={
              <ProtectedRoute allowedRoles={['user']}>
                <SpeakerDetail />
              </ProtectedRoute>
            } />

            <Route path="/feedback" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserFeedback />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/payment-history" element={
              <ProtectedRoute allowedRoles={['user']}>
                <PaymentHistory />
              </ProtectedRoute>
            } />
            <Route path="/all-events" element={

              <ProtectedRoute allowedRoles={['user']}>
                <AllEvents />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute allowedRoles={['user']}>
                <HelpSupport />
              </ProtectedRoute>
            } />
            <Route path="/help/cancellation" element={
              <ProtectedRoute allowedRoles={['user']}>
                <CancelRegistration />
              </ProtectedRoute>
            } />
            <Route path="/help/tickets" element={
              <ProtectedRoute allowedRoles={['user']}>
                <FindTickets />
              </ProtectedRoute>
            } />
            <Route path="/help/registration" element={
              <ProtectedRoute allowedRoles={['user']}>
                <RegisterEvent />
              </ProtectedRoute>
            } />
            <Route path="/help/organizer" element={
              <ProtectedRoute allowedRoles={['user']}>
                <ContactOrganizer />
              </ProtectedRoute>
            } />
            <Route path="/complete-registration/:id" element={
              <ProtectedRoute allowedRoles={['user']}>
                <CompleteRegistration />
              </ProtectedRoute>
            } />
            <Route path="/payment-success" element={
              <ProtectedRoute allowedRoles={['user']}>
                <PaymentSuccess />
              </ProtectedRoute>
            } />
            <Route path="/event-details/:id" element={
              <ProtectedRoute allowedRoles={['user']}>
                <EventDetails />
              </ProtectedRoute>
            } />

            {/* Catch-all or undefined routes: Redirect to login or home if logged in */}
            <Route path="*" element={<Navigate to={user ? (user.isAdmin ? "/admin-dashboard" : "/dashboard") : "/login"} replace />} />
          </Routes>
        </div>

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
