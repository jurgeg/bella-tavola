'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Booking } from '@/lib/supabase';
import { RESTAURANT } from '@/lib/constants';

type StatusType = 'confirmed' | 'cancelled' | 'no-show' | 'completed';
type ViewMode = 'calendar' | 'list' | 'timeline';

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-900/30 text-green-400 border-green-800',
  cancelled: 'bg-red-900/30 text-red-400 border-red-800',
  'no-show': 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
  completed: 'bg-blue-900/30 text-blue-400 border-blue-800',
};

const statusIcons: Record<string, string> = {
  confirmed: '✓',
  cancelled: '✕',
  'no-show': '⚠',
  completed: '★',
};

// Realistic demo data - a busy Saturday
function generateDemoBookings(): Booking[] {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const day3 = new Date(today); day3.setDate(today.getDate() + 2);
  const day3Str = day3.toISOString().split('T')[0];
  const day4 = new Date(today); day4.setDate(today.getDate() + 3);
  const day4Str = day4.toISOString().split('T')[0];
  const day5 = new Date(today); day5.setDate(today.getDate() + 5);
  const day5Str = day5.toISOString().split('T')[0];
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const day_2 = new Date(today); day_2.setDate(today.getDate() - 2);
  const day_2Str = day_2.toISOString().split('T')[0];

  return [
    // Today - Lunch
    { id: 'd1', date: todayStr, time: '12:00', party_size: 2, guest_name: 'Margaret Thompson', guest_email: 'margaret.t@gmail.com', guest_phone: '+44 7700 112233', occasion: 'None', status: 'completed', special_requests: '', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'd2', date: todayStr, time: '12:30', party_size: 4, guest_name: 'Oliver & Sophie Bennett', guest_email: 'oliver.bennett@outlook.com', guest_phone: '+44 7911 223344', occasion: 'Anniversary', status: 'completed', special_requests: 'Window table if possible. 5th wedding anniversary.', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'd3', date: todayStr, time: '13:00', party_size: 3, guest_name: 'Richard Patel', guest_email: 'r.patel@company.co.uk', guest_phone: '+44 7850 334455', occasion: 'Business Dinner', status: 'completed', special_requests: 'Quiet corner preferred — client meeting', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'd4', date: todayStr, time: '13:30', party_size: 2, guest_name: 'Lucy Chen', guest_email: 'lucy.c@icloud.com', guest_phone: '+44 7734 445566', occasion: 'None', status: 'no-show', special_requests: '', created_at: new Date(Date.now() - 86400000 * 1).toISOString() },

    // Today - Dinner (the busy part)
    { id: 'd5', date: todayStr, time: '18:00', party_size: 2, guest_name: 'James & Emma Wright', guest_email: 'jwright@gmail.com', guest_phone: '+44 7900 556677', occasion: 'Date Night', status: 'confirmed', special_requests: '', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'd6', date: todayStr, time: '18:30', party_size: 6, guest_name: 'Sarah Mitchell', guest_email: 'sarah.m@hotmail.com', guest_phone: '+44 7456 667788', occasion: 'Birthday', status: 'confirmed', special_requests: 'Birthday cake at 8:30pm please! Candles + sparkler. Name: Sarah. She loves tiramisu.', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: 'd7', date: todayStr, time: '19:00', party_size: 4, guest_name: 'Marco & Isabella Rossi', guest_email: 'marco.rossi@gmail.com', guest_phone: '+44 7811 778899', occasion: 'None', status: 'confirmed', special_requests: 'One guest is coeliac — needs gluten-free options', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'd8', date: todayStr, time: '19:00', party_size: 2, guest_name: 'David Park', guest_email: 'dpark@yahoo.com', guest_phone: '+44 7623 889900', occasion: 'None', status: 'confirmed', special_requests: '', created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'd9', date: todayStr, time: '19:30', party_size: 8, guest_name: 'The Henderson Party', guest_email: 'claire.henderson@outlook.com', guest_phone: '+44 7700 990011', occasion: 'Celebration', status: 'confirmed', special_requests: 'Chef\'s table booked. One vegan, one vegetarian. Prosecco on arrival please — will pay on the night.', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'd10', date: todayStr, time: '20:00', party_size: 2, guest_name: 'Tom Harris', guest_email: 'tom.h@proton.me', guest_phone: '+44 7555 001122', occasion: 'Date Night', status: 'confirmed', special_requests: 'Proposing tonight! Can you put the ring in a dessert? Will call ahead.', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'd11', date: todayStr, time: '20:30', party_size: 4, guest_name: 'Aisha & Mohammed Khan', guest_email: 'aisha.khan@gmail.com', guest_phone: '+44 7444 112233', occasion: 'None', status: 'confirmed', special_requests: 'No alcohol in any dishes please. Halal options?', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'd12', date: todayStr, time: '21:00', party_size: 3, guest_name: 'Rebecca Foster', guest_email: 'bex.foster@gmail.com', guest_phone: '+44 7333 223344', occasion: 'None', status: 'confirmed', special_requests: 'Late seating — is the kitchen still open?', created_at: new Date(Date.now() - 86400000 * 1).toISOString() },

    // Tomorrow
    { id: 'd13', date: tomorrowStr, time: '12:30', party_size: 2, guest_name: 'Patricia Morgan', guest_email: 'pat.morgan@btinternet.com', guest_phone: '+44 7222 334455', occasion: 'None', status: 'confirmed', special_requests: 'Wheelchair access needed', created_at: new Date().toISOString() },
    { id: 'd14', date: tomorrowStr, time: '18:00', party_size: 5, guest_name: 'George & Family', guest_email: 'george@email.com', guest_phone: '+44 7111 445566', occasion: 'None', status: 'confirmed', special_requests: '2 children (ages 4 and 7). Highchair needed.', created_at: new Date().toISOString() },
    { id: 'd15', date: tomorrowStr, time: '19:00', party_size: 2, guest_name: 'Charlotte Adams', guest_email: 'charlotte.a@gmail.com', guest_phone: '+44 7999 556677', occasion: 'Anniversary', status: 'confirmed', special_requests: '', created_at: new Date().toISOString() },
    { id: 'd16', date: tomorrowStr, time: '19:30', party_size: 4, guest_name: 'Daniel & Friends', guest_email: 'dan.w@outlook.com', guest_phone: '+44 7888 667788', occasion: 'None', status: 'confirmed', special_requests: '', created_at: new Date().toISOString() },
    { id: 'd17', date: tomorrowStr, time: '20:00', party_size: 6, guest_name: 'Williams Corporate', guest_email: 'events@williamscorp.com', guest_phone: '+44 20 7946 0852', occasion: 'Business Dinner', status: 'confirmed', special_requests: 'Private area preferred. Need to present during dinner — laptop setup?', created_at: new Date().toISOString() },

    // Day 3
    { id: 'd18', date: day3Str, time: '19:00', party_size: 2, guest_name: 'Hannah Lewis', guest_email: 'hannah.l@gmail.com', guest_phone: '+44 7777 778899', occasion: 'Date Night', status: 'confirmed', special_requests: '', created_at: new Date().toISOString() },
    { id: 'd19', date: day3Str, time: '20:00', party_size: 4, guest_name: 'Robert & Jane Clark', guest_email: 'rclark@yahoo.co.uk', guest_phone: '+44 7666 889900', occasion: 'None', status: 'confirmed', special_requests: 'Nut allergy (severe) — one guest', created_at: new Date().toISOString() },

    // Day 4
    { id: 'd20', date: day4Str, time: '18:30', party_size: 3, guest_name: 'Elena Petrova', guest_email: 'elena.p@gmail.com', guest_phone: '+44 7555 990011', occasion: 'Birthday', status: 'confirmed', special_requests: 'Surprise birthday — please don\'t mention until dessert!', created_at: new Date().toISOString() },

    // Day 5
    { id: 'd21', date: day5Str, time: '19:00', party_size: 10, guest_name: 'Sevenoaks Rugby Club', guest_email: 'events@sevenoaksrfc.co.uk', guest_phone: '+44 7444 001122', occasion: 'Celebration', status: 'confirmed', special_requests: 'End of season dinner. Set menu discussed on phone — Marco has details. Budget: £40pp', created_at: new Date().toISOString() },

    // Yesterday (completed/no-shows for history)
    { id: 'd22', date: yesterdayStr, time: '19:00', party_size: 4, guest_name: 'Andrew Taylor', guest_email: 'andy.t@gmail.com', guest_phone: '+44 7333 112233', occasion: 'None', status: 'completed', special_requests: '', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'd23', date: yesterdayStr, time: '19:30', party_size: 2, guest_name: 'Lisa Nguyen', guest_email: 'lisa.n@outlook.com', guest_phone: '+44 7222 223344', occasion: 'Date Night', status: 'completed', special_requests: '', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'd24', date: yesterdayStr, time: '20:00', party_size: 3, guest_name: 'Michael O\'Brien', guest_email: 'mob@gmail.com', guest_phone: '+44 7111 334455', occasion: 'None', status: 'no-show', special_requests: '', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'd25', date: yesterdayStr, time: '20:30', party_size: 6, guest_name: 'The Cooper Family', guest_email: 'jcooper@btinternet.com', guest_phone: '+44 7999 445566', occasion: 'Birthday', status: 'completed', special_requests: 'Grandad\'s 70th — brought own cake', created_at: new Date(Date.now() - 86400000 * 6).toISOString() },

    // 2 days ago
    { id: 'd26', date: day_2Str, time: '19:00', party_size: 2, guest_name: 'Sophie Grant', guest_email: 'sophieg@gmail.com', guest_phone: '+44 7888 556677', occasion: 'None', status: 'completed', special_requests: '', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'd27', date: day_2Str, time: '19:30', party_size: 4, guest_name: 'Ryan & Kate Murphy', guest_email: 'rmurphy@yahoo.com', guest_phone: '+44 7777 667788', occasion: 'Anniversary', status: 'completed', special_requests: 'Complimentary prosecco — loyalty guests (5th visit)', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  ];
}

// Tour steps
const TOUR_STEPS = [
  { target: 'stats', title: 'At a Glance', desc: 'See today\'s bookings, covers, and trends instantly. Know exactly how busy your restaurant is.' },
  { target: 'search', title: 'Find Any Booking', desc: 'Search by guest name, phone number, email, or occasion. Find anyone in seconds.' },
  { target: 'views', title: '3 Ways to View', desc: 'Calendar for the big picture. List for details. Timeline to manage your evening service.' },
  { target: 'calendar', title: 'Your Calendar', desc: 'See which days are busy at a glance. Coloured dots show booking density. Click any date to see details.' },
  { target: 'booking', title: 'Manage Bookings', desc: 'Click any booking to view details, edit, change status, or contact the guest directly.' },
  { target: 'add', title: 'Add Walk-ins & Phone Bookings', desc: 'Quickly add bookings from phone calls or walk-ins. Track the source so you know where your customers come from.' },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}
function fmtDateLong(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DemoPage() {
  const [bookings, setBookings] = useState<Booking[]>(generateDemoBookings);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [showBookingDetail, setShowBookingDetail] = useState<Booking | null>(null);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(true);
  const [newBooking, setNewBooking] = useState({
    guest_name: '', guest_phone: '', guest_email: '', party_size: 2,
    date: new Date().toISOString().split('T')[0], time: '19:00',
    occasion: 'None', special_requests: '', source: 'phone',
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const TIME_SLOTS = ['12:00','12:30','13:00','13:30','14:00','14:30','15:00','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'];

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateStatus = useCallback((id: string, status: StatusType) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    showNotification(`Booking marked as ${status}`);
    setShowBookingDetail(null);
  }, []);

  const deleteBooking = useCallback((id: string) => {
    if (!confirm('Delete this booking?')) return;
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showNotification('Booking deleted');
    setShowBookingDetail(null);
  }, []);

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const b: Booking = {
      id: `new-${Date.now()}`, date: newBooking.date, time: newBooking.time,
      party_size: newBooking.party_size, guest_name: newBooking.guest_name,
      guest_phone: newBooking.guest_phone, guest_email: newBooking.guest_email,
      occasion: newBooking.occasion, special_requests: newBooking.special_requests,
      status: 'confirmed', created_at: new Date().toISOString(),
    };
    setBookings((prev) => [...prev, b].sort((a, b2) => a.date.localeCompare(b2.date) || a.time.localeCompare(b2.time)));
    setShowAddBooking(false);
    setNewBooking({ guest_name: '', guest_phone: '', guest_email: '', party_size: 2, date: todayStr, time: '19:00', occasion: 'None', special_requests: '', source: 'phone' });
    showNotification('Booking added');
  };

  const handleEditBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    setBookings((prev) => prev.map((b) => b.id === editingBooking.id ? editingBooking : b));
    setEditingBooking(null);
    setShowBookingDetail(null);
    showNotification('Booking updated');
  };

  const searchFiltered = useMemo(() => {
    let result = bookings;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => b.guest_name.toLowerCase().includes(q) || b.guest_phone?.toLowerCase().includes(q) || b.guest_email?.toLowerCase().includes(q) || b.occasion?.toLowerCase().includes(q) || b.special_requests?.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter((b) => b.status === statusFilter);
    return result;
  }, [bookings, searchQuery, statusFilter]);

  const selectedDateBookings = useMemo(() => searchFiltered.filter((b) => b.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)), [searchFiltered, selectedDate]);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, { count: number; covers: number; statuses: string[] }> = {};
    bookings.forEach((b) => {
      if (!map[b.date]) map[b.date] = { count: 0, covers: 0, statuses: [] };
      map[b.date].count++;
      map[b.date].covers += b.party_size;
      map[b.date].statuses.push(b.status || 'confirmed');
    });
    return map;
  }, [bookings]);

  const todayBookings = bookings.filter((b) => b.date === todayStr);
  const totalCoversToday = todayBookings.reduce((s, b) => s + b.party_size, 0);
  const confirmedToday = todayBookings.filter((b) => b.status === 'confirmed').length;
  const upcomingBookings = bookings.filter((b) => b.date >= todayStr && b.status === 'confirmed');
  const thisWeekCovers = bookings.filter((b) => { const diff = (new Date(b.date).getTime() - Date.now()) / 86400000; return diff >= 0 && diff < 7; }).reduce((s, b) => s + b.party_size, 0);

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
  const monthName = new Date(calendarYear, calendarMonth).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const prevMonth = () => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); } else setCalendarMonth(calendarMonth - 1); };
  const nextMonth = () => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); } else setCalendarMonth(calendarMonth + 1); };
  const goToToday = () => { setCalendarMonth(new Date().getMonth()); setCalendarYear(new Date().getFullYear()); setSelectedDate(todayStr); };

  const timelineHours = ['12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];

  return (
    <div className="min-h-screen bg-bg">
      {/* Tour overlay */}
      <AnimatePresence>
        {showTour && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-bg-card border border-gold/30 w-full max-w-md p-8 text-center">
              <div className="flex justify-center gap-1 mb-6">
                {TOUR_STEPS.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === tourStep ? 'bg-gold w-6' : i < tourStep ? 'bg-gold/50' : 'bg-border'}`} />
                ))}
              </div>
              <p className="text-gold text-xs tracking-widest uppercase mb-2">
                {tourStep + 1} of {TOUR_STEPS.length}
              </p>
              <h2 className="font-serif text-2xl text-cream mb-3">{TOUR_STEPS[tourStep].title}</h2>
              <p className="text-text-muted text-sm leading-relaxed mb-8">{TOUR_STEPS[tourStep].desc}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowTour(false)}
                  className="flex-1 py-3 text-text-dim border border-border hover:border-gold/30 text-sm transition-all min-h-[44px]">
                  Skip Tour
                </button>
                {tourStep < TOUR_STEPS.length - 1 ? (
                  <button onClick={() => setTourStep(tourStep + 1)}
                    className="flex-1 py-3 bg-gold text-bg font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-all min-h-[44px]">
                    Next →
                  </button>
                ) : (
                  <button onClick={() => setShowTour(false)}
                    className="flex-1 py-3 bg-gold text-bg font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-all min-h-[44px]">
                    Start Exploring ✓
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[60] px-6 py-3 border text-sm ${notification.type === 'success' ? 'bg-green-900/90 text-green-300 border-green-700' : 'bg-red-900/90 text-red-300 border-red-700'}`}>
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo banner */}
      <div className="bg-gold/10 border-b border-gold/30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gold text-sm font-medium">🎯 Interactive Demo</span>
          <span className="text-text-dim text-xs">Everything works — click around, add bookings, manage your restaurant</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setShowTour(true); setTourStep(0); }}
            className="text-gold text-xs hover:underline">Restart Tour</button>
          <Link href="/" className="text-text-dim text-xs hover:text-cream transition-colors">← Back to Restaurant Site</Link>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-bg-card sticky top-0 z-40" data-tour="header">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-xl text-gold">{RESTAURANT.name}</Link>
            <span className="text-text-dim text-xs tracking-widest uppercase bg-bg-elevated px-3 py-1 border border-border">Admin</span>
          </div>
          <div className="flex items-center gap-3" data-tour="add">
            <button onClick={() => setShowAddBooking(true)}
              className="px-4 py-2 bg-gold text-bg text-sm font-medium tracking-widest uppercase hover:bg-gold-light transition-all min-h-[44px]">
              + Add Booking
            </button>
            <button onClick={() => { setBookings(generateDemoBookings()); showNotification('Demo data refreshed'); }}
              className="px-3 py-2 text-text-dim border border-border hover:border-gold/30 text-sm transition-all min-h-[44px]">↻ Reset Demo</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6" data-tour="stats">
          {[
            { label: "Today's Bookings", value: todayBookings.length, sub: `${confirmedToday} confirmed`, accent: true },
            { label: 'Covers Today', value: totalCoversToday, sub: 'of 45 capacity', accent: false },
            { label: 'This Week', value: upcomingBookings.length, sub: `${thisWeekCovers} covers`, accent: false },
            { label: 'No-Shows (30d)', value: bookings.filter(b => b.status === 'no-show').length, sub: `${((bookings.filter(b => b.status === 'no-show').length / bookings.length) * 100).toFixed(0)}% rate`, accent: false },
            { label: 'Avg Party Size', value: bookings.length > 0 ? (bookings.reduce((s, b) => s + b.party_size, 0) / bookings.length).toFixed(1) : '0', sub: 'all time', accent: false },
          ].map((stat) => (
            <div key={stat.label} className="bg-bg-card border border-border p-4">
              <p className="text-text-dim text-[10px] tracking-widest uppercase mb-1">{stat.label}</p>
              <p className={`font-serif text-2xl ${stat.accent ? 'text-gold' : 'text-cream'}`}>{stat.value}</p>
              <p className="text-text-dim text-[10px] mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1" data-tour="search">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">🔍</span>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, occasion..."
              className="w-full bg-bg-card border border-border pl-10 pr-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none transition-colors text-sm" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-cream">✕</button>}
          </div>
          <div className="flex border border-border" data-tour="views">
            {(['calendar', 'list', 'timeline'] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-4 py-2 text-sm capitalize min-h-[44px] transition-all ${viewMode === v ? 'bg-gold/15 text-gold' : 'text-text-dim hover:text-cream'}`}>
                {v === 'calendar' ? '📅' : v === 'list' ? '📋' : '⏱️'} {v}
              </button>
            ))}
          </div>
          <div className="flex border border-border">
            {['all', 'confirmed', 'completed', 'cancelled', 'no-show'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs capitalize min-h-[44px] transition-all ${statusFilter === s ? 'bg-gold/15 text-gold' : 'text-text-dim hover:text-cream'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {searchQuery && <p className="text-text-dim text-sm mb-4">Found <span className="text-gold">{searchFiltered.length}</span> booking{searchFiltered.length !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;</p>}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6" data-tour="calendar">
            <div className="bg-bg-card border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <button onClick={prevMonth} className="text-text-dim hover:text-cream px-3 py-1 min-h-[44px]">←</button>
                <div className="text-center">
                  <h2 className="font-serif text-lg text-cream">{monthName}</h2>
                  <button onClick={goToToday} className="text-gold text-xs hover:underline">Today</button>
                </div>
                <button onClick={nextMonth} className="text-text-dim hover:text-cream px-3 py-1 min-h-[44px]">→</button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 mb-2">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
                    <div key={d} className="text-center text-text-dim text-[10px] tracking-widest uppercase py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = dateStr === todayStr;
                    const isSelected = dateStr === selectedDate;
                    const dayData = bookingsByDate[dateStr];
                    const isPast = dateStr < todayStr;
                    return (
                      <button key={day} onClick={() => setSelectedDate(dateStr)}
                        className={`aspect-square p-1 flex flex-col items-center justify-center gap-0.5 transition-all relative border ${isSelected ? 'border-gold bg-gold/10' : isToday ? 'border-gold/30 bg-gold/5' : 'border-transparent hover:border-border'} ${isPast ? 'opacity-50' : ''}`}>
                        <span className={`text-sm ${isToday ? 'text-gold font-bold' : isSelected ? 'text-cream' : 'text-text-muted'}`}>{day}</span>
                        {dayData && (
                          <div className="flex gap-0.5 items-center">
                            <span className={`text-[9px] font-medium ${dayData.count >= 5 ? 'text-red-400' : dayData.count >= 3 ? 'text-yellow-400' : 'text-green-400'}`}>{dayData.count}</span>
                            <div className="flex gap-px">
                              {dayData.statuses.slice(0, 5).map((s, si) => (
                                <div key={si} className={`w-1 h-1 rounded-full ${s === 'confirmed' ? 'bg-green-400' : s === 'completed' ? 'bg-blue-400' : s === 'cancelled' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-bg-card border border-border" data-tour="booking">
              <div className="p-4 border-b border-border">
                <h3 className="font-serif text-lg text-cream">{fmtDateLong(selectedDate)}</h3>
                <p className="text-text-dim text-xs mt-1">{selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''} · {selectedDateBookings.reduce((s, b) => s + b.party_size, 0)} covers</p>
              </div>
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {selectedDateBookings.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-text-dim text-sm">No bookings for this date</p>
                    <button onClick={() => { setNewBooking({ ...newBooking, date: selectedDate }); setShowAddBooking(true); }} className="text-gold text-sm mt-2 hover:underline">+ Add one</button>
                  </div>
                ) : selectedDateBookings.map((booking) => (
                  <button key={booking.id} onClick={() => setShowBookingDetail(booking)} className="w-full text-left p-4 hover:bg-bg-elevated transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif text-lg text-gold">{booking.time}</span>
                      <span className={`text-[10px] px-2 py-0.5 border ${statusColors[booking.status || 'confirmed']}`}>{booking.status}</span>
                    </div>
                    <p className="text-cream text-sm font-medium">{booking.guest_name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-text-dim text-xs">👥 {booking.party_size}</span>
                      {booking.occasion && booking.occasion !== 'None' && <span className="text-text-dim text-xs">{booking.occasion}</span>}
                      <span className="text-text-dim text-xs">{booking.guest_phone}</span>
                    </div>
                    {booking.special_requests && <p className="text-text-dim text-[11px] mt-1 italic truncate">&quot;{booking.special_requests}&quot;</p>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            <div className="hidden md:grid grid-cols-[100px_140px_1fr_120px_80px_100px_150px] gap-3 px-4 py-2 text-text-dim text-[10px] tracking-widest uppercase border-b border-border">
              <span>Time</span><span>Date</span><span>Guest</span><span>Phone</span><span>Party</span><span>Status</span><span>Actions</span>
            </div>
            {searchFiltered.length === 0 ? (
              <div className="text-center py-20"><p className="text-text-dim">No bookings found.</p></div>
            ) : searchFiltered.map((booking) => (
              <div key={booking.id} className="bg-bg-card border border-border hover:border-gold/20 transition-all cursor-pointer" onClick={() => setShowBookingDetail(booking)}>
                <div className="grid grid-cols-1 md:grid-cols-[100px_140px_1fr_120px_80px_100px_150px] gap-3 p-4 items-center">
                  <span className="font-serif text-lg text-gold">{booking.time}</span>
                  <span className="text-text-muted text-sm">{fmtDate(booking.date)}</span>
                  <div><span className="text-cream text-sm font-medium">{booking.guest_name}</span>{booking.occasion && booking.occasion !== 'None' && <span className="text-gold/60 text-xs ml-2">{booking.occasion}</span>}</div>
                  <span className="text-text-dim text-xs">{booking.guest_phone}</span>
                  <span className="text-text-dim text-sm">👥 {booking.party_size}</span>
                  <span className={`text-[10px] px-2 py-0.5 border w-fit ${statusColors[booking.status || 'confirmed']}`}>{booking.status}</span>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    {booking.status === 'confirmed' && (
                      <>
                        <button onClick={() => updateStatus(booking.id!, 'completed')} className="px-2 py-1 text-xs text-green-400 border border-green-900 hover:bg-green-900/30 min-h-[32px]">✓</button>
                        <button onClick={() => updateStatus(booking.id!, 'no-show')} className="px-2 py-1 text-xs text-yellow-400 border border-yellow-900 hover:bg-yellow-900/30 min-h-[32px]">⚠</button>
                        <button onClick={() => updateStatus(booking.id!, 'cancelled')} className="px-2 py-1 text-xs text-red-400 border border-red-900 hover:bg-red-900/30 min-h-[32px]">✕</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="text-text-dim hover:text-cream px-3 py-2 border border-border min-h-[44px]">← Prev</button>
              <h3 className="font-serif text-lg text-cream flex-1 text-center">{fmtDateLong(selectedDate)}</h3>
              <button onClick={() => setSelectedDate(todayStr)} className="text-gold text-sm hover:underline px-3 py-2 min-h-[44px]">Today</button>
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="text-text-dim hover:text-cream px-3 py-2 border border-border min-h-[44px]">Next →</button>
            </div>
            <div className="bg-bg-card border border-border">
              {timelineHours.map((hour) => {
                const hourBookings = selectedDateBookings.filter((b) => parseInt(b.time.split(':')[0]) === parseInt(hour.split(':')[0]));
                return (
                  <div key={hour} className="flex border-b border-border last:border-b-0 min-h-[60px]">
                    <div className="w-20 shrink-0 p-3 border-r border-border flex items-start justify-center">
                      <span className="text-text-dim text-sm font-mono">{hour}</span>
                    </div>
                    <div className="flex-1 p-2 flex flex-wrap gap-2">
                      {hourBookings.map((b) => (
                        <button key={b.id} onClick={() => setShowBookingDetail(b)}
                          className={`px-3 py-2 border text-left transition-all hover:brightness-125 ${b.status === 'confirmed' ? 'bg-green-900/20 border-green-800 text-green-300' : b.status === 'completed' ? 'bg-blue-900/20 border-blue-800 text-blue-300' : b.status === 'cancelled' ? 'bg-red-900/20 border-red-800 text-red-300 opacity-50' : 'bg-yellow-900/20 border-yellow-800 text-yellow-300'}`}>
                          <div className="flex items-center gap-2"><span className="font-medium text-sm">{b.time}</span><span className="text-[10px] opacity-70">{statusIcons[b.status || 'confirmed']}</span></div>
                          <p className="text-xs font-medium mt-0.5">{b.guest_name}</p>
                          <p className="text-[10px] opacity-70">👥 {b.party_size}{b.occasion && b.occasion !== 'None' ? ` · ${b.occasion}` : ''}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {showBookingDetail && !editingBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setShowBookingDetail(null)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-bg-card border border-border w-full max-w-md">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-serif text-2xl text-gold">Booking Details</h2>
                <button onClick={() => setShowBookingDetail(null)} className="text-text-dim hover:text-cream text-xl">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-cream text-lg font-medium">{showBookingDetail.guest_name}</p><span className={`text-xs px-3 py-1 border ${statusColors[showBookingDetail.status || 'confirmed']}`}>{showBookingDetail.status}</span></div>
                  <div className="text-right"><p className="font-serif text-2xl text-gold">{showBookingDetail.time}</p><p className="text-text-dim text-sm">{fmtDate(showBookingDetail.date)}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg p-3 border border-border"><p className="text-text-dim text-[10px] tracking-widest uppercase">Party Size</p><p className="text-cream text-lg">👥 {showBookingDetail.party_size}</p></div>
                  <div className="bg-bg p-3 border border-border"><p className="text-text-dim text-[10px] tracking-widest uppercase">Occasion</p><p className="text-cream text-lg">{showBookingDetail.occasion || 'None'}</p></div>
                </div>
                <div className="bg-bg p-3 border border-border space-y-1">
                  <p className="text-text-dim text-[10px] tracking-widest uppercase">Contact</p>
                  <p className="text-cream text-sm">📞 <span className="text-gold">{showBookingDetail.guest_phone}</span></p>
                  {showBookingDetail.guest_email && <p className="text-cream text-sm">✉️ <span className="text-gold">{showBookingDetail.guest_email}</span></p>}
                </div>
                {showBookingDetail.special_requests && (
                  <div className="bg-bg p-3 border border-border"><p className="text-text-dim text-[10px] tracking-widest uppercase mb-1">Special Requests</p><p className="text-cream text-sm italic">&quot;{showBookingDetail.special_requests}&quot;</p></div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {showBookingDetail.status !== 'completed' && <button onClick={() => updateStatus(showBookingDetail.id!, 'completed')} className="flex-1 py-2 text-sm text-green-400 border border-green-800 hover:bg-green-900/30 min-h-[44px]">✓ Completed</button>}
                  {showBookingDetail.status !== 'confirmed' && <button onClick={() => updateStatus(showBookingDetail.id!, 'confirmed')} className="flex-1 py-2 text-sm text-green-400 border border-green-800 hover:bg-green-900/30 min-h-[44px]">↩ Re-confirm</button>}
                  {showBookingDetail.status !== 'cancelled' && <button onClick={() => updateStatus(showBookingDetail.id!, 'cancelled')} className="flex-1 py-2 text-sm text-red-400 border border-red-800 hover:bg-red-900/30 min-h-[44px]">✕ Cancel</button>}
                  {showBookingDetail.status !== 'no-show' && <button onClick={() => updateStatus(showBookingDetail.id!, 'no-show')} className="flex-1 py-2 text-sm text-yellow-400 border border-yellow-800 hover:bg-yellow-900/30 min-h-[44px]">⚠ No-show</button>}
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <button onClick={() => setEditingBooking({ ...showBookingDetail })} className="flex-1 py-2 text-sm text-gold border border-gold/30 hover:bg-gold/10 min-h-[44px]">✏️ Edit</button>
                  <button onClick={() => deleteBooking(showBookingDetail.id!)} className="py-2 px-4 text-sm text-red-400 border border-red-900 hover:bg-red-900/30 min-h-[44px]">🗑️</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setEditingBooking(null)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex items-center justify-between"><h2 className="font-serif text-2xl text-gold">Edit Booking</h2><button onClick={() => setEditingBooking(null)} className="text-text-dim hover:text-cream text-xl">✕</button></div>
              <form onSubmit={handleEditBooking} className="p-6 space-y-4">
                <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Guest Name</label><input type="text" required value={editingBooking.guest_name} onChange={(e) => setEditingBooking({ ...editingBooking, guest_name: e.target.value })} className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none" /></div>
                <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Phone</label><input type="tel" required value={editingBooking.guest_phone || ''} onChange={(e) => setEditingBooking({ ...editingBooking, guest_phone: e.target.value })} className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Date</label><input type="date" required value={editingBooking.date} onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })} className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none" /></div>
                  <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Time</label><select value={editingBooking.time} onChange={(e) => setEditingBooking({ ...editingBooking, time: e.target.value })} className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none">{TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                </div>
                <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Party Size</label><div className="flex gap-1">{[1,2,3,4,5,6,7,8].map((n) => (<button key={n} type="button" onClick={() => setEditingBooking({ ...editingBooking, party_size: n })} className={`w-10 h-10 text-sm border transition-all ${editingBooking.party_size === n ? 'bg-gold/20 text-gold border-gold/50' : 'text-text-dim border-border'}`}>{n}</button>))}</div></div>
                <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Special Requests</label><textarea value={editingBooking.special_requests || ''} onChange={(e) => setEditingBooking({ ...editingBooking, special_requests: e.target.value })} rows={2} className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none resize-none" /></div>
                <div className="flex gap-2"><button type="submit" className="flex-1 py-3 bg-gold text-bg font-medium tracking-widest uppercase text-sm min-h-[44px]">Save Changes</button><button type="button" onClick={() => setEditingBooking(null)} className="px-6 py-3 text-text-dim border border-border text-sm min-h-[44px]">Cancel</button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Booking Modal */}
      <AnimatePresence>
        {showAddBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setShowAddBooking(false)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex items-center justify-between"><h2 className="font-serif text-2xl text-gold">Add Booking</h2><button onClick={() => setShowAddBooking(false)} className="text-text-dim hover:text-cream text-xl">✕</button></div>
              <form onSubmit={handleAddBooking} className="p-6 space-y-4">
                <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Guest Name *</label><input type="text" required value={newBooking.guest_name} onChange={(e) => setNewBooking({ ...newBooking, guest_name: e.target.value })} placeholder="John Smith" className="w-full bg-bg border border-border px-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none" /></div>
                <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Phone *</label><input type="tel" required value={newBooking.guest_phone} onChange={(e) => setNewBooking({ ...newBooking, guest_phone: e.target.value })} placeholder="+44 7700 900000" className="w-full bg-bg border border-border px-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Date *</label><input type="date" required value={newBooking.date} onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })} className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none" /></div>
                  <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Time *</label><select value={newBooking.time} onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })} className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none">{TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Party Size *</label><div className="flex gap-1 flex-wrap">{[1,2,3,4,5,6,7,8].map((n) => (<button key={n} type="button" onClick={() => setNewBooking({ ...newBooking, party_size: n })} className={`w-10 h-10 text-sm border transition-all ${newBooking.party_size === n ? 'bg-gold/20 text-gold border-gold/50' : 'text-text-dim border-border'}`}>{n}</button>))}</div></div>
                  <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Source</label><select value={newBooking.source} onChange={(e) => setNewBooking({ ...newBooking, source: e.target.value })} className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none"><option value="phone">📞 Phone</option><option value="walk_in">🚶 Walk-in</option><option value="admin">👨‍💼 Admin</option></select></div>
                </div>
                <div><label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Special Requests</label><textarea value={newBooking.special_requests} onChange={(e) => setNewBooking({ ...newBooking, special_requests: e.target.value })} rows={2} placeholder="Allergies, highchair..." className="w-full bg-bg border border-border px-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none resize-none" /></div>
                <button type="submit" className="w-full py-3 bg-gold text-bg font-medium tracking-widest uppercase text-sm min-h-[44px]">Confirm Booking</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
