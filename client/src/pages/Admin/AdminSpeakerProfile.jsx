import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CalendarDays,
  ChevronRight,
  Loader2,
  Search,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminSpeakerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [speaker, setSpeaker] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── fetch speaker + all events ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spRes, evRes] = await Promise.all([
          fetch(`/api/speakers/${id}`),
          fetch('/api/events'),
        ]);
        if (!spRes.ok) throw new Error('Speaker not found');
        const spData = await spRes.json();
        setSpeaker(spData);
        if (evRes.ok) {
          const evData = await evRes.json();
          setEvents(evData);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || 'Failed to load speaker');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  /* ── derive upcoming / past events ── */
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const speakerEvents = events.filter((e) => {
    const name = speaker?.name?.toLowerCase() || '';
    return (
      e.speaker?.toLowerCase().includes(name) ||
      (speaker?.event && e.title?.toLowerCase().includes(speaker.event.toLowerCase()))
    );
  });

  const upcomingEvents = speakerEvents.filter((e) => new Date(e.date) >= now);
  const pastEvents = speakerEvents.filter((e) => new Date(e.date) < now);

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      });
    } catch { return iso; }
  };

  const firstName = speaker?.name?.split(' ')[0] || '';

  /* ── loading / error states ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Loader2 size={30} className="animate-spin text-[#5CB85C]" />
      </div>
    );
  }
  if (!speaker) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center text-slate-500 font-semibold">
        Speaker not found.
      </div>
    );
  }

  /* ════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-800">

      {/* ── Top search bar (matches AdminSpeakers header) ── */}
      <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-center sticky top-0 z-10 w-full">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            readOnly
            placeholder="Search events..."
            className="w-full bg-slate-50 border border-slate-100 text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none shadow-sm"
          />
        </div>
      </header>

      <div className="max-w-[860px] mx-auto px-6 py-7">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[13px] text-slate-500 font-medium">
            Speaker &nbsp;<span className="text-slate-400">›</span>&nbsp;
            <span className="text-slate-900 font-bold">ViewProfile</span>
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[#5CB85C] text-[13px] font-bold hover:text-green-700 transition"
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex gap-8 mb-6 items-start">
          {/* Avatar — square rounded */}
          <div
            className="w-[130px] h-[130px] rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-3xl font-extrabold shadow-sm"
            style={{ background: speaker.profilePic ? 'transparent' : '#d1e8ff' }}
          >
            {speaker.profilePic ? (
              <img
                src={speaker.profilePic}
                alt={speaker.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span style={{ color: '#4a90d9' }}>
                {(speaker.initials ||
                  speaker.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2))}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-start pt-1 flex-1">
            {/* Full name — large bold */}
            <h1 className="text-[34px] font-extrabold text-slate-900 leading-tight mb-1">
              {speaker.name}
            </h1>
            {/* Role in green */}
            <p className="text-[#5CB85C] font-semibold text-[16px] mb-3">
              {speaker.role}
            </p>
            {/* Bio */}
            <p className="text-slate-600 text-[14px] leading-relaxed">
              {speaker.bio ||
                `${speaker.name} is a distinguished expert in ${speaker.category?.toUpperCase()}. With extensive industry experience, they bring cutting-edge insights and practical knowledge to every session. A highly sought-after speaker and thought leader at top global conferences.`}
            </p>
          </div>
        </div>

        {/* ── Stats Card ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CalendarDays size={20} className="text-[#5CB85C]" />
            </div>
            <div>
              <p className="text-[26px] font-extrabold text-slate-900 leading-none">
                {speakerEvents.length || 1}
              </p>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5">Events Hosted</p>
            </div>
          </div>
        </div>

        {/* ── Upcoming Events ── */}
        <div className="mb-10">
          <h2 className="text-[22px] font-extrabold text-slate-900 leading-tight">
            Upcoming Events
          </h2>
          <p className="text-[11px] font-bold text-[#5CB85C] uppercase tracking-widest mb-5 mt-0.5">
            Don't miss {firstName}'s next live sessions
          </p>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                >
                  <div className="relative h-[130px] bg-[#1c2331] flex items-center justify-center">
                    {ev.coverImage ? (
                      <img
                        src={
                          ev.coverImage.startsWith('data:') || ev.coverImage.startsWith('http')
                            ? ev.coverImage
                            : `http://localhost:5000/${ev.coverImage.replace(/^\/+/, '')}`
                        }
                        alt={ev.title}
                        className="w-full h-full object-cover opacity-70"
                      />
                    ) : (
                      <span className="text-white/20 text-5xl font-black">
                        {ev.title?.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    {ev.category && (
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-white bg-[#3b07d8] px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        {ev.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] font-bold text-slate-900 mb-2">{ev.title}</p>
                    {ev.location && (
                      <div className="flex items-center gap-1.5 text-[11px] text-red-500 mb-1">
                        <MapPin size={11} /> <span>{ev.location}</span>
                      </div>
                    )}
                    {ev.date && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
                        <Calendar size={11} /> <span>{fmtDate(ev.date)}</span>
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/admin-view-details/${ev._id}`)}
                      className="w-full py-2 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback: show speaker's own event field */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <div className="h-[130px] bg-[#1c2331] flex items-center justify-center">
                  <span className="text-white/20 text-5xl font-black">
                    {speaker.event?.substring(0, 2).toUpperCase() || 'EV'}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[14px] font-bold text-slate-900 mb-1">{speaker.event}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar size={11} /> <span>{speaker.date}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Past Engagements ── */}
        <div>
          <h2 className="text-[22px] font-extrabold text-slate-900 mb-5">Past Engagements</h2>

          {pastEvents.length > 0 ? (
            <div className="flex flex-col gap-3">
              {pastEvents.map((ev) => (
                <div
                  key={ev._id}
                  onClick={() => navigate(`/admin-view-details/${ev._id}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1c2331] flex items-center justify-center flex-shrink-0">
                    <span className="text-white/60 text-sm font-bold">
                      {ev.title?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-slate-900">{ev.title}</p>
                  </div>
                  <div className="text-right mr-2">
                    <p className="text-[12px] font-semibold text-slate-700">{fmtDate(ev.date)}</p>
                    {ev.location && <p className="text-[11px] text-slate-400">{ev.location}</p>}
                  </div>
                  <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            /* Fallback */
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1c2331] flex items-center justify-center flex-shrink-0">
                  <span className="text-white/60 text-sm font-bold">
                    {speaker.event?.substring(0, 2).toUpperCase() || 'EV'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-slate-900">{speaker.event}</p>
                </div>
                <div className="text-right mr-2">
                  <p className="text-[12px] font-semibold text-slate-700">{speaker.date}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
