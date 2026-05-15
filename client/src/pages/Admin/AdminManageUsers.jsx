import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Loader2, ShieldOff, Shield, Trash2 } from 'lucide-react';

const getToken = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    return u?.token ?? '';
  } catch {
    return '';
  }
};

export default function AdminManageUsers() {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const handleSuspend = async (user) => {
    setActionLoading((p) => ({ ...p, [user._id]: 'suspend' }));
    try {
      const res = await fetch(`/api/users/${user._id}/suspend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setUsers((p) =>
        p.map((u) => (u._id === user._id ? { ...u, isSuspended: data.isSuspended } : u))
      );
      toast.success(data.isSuspended ? `${user.name} suspended` : `${user.name} unsuspended`);
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading((p) => ({ ...p, [user._id]: null }));
    }
  };

  const handleRemove = async (user) => {
    if (!window.confirm(`Remove "${user.name}" permanently?`)) return;
    setActionLoading((p) => ({ ...p, [user._id]: 'remove' }));
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed');
      setUsers((p) => p.filter((u) => u._id !== user._id));
      toast.success(`${user.name} removed`);
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading((p) => ({ ...p, [user._id]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-800 flex flex-col pb-12 w-full">

      {/* Sticky search header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-center sticky top-0 z-10 w-full shadow-sm">
        <div className="relative w-full max-w-lg group">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-slate-50 border border-slate-200 text-[13px] rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="flex-1 p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-500">

        {/* Page title */}
        <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-6">
          Manage Users
        </h1>

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1.5px solid #5b8abf' }}
        >
          {/* Header row */}
          <div
            className="grid text-[13px] font-medium text-[#1e293b]"
            style={{
              gridTemplateColumns: '1.6fr 2.2fr 1.6fr',
              background: '#8a99a8',
              padding: '11px 20px',
            }}
          >
            <span>Users</span>
            <span>Email</span>
            <span className="text-right">Account Action</span>
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 bg-white text-[#64748b]">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-[13px]">Loading users...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center text-[13px] text-[#94a3b8] bg-white">
              {searchQuery ? 'No users match your search.' : 'No users registered yet.'}
            </div>
          ) : (
            filtered.map((user) => {
              const isBusy = !!actionLoading[user._id];
              return (
                <div
                  key={user._id}
                  className="grid items-center border-t border-[#e2e8f0] transition-colors"
                  style={{
                    gridTemplateColumns: '1.6fr 2.2fr 1.6fr',
                    padding: '10px 20px',
                    backgroundColor: user.isSuspended ? '#fff5f5' : '#ffffff',
                  }}
                >
                  {/* Name */}
                  <span
                    className={`text-[13px] font-medium ${
                      user.isSuspended
                        ? 'text-[#e05252] line-through'
                        : 'text-[#374151]'
                    }`}
                  >
                    {user.name}
                    {user.isSuspended && (
                      <span className="ml-2 text-[10px] font-bold bg-[#e05252] text-white px-1.5 py-0.5 rounded no-underline" style={{ textDecoration: 'none' }}>
                        SUSPENDED
                      </span>
                    )}
                  </span>

                  {/* Email */}
                  <span className="text-[13px] text-[#374151] truncate pr-2">
                    {user.email}
                  </span>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2">
                    {/* Suspend / Unsuspend */}
                    <button
                      onClick={() => handleSuspend(user)}
                      disabled={isBusy}
                      title={user.isSuspended ? 'Unsuspend this user' : 'Suspend this user'}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all disabled:opacity-50 active:scale-95 ${
                        user.isSuspended
                          ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                          : 'bg-[#f59e0b] text-white hover:bg-[#d97706]'
                      }`}
                    >
                      {actionLoading[user._id] === 'suspend' ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : user.isSuspended ? (
                        <Shield size={11} />
                      ) : (
                        <ShieldOff size={11} />
                      )}
                      {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(user)}
                      disabled={isBusy}
                      title="Remove permanently"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[12px] font-semibold bg-[#e05252] text-white hover:bg-[#c94040] transition-all disabled:opacity-50 active:scale-95"
                    >
                      {actionLoading[user._id] === 'remove' ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Trash2 size={11} />
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
