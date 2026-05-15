import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plane, MapPin, Calendar, LayoutDashboard, 
  Settings, LogOut, Bell, Star, 
  Compass, Users, TrendingUp, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const T = {
  bg: '#F1F5F9',
  accent: '#2563EB',
  accentGradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  sidebarBg: '#0F172A',
  text: '#0F172A',
  muted: '#64748B',
  white: '#ffffff',
  radiusLg: '24px',
  glass: 'rgba(255, 255, 255, 0.7)',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('Explorer');
  const [bookingData, setBookingData] = useState({ destination: '', startDate: '', travelers: '1 Person' });

  // ── 1. SECURITY & DATA SYNC ──
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (savedUser?.username) {
      setUserName(savedUser.username);
    }
  }, [navigate]);

  // ── 2. HANDLERS ──
  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const tripPayload = {
        tripName: bookingData.destination,
        startDate: bookingData.startDate,
        endDate: bookingData.startDate,
        description: `Travelers: ${bookingData.travelers}`,
        stops: [],
        totalBudget: 50000 
      };

      const response = await axios.post('http://localhost:5000/api/trips/add', tripPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success || response.status === 201) {
        alert(`🚀 Ignition Start! Trip to ${bookingData.destination} is scheduled.`);
        setBookingData({ destination: '', startDate: '', travelers: '1 Person' });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Booking Failed! Check if Backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: 'Completed', value: '12', icon: ShieldCheck, color: '#10B981' },
    { label: 'Upcoming', value: '02', icon: Plane, color: '#3B82F6' },
    { label: 'Points', value: '2,450', icon: Star, color: '#F59E0B' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* ── SIDEBAR (STYLISH) ── */}
      <aside style={{ width: '280px', background: T.sidebarBg, color: '#fff', display: 'flex', flexDirection: 'column', padding: '40px 24px', position: 'fixed', height: '100vh', boxShadow: '10px 0 30px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: '50px' }}>
          <div style={{ background: T.accentGradient, padding: 10, borderRadius: '14px', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.4)' }}>
            <Plane size={22} color="#fff" style={{ transform: 'rotate(45deg)' }} />
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, letterSpacing: '1.5px' }}>TRAVELOOP</h2>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
            { id: 'trips', icon: Compass, label: 'My Expeditions' },
            { id: 'trending', icon: TrendingUp, label: 'Marketplace' },
            { id: 'settings', icon: Settings, label: 'Preferences' }
          ].map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: 15, padding: '16px 20px', borderRadius: '18px', cursor: 'pointer', 
                background: activeTab === item.id ? 'rgba(255,255,255,0.08)' : 'transparent', 
                border: activeTab === item.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                color: activeTab === item.id ? '#60A5FA' : '#94A3B8',
                transition: 'all 0.3s ease'
              }}
            >
              <item.icon size={20} />
              <span style={{ fontWeight: 600, fontSize: '15px' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '16px 20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '18px', color: '#EF4444', cursor: 'pointer', fontWeight: 700, transition: '0.3s' }}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '40px 50px' }}>
        
        {/* Header Section */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: T.text, letterSpacing: '-0.5px' }}>Hello, {userName} ✨</h1>
            <p style={{ color: T.muted, fontSize: '15px', marginTop: 5 }}>Your next adventure is just one click away.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '18px', border: '1px solid #E2E8F0', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <Bell size={22} color={T.muted} />
            </div>
            <div style={{ width: 52, height: 52, borderRadius: '18px', background: T.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '20px', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.25)' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* ── LUXURY BOOKING FORM ── */}
        <section style={{ background: T.white, padding: '40px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '30px' }}>
            <div style={{ width: 4, height: 24, background: T.accent, borderRadius: 2 }}></div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: T.text }}>Create New Itinerary</h3>
          </div>
          
          <form onSubmit={handleBooking} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr', gap: '25px' }}>
            {[
              { label: 'Destination', name: 'destination', type: 'text', placeholder: 'Where to?', icon: MapPin },
              { label: 'Date', name: 'startDate', type: 'date', icon: Calendar },
            ].map((f) => (
              <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: T.muted, textTransform: 'uppercase', paddingLeft: 4 }}>{f.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '16px 20px', borderRadius: '20px', border: '1px solid #E2E8F0', transition: '0.3s' }}>
                  <f.icon size={18} color={T.accent} />
                  <input required name={f.name} type={f.type} value={bookingData[f.name]} onChange={handleInputChange} placeholder={f.placeholder} style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, width: '100%', color: T.text }} />
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: T.muted, textTransform: 'uppercase', paddingLeft: 4 }}>Travelers</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '16px 20px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <Users size={18} color={T.accent} />
                <select name="travelers" value={bookingData.travelers} onChange={handleInputChange} style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, width: '100%', color: T.text, cursor: 'pointer' }}>
                  <option>1 Person</option><option>2 Persons</option><option>Business Group</option><option>Family</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '18px', background: T.accentGradient, color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)' }}>
                {isLoading ? 'INITIATING...' : 'BOOK NOW'}
              </button>
            </div>
          </form>
        </section>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: T.white, padding: '30px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              <div style={{ background: `${stat.color}10`, padding: '15px', borderRadius: '20px' }}>
                <stat.icon size={26} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: T.muted, marginBottom: 4 }}>{stat.label}</p>
                <h4 style={{ fontSize: '26px', fontWeight: 800, color: T.text, lineHeight: 1 }}>{stat.value}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* ── DESTINATIONS ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: T.text }}>Trending Destinations</h3>
          <button style={{ color: T.accent, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>See All</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {[
            { name: 'Swiss Alps Premium', price: '₹84k', img: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=600', time: '7 Days' },
            { name: 'Kyoto Zen Valley', price: '₹62k', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600', time: '5 Days' }
          ].map((place, idx) => (
            <div key={idx} style={{ background: T.white, borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.8)', cursor: 'pointer', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ height: '220px', position: 'relative' }}>
                <img src={place.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Place" />
                <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '14px', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                  {place.time}
                </div>
              </div>
              <div style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '18px' }}>{place.name}</h4>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>{place.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;