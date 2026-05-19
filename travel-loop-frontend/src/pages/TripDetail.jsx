import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowLeft, Edit2, Trash2, Cloud, Map, Hotel, DollarSign, 
  Users, Calendar, X, Plus, Star, MapPin, Phone
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [weather, setWeather] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [availableHotels, setAvailableHotels] = useState([]);
  const [showAvailableHotels, setShowAvailableHotels] = useState(false);
  
  const [editData, setEditData] = useState({
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: '',
    totalBudget: '',
    description: ''
  });

  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    checkIn: '',
    checkOut: '',
    price: '',
    rating: ''
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTrip(response.data.data);
        setEditData({
          tripName: response.data.data.tripName,
          destination: response.data.data.destination,
          startDate: response.data.data.startDate.split('T')[0],
          endDate: response.data.data.endDate.split('T')[0],
          travelers: response.data.data.travelers,
          totalBudget: response.data.data.totalBudget,
          description: response.data.data.description
        });
        fetchWeather(tripId);
        fetchDistance(tripId);
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
      alert('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/trips/${id}/weather`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setWeather(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const fetchDistance = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/trips/${id}/distance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDistance(response.data.distance);
      }
    } catch (error) {
      console.error('Error fetching distance:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${apiUrl}/api/trips/${tripId}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTrip(response.data.data);
        setIsEditing(false);
        alert('Trip updated successfully!');
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${apiUrl}/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Trip deleted successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip');
      }
    }
  };

  const handleAddHotel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/api/trips/${tripId}/hotels`, hotelData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTrip(response.data.data);
        setHotelData({ name: '', location: '', checkIn: '', checkOut: '', price: '', rating: '' });
        setShowHotelForm(false);
        alert('Hotel booking added!');
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Failed to add hotel');
    }
  };

  const handleRemoveHotel = async (hotelId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${apiUrl}/api/trips/${tripId}/hotels/${hotelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTrip(response.data.data);
        alert('Hotel booking removed!');
      }
    } catch (error) {
      console.error('Error removing hotel:', error);
      alert('Failed to remove hotel');
    }
  };

  const searchAvailableHotels = async () => {
    if (!trip || !trip.destination) {
      alert('Destination not found');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/trips/hotels/search/${trip.destination}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success || response.data.data) {
        setAvailableHotels(response.data.data);
        setShowAvailableHotels(true);
      }
    } catch (error) {
      console.error('Error searching hotels:', error);
      alert('Failed to search hotels');
    }
  };

  const bookHotelFromSearch = async (hotel) => {
    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        name: hotel.name,
        location: hotel.location,
        checkIn: trip.startDate,
        checkOut: trip.endDate,
        price: hotel.price,
        rating: hotel.rating
      };

      const response = await axios.post(`${apiUrl}/api/trips/${tripId}/hotels`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTrip(response.data.data);
        alert(`${hotel.name} booked successfully!`);
        setShowAvailableHotels(false);
      }
    } catch (error) {
      console.error('Error booking hotel:', error);
      alert('Failed to book hotel');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading trip details...</div>;
  }

  if (!trip) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Trip not found</div>;
  }

  const getWeatherIcon = () => {
    const code = weather?.condition;
    if (code === 0 || code === 1) return '☀️';
    if (code === 2 || code === 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    return '🌤️';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: '600' }}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px' }}>{trip.tripName}</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsEditing(!isEditing)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              <Edit2 size={16} /> Edit
            </button>
            <button onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* Edit Mode */}
        {isEditing && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '2px solid #2563eb' }}>
            <h3 style={{ marginTop: 0 }}>Edit Trip</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Trip Name</label>
                <input type="text" value={editData.tripName} onChange={e => setEditData({...editData, tripName: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Destination</label>
                <input type="text" value={editData.destination} onChange={e => setEditData({...editData, destination: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Start Date</label>
                <input type="date" value={editData.startDate} onChange={e => setEditData({...editData, startDate: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>End Date</label>
                <input type="date" value={editData.endDate} onChange={e => setEditData({...editData, endDate: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Travelers</label>
                <input type="text" value={editData.travelers} onChange={e => setEditData({...editData, travelers: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Budget (₹)</label>
                <input type="number" value={editData.totalBudget} onChange={e => setEditData({...editData, totalBudget: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Description</label>
              <textarea value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box', minHeight: '80px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button onClick={handleUpdate} style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
              <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>📊 Trip Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          
          {/* Weather Card */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Cloud size={24} color="#fff" />
              <h4 style={{ margin: 0 }}>Weather</h4>
            </div>
            {weather ? (
              <>
                <div style={{ fontSize: '42px', marginBottom: '10px' }}>{getWeatherIcon()}</div>
                <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>{weather.temp}°C</p>
                <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9 }}>💧 Humidity: {weather.humidity}%</p>
                <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9 }}>💨 Wind: {weather.windSpeed} km/h</p>
              </>
            ) : (
              <p style={{ color: '#e0e7ff' }}>⏳ Loading weather...</p>
            )}
          </div>

          {/* Distance Card */}
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Map size={24} color="#fff" />
              <h4 style={{ margin: 0 }}>Distance</h4>
            </div>
            {distance ? (
              <>
                <p style={{ margin: '5px 0', fontSize: '32px', fontWeight: '800' }}>{distance} km</p>
                <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9 }}>Total route distance</p>
              </>
            ) : (
              <p style={{ color: '#e9d5ff' }}>⏳ Calculating distance...</p>
            )}
          </div>

          {/* Budget Card */}
          <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <DollarSign size={24} color="#fff" />
              <h4 style={{ margin: 0 }}>Budget</h4>
            </div>
            <p style={{ margin: '5px 0', fontSize: '28px', fontWeight: '800' }}>₹{trip.totalBudget}</p>
            <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9 }}>Total allocated budget</p>
          </div>

          {/* Travelers Card */}
          <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Users size={24} color="#fff" />
              <h4 style={{ margin: 0 }}>Travelers</h4>
            </div>
            <p style={{ margin: '5px 0', fontSize: '28px', fontWeight: '800' }}>{trip.travelers}</p>
            <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9 }}>Number of people</p>
          </div>

          {/* Status Card */}
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Calendar size={24} color="#fff" />
              <h4 style={{ margin: 0 }}>Status</h4>
            </div>
            <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', textTransform: 'capitalize' }}>{trip.status || 'planning'}</p>
            <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9 }}>Current trip status</p>
          </div>

        </div>
        </div>

        {/* Trip Details */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#0f172a' }}>Trip Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Destination</p>
              <p style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>{trip.destination}</p>
              
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Status</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: trip.status === 'completed' ? '#10b981' : trip.status === 'ongoing' ? '#3b82f6' : '#f59e0b', textTransform: 'capitalize' }}>
                {trip.status}
              </p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Dates</p>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </p>

              <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Description</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#0f172a' }}>{trip.description || 'No description'}</p>
            </div>
          </div>
        </div>

        {/* Hotels Section */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>🏨 Hotel Booking</h2>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Hotel size={24} color="#6366f1" />
              Hotel Bookings
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={searchAvailableHotels} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                🔍 Browse Hotels
              </button>
              <button onClick={() => setShowHotelForm(!showHotelForm)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                <Plus size={16} /> Add Manually
              </button>
            </div>
          </div>

          {/* Available Hotels from Search */}
          {showAvailableHotels && availableHotels.length > 0 && (
            <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: '#1e40af' }}>Available Hotels in {trip.destination}</h4>
                <button onClick={() => setShowAvailableHotels(false)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>×</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                {availableHotels.map((hotel, idx) => (
                  <div key={idx} style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e0e7ff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div>
                      <h5 style={{ margin: '0 0 5px 0', color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{hotel.name}</h5>
                      <p style={{ margin: '3px 0', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {hotel.location}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#3b82f6' }}>₹{hotel.price}</span>
                        <span style={{ fontSize: '12px', color: '#f59e0b' }}>⭐ {hotel.rating}</span>
                      </div>
                    </div>
                    <button onClick={() => bookHotelFromSearch(hotel)} style={{ padding: '8px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', width: '100%' }}>
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Hotel Form */}
          {showHotelForm && (
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #6366f1' }}>
              <h4 style={{ marginTop: 0, color: '#0f172a' }}>Add New Hotel Booking</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Hotel Name</label>
                  <input type="text" value={hotelData.name} onChange={e => setHotelData({...hotelData, name: e.target.value})} placeholder="e.g., Taj Hotel" style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Location</label>
                  <input type="text" value={hotelData.location} onChange={e => setHotelData({...hotelData, location: e.target.value})} placeholder="e.g., Downtown" style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Check-in</label>
                  <input type="date" value={hotelData.checkIn} onChange={e => setHotelData({...hotelData, checkIn: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Check-out</label>
                  <input type="date" value={hotelData.checkOut} onChange={e => setHotelData({...hotelData, checkOut: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Price (₹)</label>
                  <input type="number" value={hotelData.price} onChange={e => setHotelData({...hotelData, price: e.target.value})} placeholder="0" style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Rating (★)</label>
                  <input type="number" min="1" max="5" step="0.1" value={hotelData.rating} onChange={e => setHotelData({...hotelData, rating: e.target.value})} placeholder="4.5" style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleAddHotel} style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Book Hotel</button>
                <button onClick={() => setShowHotelForm(false)} style={{ padding: '10px 20px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Hotels List */}
          {trip.hotels && trip.hotels.length > 0 ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {trip.hotels.map((hotel, idx) => (
                <div key={idx} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Hotel size={18} color="#6366f1" />
                      {hotel.name}
                    </h4>
                    <p style={{ margin: '3px 0', fontSize: '12px', color: '#64748b' }}>
                      <MapPin size={14} style={{display: 'inline', marginRight: '4px'}} />
                      {hotel.location}
                    </p>
                    <p style={{ margin: '3px 0', fontSize: '12px', color: '#64748b' }}>
                      <Calendar size={14} style={{display: 'inline', marginRight: '4px'}} />
                      {new Date(hotel.checkIn).toLocaleDateString()} - {new Date(hotel.checkOut).toLocaleDateString()}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', fontWeight: '600', color: '#6366f1' }}>₹{hotel.price} {hotel.rating && `⭐ ${hotel.rating}`}</p>
                  </div>
                  <button onClick={() => handleRemoveHotel(hotel._id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <X size={14} /> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No hotel bookings yet. Browse or add one now!</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TripDetail;
