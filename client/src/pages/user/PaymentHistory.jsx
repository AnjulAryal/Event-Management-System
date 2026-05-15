import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, CreditCard, Calendar, MapPin, ReceiptText } from 'lucide-react';
import UserPageContainer from '../../components/user/UserPageContainer';
import UserSearch from '../../components/user/UserSearch';
import UserPageHeader from '../../components/user/UserPageHeader';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <UserPageContainer
      isMobile={isMobile}
      header={
        <UserSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by event or transaction ID..."
        />
      }
    >
      <UserPageHeader
        title="Payment History"
        subtitle="Keep track of your event registrations and payments."
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#5CB85C]">
            <CreditCard size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</p>
            <p className="text-2xl font-black text-slate-900">
              Rs. {payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl flex items-center gap-5 border border-slate-100 shadow-sm">
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
            {searchQuery
              ? "We couldn't find any transactions matching your search."
              : "You haven't made any paid event registrations yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4 pb-6">
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
                  <p className="text-xs font-mono text-slate-600 truncate max-w-[120px]">
                    {payment.transaction_uuid || 'N/A'}
                  </p>
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
    </UserPageContainer>
  );
}
