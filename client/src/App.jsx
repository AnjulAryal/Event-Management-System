import Navbar from './components/Navbar';
import Footer from './components/footer';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-grow md:ml-64 pt-16 md:pt-0 px-4 pb-10">
          <Routes>
            <Route path="/" element={<h1>Events Page</h1>} />
            <Route path="/dashboard" element={<h1>Dashboard Page</h1>} />
            <Route path="/my-events" element={<h1>My Events Only</h1>} />
            <Route path="/register" element={<h1>Register Page</h1>} />
            <Route path="/speakers" element={<h1>Speaker Page</h1>} />
            <Route path="/help" element={<h1>Help/support Page</h1>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;