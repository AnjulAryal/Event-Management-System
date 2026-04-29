import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  HelpCircle,
  Clock,
  CheckCircle,
  X,
  Send,
  Bold,
  Italic,
  List,
  AlignLeft,
  Mail,
  Loader2,
} from 'lucide-react';

/* ─── small rich-text helpers ─────────────────────────────────────────── */
function applyFormat(textarea, format) {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const selected = value.substring(s, e) || 'text';
  const wrappers = { bold: ['**', '**'], italic: ['_', '_'] };
  let replacement = '';

  if (format === 'ul') {
    replacement = selected
      .split('\n')
      .map((l) => `• ${l}`)
      .join('\n');
  } else if (format === 'ol') {
    replacement = selected
      .split('\n')
      .map((l, i) => `${i + 1}. ${l}`)
      .join('\n');
  } else {
    const [pre, post] = wrappers[format];
    replacement = `${pre}${selected}${post}`;
  }
  return value.substring(0, s) + replacement + value.substring(e);
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function AdminHelpSupport() {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Reply modal state */
  const [activeReply, setActiveReply] = useState(null); // the ticket object
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);

  /* ── fetch tickets ──────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const res = await fetch('/api/support', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch support requests');
        const data = await res.json();
        setSupportRequests(data);
      } catch (error) {
        console.error('Error fetching support requests:', error);
        toast.error('Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchSupportRequests();
  }, []);

  /* ── open reply modal ───────────────────────────────────────────────── */
  const openReply = (ticket) => {
    setActiveReply(ticket);
    setReplyText('');
  };

  /* ── send reply ─────────────────────────────────────────────────────── */
  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message.');
      return;
    }
    setSending(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      const res = await fetch(`/api/support/${activeReply._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ replyMessage: replyText }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to send reply');
      }

      /* Update ticket status locally to 'resolved' */
      setSupportRequests((prev) =>
        prev.map((r) =>
          r._id === activeReply._id ? { ...r, status: 'resolved' } : r
        )
      );

      toast.success(`Reply sent to ${activeReply.email}`);
      setActiveReply(null);
      setReplyText('');
    } catch (error) {
      console.error('Reply error:', error);
      toast.error(error.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  /* ── remove ticket ──────────────────────────────────────────────────── */
  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this support ticket?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      const res = await fetch(`/api/support/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete request');
      setSupportRequests((prev) => prev.filter((req) => req._id !== id));
      toast.success('Ticket removed successfully');
    } catch (error) {
      console.error('Error deleting support request:', error);
      toast.error('Failed to remove ticket');
    }
  };

  /* ── format toolbar action ──────────────────────────────────────────── */
  const handleFormat = (format) => {
    if (!textareaRef.current) return;
    const newVal = applyFormat(textareaRef.current, format);
    setReplyText(newVal);
    textareaRef.current.focus();
  };

  /* ── date helpers ───────────────────────────────────────────────────── */
  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  /* ════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7FA] p-6 sm:p-8 md:p-12 lg:p-16 font-sans">
      <div className="max-w-[1100px] mx-auto">

        {/* Page header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-[28px] md:text-3xl font-bold text-[#1e293b] mb-1 tracking-tight">
            Help &amp; Support
          </h1>
          <p className="text-[#64748b] text-sm md:text-base font-medium">
            Browse FAQs or get in touch with our team.
          </p>
        </div>

        {/* ── Tickets grid ── */}
        {loading ? (
          <div className="py-8 text-center text-[#64748b] animate-pulse font-medium">
            Loading support requests…
          </div>
        ) : supportRequests.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {supportRequests.map((card, idx) => (
              <div
                key={card._id || idx}
                className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md"
              >
                {/* Status badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
                      <HelpCircle size={18} className="text-[#16a34a]" />
                    </div>
                    <span className="text-[#1e293b] text-[14px] font-semibold break-all">
                      {card.email}
                    </span>
                  </div>
                  {card.status === 'resolved' ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#16a34a] bg-[#dcfce7] px-2.5 py-1 rounded-full">
                      <CheckCircle size={12} /> Resolved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#d97706] bg-[#fef3c7] px-2.5 py-1 rounded-full">
                      <Clock size={12} /> Pending
                    </span>
                  )}
                </div>

                {/* Message */}
                <p className="text-[#64748b] text-[13px] leading-relaxed px-1">
                  "{card.message}"
                </p>

                {/* Timestamp */}
                <div className="flex items-center gap-4 text-[11px] text-[#94a3b8]">
                  <span>📅 {fmtDate(card.createdAt)}</span>
                  <span>🕐 {fmtTime(card.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end mt-1">
                  <button
                    onClick={() => openReply(card)}
                    className="flex items-center gap-1.5 bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 text-white text-[12px] font-bold py-1.5 px-5 rounded-full transition-all shadow-sm"
                  >
                    <Send size={12} /> Reply
                  </button>
                  <button
                    onClick={() => handleRemove(card._id)}
                    className="flex items-center gap-1.5 bg-[#f1f5f9] hover:bg-[#fee2e2] text-[#64748b] hover:text-[#dc2626] text-[12px] font-bold py-1.5 px-5 rounded-full transition-all"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-[#64748b] bg-white rounded-2xl border border-dashed border-slate-200">
            No support requests found.
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          REPLY MODAL  (matches the screenshot design)
      ══════════════════════════════════════════════════════════════════ */}
      {activeReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}>

          <div className="bg-white w-full max-w-[680px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <p className="text-[11px] text-[#94a3b8] font-medium mb-0.5">
                  Help &amp; Support › Reply
                </p>
                <h2 className="text-[20px] font-bold text-[#1e293b] tracking-tight">Reply</h2>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  Review and respond to active user queries to maintain high satisfaction scores.
                </p>
              </div>
              <button
                onClick={() => setActiveReply(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-[#64748b] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* User message card */}
            <div className="px-6 pt-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#dbeafe] flex items-center justify-center">
                      <span className="text-[#2563eb] text-[13px] font-bold uppercase">
                        {activeReply.name?.[0] || activeReply.email?.[0] || 'U'}
                      </span>
                    </div>
                    <span className="text-[13px] font-semibold text-[#1e293b]">
                      {activeReply.email}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#d97706] bg-[#fef3c7] px-2.5 py-1 rounded-full">
                    <Clock size={11} /> Pending Response
                  </span>
                </div>

                <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
                  User Message
                </p>
                <p className="text-[#475569] text-[14px] leading-relaxed italic mb-3">
                  "{activeReply.message}"
                </p>

                <div className="flex items-center gap-5 text-[11px] text-[#94a3b8]">
                  <span>📅 {fmtDate(activeReply.createdAt)}</span>
                  <span>🕐 {fmtTime(activeReply.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Reply composer */}
            <div className="px-6 pt-5 pb-4">
              <p className="text-[13px] font-semibold text-[#1e293b] mb-2">Your Response</p>

              {/* Toolbar */}
              <div className="flex items-center gap-1 border border-slate-200 rounded-t-lg px-3 py-2 bg-[#f8fafc]">
                {[
                  { icon: <Bold size={14} />, action: 'bold', title: 'Bold' },
                  { icon: <Italic size={14} />, action: 'italic', title: 'Italic' },
                  { icon: <List size={14} />, action: 'ul', title: 'Bullet List' },
                  { icon: <AlignLeft size={14} />, action: 'ol', title: 'Numbered List' },
                ].map(({ icon, action, title }) => (
                  <button
                    key={action}
                    title={title}
                    onMouseDown={(e) => { e.preventDefault(); handleFormat(action); }}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-[#475569] transition-all"
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here…"
                rows={6}
                className="w-full border border-t-0 border-slate-200 rounded-b-lg px-4 py-3 text-[14px] text-[#1e293b] placeholder-[#94a3b8] resize-none focus:outline-none focus:ring-2 focus:ring-[#22c55e]/30 focus:border-[#22c55e] transition-all"
              />
            </div>

            {/* Footer actions */}
            <div className="px-6 pb-5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
                <Mail size={12} />
                This reply will be sent to the user's registered email.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveReply(null)}
                  className="px-5 py-2 rounded-full border border-slate-200 text-[13px] font-medium text-[#64748b] hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={sending}
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-white text-[13px] font-bold shadow-sm active:scale-95 transition-all"
                >
                  {sending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  {sending ? 'Sending…' : 'Send Reply'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
