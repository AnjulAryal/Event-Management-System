import { useState, useEffect } from "react";
import UserPageContainer from "../../components/user/UserPageContainer";
import UserSearch from "../../components/user/UserSearch";
import { Edit2, Save, X, Key, Camera, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UserProfile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    
    // User state
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        profilePicture: ""
    });

    // Form state for editing
    const [formData, setFormData] = useState({
        name: "",
        phone: ""
    });

    useEffect(() => {
        fetchUserProfile();
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchUserProfile = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser || !storedUser.token) return;

            const response = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${storedUser.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                setFormData({
                    name: data.name,
                    phone: data.phone || ""
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters!");
            return;
        }

        setLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUser.token}`,
                },
                body: JSON.stringify({ password: passwordData.newPassword }),
            });

            if (res.ok) {
                toast.success("Password updated successfully!");
                setIsChangePasswordModalOpen(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to update password");
            }
        } catch (error) {
            toast.error("Error updating password");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedUser.token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                // Update localStorage name if changed
                const updatedStoredUser = { ...storedUser, name: data.name, profilePicture: data.profilePicture };
                localStorage.setItem('user', JSON.stringify(updatedStoredUser));
                setIsEditing(false);
                toast.success("Profile updated successfully!");
                // Trigger navbar update
                window.dispatchEvent(new Event('userUpdated'));
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (optional but good practice)
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("File is too large. Please select an image under 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64String = reader.result;
            
            setLoading(true);
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const response = await fetch('/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedUser.token}`
                    },
                    body: JSON.stringify({ profilePicture: base64String })
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                    // Update localStorage with new profilePicture so Navbar re-renders
                    const storedUserLocal = JSON.parse(localStorage.getItem('user'));
                    const updatedStoredUser = { ...storedUserLocal, profilePicture: data.profilePicture };
                    localStorage.setItem('user', JSON.stringify(updatedStoredUser));
                    // Fire event so Navbar picks up the change immediately
                    window.dispatchEvent(new Event('userUpdated'));
                    toast.success("Profile picture updated!");
                } else {
                    toast.error(data.message || "Failed to update picture");
                }
            } catch (error) {
                toast.error("An error occurred during upload");
            } finally {
                setLoading(false);
            }
        };
    };

    const handleRemovePicture = async () => {
        if (!confirm("Remove profile picture?")) return;
        setLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedUser.token}`
                },
                body: JSON.stringify({ profilePicture: "" })
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                // Update localStorage to clear profilePicture so Navbar re-renders
                const storedUserLocal = JSON.parse(localStorage.getItem('user'));
                const updatedStoredUser = { ...storedUserLocal, profilePicture: "" };
                localStorage.setItem('user', JSON.stringify(updatedStoredUser));
                window.dispatchEvent(new Event('userUpdated'));
                toast.success("Profile picture removed");
            }
        } catch (error) {
            toast.error("Failed to remove picture");
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserPageContainer isMobile={isMobile}>
            <UserSearch 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Search events..." 
            />

            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-12 min-h-[500px]">
                {/* Left side: Profile Picture */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="w-64 h-64 bg-[#f0f0f0] rounded-[40px] flex items-center justify-center overflow-hidden border-4 border-[#3b82f6] shadow-lg relative group">
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-inner">
                                <div className="w-32 h-32 bg-[#e0e0e0] rounded-full flex items-center justify-center">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#999" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.33 4 18V20H20V18C20 16.67 14.67 14 12 14Z"/>
                                    </svg>
                                </div>
                            </div>
                        )}
                        {loading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}
                    </div>
                    
                    <div className="flex gap-3 w-full">
                        <input 
                            type="file" 
                            id="profile-upload" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                        />
                        <button 
                            onClick={() => document.getElementById('profile-upload').click()}
                            className="flex-1 bg-[#8a99a8] hover:bg-[#7a8998] text-white py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-md shadow-gray-200 flex items-center justify-center gap-2"
                        >
                            <Camera size={16} /> Change Profile Picture
                        </button>
                        <button 
                            onClick={handleRemovePicture}
                            className="bg-[#e53935] hover:bg-[#d32f2f] text-white py-3 px-6 rounded-xl text-sm font-bold transition-all shadow-md shadow-red-100 flex items-center justify-center"
                        >
                            <Trash2 size={16} className="md:hidden" />
                            <span className="hidden md:inline">Remove</span>
                        </button>
                    </div>
                </div>

                {/* Right side: Details */}
                <div className="flex-1 space-y-10">
                    {/* Personal Details */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold text-slate-800">Personal Details</h2>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleUpdateProfile}
                                        disabled={loading}
                                        className="bg-[#5CB85C] hover:bg-[#4AA14A] text-white py-1.5 px-4 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
                                    >
                                        <Save size={14} /> Save
                                    </button>
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-1.5 px-4 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-[#8a99a8] hover:bg-[#7a8998] text-white py-1.5 px-4 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-8">
                                <label className="w-24 text-lg font-bold text-slate-700">Name:</label>
                                {isEditing ? (
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="flex-1 bg-[#eef6ff] py-2 px-6 rounded-lg text-slate-700 font-bold border-2 border-blue-200 focus:border-blue-400 outline-none"
                                    />
                                ) : (
                                    <div className="flex-1 bg-[#eef6ff] py-2 px-6 rounded-lg text-slate-700 font-bold border border-blue-50">
                                        {user.name}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-8">
                                <label className="w-24 text-lg font-bold text-slate-700">Email:</label>
                                <div className="flex-1 bg-slate-50 py-2 px-6 rounded-lg text-slate-400 font-bold border border-slate-100 cursor-not-allowed">
                                    {user.email}
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <label className="w-24 text-lg font-bold text-slate-700">Phone no:</label>
                                {isEditing ? (
                                    <input 
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="flex-1 bg-[#eef6ff] py-2 px-6 rounded-lg text-slate-700 font-bold border-2 border-blue-200 focus:border-blue-400 outline-none"
                                    />
                                ) : (
                                    <div className="flex-1 bg-[#eef6ff] py-2 px-6 rounded-lg text-slate-700 font-bold border border-blue-50">
                                        {user.phone || "0987654321"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Password & Security */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-extrabold text-slate-800">Password & Security</h2>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-lg font-bold text-slate-700">Password:</label>
                                <button 
                                    onClick={() => setIsChangePasswordModalOpen(true)}
                                    className="w-fit bg-[#8a99a8] hover:bg-[#7a8998] text-white py-3 px-10 rounded-xl text-sm font-bold transition-all shadow-md shadow-gray-200 flex items-center gap-2"
                                >
                                    <Key size={16} /> Change Password
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Change Password Modal */}
            {isChangePasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-800">Change Password</h2>
                            <button onClick={() => setIsChangePasswordModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                <input 
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-100 py-3.5 px-5 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-[#5CB85C]/10 focus:bg-white focus:border-[#5CB85C] transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                <input 
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-100 py-3.5 px-5 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-[#5CB85C]/10 focus:bg-white focus:border-[#5CB85C] transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-[#5CB85C] hover:bg-[#4AA14A] text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsChangePasswordModalOpen(false)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserPageContainer>
    );
}

