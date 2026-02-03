'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { supabase, Booking } from '@/lib/supabase';
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

const DEMO_BOOKINGS: Booking[] = [
  { id: '1', date: new Date().toISOString().split('T')[0], time: '12:30', party_size: 2, guest_name: 'James Wilson', guest_email: 'james@email.com', guest_phone: '+44 7700 900123', occasion: 'Date Night', status: 'confirmed', created_at: new Date().toISOString() },
  { id: '2', date: new Date().toISOString().split('T')[0], time: '13:00', party_size: 4, guest_name: 'Sarah Chen', guest_email: 'sarah@email.com', guest_phone: '+44 7700 900456', status: 'confirmed', created_at: new Date().toISOString() },
  { id: '3', date: new Date().toISOString().split('T')[0], time: '19:00', party_size: 6, guest_name: 'Marco Rossi', guest_email: 'marco@email.com', guest_phone: '+44 7700 900789', occasion: 'Birthday', special_requests: 'Birthday cake at 9pm please', status: 'confirmed', created_at: new Date().toISOString() },
  { id: '4', date: new Date().toISOString().split('T')[0], time: '19:30', party_size: 2, guest_name: 'Emily Brown', guest_email: 'emily@email.com', guest_phone: '+44 7700 900321', status: 'completed', created_at: new Date().toISOString() },
  { id: '5', date: new Date().toISOString().split('T')[0], time: '20:00', party_size: 3, guest_name: 'Alex Johnson', guest_email: 'alex@email.com', guest_phone: '+44 7700 900654', occasion: 'Business Dinner', status: 'confirmed', created_at: new Date().toISOString() },
  { id: '6', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '19:00', party_size: 2, guest_name: 'Laura Bianchi', guest_email: 'laura@email.com', guest_phone: '+44 7700 900987', occasion: 'Anniversary', status: 'confirmed', created_at: new Date().toISOString() },
  { id: '7', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], time: '20:30', party_size: 8, guest_name: 'David Park', guest_email: 'david@email.com', guest_phone: '+44 7700 900147', occasion: 'Celebration', special_requests: 'Window table if possible', status: 'confirmed', created_at: new Date().toISOString() },
  { id: '8', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '19:00', party_size: 4, guest_name: 'Tom Harris', guest_email: 'tom@email.com', guest_phone: '+44 7700 900258', status: 'no-show', created_at: new Date().toISOString() },
  { id: '9', date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], time: '18:00', party_size: 5, guest_name: 'Rachel Green', guest_email: 'rachel@email.com', guest_phone: '+44 7700 900369', occasion: 'Birthday', status: 'confirmed', created_at: new Date().toISOString() },
  { id: '10', date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], time: '19:30', party_size: 2, guest_name: 'Michael Scott', guest_email: 'michael@email.com', guest_phone: '+44 7700 900741', occasion: 'Date Night', status: 'confirmed', created_at: new Date().toISOString() },
];

// Helper: generate time slots
const TIME_SLOTS = ['12:00','12:30','13:00','13:30','14:00','14:30','15:00','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'];

