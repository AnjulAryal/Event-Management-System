import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, BarChart3, Bell, Video, Search } from 'lucide-react';
import BrandLogo from '../components/ui/BrandLogo';

const PublicDashboard = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/login');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <Calendar className="w-5 h-5 text-[#5CB85C]" />,
      title: "Event Creation",
      description: "Intuitive step-by-step builders designed for complex multi-day tracks and simple meetups alike."
    },
    {
      icon: <Users className="w-5 h-5 text-[#5CB85C]" />,
      title: "Attendee Management",
      description: "Complete CRM for your events with check-in tools, badge printing, and tiered ticketing support."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-[#5CB85C]" />,
      title: "Real-time Analytics",
      description: "Visualize registration trends, revenue streams, and demographic data through our sleek dashboard."
    },
    {
      icon: <Bell className="w-5 h-5 text-[#5CB85C]" />,
      title: "Notifications",
      description: "Automated email sequences and SMS alerts to keep your participants informed about schedule changes."
    },
    {
      icon: <Video className="w-5 h-5 text-[#5CB85C]" />,
      title: "Online & Hybrid Events",
      description: "Seamless integration with major streaming platforms for global reach and interactive digital spaces."
    },
    {
      icon: <Search className="w-5 h-5 text-[#5CB85C]" />,
      title: "Searchable Directory",
      description: "Elegant public listing pages that make finding and filtering events a delightful experience."
    }
  ];

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Typing animation state
  const phrases = ["Register Events", "Discover Events", "Manage Events"];
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        // Take up to 4 events for the public dashboard
        setEvents(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fullText = phrases[phraseIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && currentPhrase === fullText) {
      typingSpeed = 2000;
      const timer = setTimeout(() => setIsDeleting(true), typingSpeed);
      return () => clearTimeout(timer);
    } else if (isDeleting && currentPhrase === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      typingSpeed = 500;
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPhrase((prev) =>
        isDeleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentPhrase, isDeleting, phraseIndex]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
        <button onClick={() => scrollToSection('home')} className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
          <BrandLogo size="24px" />
        </button>
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection('home')} className="text-sm font-medium text-gray-600 hover:text-[#5CB85C] transition-colors cursor-pointer">Home</button>
          <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-gray-600 hover:text-[#5CB85C] transition-colors cursor-pointer">About</button>
          <button onClick={() => scrollToSection('events')} className="text-sm font-medium text-gray-600 hover:text-[#5CB85C] transition-colors cursor-pointer">Events</button>
        </div>
        <div>
          <Link to="/login" className="bg-[#5CB85C] hover:bg-[#4AA14A] text-white px-6 py-2 rounded-md font-medium transition-colors">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-[#1a1c1a] text-white py-24 flex flex-col items-center text-center px-4">
        <div className="inline-block border border-[#5CB85C] rounded-full px-4 py-1 mb-8">
          <span className="text-[#5CB85C] text-xs font-bold tracking-wider uppercase">Smart Event Management Platform</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6 max-w-3xl leading-tight flex flex-col items-center justify-center h-32 md:h-24 gap-2">
          <span>Manage, Discover &</span>
          <span><span className="text-[#5CB85C]">{currentPhrase}</span> Effortlessly</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mb-10 text-lg">
          The premier editorial platform for high-impact gatherings, professional conferences, and exclusive cultural showcases.
        </p>
        <div className="flex space-x-4 mt-2">
          <button 
            onClick={handleRegisterClick}
            className="bg-[#5CB85C] hover:bg-[#4AA14A] text-white px-8 py-3 rounded-md font-medium transition-colors cursor-pointer"
          >
            Browse Events
          </button>
          <button className="border border-gray-600 hover:border-gray-400 text-white px-8 py-3 rounded-md font-medium transition-colors cursor-pointer">
            Learn More
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="bg-[#111111] text-white py-12 border-y border-[#222]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#333]">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">320+</div>
            <div className="text-gray-500 text-xs font-bold tracking-widest uppercase">Events Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">12K+</div>
            <div className="text-gray-500 text-xs font-bold tracking-widest uppercase">Registrations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">80+</div>
            <div className="text-gray-500 text-xs font-bold tracking-widest uppercase">Organisers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">99%</div>
            <div className="text-gray-500 text-xs font-bold tracking-widest uppercase">Uptime</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-medium mb-12 text-gray-800 border-b pb-4">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="border border-gray-100 p-8 rounded-sm hover:shadow-lg transition-shadow bg-white">
                <div className="w-10 h-10 rounded-full bg-[#5CB85C]/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="bg-white py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12 border-b pb-4">
            <h2 className="text-xl font-medium text-gray-800">Upcoming Events</h2>
            <button onClick={handleRegisterClick} className="text-sm text-gray-500 hover:text-[#5CB85C] flex items-center cursor-pointer">
              View all <span className="ml-1">→</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-500">Loading events...</div>
            ) : events.length > 0 ? (
              events.map((event, index) => {
                const dateObj = new Date(event.date);
                const day = dateObj.getDate() || "12";
                const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() || "OCT";
                const tag = event.category ? event.category.toUpperCase() : "EVENT";
                const isEco = tag.includes("ECO");
                const isWorkshop = tag.includes("WORKSHOP");
                const isCultural = tag.includes("CULTURAL");
                const tagColor = isEco ? "bg-[#5CB85C]/15 text-[#4AA14A]" : isWorkshop ? "bg-red-100 text-red-800" : isCultural ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";

                return (
                  <div 
                    key={event._id || index} 
                    onClick={handleRegisterClick}
                    className="border border-gray-200 p-6 rounded-sm flex items-center cursor-pointer hover:border-[#5CB85C] transition-colors group"
                  >
                    <div className="flex-shrink-0 w-16 text-center border-r border-gray-200 pr-6 mr-6">
                      <div className="text-2xl font-bold text-gray-900 group-hover:text-[#5CB85C] transition-colors">{day}</div>
                      <div className="text-xs font-bold text-gray-500 tracking-wider">{month}</div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#5CB85C] transition-colors">{event.title}</h3>
                      <p className="text-gray-500 text-sm flex items-center">
                        <span className="mr-1 opacity-60">📍</span> {event.location || "Online"}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4 hidden sm:block">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full tracking-wider ${tagColor}`}>
                        {tag}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">No upcoming events found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-gray-50 py-10 px-4 mt-auto border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <button onClick={() => scrollToSection('home')} className="mb-4 md:mb-0 flex items-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
            <BrandLogo size="20px" />
          </button>
          <div className="text-xs md:text-sm font-medium tracking-widest text-gray-500 uppercase">
            All Rights Reserved Visionaries <span className="mx-3 text-[#5CB85C]">|</span> 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicDashboard;
