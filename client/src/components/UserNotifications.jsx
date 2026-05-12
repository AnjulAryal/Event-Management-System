import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarClock,
  CalendarPlus,
  CheckCheck,
  MessageCircleReply,
  MessagesSquare,
  X,
} from 'lucide-react';

const typeConfig = {
  new_event: {
    icon: CalendarPlus,
    label: 'New Event',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  support_reply: {
    icon: MessageCircleReply,
    label: 'Support Reply',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  feedback_reply: {
    icon: MessagesSquare,
    label: 'Feedback Reply',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  upcoming_event: {
    icon: CalendarClock,
    label: 'Reminder',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
};

const formatTime = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Just now';

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const getNotificationMessage = (notification) => {
  if (notification.type === 'support_reply') {
    return 'Admin replied to your support request. Check your email to see the full reply.';
  }

  return notification.message;
};

export default function UserNotifications() {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  }, []);

  const fetchNotifications = useCallback(async ({ quiet = false } = {}) => {
    if (!user?.token) return;
    if (!quiet) setLoading(true);

    try {
      const res = await fetch('/api/notifications/user', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(Number(data.unreadCount) || 0);
    } catch {
      // Keep polling quiet to avoid interrupting user flows.
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchNotifications();
    const interval = window.setInterval(() => fetchNotifications({ quiet: true }), 15000);
    return () => window.clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const markRead = async (notification) => {
    if (!user?.token || notification.isRead) return;

    await fetch(`/api/notifications/${notification._id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
    });

    setNotifications((items) =>
      items.map((item) => item._id === notification._id ? { ...item, isRead: true } : item)
    );
    setUnreadCount((count) => Math.max(count - 1, 0));
  };

  const markAllRead = async () => {
    if (!user?.token || unreadCount === 0) return;

    await fetch('/api/notifications/user/read-all', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
    });

    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
  };

  const openNotification = async (notification) => {
    await markRead(notification);
    setOpen(false);

    if (notification.type === 'support_reply') {
      navigate('/help');
      return;
    }

    if (notification.type === 'feedback_reply') {
      navigate('/feedback');
      return;
    }

    if (notification.event) {
      navigate(`/event-details/${notification.event}`);
      return;
    }

    navigate('/all-events');
  };

  if (!user?.token || user?.isAdmin) return null;

  return (
    <div ref={panelRef} className="fixed right-5 top-3 z-[180] md:right-9">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#5CB85C] hover:text-[#5CB85C] focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/30"
        aria-label="User notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#5CB85C] px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-950">Notifications</h2>
              <p className="text-xs font-semibold text-slate-500">
                {unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` : 'All caught up'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#5CB85C] disabled:cursor-not-allowed disabled:opacity-40"
                title="Mark all as read"
                aria-label="Mark all notifications as read"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[440px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm font-semibold text-slate-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm font-semibold text-slate-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => {
                const config = typeConfig[notification.type] || typeConfig.new_event;
                const Icon = config.icon;

                return (
                  <button
                    type="button"
                    key={notification._id}
                    onClick={() => openNotification(notification)}
                    className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${notification.isRead ? 'bg-white' : 'bg-[#5CB85C]/5'}`}
                  >
                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.bg} ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-sm font-extrabold text-slate-950">{notification.title}</span>
                        {!notification.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5CB85C]" />}
                      </span>
                      <span className="mt-1 block text-sm font-semibold leading-5 text-slate-600">
                        {getNotificationMessage(notification)}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-slate-400">
                        <span>{config.label}</span>
                        <span>|</span>
                        <span>{formatTime(notification.createdAt)}</span>
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
