import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, CreditCard, Calendar, MapPin, ReceiptText } from 'lucide-react';

const getToken = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    return u?.token ?? '';
  } catch {
    return '';
  }
};

const formatDate = (iso) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/events/payment-history', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return payments.filter((p) =>
      !q ||
      p.event?.title?.toLowerCase().includes(q) ||
      p.transaction_uuid?.toLowerCase().includes(q)
    );
  }, [payments, searchQuery]);

  return (
    <div className="flex-1 w-full min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Payment History</h1>
            <p className="text-slate-500 font-medium">Keep track of your event registrations and payments.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by event or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#5CB85C]/20 focus:border-[#5CB85C] outline-none transition-all text-slate-700"
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#5CB85C]">
              <CreditCard size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</p>
              <p className="text-2xl font-black text-slate-900">Rs. {payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
              <ReceiptText size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Transactions</p>
              <p className="text-2xl font-black text-slate-900">{payments.length}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-[#5CB85C] mb-4" size={40} />
            <p className="text-slate-500 font-bold">Loading your history...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ReceiptText className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No payments found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              {searchQuery ? "We couldn't find any transactions matching your search." : "You haven't made any paid event registrations yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((payment) => (
              <div 
                key={payment._id}
                className="group bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#5CB85C]/5 hover:border-[#5CB85C]/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex w-16 h-16 bg-slate-50 group-hover:bg-[#5CB85C]/10 rounded-2xl items-center justify-center text-slate-400 group-hover:text-[#5CB85C] transition-colors">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#5CB85C] transition-colors">
                      {payment.event?.title || 'Unknown Event'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                        <Calendar size={14} />
                        <span>{formatDate(payment.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                        <MapPin size={14} />
                        <span>{payment.event?.venue || 'Virtual'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-none pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Reference ID</p>
                    <p className="text-xs font-mono text-slate-600 truncate max-w-[120px]">{payment.transaction_uuid || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">Rs. {payment.amount?.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <div className="w-2 h-2 bg-[#5CB85C] rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black text-[#5CB85C] uppercase tracking-tighter">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
