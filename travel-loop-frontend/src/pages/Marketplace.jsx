import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Users, Calendar, 
  Heart, Share2, Filter, Compass, Flame, 
  TrendingUp, SlidersHorizontal, Search
} from 'lucide-react';

// --- RICH EXTENDED DATA ARCHITECTURE ---
const PACKAGES_DATABASE = [
  {
    id: 1,
    name: 'Swiss Alps Luxury & Peaks',
    destination: 'Zermatt, Switzerland',
    price: 125000,
    duration: '7 Days',
    travelers: '2-4 Guests',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 324,
    category: 'adventure',
    tag: 'Best Seller',
    description: 'Carve through legendary ski slopes, ride the Glacier Express, and relax in world-class thermal spas under the peak of the Matterhorn.'
  },
  {
    id: 2,
    name: 'Bali Spiritual & Beach Haven',
    destination: 'Ubud & Uluwatu, Indonesia',
    price: 65000,
    duration: '5 Days',
    travelers: '1-2 Guests',
    image: 'https://images.unsplash.com/photo-1537225228614-b4fad34a0b60?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 512,
    category: 'beach',
    tag: 'Top Rated',
    description: 'Immerse yourself in jungle eco-resorts, pristine coastlines, cliffside sunset fire dances, and ancient hidden temples.'
  },
  {
    id: 3,
    name: 'Tokyo Neon & Kyoto Shrines',
    destination: 'Tokyo & Kyoto, Japan',
    price: 95000,
    duration: '6 Days',
    travelers: '1-4 Guests',
    image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 428,
    category: 'city',
    tag: 'Trending',
    description: 'Bridge the cultural gap between blade-runner neon skylines in Shinjuku and serene cherry blossom shrines in ancient Kyoto.'
  },
  {
    id: 4,
    name: 'Serengeti Big Five Safari',
    destination: 'Maasai Mara, Kenya',
    price: 155000,
    duration: '10 Days',
    travelers: '4-6 Guests',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 289,
    category: 'adventure',
    tag: 'Rare Finding',
    description: 'Witness the iconic Great Migration first-hand with luxury all-inclusive tented glamping camp setups and master local trackers.'
  },
  {
    id: 5,
    name: 'Parisian Lights & Romance',
    destination: 'Paris, France',
    price: 85000,
    duration: '4 Days',
    travelers: '2 Guests',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 687,
    category: 'romantic',
    tag: 'Honeymoon Choice',
    description: 'Private nighttime Seine river cruises, VIP museum access skip-the-lines, and Michelin-starred culinary dining tastings.'
  },
  {
    id: 6,
    name: 'Maldives Private Island Retreat',
    destination: 'Ba Atoll, Maldives',
    price: 175000,
    duration: '8 Days',
    travelers: '2 Guests',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 156,
    category: 'luxury',
    tag: 'Ultra-Luxe',
    description: 'Wake up in exclusive overwater bungalows featuring slide down access to house coral reefs, glass floors, and personal 24/7 butlers.'
  },
  {
    id: 7,
    name: 'Patagonia Ice Trekking Expedition',
    destination: 'El Calafate, Argentina',
    price: 190000,
    duration: '9 Days',
    travelers: '2-3 Guests',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 114,
    category: 'adventure',
    tag: 'New Adventure',
    description: 'Strap on crampons to step onto the shifting turquoise ice sheets of Perito Moreno glacier before warming up in cozy wood log chalets.'
  },
  {
    id: 8,
    name: 'Santorini Sunset Caldera Cruise',
    destination: 'Santorini, Greece',
    price: 110000,
    duration: '6 Days',
    travelers: '2 Guests',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 894,
    category: 'romantic',
    tag: 'Iconic Views',
    description: 'Unwind amidst white-washed cliff houses overlooking deep-blue Aegean waters, sailing catamarans, and infinite edge pools.'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Experiences', icon: <Compass className="w-4 h-4" /> },
  { id: 'adventure', label: 'Adventure', icon: <Flame className="w-4 h-4" /> },
  { id: 'beach', label: 'Beach & Coast', icon: '🏖️' },
  { id: 'city', label: 'Metropolis', icon: '🏙️' },
  { id: 'romantic', label: 'Romantic Escape', icon: '💕' },
  { id: 'luxury', label: 'Elite Luxury', icon: '👑' }
];

const Marketplace = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(200000);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFavorite = (e, id) => {
    e.stopPropagation(); // Prevents clicking the heart from opening the details page card trigger
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const sharePackage = (e, pkgName) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: pkgName, text: `Check out this trip!`, url: window.location.href });
    } else {
      alert(`Link copied for: ${pkgName}`);
    }
  };

  // Performance Optimization: Cache heavy computations across component re-renders
  const filteredPackages = useMemo(() => {
    return PACKAGES_DATABASE.filter(pkg => {
      const categoryMatch = selectedCategory === 'all' || pkg.category === selectedCategory;
      const priceMatch = pkg.price <= priceRange;
      const textMatch = 
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priceMatch && textMatch;
    });
  }, [selectedCategory, priceRange, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* --- STICKY CONTEXT HEADER --- */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Premium Marketplace</h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  <TrendingUp className="w-3 h-3" /> Curated Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block">Tailor-made itineraries constructed by expert regional travel concierges.</p>
            </div>
          </div>
          
          {/* Global Smart Search Bar */}
          <div className="relative flex-1 max-w-xs md:max-w-sm hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search destinations, experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder-slate-400 font-medium"
            />
          </div>
        </div>
      </header>

      {/* --- REFINED CONTROL HUB (FILTERS) --- */}
      <section className="bg-white border-b border-slate-200 py-6 sticky top-20 z-30 shadow-sm shadow-slate-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          
          {/* Horizontal Category Pill Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 focus:outline-none ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Granular Slider controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-slate-500">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Budget Parameter</span>
                  <span className="text-slate-700 font-mono">Max: ₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="200000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="text-xs text-slate-400 font-medium self-end sm:self-auto">
              Showing <span className="font-bold text-slate-800 font-mono">{filteredPackages.length}</span> destinations matching filters
            </div>
          </div>
        </div>
      </section>

      {/* --- DYNAMIC PACKAGES ENGINE (GRID) --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 max-w-md mx-auto px-6">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Match Found</h3>
            <p className="text-sm text-slate-500 mt-1">Try broadening your pricing scale or modifying experience filters.</p>
            <button 
              onClick={() => { setPriceRange(200000); setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredPackages.map(pkg => {
              const isFavorited = favorites.includes(pkg.id);
              return (
                <article
                  key={pkg.id}
                  onClick={() => alert(`Navigating to dynamic dashboard details page for package context ID: ${pkg.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300/70 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Image Frame Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                    />
                    
                    {/* Abstract Floating Pill Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white bg-slate-950/70 backdrop-blur-md rounded-md shadow-sm">
                        {pkg.category}
                      </span>
                      {pkg.tag && (
                        <span className="px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100/50 rounded-md">
                          {pkg.tag}
                        </span>
                      )}
                    </div>

                    {/* Action Hub overlay buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => sharePackage(e, pkg.name)}
                        className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                        title="Share Package Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => toggleFavorite(e, pkg.id)}
                        className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all shadow-sm group/heart"
                        title={isFavorited ? "Remove from Vault" : "Save to Favorites"}
                      >
                        <Heart 
                          className={`w-4 h-4 transition-transform group-hover/heart:scale-110 ${
                            isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-600'
                          }`} 
                        />
                      </button>
                    </div>
                  </div>

                  {/* Body Details Context */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-slate-500 min-w-0">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="text-xs font-semibold truncate">{pkg.destination}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-bold text-amber-900">{pkg.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                        {pkg.name}
                      </h3>
                      
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Meta Parameters Microgrid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> 
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end sm:justify-start">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> 
                        <span className="truncate">{pkg.travelers}</span>
                      </div>
                    </div>

                    {/* Pricing Block Footer action wrapper */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Investment</span>
                        <span className="text-lg font-black text-slate-900 tracking-tight font-mono">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button 
                        className="px-4 py-2.5 bg-slate-900 group-hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:shadow-blue-500/10 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                      >
                        Explore Itinerary
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;