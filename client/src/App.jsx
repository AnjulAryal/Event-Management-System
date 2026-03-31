import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Login from './pages/Login';
import Signup from "./pages/signup";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';
import RegisteredEvents from './pages/user/RegisteredEvents';
import Speakers from './pages/user/Speakers';
import UserFeedback from './pages/user/UserFeedback';
import HelpSupport from './pages/HelpSupport';
import { Toaster } from 'react-hot-toast';

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

  const SIDEBAR_W = 240;

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar open={open} setOpen={setOpen} isMobile={isMobile} />
        {/* Main Content */}
        <main
          className="flex-grow pt-16 md:pt-0"
          style={{
            marginLeft: !isMobile && open ? `${SIDEBAR_W}px` : "0px",
            transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/" element={<RegisteredEvents />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/user-events" element={<RegisteredEvents />} />
            <Route path="/register" element={<h1>Register Page</h1>} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/feedback" element={<UserFeedback />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;