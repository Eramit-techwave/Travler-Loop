import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Plane, MapPin, Calendar, LayoutDashboard, 
  Settings, LogOut, Bell, Star, 
  Compass, Users, TrendingUp, ShieldCheck, Clock, Trash2, Eye
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
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('Explorer');
  const [myTrips, setMyTrips] = useState([]);
  const [tripStats, setTripStats] = useState({ total: 0, completed: 0, ongoing: 0, planning: 0 });
  const [hoveredTripId, setHoveredTripId] = useState(null);
  
  const [bookingData, setBookingData] = useState({ 
    origin: '',
    destination: '', 
    startDate: '', 
    travelers: '1 Person',
    budget: ''
  });

  // State for weather and distance data
  const [tripWeatherDistance, setTripWeatherDistance] = useState({});

  // Function to fetch weather and distance for a specific trip
  const fetchWeatherAndDistance = useCallback(async (tripId, token, apiUrl) => {
    try {
      const weatherRes = await axios.get(`${apiUrl}/api/trips/${tripId}/weather`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const distanceRes = await axios.get(`${apiUrl}/api/trips/${tripId}/distance`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTripWeatherDistance(prev => ({
        ...prev,
        [tripId]: {
          weather: weatherRes.data.data || { temp: 25, condition: 2, humidity: 60 },
          distance: distanceRes.data.distance || 0
        }
      }));
    } catch (error) {
      console.error(`[Weather/Distance] Error for trip ${tripId}:`, error);
      // Set fallback values on error
      setTripWeatherDistance(prev => ({
        ...prev,
        [tripId]: {
          weather: { temp: 25, condition: 2, humidity: 60 },
          distance: 0
        }
      }));
    }
  }, []);

  const fetchMyTrips = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/trips/my-trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMyTrips(response.data.data);
        if (response.data.stats) {
          setTripStats(response.data.stats);
        }
        
        // Fetch weather and distance for each trip
        response.data.data.forEach(trip => {
          fetchWeatherAndDistance(trip._id, token, apiUrl);
        });
      }
    } catch (error) {
      console.error('[Trips] Fetch error:', error);
    }
  }, [fetchWeatherAndDistance]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (savedUser?.username) setUserName(savedUser.username);
    fetchMyTrips();

    // Auto-refresh weather/distance every 5 minutes (300000ms)
    const weatherRefreshInterval = setInterval(() => {
      console.log('[Dashboard] Auto-refreshing weather/distance...');
      fetchMyTrips();
    }, 300000);

    return () => clearInterval(weatherRefreshInterval);
  }, [navigate, fetchMyTrips]);

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Helper function to get weather emoji
  const getWeatherEmoji = (weatherCode) => {
    if (!weatherCode) return '🌤️';
    if (weatherCode <= 1) return '☀️';
    if (weatherCode <= 3) return '⛅';
    if (weatherCode >= 45 && weatherCode <= 48) return '🌫️';
    if (weatherCode >= 51 && weatherCode <= 67) return '🌧️';
    if (weatherCode >= 71 && weatherCode <= 77) return '❄️';
    if (weatherCode >= 80 && weatherCode <= 82) return '⛈️';
    return '🌤️';
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const tripPayload = {
        tripName: bookingData.destination,
        origin: bookingData.origin,
        destination: bookingData.destination,
        startDate: bookingData.startDate,
        endDate: bookingData.startDate,
        travelers: bookingData.travelers === '1 Person' ? 1 : bookingData.travelers === '2 Persons' ? 2 : bookingData.travelers === '4 Persons' ? 4 : 5,
        description: `Trip for ${bookingData.travelers}`,
        stops: [],
        totalBudget: Number(bookingData.budget) || 0
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/trips/add`, tripPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success || response.status === 201) {
        alert(`Trip to ${bookingData.destination} created successfully`);
        setBookingData({ origin: '', destination: '', startDate: '', travelers: '1 Person', budget: '' });
        fetchMyTrips(); 
      } else {
        alert(response.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('[Trips] Booking error:', error);
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.delete(`${apiUrl}/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Trip deleted!');
        fetchMyTrips();
      } catch (error) {
        alert('Failed to delete trip');
      }
    }
  };

  const stats = [
    { label: 'Total Trips', value: tripStats.total.toString().padStart(2, '0'), icon: Plane, color: '#3B82F6' },
    { label: 'Completed', value: tripStats.completed.toString().padStart(2, '0'), icon: ShieldCheck, color: '#10B981' },
    { label: 'Planning', value: tripStats.planning.toString().padStart(2, '0'), icon: Calendar, color: '#F59E0B' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      <aside style={{ width: '280px', background: T.sidebarBg, color: '#fff', display: 'flex', flexDirection: 'column', padding: '40px 24px', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: '50px' }}>
          <div style={{ background: T.accentGradient, padding: 10, borderRadius: '14px' }}>
            <Plane size={22} color="#fff" style={{ transform: 'rotate(45deg)' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '1.5px' }}>TRAVELOOP</h2>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
            { id: 'trips', icon: Compass, label: 'My Expeditions' },
            { id: 'trending', icon: TrendingUp, label: 'Marketplace' },
            { id: 'settings', icon: Settings, label: 'Preferences' }
          ].map((item) => (
            <div key={item.id} onClick={() => {
              if (item.id === 'trending') {
                navigate('/marketplace');
              } else if (item.id === 'settings') {
                navigate('/preferences');
              } else {
                setActiveTab(item.id);
              }
            }} style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '16px 20px', borderRadius: '18px', cursor: 'pointer', background: activeTab === item.id ? 'rgba(255,255,255,0.08)' : 'transparent', color: activeTab === item.id ? '#60A5FA' : '#94A3B8', transition: '0.3s' }}>
              <item.icon size={20} />
              <span style={{ fontWeight: 600, fontSize: '15px' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '16px 20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '18px', color: '#EF4444', cursor: 'pointer', fontWeight: 700 }}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main style={{ marginLeft: '280px', flex: 1, padding: '40px 50px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: T.text }}>Hello, {userName} ✨</h1>
            <p style={{ color: T.muted, fontSize: '15px', marginTop: 5 }}>Your next adventure is just one click away.</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '18px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <Bell size={22} color={T.muted} />
            </div>
            <div style={{ width: 52, height: 52, borderRadius: '18px', background: T.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '20px' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* ── 3. UPDATED FORM GRID WITH BUDGET INPUT ── */}
        <section style={{ background: T.white, padding: '40px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '30px' }}>
            <div style={{ width: 4, height: 24, background: T.accent, borderRadius: 2 }}></div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: T.text }}>Create New Itinerary</h3>
          </div>
          <form onSubmit={handleBooking} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 0.8fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: T.muted }}>FROM</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '16px 20px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <MapPin size={18} color={T.accent} />
                <input required name="origin" type="text" value={bookingData.origin} onChange={handleInputChange} placeholder="Starting point?" style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, width: '100%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: T.muted }}>TO</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '16px 20px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <MapPin size={18} color={T.accent} />
                <input required name="destination" type="text" value={bookingData.destination} onChange={handleInputChange} placeholder="Where to?" style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, width: '100%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: T.muted }}>DATE</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '16px 20px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <Calendar size={18} color={T.accent} />
                <input required name="startDate" type="date" value={bookingData.startDate} onChange={handleInputChange} style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, width: '100%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: T.muted }}>TRAVELERS</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '16px 20px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <Users size={18} color={T.accent} />
                <select name="travelers" value={bookingData.travelers} onChange={handleInputChange} style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, width: '100%', cursor: 'pointer' }}>
                  <option>1 Person</option><option>2 Persons</option><option>4 Persons</option><option>Group (5+)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: T.muted }}>BUDGET (₹)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '16px 20px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 800, color: T.accent }}>₹</span>
                <input required name="budget" type="number" value={bookingData.budget} onChange={handleInputChange} placeholder="Budget" style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, width: '100%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '18px', background: T.accentGradient, color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 800, cursor: 'pointer' }}>
                {isLoading ? '...' : 'BOOK'}
              </button>
            </div>
          </form>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: T.white, padding: '30px', borderRadius: '28px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ background: `${stat.color}10`, padding: '15px', borderRadius: '20px' }}>
                <stat.icon size={26} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: T.muted }}>{stat.label}</p>
                <h4 style={{ fontSize: '26px', fontWeight: 800, color: T.text }}>{stat.value}</h4>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: T.text }}>My Planned Expeditions 🗺️</h3>
            <button onClick={fetchMyTrips} style={{ background: 'none', border: 'none', color: T.accent, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={16} /> Refresh
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
            {myTrips.length > 0 ? myTrips.map((trip, idx) => (
              <div key={idx} onClick={() => navigate(`/trip/${trip._id}`)} onMouseEnter={() => setHoveredTripId(trip._id)} onMouseLeave={() => setHoveredTripId(null)} style={{ background: T.white, borderRadius: '28px', padding: '25px', border: '1px solid #f1f5f9', boxShadow: hoveredTripId === trip._id ? '0 20px 40px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.02)', transition: 'all 0.3s', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '17px', margin: 0, marginBottom: '5px' }}>{trip.tripName}</h4>
                    <span style={{ display: 'inline-block', background: trip.status === 'completed' ? '#dcfce7' : trip.status === 'ongoing' ? '#dbeafe' : '#fef3c7', color: trip.status === 'completed' ? '#15803d' : trip.status === 'ongoing' ? '#0c4a6e' : '#92400e', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize' }}>{trip.status || 'planning'}</span>
                  </div>
                  <div style={{ background: '#F0F9FF', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, color: T.accent }}>₹{trip.totalBudget}</div>
                </div>
                
                {/* Weather and Distance Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px', padding: '12px', background: '#F8FAFC', borderRadius: '16px' }}>
                  {/* Weather Card */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                      {getWeatherEmoji(tripWeatherDistance[trip._id]?.weather?.condition)}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: T.text }}>
                      {tripWeatherDistance[trip._id]?.weather?.temp || 25}°C
                    </div>
                    <div style={{ fontSize: '10px', color: T.muted }}>Weather</div>
                  </div>
                  
                  {/* Distance Card */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>🗺️</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: T.text }}>
                      {tripWeatherDistance[trip._id]?.distance || 0} km
                    </div>
                    <div style={{ fontSize: '10px', color: T.muted }}>Distance</div>
                  </div>
                </div>
                
                <p style={{ fontSize: '12px', color: T.muted, marginBottom: '8px' }}>📅 {new Date(trip.startDate).toLocaleDateString()}</p>
                <p style={{ fontSize: '12px', color: T.muted, marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{trip.description || 'No description added'}</p>
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                  <button onClick={() => navigate(`/trip/${trip._id}`)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: T.accent, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>
                    <Eye size={14} /> Details
                  </button>
                  <button onClick={(e) => handleDeleteTrip(trip._id, e)} style={{ padding: '10px 12px', background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '32px', border: '2px dashed #E2E8F0', color: T.muted }}>
                No trips scheduled. Start your journey above! ✈️
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: T.text }}>Trending Destinations</h3>
          <button style={{ color: T.accent, background: 'none', border: 'none', fontWeight: 700, fontSize: '14px' }}>See All</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {[
            { name: 'Swiss Alps Premium', price: '₹84k', img: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=600', time: '7 Days' },
            { name: 'Kyoto Zen Valley', price: '₹62k', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600', time: '5 Days' }
          ].map((place, idx) => (
            <div key={idx} style={{ background: T.white, borderRadius: '32px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              <img src={place.img} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt={place.name} />
              <div style={{ padding: '25px' }}>
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