import React, { useState, useEffect, useRef } from "react";

import { toast } from "react-hot-toast";

const AdminProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('user'));
      if (!userInfo || !userInfo.token) {
        toast.error("Authentication required");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await fetch('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setUser({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        profilePicture: data.profilePicture || "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }
      
      // Update local storage user data
      localStorage.setItem('user', JSON.stringify({
        ...userInfo,
        name: data.name,
        phone: data.phone,
      }));
      
      setUser(prev => ({
        ...prev,
        name: data.name,
        phone: data.phone,
      }));
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.password) {
      return toast.error("Please enter a new password");
    }
    
    try {
      setIsUpdating(true);
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          password: passwordData.password,
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setPasswordData({ password: "" });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        try {
          const userInfo = JSON.parse(localStorage.getItem('user'));
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          
          const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify({
              profilePicture: base64String,
            }),
          });
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Failed to update profile picture");
          }
          
          setUser(prev => ({ ...prev, profilePicture: base64String }));
          
          // Update local storage
          localStorage.setItem('user', JSON.stringify({
            ...userInfo,
            profilePicture: base64String,
          }));
          
          toast.success("Profile picture updated");
        } catch (error) {
          toast.error(error.message || "Failed to update profile picture");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          profilePicture: "",
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to remove profile picture");
      }
      
      setUser(prev => ({ ...prev, profilePicture: "" }));
      
      localStorage.setItem('user', JSON.stringify({
        ...userInfo,
        profilePicture: "",
      }));
      
      toast.success("Profile picture removed");
    } catch (error) {
      toast.error(error.message || "Failed to remove profile picture");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      {/* Search Bar at top */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Column: Profile Picture */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-[300px] h-[300px] bg-[#dcdcdc] rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center border-4 border-gray-50">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg viewBox="0 0 24 24" fill="#ffffff" className="w-48 h-48 mt-12">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*" 
            />
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => fileInputRef.current.click()}
                className="flex-1 bg-[#8795A1] hover:bg-[#73828f] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Change Profile Picture
              </button>
              <button 
                onClick={handleRemoveImage}
                disabled={!user.profilePicture}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${user.profilePicture ? 'bg-[#E3342F] hover:bg-[#cc2e2a] text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                Remove
              </button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex-1 pt-2">
            {/* Personal Details */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1.5 px-4 rounded-md transition-colors"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-semibold py-1.5 px-4 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 bg-[#9EABB4] hover:bg-[#8A98A1] text-white text-xs font-medium py-1.5 px-4 rounded-md transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </button>
                )}
              </div>
              
              <div className="space-y-4 max-w-md">
                <div className="flex items-center">
                  <label className="w-32 text-gray-800 font-medium text-sm">Name:</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={user.name} 
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex-1 bg-[#E8F0FE] text-gray-800 rounded-md px-3 py-1.5 text-sm font-medium">
                      {user.name}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <label className="w-32 text-gray-800 font-medium text-sm">Email:</label>
                  <div className="flex-1 bg-[#E8F0FE] text-gray-800 rounded-md px-3 py-1.5 text-sm font-medium cursor-not-allowed opacity-80">
                    {user.email}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="w-32 text-gray-800 font-medium text-sm">Phone no:</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={user.phone} 
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                      className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex-1 bg-[#E8F0FE] text-gray-800 rounded-md px-3 py-1.5 text-sm font-medium">
                      {user.phone || "-"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Password & Security */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Password & Security</h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div className="flex items-center">
                  <label className="w-32 text-gray-800 font-medium text-sm">Password:</label>
                  <input 
                    type="password" 
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({password: e.target.value})}
                    placeholder="Enter new password"
                    className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[#8795A1] hover:bg-[#73828f] text-white text-sm font-medium py-2 px-6 rounded-md transition-colors mt-2"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>

            {/* Linked Accounts */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Link your google account</h3>
              <div className="flex gap-4">
                {/* Google */}
                <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>
                {/* LinkedIn */}
                <button className="w-10 h-10 rounded-sm bg-[#0077b5] flex items-center justify-center hover:bg-[#006097] transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </button>
                {/* Discord */}
                <button className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center hover:bg-[#4752C4] transition-colors">
                  <svg width="24" height="24" viewBox="0 0 127.14 96.36" fill="white">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                  </svg>
                </button>
                {/* Facebook */}
                <button className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:bg-[#166FE5] transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
