import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/Login';
import Signup from "./pages/signup";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';
import RegisteredEvents from './pages/user/RegisteredEvents';
import Speakers from './pages/user/Speakers';
import UserFeedback from './pages/user/UserFeedback';
import HelpSupport from './pages/HelpSupport';
import CancelRegistration from './pages/help/CancelRegistration';
import FindTickets from './pages/help/FindTickets';
import RegisterEvent from './pages/help/RegisterEvent';
import ContactOrganizer from './pages/help/ContactOrganizer';
import CompleteRegistration from './pages/user/CompleteRegistration';
import EventDetails from './pages/user/EventDetails';
import { Toaster } from 'react-hot-toast';
import UpdatePassword from './pages/UpdatePassword';
import AllEvents from './pages/user/AllEvents';
import AdminSpeakersEdit from './pages/admin/AdminSpeakersEdit';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvent";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminSpeakers from "./pages/admin/AdminSpeakers";
import AdminAddEvent from "./pages/admin/AdminAddEvent";
import AdminEditEvent from "./pages/admin/AdminEditEvent";
import AdminEventAttendees from "./pages/admin/AdminEventAttendees";
import AdminHelpsupport from "./pages/admin/AdminHelpsupport";
import Adminaddspeaker from "./pages/admin/adminaddspeaker";
import AdminViewDetails from "./pages/admin/adminViewdetails";


function AppContent({ open, setOpen, isMobile }) {
  const location = useLocation();
  const authRoutes = ['/login', '/reset-password', '/update-password'];
  const isAuthPage = authRoutes.includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Get the user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

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

      {/* Main Content */}
      <main
        className={`flex flex-col flex-grow ${(!isAuthPage && user) ? 'pt-16 md:pt-0' : ''}`}
        style={{
          marginLeft: !isMobile && open && !isAuthPage && user ? `${SIDEBAR_W}px` : "0px",
          transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
          minHeight: "100vh",
        }}
      >
        <div className="flex-grow flex flex-col w-full">
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