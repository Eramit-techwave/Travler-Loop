import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
  Plane, MapPin, Calendar, LayoutDashboard, 
  Settings, LogOut, Bell, Star, Menu, X,
  Compass, Users, TrendingUp, ShieldCheck, Clock, Trash2, Eye, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('Explorer');
  const [myTrips, setMyTrips] = useState([]);
  const [tripStats, setTripStats] = useState({ total: 0, completed: 0, ongoing: 0, planning: 0 });
  const [hoveredTripId, setHoveredTripId] = useState(null);
  
  // Custom Dynamic Dropdown Toggle State for Main Navigation
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);

  const [bookingData, setBookingData] = useState({ 
    origin: '',
    destination: '', 
    startDate: '', 
    travelers: '1 Person',
    budget: ''
  });

  const [tripWeatherDistance, setTripWeatherDistance] = useState({});

  // Close Navigation menu on outside click context
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      const apiUrl = import.meta.env.VITE_API_URL || 'https://travler-loop.onrender.com';
      const response = await axios.get(`${apiUrl}/api/trips/my-trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMyTrips(response.data.data);
        if (response.data.stats) {
          setTripStats(response.data.stats);
        }
        
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

    const weatherRefreshInterval = setInterval(() => {
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

      const apiUrl = import.meta.env.VITE_API_URL || 'https://travler-loop.onrender.com';
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
        const apiUrl = import.meta.env.VITE_API_URL || 'https://travler-loop.onrender.com';
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
    { label: 'Total Expeditions', value: tripStats.total.toString().padStart(2, '0'), icon: Plane, bgStyle: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { label: 'Journeys Completed', value: tripStats.completed.toString().padStart(2, '0'), icon: ShieldCheck, bgStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'In Active Planning', value: tripStats.planning.toString().padStart(2, '0'), icon: Calendar, bgStyle: 'bg-amber-50 text-amber-600 border-amber-200' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] antialiased text-slate-900 relative">
      
      {/* ── TOP UTILITY NAVIGATION HEADER (FULL WIDTH EXPERIENCE) ── */}
      <header className="w-full h-24 bg-white border-b border-slate-200/80 sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between shadow-sm shadow-slate-100/50">
        
        {/* Left Segment: Logo and Dynamic Action Dropdown Menu Trigger */}
        <div className="flex items-center gap-6 relative" ref={navRef}>
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-2.5 rounded-xl text-white shadow-md">
              <Plane className="w-5 h-5 rotate-45" />
            </div>
            <span className="text-lg font-black tracking-widest text-slate-950 hidden sm:block">TRAVELOOP</span>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* DYNAMIC ACTION NAVIGATION MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 shadow-2xs ${
              isNavOpen 
                ? 'bg-slate-950 text-white border-slate-950 ring-4 ring-slate-900/5' 
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
            }`}
          >
            {isNavOpen ? <X className="w-4 h-4 text-indigo-400" /> : <Menu className="w-4 h-4 text-indigo-600" />}
            <span>Main Navigation</span>
          </button>

          {/* FLOATING DROPDOWN LIST CONTAINER */}
          {isNavOpen && (
            <div className="absolute top-14 left-0 sm:left-44 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block px-3 py-1.5">Hub Navigation</span>
              {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
                { id: 'trips', icon: Compass, label: 'My Expeditions' },
                { id: 'trending', icon: TrendingUp, label: 'Marketplace' },
                { id: 'settings', icon: Settings, label: 'Preferences' }
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button 
                    key={item.id} 
                    type="button"
                    onClick={() => {
                      setIsNavOpen(false);
                      if (item.id === 'trending') navigate('/marketplace');
                      else if (item.id === 'settings') navigate('/preferences');
                      else setActiveTab(item.id);
                    }} 
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-colors ${
                      isActive 
                        ? 'bg-slate-950 text-white' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <div className="h-px bg-slate-100 my-2" />
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl text-xs sm:text-sm font-bold transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log Out Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Segment: Notifications and Profile Interface */}
        <div className="flex items-center gap-4">
          <button className="p-3 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl border border-slate-200 shadow-2xs relative transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-indigo-600 rounded-full ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-3 bg-white pr-4 sm:pr-5 pl-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white font-black text-sm shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-wide hidden sm:block">{userName}</span>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE SURFACE (INFINITE SCREEN HORIZON SPACE) ── */}
      <main className="w-full px-6 lg:px-12 py-10 mx-auto max-w-7xl">
        
        {/* HERO WELCOME GREETING */}
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
            Welcome, <span className="text-indigo-600">{userName}</span> ✨
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-1 font-semibold">Orchestrate your next custom routes and operational manifests seamlessly.</p>
        </div>

        {/* HIGH-VISIBILITY COMPACT FORM ENTRY STRIP */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mb-10">
          <div className="flex items-center gap-2.5 mb-5 px-1">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest">Deploy New Expedition Manifest</h3>
          </div>
          
          <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
            <div className="space-y-1.5 px-0.5">
              <span className="text-xs font-black tracking-wider text-slate-500 uppercase block">Leaving From</span>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-slate-400 rounded-xl px-4 py-3 transition-all">
                <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                <input required name="origin" type="text" value={bookingData.origin} onChange={handleInputChange} placeholder="Origin city" className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-900 placeholder-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5 px-0.5">
              <span className="text-xs font-black tracking-wider text-slate-500 uppercase block">Going To</span>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-slate-400 rounded-xl px-4 py-3 transition-all">
                <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                <input required name="destination" type="text" value={bookingData.destination} onChange={handleInputChange} placeholder="Where to?" className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-900 placeholder-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5 px-0.5">
              <span className="text-xs font-black tracking-wider text-slate-500 uppercase block">Departure Date</span>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-slate-400 rounded-xl px-4 py-3 transition-all">
                <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
                <input required name="startDate" type="date" value={bookingData.startDate} onChange={handleInputChange} className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-700 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-1.5 px-0.5">
              <span className="text-xs font-black tracking-wider text-slate-500 uppercase block">Travelers Matrix</span>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-slate-400 rounded-xl px-4 py-3 transition-all">
                <Users className="w-5 h-5 text-indigo-600 shrink-0" />
                <select name="travelers" value={bookingData.travelers} onChange={handleInputChange} className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-700 cursor-pointer appearance-none">
                  <option>1 Person</option><option>2 Persons</option><option>4 Persons</option><option>Group (5+)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 px-0.5">
              <span className="text-xs font-black tracking-wider text-slate-500 uppercase block">Budget (₹)</span>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-slate-400 rounded-xl px-4 py-3 transition-all">
                <span className="font-extrabold text-indigo-600 text-sm shrink-0">₹</span>
                <input required name="budget" type="number" value={bookingData.budget} onChange={handleInputChange} placeholder="Max amount" className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-900 placeholder-slate-400" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-slate-950 hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-md transition-all duration-150">
              {isLoading ? 'Sending...' : 'Deploy Route'}
            </button>
          </form>
        </section>

        {/* METRICS DISPATCH MODULE CARD INDEX */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-sm transition-all duration-150">
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{stat.value}</h4>
              </div>
              <div className={`p-4 rounded-xl border ${stat.bgStyle} shadow-2xs`}>
                <stat.icon className="w-5 h-5 stroke-[2px]" />
              </div>
            </div>
          ))}
        </section>

        {/* DYNAMIC ACTIVE EXPEDITIONS RECOGNITION LIST */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-400">Your Active Expeditions</h3>
            <button onClick={fetchMyTrips} className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-slate-950 transition-colors bg-white border border-slate-200 shadow-2xs px-4 py-2 rounded-xl">
              <Clock className="w-4 h-4" /> Sync Registry
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {myTrips.length > 0 ? myTrips.map((trip, idx) => (
              <article 
                key={trip._id || idx}
                onClick={() => navigate(`/trip/${trip._id}`)} 
                onMouseEnter={() => setHoveredTripId(trip._id)} 
                onMouseLeave={() => setHoveredTripId(null)} 
                className={`group bg-white rounded-2xl p-6 border transition-all duration-150 flex flex-col justify-between cursor-pointer relative shadow-2xs ${
                  hoveredTripId === trip._id ? 'border-slate-400 shadow-sm' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-lg text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{trip.tripName}</h4>
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest border ${
                        trip.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        trip.status === 'ongoing' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {trip.status || 'planning'}
                      </span>
                    </div>
                    <div className="text-sm md:text-base font-black text-slate-900 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                      ₹{trip.totalBudget.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  {/* Weather Telemetry Matrix Readouts */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl mb-4 text-center border border-slate-100">
                    <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-2xl block">{getWeatherEmoji(tripWeatherDistance[trip._id]?.weather?.condition)}</span>
                      <span className="text-sm font-black text-slate-900 font-mono block mt-1">{tripWeatherDistance[trip._id]?.weather?.temp || 25}°C</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-xl block mt-0.5">🗺️</span>
                      <span className="text-sm font-black text-slate-900 font-mono block mt-1.5">{(tripWeatherDistance[trip._id]?.distance || 0).toLocaleString()} km</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 mb-5 text-xs font-bold text-slate-500">
                    <p className="flex items-center gap-2 text-slate-700"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(trip.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                    <p className="line-clamp-2 leading-relaxed text-slate-400 font-medium italic">"{trip.description || 'No overview configured.'}"</p>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate(`/trip/${trip._id}`); }} 
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-950 text-white hover:bg-indigo-600 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-colors duration-150"
                  >
                    <Eye className="w-4 h-4" /> Open Card
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => handleDeleteTrip(trip._id, e)} 
                    className="p-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            )) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200 px-6 text-slate-400 text-sm font-medium tracking-wide">
                No active trip entries found inside this project manifest space.
              </div>
            )}
          </div>
        </section>

        {/* CURATED EXTERNAL DECK HIGHLIGHT INDEX */}
        <section className="pb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Curated Escape Profiles</h3>
            <button type="button" onClick={() => navigate('/marketplace')} className="text-xs font-bold text-indigo-600 hover:text-slate-950 transition-colors">See Complete Index</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Swiss Alps Premium Luxury Pack', price: '₹84,000', img: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=600', time: '7 Days' },
              { name: 'Kyoto Zen Hidden Shrines Tour', price: '₹62,000', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600', time: '5 Days' }
            ].map((place, idx) => (
              <div key={idx} className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-2xl flex flex-col sm:flex-row transition-all duration-150 hover:shadow-md">
                <div className="sm:w-44 h-44 sm:h-auto overflow-hidden bg-slate-50 shrink-0 relative">
                  <img src={place.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" alt={place.name} />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-md text-[10px] font-black tracking-widest text-slate-900 rounded-md shadow-sm uppercase">{place.time}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-base md:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{place.name}</h4>
                    <p className="text-xs md:text-sm text-slate-400 font-semibold">All-inclusive localized premium route setup.</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-5 sm:mt-0">
                    <span className="text-lg font-black text-emerald-600 font-mono">{place.price}</span>
                    <button type="button" onClick={() => navigate('/marketplace')} className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-slate-950 transition-colors">Explore</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;