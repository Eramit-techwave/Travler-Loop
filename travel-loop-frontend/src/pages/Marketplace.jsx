import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Users, Calendar, DollarSign, Heart, Share2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(100000);

  const T = {
    bg: '#F1F5F9',
    accent: '#2563EB',
    text: '#0F172A',
    muted: '#64748B',
    white: '#ffffff',
  };

  // Sample marketplace packages
  const packages = [
    {
      id: 1,
      name: 'Swiss Alps Adventure',
      destination: 'Switzerland',
      price: 125000,
      duration: '7 days',
      travelers: '2-4 persons',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      rating: 4.8,
      reviews: 324,
      category: 'adventure',
      description: 'Experience breathtaking mountain views and Swiss hospitality'
    },
    {
      id: 2,
      name: 'Bali Paradise',
      destination: 'Indonesia',
      price: 65000,
      duration: '5 days',
      travelers: '1-2 persons',
      image: 'https://images.unsplash.com/photo-1537225228614-b4fad34a0b60?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 512,
      category: 'beach',
      description: 'Tropical paradise with pristine beaches and ancient temples'
    },
    {
      id: 3,
      name: 'Tokyo Modern',
      destination: 'Japan',
      price: 95000,
      duration: '6 days',
      travelers: '1-4 persons',
      image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=500&h=300&fit=crop',
      rating: 4.7,
      reviews: 428,
      category: 'city',
      description: 'Discover ancient temples and ultra-modern cities in Japan'
    },
    {
      id: 4,
      name: 'Safari Expedition',
      destination: 'Kenya',
      price: 155000,
      duration: '10 days',
      travelers: '4-6 persons',
      image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&h=300&fit=crop',
      rating: 4.6,
      reviews: 289,
      category: 'adventure',
      description: 'Wild African safari with exclusive wildlife encounters'
    },
    {
      id: 5,
      name: 'Paris Romance',
      destination: 'France',
      price: 85000,
      duration: '4 days',
      travelers: '2 persons',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 687,
      category: 'romantic',
      description: 'Romantic getaway in the city of love'
    },
    {
      id: 6,
      name: 'Maldives Luxury',
      destination: 'Maldives',
      price: 175000,
      duration: '8 days',
      travelers: '2 persons',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
      rating: 5.0,
      reviews: 156,
      category: 'luxury',
      description: 'Ultimate luxury at overwater bungalows with private beach'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Packages', icon: '🌍' },
    { id: 'adventure', label: 'Adventure', icon: '⛰️' },
    { id: 'beach', label: 'Beach', icon: '🏖️' },
    { id: 'city', label: 'City Tours', icon: '🏙️' },
    { id: 'romantic', label: 'Romantic', icon: '💕' },
    { id: 'luxury', label: 'Luxury', icon: '👑' }
  ];

  const filteredPackages = packages.filter(pkg => {
    const categoryMatch = selectedCategory === 'all' || pkg.category === selectedCategory;
    const priceMatch = pkg.price <= priceRange;
    return categoryMatch && priceMatch;
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', paddingTop: '60px' }}>
      {/* Header */}
      <div style={{ background: T.white, borderBottom: '1px solid #e2e8f0', sticky: true, top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={24} color={T.accent} />
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: T.text }}>🎁 Marketplace</h1>
          </div>
          <p style={{ color: T.muted, margin: 0 }}>Curated travel packages just for you</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: T.white, padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '20px',
                  border: selectedCategory === cat.id ? `2px solid ${T.accent}` : '1px solid #e2e8f0',
                  background: selectedCategory === cat.id ? `${T.accent}15` : T.white,
                  color: selectedCategory === cat.id ? T.accent : T.muted,
                  fontWeight: selectedCategory === cat.id ? '700' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s'
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Filter size={18} color={T.muted} />
            <input
              type="range"
              min="20000"
              max="200000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ color: T.muted, fontWeight: '600' }}>₹{priceRange.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {filteredPackages.map(pkg => (
            <div
              key={pkg.id}
              style={{
                background: T.white,
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => toggleFavorite(pkg.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: T.white,
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Heart size={20} fill={favorites.includes(pkg.id) ? '#ef4444' : 'none'} color={favorites.includes(pkg.id) ? '#ef4444' : T.muted} />
                </button>
              </div>

              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0', color: T.text }}>{pkg.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                  <MapPin size={14} color={T.muted} />
                  <span style={{ fontSize: '13px', color: T.muted }}>{pkg.destination}</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: T.text }}>{pkg.rating}</span>
                    <span style={{ fontSize: '12px', color: T.muted }}>({pkg.reviews})</span>
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: T.muted, margin: '0 0 12px 0', lineHeight: '1.5' }}>{pkg.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '12px', color: T.muted }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {pkg.duration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} /> {pkg.travelers}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: T.muted }}>Price</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: T.accent }}>₹{pkg.price.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => alert(`Added "${pkg.name}" to your favorites!`)}
                    style={{
                      flex: 1,
                      background: T.accent,
                      color: T.white,
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
