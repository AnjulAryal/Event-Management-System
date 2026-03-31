import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Login from './pages/Login';
import Signup from "./pages/signup";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';

function App() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
            <Route path="/" element={<h1>Events Page</h1>} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/my-events" element={<h1>My Events Only</h1>} />
            <Route path="/register" element={<h1>Register Page</h1>} />
            <Route path="/speakers" element={<h1>Speaker Page</h1>} />
            <Route path="/help" element={<h1>Help/support Page</h1>} />
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