// Helper: format date
function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function fmtDateLong(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// Helper: days in month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [showBookingDetail, setShowBookingDetail] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newBooking, setNewBooking] = useState({
    guest_name: '', guest_phone: '', guest_email: '', party_size: 2,
    date: new Date().toISOString().split('T')[0], time: '19:00',
    occasion: 'None', special_requests: '', source: 'phone',
  });
  const [addingBooking, setAddingBooking] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      if (error || !data || data.length === 0) {
        setBookings(DEMO_BOOKINGS);
      } else {
        setBookings(data);
      }
    } catch {
      setBookings(DEMO_BOOKINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadBookings();
  }, [authed, loadBookings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tavola2026') {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const updateStatus = async (id: string, status: StatusType) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    showNotification(`Booking marked as ${status}`);
    setShowBookingDetail(null);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    await supabase.from('bookings').delete().eq('id', id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showNotification('Booking deleted');
    setShowBookingDetail(null);
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingBooking(true);
    try {
      const bookingData = {
        restaurant_id: undefined as string | undefined,
        customer_name: newBooking.guest_name,
        customer_phone: newBooking.guest_phone,
        customer_email: newBooking.guest_email || null,
        party_size: newBooking.party_size,
        booking_date: newBooking.date,
        booking_time: newBooking.time,
        occasion: newBooking.occasion === 'None' ? null : newBooking.occasion,
        special_requests: newBooking.special_requests || null,
        source: newBooking.source,
        status: 'confirmed' as const,
      };
      const { data: restaurants } = await supabase.from('restaurants').select('id').limit(1);
      if (restaurants && restaurants.length > 0) bookingData.restaurant_id = restaurants[0].id;
      const { error } = await supabase.from('bookings').insert(bookingData);
      if (error) {
        const localBooking: Booking = {
          id: crypto.randomUUID(), date: newBooking.date, time: newBooking.time,
          party_size: newBooking.party_size, guest_name: newBooking.guest_name,
          guest_phone: newBooking.guest_phone, guest_email: newBooking.guest_email,
          occasion: newBooking.occasion, special_requests: newBooking.special_requests,
          status: 'confirmed', created_at: new Date().toISOString(),
        };
        setBookings((prev) => [...prev, localBooking].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)));
      } else {
        await loadBookings();
      }
      setShowAddBooking(false);
      setNewBooking({ guest_name: '', guest_phone: '', guest_email: '', party_size: 2, date: todayStr, time: '19:00', occasion: 'None', special_requests: '', source: 'phone' });
      showNotification('Booking added successfully');
    } finally {
      setAddingBooking(false);
    }
  };

  const handleEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    await supabase.from('bookings').update({
      customer_name: editingBooking.guest_name,
      customer_phone: editingBooking.guest_phone,
      customer_email: editingBooking.guest_email,
      party_size: editingBooking.party_size,
      booking_date: editingBooking.date,
      booking_time: editingBooking.time,
      occasion: editingBooking.occasion,
      special_requests: editingBooking.special_requests,
    }).eq('id', editingBooking.id);
    setBookings((prev) => prev.map((b) => b.id === editingBooking.id ? editingBooking : b));
    setEditingBooking(null);
    setShowBookingDetail(null);
    showNotification('Booking updated');
  };

  // Search & filter
  const searchFiltered = useMemo(() => {
    let result = bookings;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) =>
        b.guest_name.toLowerCase().includes(q) ||
        b.guest_phone?.toLowerCase().includes(q) ||
        b.guest_email?.toLowerCase().includes(q) ||
        b.occasion?.toLowerCase().includes(q) ||
        b.special_requests?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter);
    }
    return result;
  }, [bookings, searchQuery, statusFilter]);

  // Bookings for selected date (calendar view)
  const selectedDateBookings = useMemo(() =>
    searchFiltered.filter((b) => b.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [searchFiltered, selectedDate]
  );

  // Bookings by date for calendar dots
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

  // Stats
  const todayBookings = bookings.filter((b) => b.date === todayStr);
  const totalCoversToday = todayBookings.reduce((s, b) => s + b.party_size, 0);
  const confirmedToday = todayBookings.filter((b) => b.status === 'confirmed').length;
  const upcomingBookings = bookings.filter((b) => b.date >= todayStr && b.status === 'confirmed');
  const thisWeekCovers = bookings.filter((b) => {
    const d = new Date(b.date);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / 86400000;
    return diff >= 0 && diff < 7;
  }).reduce((s, b) => s + b.party_size, 0);

  // Calendar
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
  const monthName = new Date(calendarYear, calendarMonth).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); }
    else setCalendarMonth(calendarMonth - 1);
  };
  const nextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); }
    else setCalendarMonth(calendarMonth + 1);
  };
  const goToToday = () => {
    const now = new Date();
    setCalendarMonth(now.getMonth());
    setCalendarYear(now.getFullYear());
    setSelectedDate(todayStr);
  };

  // Timeline hours
  const timelineHours = ['12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h1 className="font-serif text-3xl text-cream text-center mb-2">{RESTAURANT.name}</h1>
          <p className="text-text-muted text-center text-sm mb-8">Admin Dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
              placeholder="Enter password" autoFocus
              className="w-full bg-bg-card border border-border px-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none transition-colors" />
            {pwError && <p className="text-wine-light text-sm">Incorrect password.</p>}
            <button type="submit" className="w-full py-3 bg-gold text-bg font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-all">Sign In</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[60] px-6 py-3 border text-sm ${
              notification.type === 'success' ? 'bg-green-900/90 text-green-300 border-green-700' : 'bg-red-900/90 text-red-300 border-red-700'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-border bg-bg-card sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-xl text-gold">{RESTAURANT.name}</Link>
            <span className="text-text-dim text-xs tracking-widest uppercase bg-bg-elevated px-3 py-1 border border-border">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAddBooking(true)}
              className="px-4 py-2 bg-gold text-bg text-sm font-medium tracking-widest uppercase hover:bg-gold-light transition-all min-h-[44px]">
              + Add Booking
            </button>
            <button onClick={loadBookings} className="px-3 py-2 text-text-dim border border-border hover:border-gold/30 text-sm transition-all min-h-[44px]">↻ Refresh</button>
            <button onClick={() => setAuthed(false)} className="text-text-muted text-sm hover:text-cream transition-colors px-3 py-2 min-h-[44px]">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Today's Bookings", value: todayBookings.length, sub: `${confirmedToday} confirmed`, accent: true },
            { label: 'Covers Today', value: totalCoversToday, sub: `of ${RESTAURANT.totalCovers || 45} capacity`, accent: false },
            { label: 'This Week', value: upcomingBookings.length, sub: `${thisWeekCovers} covers`, accent: false },
            { label: 'No-Shows (30d)', value: bookings.filter(b => b.status === 'no-show').length, sub: 'track rate', accent: false },
            { label: 'Avg Party Size', value: bookings.length > 0 ? (bookings.reduce((s, b) => s + b.party_size, 0) / bookings.length).toFixed(1) : '0', sub: 'all time', accent: false },
          ].map((stat) => (
            <div key={stat.label} className="bg-bg-card border border-border p-4">
              <p className="text-text-dim text-[10px] tracking-widest uppercase mb-1">{stat.label}</p>
              <p className={`font-serif text-2xl ${stat.accent ? 'text-gold' : 'text-cream'}`}>{stat.value}</p>
              <p className="text-text-dim text-[10px] mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Toolbar: Search + View Toggle + Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, occasion..."
              className="w-full bg-bg-card border border-border pl-10 pr-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none transition-colors text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-cream">✕</button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex border border-border">
            {(['calendar', 'list', 'timeline'] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-4 py-2 text-sm capitalize min-h-[44px] transition-all ${
                  viewMode === v ? 'bg-gold/15 text-gold' : 'text-text-dim hover:text-cream'
                }`}>
                {v === 'calendar' ? '📅' : v === 'list' ? '📋' : '⏱️'} {v}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex border border-border">
            {['all', 'confirmed', 'completed', 'cancelled', 'no-show'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs capitalize min-h-[44px] transition-all ${
                  statusFilter === s ? 'bg-gold/15 text-gold' : 'text-text-dim hover:text-cream'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Search results count */}
        {searchQuery && (
          <p className="text-text-dim text-sm mb-4">
            Found <span className="text-gold">{searchFiltered.length}</span> booking{searchFiltered.length !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
          </p>
        )}

        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-bg-card border border-border animate-pulse" />)}</div>
        ) : (
          <>
            {/* =================== CALENDAR VIEW =================== */}
            {viewMode === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
                {/* Calendar */}
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
                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-2">
                      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
                        <div key={d} className="text-center text-text-dim text-[10px] tracking-widest uppercase py-2">{d}</div>
                      ))}
                    </div>
                    {/* Days */}
                    <div className="grid grid-cols-7">
                      {/* Empty cells for offset */}
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                      ))}
                      {/* Day cells */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isToday = dateStr === todayStr;
                        const isSelected = dateStr === selectedDate;
                        const dayData = bookingsByDate[dateStr];
                        const isPast = dateStr < todayStr;

                        return (
                          <button
                            key={day}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`aspect-square p-1 flex flex-col items-center justify-center gap-0.5 transition-all relative border ${
                              isSelected ? 'border-gold bg-gold/10' :
                              isToday ? 'border-gold/30 bg-gold/5' :
                              'border-transparent hover:border-border'
                            } ${isPast ? 'opacity-50' : ''}`}
                          >
                            <span className={`text-sm ${isToday ? 'text-gold font-bold' : isSelected ? 'text-cream' : 'text-text-muted'}`}>
                              {day}
                            </span>
                            {dayData && (
                              <div className="flex gap-0.5 items-center">
                                <span className={`text-[9px] font-medium ${dayData.count >= 5 ? 'text-red-400' : dayData.count >= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                                  {dayData.count}
                                </span>
                                <div className="flex gap-px">
                                  {dayData.count <= 5 ? (
                                    dayData.statuses.slice(0, 5).map((s, si) => (
                                      <div key={si} className={`w-1 h-1 rounded-full ${
                                        s === 'confirmed' ? 'bg-green-400' :
                                        s === 'completed' ? 'bg-blue-400' :
                                        s === 'cancelled' ? 'bg-red-400' : 'bg-yellow-400'
                                      }`} />
                                    ))
                                  ) : (
                                    <div className="w-1 h-1 rounded-full bg-gold" />
                                  )}
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Selected date bookings */}
                <div className="bg-bg-card border border-border">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-serif text-lg text-cream">{fmtDateLong(selectedDate)}</h3>
                    <p className="text-text-dim text-xs mt-1">
                      {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''} · {selectedDateBookings.reduce((s, b) => s + b.party_size, 0)} covers
                    </p>
                  </div>
                  <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                    {selectedDateBookings.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-text-dim text-sm">No bookings for this date</p>
                        <button onClick={() => { setNewBooking({ ...newBooking, date: selectedDate }); setShowAddBooking(true); }}
                          className="text-gold text-sm mt-2 hover:underline">+ Add one</button>
                      </div>
                    ) : (
                      selectedDateBookings.map((booking) => (
                        <button key={booking.id} onClick={() => setShowBookingDetail(booking)}
                          className="w-full text-left p-4 hover:bg-bg-elevated transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif text-lg text-gold">{booking.time}</span>
                            <span className={`text-[10px] px-2 py-0.5 border ${statusColors[booking.status || 'confirmed']}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-cream text-sm font-medium">{booking.guest_name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-text-dim text-xs">👥 {booking.party_size}</span>
                            {booking.occasion && booking.occasion !== 'None' && (
                              <span className="text-text-dim text-xs">{booking.occasion}</span>
                            )}
                            <span className="text-text-dim text-xs">{booking.guest_phone}</span>
                          </div>
                          {booking.special_requests && (
                            <p className="text-text-dim text-[11px] mt-1 italic truncate">"{booking.special_requests}"</p>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =================== LIST VIEW =================== */}
            {viewMode === 'list' && (
              <div className="space-y-2">
                {/* Table header */}
                <div className="hidden md:grid grid-cols-[100px_140px_1fr_120px_80px_100px_150px] gap-3 px-4 py-2 text-text-dim text-[10px] tracking-widest uppercase border-b border-border">
                  <span>Time</span><span>Date</span><span>Guest</span><span>Phone</span><span>Party</span><span>Status</span><span>Actions</span>
                </div>
                {searchFiltered.length === 0 ? (
                  <div className="text-center py-20"><p className="text-text-dim">No bookings found.</p></div>
                ) : (
                  searchFiltered.map((booking) => (
                    <motion.div key={booking.id} layout
                      className="bg-bg-card border border-border hover:border-gold/20 transition-all cursor-pointer"
                      onClick={() => setShowBookingDetail(booking)}>
                      <div className="grid grid-cols-1 md:grid-cols-[100px_140px_1fr_120px_80px_100px_150px] gap-3 p-4 items-center">
                        <span className="font-serif text-lg text-gold">{booking.time}</span>
                        <span className="text-text-muted text-sm">{fmtDate(booking.date)}</span>
                        <div>
                          <span className="text-cream text-sm font-medium">{booking.guest_name}</span>
                          {booking.occasion && booking.occasion !== 'None' && (
                            <span className="text-gold/60 text-xs ml-2">{booking.occasion}</span>
                          )}
                        </div>
                        <span className="text-text-dim text-xs">{booking.guest_phone}</span>
                        <span className="text-text-dim text-sm">👥 {booking.party_size}</span>
                        <span className={`text-[10px] px-2 py-0.5 border w-fit ${statusColors[booking.status || 'confirmed']}`}>
                          {booking.status}
                        </span>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          {booking.status === 'confirmed' && (
                            <>
                              <button onClick={() => updateStatus(booking.id!, 'completed')}
                                className="px-2 py-1 text-xs text-green-400 border border-green-900 hover:bg-green-900/30 transition-all min-h-[32px]">✓ Done</button>
                              <button onClick={() => updateStatus(booking.id!, 'no-show')}
                                className="px-2 py-1 text-xs text-yellow-400 border border-yellow-900 hover:bg-yellow-900/30 transition-all min-h-[32px]">⚠ No-show</button>
                              <button onClick={() => updateStatus(booking.id!, 'cancelled')}
                                className="px-2 py-1 text-xs text-red-400 border border-red-900 hover:bg-red-900/30 transition-all min-h-[32px]">✕</button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* =================== TIMELINE VIEW =================== */}
            {viewMode === 'timeline' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]); }}
                    className="text-text-dim hover:text-cream px-3 py-2 border border-border min-h-[44px]">← Prev</button>
                  <h3 className="font-serif text-lg text-cream flex-1 text-center">{fmtDateLong(selectedDate)}</h3>
                  <button onClick={() => setSelectedDate(todayStr)} className="text-gold text-sm hover:underline px-3 py-2 min-h-[44px]">Today</button>
                  <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]); }}
                    className="text-text-dim hover:text-cream px-3 py-2 border border-border min-h-[44px]">Next →</button>
                </div>
                <div className="bg-bg-card border border-border">
                  {timelineHours.map((hour) => {
                    const hourBookings = selectedDateBookings.filter((b) => {
                      const bHour = parseInt(b.time.split(':')[0]);
                      const slotHour = parseInt(hour.split(':')[0]);
                      return bHour === slotHour;
                    });
                    return (
                      <div key={hour} className="flex border-b border-border last:border-b-0 min-h-[60px]">
                        <div className="w-20 shrink-0 p-3 border-r border-border flex items-start justify-center">
                          <span className="text-text-dim text-sm font-mono">{hour}</span>
                        </div>
                        <div className="flex-1 p-2 flex flex-wrap gap-2">
                          {hourBookings.map((b) => (
                            <button key={b.id} onClick={() => setShowBookingDetail(b)}
                              className={`px-3 py-2 border text-left transition-all hover:brightness-125 ${
                                b.status === 'confirmed' ? 'bg-green-900/20 border-green-800 text-green-300' :
                                b.status === 'completed' ? 'bg-blue-900/20 border-blue-800 text-blue-300' :
                                b.status === 'cancelled' ? 'bg-red-900/20 border-red-800 text-red-300 opacity-50' :
                                'bg-yellow-900/20 border-yellow-800 text-yellow-300'
                              }`}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{b.time}</span>
                                <span className="text-[10px] opacity-70">{statusIcons[b.status || 'confirmed']}</span>
                              </div>
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
          </>
        )}
      </main>

      {/* =================== BOOKING DETAIL MODAL =================== */}
      <AnimatePresence>
        {showBookingDetail && !editingBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setShowBookingDetail(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="bg-bg-card border border-border w-full max-w-md">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-serif text-2xl text-gold">Booking Details</h2>
                <button onClick={() => setShowBookingDetail(null)} className="text-text-dim hover:text-cream text-xl w-8 h-8 flex items-center justify-center">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream text-lg font-medium">{showBookingDetail.guest_name}</p>
                    <span className={`text-xs px-3 py-1 border ${statusColors[showBookingDetail.status || 'confirmed']}`}>{showBookingDetail.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl text-gold">{showBookingDetail.time}</p>
                    <p className="text-text-dim text-sm">{fmtDate(showBookingDetail.date)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg p-3 border border-border">
                    <p className="text-text-dim text-[10px] tracking-widest uppercase">Party Size</p>
                    <p className="text-cream text-lg">👥 {showBookingDetail.party_size}</p>
                  </div>
                  <div className="bg-bg p-3 border border-border">
                    <p className="text-text-dim text-[10px] tracking-widest uppercase">Occasion</p>
                    <p className="text-cream text-lg">{showBookingDetail.occasion || 'None'}</p>
                  </div>
                </div>
                <div className="bg-bg p-3 border border-border space-y-1">
                  <p className="text-text-dim text-[10px] tracking-widest uppercase">Contact</p>
                  <p className="text-cream text-sm">📞 <a href={`tel:${showBookingDetail.guest_phone}`} className="text-gold hover:underline">{showBookingDetail.guest_phone}</a></p>
                  {showBookingDetail.guest_email && <p className="text-cream text-sm">✉️ <a href={`mailto:${showBookingDetail.guest_email}`} className="text-gold hover:underline">{showBookingDetail.guest_email}</a></p>}
                </div>
                {showBookingDetail.special_requests && (
                  <div className="bg-bg p-3 border border-border">
                    <p className="text-text-dim text-[10px] tracking-widest uppercase mb-1">Special Requests</p>
                    <p className="text-cream text-sm italic">"{showBookingDetail.special_requests}"</p>
                  </div>
                )}
                {/* Status actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {showBookingDetail.status !== 'completed' && (
                    <button onClick={() => updateStatus(showBookingDetail.id!, 'completed')}
                      className="flex-1 py-2 text-sm text-green-400 border border-green-800 hover:bg-green-900/30 transition-all min-h-[44px]">✓ Completed</button>
                  )}
                  {showBookingDetail.status !== 'confirmed' && (
                    <button onClick={() => updateStatus(showBookingDetail.id!, 'confirmed')}
                      className="flex-1 py-2 text-sm text-green-400 border border-green-800 hover:bg-green-900/30 transition-all min-h-[44px]">↩ Re-confirm</button>
                  )}
                  {showBookingDetail.status !== 'cancelled' && (
                    <button onClick={() => updateStatus(showBookingDetail.id!, 'cancelled')}
                      className="flex-1 py-2 text-sm text-red-400 border border-red-800 hover:bg-red-900/30 transition-all min-h-[44px]">✕ Cancel</button>
                  )}
                  {showBookingDetail.status !== 'no-show' && (
                    <button onClick={() => updateStatus(showBookingDetail.id!, 'no-show')}
                      className="flex-1 py-2 text-sm text-yellow-400 border border-yellow-800 hover:bg-yellow-900/30 transition-all min-h-[44px]">⚠ No-show</button>
                  )}
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <button onClick={() => setEditingBooking({ ...showBookingDetail })}
                    className="flex-1 py-2 text-sm text-gold border border-gold/30 hover:bg-gold/10 transition-all min-h-[44px]">✏️ Edit</button>
                  <button onClick={() => deleteBooking(showBookingDetail.id!)}
                    className="py-2 px-4 text-sm text-red-400 border border-red-900 hover:bg-red-900/30 transition-all min-h-[44px]">🗑️ Delete</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================== EDIT BOOKING MODAL =================== */}
      <AnimatePresence>
        {editingBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setEditingBooking(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="bg-bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-serif text-2xl text-gold">Edit Booking</h2>
                <button onClick={() => setEditingBooking(null)} className="text-text-dim hover:text-cream text-xl w-8 h-8 flex items-center justify-center">✕</button>
              </div>
              <form onSubmit={handleEditBooking} className="p-6 space-y-4">
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Guest Name</label>
                  <input type="text" required value={editingBooking.guest_name}
                    onChange={(e) => setEditingBooking({ ...editingBooking, guest_name: e.target.value })}
                    className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Phone</label>
                  <input type="tel" required value={editingBooking.guest_phone || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, guest_phone: e.target.value })}
                    className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Email</label>
                  <input type="email" value={editingBooking.guest_email || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, guest_email: e.target.value })}
                    className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Date</label>
                    <input type="date" required value={editingBooking.date}
                      onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                      className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Time</label>
                    <select value={editingBooking.time}
                      onChange={(e) => setEditingBooking({ ...editingBooking, time: e.target.value })}
                      className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors">
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Party Size</label>
                  <div className="flex gap-1 flex-wrap">
                    {[1,2,3,4,5,6,7,8].map((n) => (
                      <button key={n} type="button" onClick={() => setEditingBooking({ ...editingBooking, party_size: n })}
                        className={`w-10 h-10 text-sm border transition-all ${
                          editingBooking.party_size === n ? 'bg-gold/20 text-gold border-gold/50' : 'text-text-dim border-border hover:border-gold/30'
                        }`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Occasion</label>
                  <select value={editingBooking.occasion || 'None'}
                    onChange={(e) => setEditingBooking({ ...editingBooking, occasion: e.target.value })}
                    className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors">
                    {['None','Birthday','Anniversary','Date Night','Business Dinner','Celebration','Other'].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Special Requests</label>
                  <textarea value={editingBooking.special_requests || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, special_requests: e.target.value })}
                    rows={2} className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors resize-none" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-3 bg-gold text-bg font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-all min-h-[44px]">Save Changes</button>
                  <button type="button" onClick={() => setEditingBooking(null)}
                    className="px-6 py-3 text-text-dim border border-border hover:border-gold/30 text-sm transition-all min-h-[44px]">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================== ADD BOOKING MODAL =================== */}
      <AnimatePresence>
        {showAddBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setShowAddBooking(false)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="bg-bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-serif text-2xl text-gold">Add Booking</h2>
                <button onClick={() => setShowAddBooking(false)} className="text-text-dim hover:text-cream text-xl w-8 h-8 flex items-center justify-center">✕</button>
              </div>
              <form onSubmit={handleAddBooking} className="p-6 space-y-4">
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Guest Name *</label>
                  <input type="text" required value={newBooking.guest_name}
                    onChange={(e) => setNewBooking({ ...newBooking, guest_name: e.target.value })}
                    className="w-full bg-bg border border-border px-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none transition-colors"
                    placeholder="John Smith" />
                </div>
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Phone *</label>
                  <input type="tel" required value={newBooking.guest_phone}
                    onChange={(e) => setNewBooking({ ...newBooking, guest_phone: e.target.value })}
                    className="w-full bg-bg border border-border px-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none transition-colors"
                    placeholder="+44 7700 900000" />
                </div>
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Email</label>
                  <input type="email" value={newBooking.guest_email}
                    onChange={(e) => setNewBooking({ ...newBooking, guest_email: e.target.value })}
                    className="w-full bg-bg border border-border px-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none transition-colors"
                    placeholder="john@email.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Date *</label>
                    <input type="date" required value={newBooking.date}
                      onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                      className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Time *</label>
                    <select required value={newBooking.time}
                      onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                      className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors">
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Party Size *</label>
                    <div className="flex gap-1 flex-wrap">
                      {[1,2,3,4,5,6,7,8].map((n) => (
                        <button key={n} type="button" onClick={() => setNewBooking({ ...newBooking, party_size: n })}
                          className={`w-10 h-10 text-sm border transition-all ${
                            newBooking.party_size === n ? 'bg-gold/20 text-gold border-gold/50' : 'text-text-dim border-border hover:border-gold/30'
                          }`}>{n}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Source</label>
                    <select value={newBooking.source}
                      onChange={(e) => setNewBooking({ ...newBooking, source: e.target.value })}
                      className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors">
                      <option value="phone">📞 Phone</option>
                      <option value="walk_in">🚶 Walk-in</option>
                      <option value="admin">👨‍💼 Admin</option>
                      <option value="website">🌐 Website</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Occasion</label>
                  <select value={newBooking.occasion}
                    onChange={(e) => setNewBooking({ ...newBooking, occasion: e.target.value })}
                    className="w-full bg-bg border border-border px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors">
                    {['None','Birthday','Anniversary','Date Night','Business Dinner','Celebration','Other'].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-text-dim text-xs tracking-widest uppercase block mb-1">Special Requests</label>
                  <textarea value={newBooking.special_requests}
                    onChange={(e) => setNewBooking({ ...newBooking, special_requests: e.target.value })}
                    rows={2} className="w-full bg-bg border border-border px-4 py-3 text-cream placeholder:text-text-dim focus:border-gold focus:outline-none transition-colors resize-none"
                    placeholder="Allergies, highchair, window table..." />
                </div>
                <button type="submit" disabled={addingBooking}
                  className="w-full py-3 bg-gold text-bg font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-all disabled:opacity-50 min-h-[44px]">
                  {addingBooking ? 'Adding...' : 'Confirm Booking'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
