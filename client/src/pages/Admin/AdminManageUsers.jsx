import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  Search,
  Trash2,
  ShieldOff,
  Shield,
  Users,
  Loader2,
  Phone,
  Mail,
} from 'lucide-react';

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState({}); // { [userId]: 'suspend' | 'remove' }

  /* ── helpers ─────────────────────────────────────── */
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
  };

  /* ── fetch all users ─────────────────────────────── */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  /* ── live search filter ──────────────────────────── */
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  /* ── suspend / unsuspend ─────────────────────────── */
  const handleSuspend = async (user) => {
    setActionLoading((prev) => ({ ...prev, [user._id]: 'suspend' }));
    try {
      const res = await fetch(`/api/users/${user._id}/suspend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to update user');
      const data = await res.json();
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isSuspended: data.isSuspended } : u
        )
      );
      toast.success(data.isSuspended ? `${user.name} suspended` : `${user.name} unsuspended`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [user._id]: null }));
    }
  };

  /* ── remove user ─────────────────────────────────── */
  const handleRemove = async (user) => {
    if (!window.confirm(`Remove "${user.name}" permanently? This cannot be undone.`)) return;
    setActionLoading((prev) => ({ ...prev, [user._id]: 'remove' }));
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to remove user');
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success(`${user.name} removed`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [user._id]: null }));
    }
  };

  /* ── avatar initials ─────────────────────────────── */
  const initials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || '?';

  /* ════════════════════════════════════════════════ */
  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7FA] font-sans">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8 py-10">

        {/* ── Search bar (top-center like screenshot) ── */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-[420px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-[13px] text-[#1e293b] placeholder-[#94a3b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5cb85c]/30 focus:border-[#5cb85c] transition-all"
            />
          </div>
        </div>

        {/* ── Page title ── */}
        <div className="flex items-center gap-3 mb-6">
          <Users size={22} className="text-[#1e293b]" />
          <h1 className="text-[26px] font-bold text-[#1e293b] tracking-tight">Manage Users</h1>
          <span className="ml-auto text-[12px] text-[#94a3b8] font-medium">
            {filtered.length} user{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Table header */}
          <div
            className="grid text-[13px] font-semibold text-[#475569]"
            style={{
              gridTemplateColumns: '1fr 1.6fr 1.2fr 1fr',
              background: '#8A99A8',
              color: '#1e293b',
              padding: '14px 24px',
            }}
          >
            <span>Users</span>
            <span>Email</span>
            <span>Phone number</span>
            <span className="text-right">Account Action</span>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-[#64748b]">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-[13px] font-medium">Loading users…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-[#94a3b8] text-[13px]">
              {searchQuery ? 'No users match your search.' : 'No users registered yet.'}
            </div>
          ) : (
            filtered.map((user, idx) => {
              const isBusy = !!actionLoading[user._id];
              return (
                <div
                  key={user._id}
                  className="grid items-center px-6 py-4 border-b border-slate-100 last:border-0 hover:bg-[#f8fafc] transition-colors"
                  style={{ gridTemplateColumns: '1fr 1.6fr 1.2fr 1fr' }}
                >
                  {/* Name + avatar */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
                      style={{
                        background: user.isSuspended
                          ? '#94a3b8'
                          : `hsl(${(idx * 47) % 360}, 60%, 52%)`,
                      }}
                    >
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        initials(user.name)
                      )}
                    </div>
                    <div>
                      <p className={`text-[13px] font-medium ${user.isSuspended ? 'text-[#94a3b8] line-through' : 'text-[#1e293b]'}`}>
                        {user.name}
                      </p>
                      {user.isSuspended && (
                        <span className="text-[10px] text-[#dc2626] font-semibold">Suspended</span>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-1.5 text-[13px] text-[#475569]">
                    <Mail size={12} className="text-[#94a3b8] flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-1.5 text-[13px] text-[#64748b]">
                    <Phone size={12} className="text-[#94a3b8] flex-shrink-0" />
                    <span>{user.phone || <span className="text-[#94a3b8] italic">Not set</span>}</span>
                  </div>

                  {/* Account Actions */}
                  <div className="flex items-center justify-end gap-2">
                    {/* Suspend / Unsuspend */}
                    <button
                      onClick={() => handleSuspend(user)}
                      disabled={isBusy}
                      title={user.isSuspended ? 'Unsuspend user' : 'Suspend user'}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-all active:scale-95 disabled:opacity-50 ${
                        user.isSuspended
                          ? 'bg-[#dbeafe] text-[#2563eb] hover:bg-[#bfdbfe]'
                          : 'bg-[#64748b] text-white hover:bg-[#475569]'
                      }`}
                    >
                      {actionLoading[user._id] === 'suspend' ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : user.isSuspended ? (
                        <Shield size={12} />
                      ) : (
                        <ShieldOff size={12} />
                      )}
                      {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(user)}
                      disabled={isBusy}
                      title="Remove user permanently"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-semibold bg-[#ef4444] text-white hover:bg-[#dc2626] transition-all active:scale-95 disabled:opacity-50"
                    >
                      {actionLoading[user._id] === 'remove' ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
