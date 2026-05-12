import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';

/* ─── helper ─────────────────────────────────────────── */
const getToken = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    return u?.token ?? '';
  } catch {
    return '';
  }
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

/* ════════════════════════════════════════════════════ */
export default function AdminPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  /* ── fetch ─────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/events/payment-history', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch {
        // silently handled in empty state
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── filter + sort ─────────────────────────────── */
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return payments
      .filter((p) =>
        !q ||
        p.user?.name?.toLowerCase().includes(q) ||
        p.user?.email?.toLowerCase().includes(q) ||
        p.event?.title?.toLowerCase().includes(q) ||
        p.transaction_uuid?.toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [payments, searchQuery]);


  /* ════════════════════════════════════════════════ */
  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7FA] font-sans">

      {/* ── Top search bar ── */}
      <div className="flex justify-center px-6 pt-6 pb-2">
        <div className="relative w-full max-w-[340px]">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none"
          />
          <input
            id="payment-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payments..."
            className="w-full pl-8 pr-3 py-2 rounded-full border border-slate-300 bg-white text-[12px] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="w-full px-6 py-4">

        {/* ── Page title ── */}
        <h1 className="text-[28px] font-extrabold text-[#1a1a2e] tracking-tight mb-5">
          Payment History
        </h1>


        {/* ── Table ── */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1.5px solid #5b8abf' }}>

          {/* Header row */}
          <div
            className="grid text-[13px] font-medium text-[#1e293b]"
            style={{
              gridTemplateColumns: '1.6fr 2.4fr 2fr 1.2fr 1.4fr',
              background: '#8a99a8',
              padding: '11px 20px',
            }}
          >
            <span>Name</span>
            <span>Email</span>
            <span>Event Title</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 bg-white text-[#64748b]">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-[13px]">Loading payments…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center text-[13px] text-[#94a3b8] bg-white">
              {searchQuery ? 'No payments match your search.' : 'No completed payments found.'}
            </div>
          ) : (
            filtered.map((p, idx) => (
              <div
                key={p._id}
                className="grid items-center border-t border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors"
                style={{
                  gridTemplateColumns: '1.6fr 2.4fr 2fr 1.2fr 1.4fr',
                  padding: '11px 20px',
                  backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                }}
              >
                {/* Name */}
                <span className="text-[13px] font-medium text-[#374151] truncate pr-2">
                  {p.user?.name || 'Unknown'}
                </span>

                {/* Email */}
                <span className="text-[13px] text-[#374151] truncate pr-2">
                  {p.user?.email || '—'}
                </span>

                {/* Event Title */}
                <span className="text-[13px] text-[#374151] truncate pr-2">
                  {p.event?.title || 'Deleted Event'}
                </span>

                {/* Date */}
                <span className="text-[13px] text-[#374151]">
                  {formatDate(p.updatedAt)}
                </span>

                {/* Amount */}
                <span className="text-right">
                  <span className="inline-block bg-[#f0fdf4] text-[#16a34a] text-[12px] font-bold px-3 py-1 rounded-md">
                    Rs. {p.amount?.toLocaleString()}
                  </span>
                </span>
              </div>
            ))
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="border-t border-[#e2e8f0] bg-white px-5 py-3 flex items-center justify-between">
              <span className="text-[12px] text-[#94a3b8]">
                Showing {filtered.length} of {payments.length} transactions
              </span>
              <span className="text-[12px] font-bold text-[#374151]">
                Total: Rs. {filtered.reduce((s, p) => s + (p.amount || 0), 0).toLocaleString()}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
