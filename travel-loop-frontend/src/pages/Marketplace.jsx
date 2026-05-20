import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Users, Calendar, 
  Heart, Share2, SlidersHorizontal, Search, RotateCcw, HelpCircle, Globe, Landmark, Compass
} from 'lucide-react';

// --- REAL-WORLD GEOGRAPHIC HISTORICAL MATRICES ---
const INDIAN_DESTINATIONS = [
  { name: 'Taj Mahal Imperial Wonder', city: 'Agra', region: 'Uttar Pradesh', type: 'historic', what: 'The ultimate pinnacle of Mughal white-marble architecture commissioned in 1632 by Emperor Shah Jahan.', why: 'Built as a monumental mausoleum to house the tomb of Mumtaz Mahal, symbolizing timeless architectural dedication.', how: 'Direct high-speed Gatimaan Express train loops operating daily straight out of New Delhi central terminal tracks.' },
  { name: 'Ayodhya Ram Mandir Divine Dham', city: 'Ayodhya', region: 'Uttar Pradesh', type: 'devotional', what: 'The newly inaugurated traditional Nagara-style grand temple complex standing at the Ram Janmabhoomi site.', why: 'Revered universally as the sacred birthplace of Lord Rama, serving as a core anchor of Hindu history and spiritual identity.', how: 'Fly directly into the newly operational Maharishi Valmiki International Airport followed by private premium sedans.' },
  { name: 'Kashi Vishwanath Sacred Sanctum', city: 'Varanasi', region: 'Uttar Pradesh', type: 'devotional', what: 'One of the oldest continuously living spiritual hubs holding the holy Jyotirlinga temple complex beside the Ganga.', why: 'The beating spiritual heart of India where timeless Vedic evening Ganga Aarti rituals have run uninterrupted for centuries.', how: 'Best explored via private dawn wooden boat cruises navigating alongside the historical river ghat networks.' },
  { name: 'Kedarnath Himalayan High Shrine', city: 'Kedarnath', region: 'Uttarakhand', type: 'devotional', what: 'An ancient stone temple structure dedicated to Lord Shiva, resting at 11,755 feet in the snow-capped Garhwal Himalayas.', why: 'One of the holiest Chardham mountain shrines traditionally built by the Pandavas to tap immense cosmic energy lines.', how: 'Reach via an intensive 16km mountain valley trek from Gaurikund base or premium private heli-charter flight slots.' },
  { name: 'Somnath Temple Oceanic Mandir', city: 'Veraval', region: 'Gujarat', type: 'devotional', what: 'The legendary first holy Jyotirlinga shrine constructed architectural-scale directly on the rocky edge of the Arabian Sea.', why: 'A magnificent historical symbol of cultural resilience, reconstructed seven times across history after major invasions.', how: 'Seamless highway routes connecting out from Rajkot junctions or Diu coastal airport bays paired with premium guides.' },
  { name: 'Dwarkadhish Lord Krishna Kingdom', city: 'Dwarka', region: 'Gujarat', type: 'devotional', what: 'A majestic 5-story chalcolithic temple structure architectural layout tracing back over 2,500 years of coastal legacy.', why: 'Stands as the historical capital administrative kingdom established by Lord Krishna on the western tip of the peninsula.', how: 'Connected smoothly via broad-gauge express rail links routing through Jamnagar and Ahmedabad railway distribution lines.' },
  { name: 'Sun Temple Stone Chariot', city: 'Konark', region: 'Odisha', type: 'historic', what: 'A monumental 13th-century stone temple engineered completely as a massive astronomical chariot with 24 intricate wheels.', why: 'Built by King Narasimhadeva I to honor the Sun God Surya, displaying flawless medieval structural mathematics.', how: 'A scenic 1-hour smooth coastal marine drive operating directly out from Biju Patnaik International Airport in Bhubaneswar.' },
  { name: 'Meenakshi Amman Dravidian Splendor', city: 'Madurai', region: 'Tamil Nadu', type: 'devotional', what: 'A massive 14-gopuram active temple complex containing over 33,000 highly detailed multicolored stone deity sculptures.', why: 'The historical cultural nucleus of ancient Sangam literature traditions and sophisticated classical geometry.', how: 'Direct global connections via Madurai International Airport terminals paired with specialized city historians.' },
  { name: 'Brihadeeswarar Chola Masterpiece', city: 'Thanjavur', region: 'Tamil Nadu', type: 'historic', what: 'The grand all-granite living temple structure constructed completely without using any binding material elements.', why: 'Built by Emperor Raja Raja Chola I in 1010 AD to manifest the absolute sovereign wealth and security of the empire.', how: 'Bespoke private car arrangements operating straight from Trichy international airport hubs running through local fields.' },
  { name: 'Hampi Vijayanagara Ruin Citadels', city: 'Hampi', region: 'Karnataka', type: 'historic', what: 'An expansive UNESCO boulder landscape containing detailed monolithic stone carvings, aqueducts, and royal stables.', why: 'The prosperous historical capital city of the extraordinarily wealthy medieval Hindu Vijayanagara Empire network.', how: 'Overnight premium train options or regional direct executive charter flights into the close Jindal Vidyanagar airstrip.' },
  { name: 'Khajuraho Chandela Sculpted Shrines', city: 'Khajuraho', region: 'Madhya Pradesh', type: 'historic', what: 'A refined group of medieval Nagara-style temples intricately carved out of rich golden sandstone rock blocks.', why: 'Commissioned by the Chandela Rajput dynasty to celebrate cosmic balance, spiritual integration, and earthly emotions.', how: 'Direct daily flight tracks linking out from New Delhi directly to the newly upgraded Khajuraho domestic runways.' },
  { name: 'Golden Temple Sanctum of Harmandir', city: 'Amritsar', region: 'Punjab', type: 'devotional', what: 'The ultimate holy shrine of Sikhism layered in pure gold sheets, floating inside a massive curative water tank (Amrit Sarovar).', why: 'Designed by Guru Arjan Dev to actively preach universal human equality, open access doorways, and selfless community service.', how: 'Fly straight into Sri Guru Ram Dass Jee International Airport paired with VIP private vehicle hotel transfers.' }
];

const INTERNATIONAL_DESTINATIONS = [
  { name: 'Giza Great Pyramids Complex', country: 'Egypt', type: 'historic', what: 'The last remaining wonder of the ancient world built using 2.3 million interlocking limestone block units.', why: 'Built as monumental royal resurrection tombs for old-kingdom Pharaohs over 4,500 historical years ago.', how: 'Private desert camel caravans led by specialized accredited academic Egyptologists tracking historical records.' },
  { name: 'Colosseum & Roman Forum Spaces', country: 'Italy', type: 'historic', what: 'The massive stone and concrete freestanding stadium layout constructed under the Flavian emperors.', why: 'The central public amphitheater hosting gladiatorial combat matches, public drama displays, and ancient Roman assemblies.', how: 'Skip-the-line early morning executive entries arranged via curated historic custom access tokens.' },
  { name: 'Angkor Wat Khmer Empire Spire', country: 'Cambodia', type: 'devotional', what: 'The largest religious monument infrastructure layout on earth with iconic stone lotus towers hidden deep inside the jungle.', why: 'Originally engineered as a grand Hindu temple layout for Lord Vishnu before transforming into a regional Buddhist hub.', how: 'Private temple tour configurations deploying directly via luxury vehicles from Siem Reap international air terminals.' },
  { name: 'Parthenon Acropolis Citadel Trails', country: 'Greece', type: 'historic', what: 'The ancient white-marble classical fortress complex standing tall over the historic modern city line of Athens.', why: 'Built in the 5th Century BC to house the legendary goddess Athena and celebrate foundational human democracy concepts.', how: 'Bespoke sunset walking tours coupled with custom access parameters to private archaeological museum displays.' },
  { name: 'Machu Picchu Incan Sanctuary Mountain', country: 'Peru', type: 'historic', what: 'A pristine 15th-century hidden Incan citadel built high into the mist-covered ridge lines of the Andes mountain ranges.', why: 'An elite imperial country estate matching advanced celestial astrological alignments and complex agriculture terrace rules.', how: 'The high-end Hiram Bingham private luxury vintage train operating directly out of historical Cusco stations.' },
  { name: 'Petra Rose-Red Nabatean Canyon', country: 'Jordan', type: 'historic', what: 'An entire commercial trading trading city carved into deep desert canyon sandstone walls through exquisite cliffside engineering.', why: 'The wealthy ancient desert capital city of the Nabataeans controlling critical historic silk, spice, and incense trade routes.', how: 'Horseback or walking access passing down through the massive narrow canyon gorge framework known globally as the Siq.' },
  { name: 'Kyoto Fushimi Inari Torii Shrines', country: 'Japan', type: 'devotional', what: 'A beautiful dense mountain path layout layered neatly underneath over 10,000 vivid vermilion wooden Shinto Torii gates.', why: 'Dedicated traditionally to Inari, the ancient Shinto deity of mountain rice, commercial success, and overall house prosperity.', how: 'Bespoke custom walking tracks arranged directly out from historical Kyoto imperial boutique ryokan hotels.' },
  { name: 'Vatican St. Peters Basilica Crypts', country: 'Vatican City', type: 'devotional', what: 'The ultimate global epicenter of Catholic architecture holding artistic masterpieces created by Michelangelo and Bernini.', why: 'The sacred historical burial site of St. Peter, standing as the supreme operational core of Christian art history records.', how: 'VIP private morning gallery access skip-the-crowds managed via certified art history research curators.' }
];

const AMBIENT_TAGS = ['Best Seller', 'UNESCO Heritage', 'Ancient Wonder', 'Rare Experience', 'Top Rated'];

// --- HIGH-RESOLUTION STABLE TRAVEL MEDIA CDN POOLS ---
const DEVOTIONAL_POOL = [
  'https://images.unsplash.com/photo-1561361531-99e224e9f331?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542442828-287217bfb87f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1707150146036-7c6cc299719f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80'
];

const HISTORICAL_POOL = [
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600577916048-804c9191e36c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800&auto=format&fit=crop&q=80'
];

// DATA STABILITY REGISTRY GENERATOR (212 UNIQUE CHRONICLE NODES)
const generateComprehensiveDatabase = () => {
  const masterList = [];
  let currentId = 1;

  for (let i = 0; i < 212; i++) {
    const isIndia = i % 2 === 0;
    const tag = AMBIENT_TAGS[i % AMBIENT_TAGS.length];
    const rating = parseFloat((4.6 + (i % 5) * 0.1).toFixed(1));
    const reviews = 180 + (i * 12);
    const duration = `${4 + (i % 4)} Days`;
    const travelers = i % 3 === 0 ? '1-2 Guests' : '2-4 Guests';

    if (isIndia) {
      const source = INDIAN_DESTINATIONS[i % INDIAN_DESTINATIONS.length];
      const targetImg = source.type === 'devotional' 
        ? DEVOTIONAL_POOL[i % DEVOTIONAL_POOL.length] 
        : HISTORICAL_POOL[i % HISTORICAL_POOL.length];

      masterList.push({
        id: currentId++,
        name: `${source.name} - Unit ${Math.floor(i / INDIAN_DESTINATIONS.length) + 1}`,
        destination: `${source.city}, ${source.region}`,
        scope: 'india',
        type: source.type,
        price: 18000 + ((i % 15) * 6500),
        duration, travelers, rating, reviews, tag,
        image: targetImg,
        category: source.type === 'devotional' ? 'adventure' : 'luxury',
        description: `Embark on an immersive cultural journey exploring the sacred legacy structures inside historical ${source.city}.`,
        what: source.what, why: source.why, how: source.how
      });
    } else {
      const source = INTERNATIONAL_DESTINATIONS[i % INTERNATIONAL_DESTINATIONS.length];
      const targetImg = source.type === 'devotional' 
        ? DEVOTIONAL_POOL[(i + 1) % DEVOTIONAL_POOL.length] 
        : HISTORICAL_POOL[(i + 1) % HISTORICAL_POOL.length];

      masterList.push({
        id: currentId++,
        name: `${source.name} Premium - ${Math.floor(i / INTERNATIONAL_DESTINATIONS.length) + 1}`,
        destination: source.country,
        scope: 'international',
        type: source.type,
        price: 65000 + ((i % 12) * 11000),
        duration, travelers, rating, reviews, tag,
        image: targetImg,
        category: source.type === 'devotional' ? 'adventure' : 'city',
        description: `Cross dynamic global map boundaries to investigate the unique ancestral engineering of ${source.country}.`,
        what: source.what, why: source.why, how: source.how
      });
    }
  }
  return masterList;
};

const PACKAGES_DATABASE = generateComprehensiveDatabase();

const Marketplace = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(200000);
  const [scopeFilter, setScopeFilter] = useState('all'); 
  const [flippedCardIds, setFlippedCardIds] = useState([]);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const sharePackage = (e, pkgName) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: pkgName, text: `Check out this itinerary!`, url: window.location.href });
    } else {
      alert(`Link copied for: ${pkgName}`);
    }
  };

  const handleCardFlipToggle = (id) => {
    setFlippedCardIds(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  const filteredPackages = useMemo(() => {
    return PACKAGES_DATABASE.filter(pkg => {
      let scopeMatch = true;
      if (scopeFilter === 'india') scopeMatch = pkg.scope === 'india';
      else if (scopeFilter === 'international') scopeMatch = pkg.scope === 'international';
      else if (scopeFilter === 'devotional') scopeMatch = pkg.type === 'devotional';

      const priceMatch = pkg.price <= priceRange;

      const textMatch = 
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.tag.toLowerCase().includes(searchQuery.toLowerCase());

      return scopeMatch && priceMatch && textMatch;
    });
  }, [scopeFilter, priceRange, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* 3D MECHANICAL CONFIGURATION PERSPECTIVE SHEET */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-canvas { perspective: 1600px; }
        .flipper-node {
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);
          transform-style: preserve-3d;
          position: relative;
        }
        .node-flipped { transform: rotateY(180deg); }
        .face-front, .face-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
        }
        .face-back { transform: rotateY(180deg); }
        .no-scroller::-webkit-scrollbar { display: none; }
        .no-scroller { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* ── CONTEXT BRAND HEADER BAR ── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200/60 shadow-2xs focus:outline-none"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">Heritage Hub</h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/60">
                  {PACKAGES_DATABASE.length} Coordinates Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold hidden sm:block">Click any card image frame to rotate and view architectural details.</p>
            </div>
          </div>
          
          {/* Smart Live Text Query Input */}
          <div className="relative flex-1 max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Ram Mandir, Taj Mahal, Rome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-bold text-slate-800 placeholder-slate-400 shadow-2xs"
            />
          </div>
        </div>
      </header>

      {/* ── BROAD FILTER ENGINE HUBS DECK ── */}
      <section className="bg-white border-b border-slate-200 py-5 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Scope Segmentation Pills Selection Layout */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scroller">
            {[
              { id: 'all', label: 'All Global Expeditions', icon: <Compass className="w-4 h-4" /> },
              { id: 'india', label: 'Domestic India Tours 🇮🇳', icon: <Landmark className="w-4 h-4" /> },
              { id: 'international', label: 'International Escapes 🌍', icon: <Globe className="w-4 h-4" /> },
              { id: 'devotional', label: 'Devotional Heritage Shrines ✨', icon: null }
            ].map(pill => {
              const isSelected = scopeFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => { setScopeFilter(pill.id); setFlippedCardIds([]); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black tracking-wide uppercase whitespace-nowrap transition-all border outline-none ${
                    isSelected 
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-950/10 scale-[1.01]' 
                      : 'bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-200/60'
                  }`}
                >
                  {pill.icon && <span className="shrink-0">{pill.icon}</span>}
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Budget tracker sliding scales */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-0.5">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 shadow-2xs">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                  <span>Investment Scope Parameter</span>
                  <span className="text-slate-800 font-mono">Max: ₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="200000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-slate-950 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="text-xs text-slate-400 font-extrabold uppercase tracking-wider bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl shadow-2xs">
              Matches Unlocked: <span className="text-indigo-600 font-mono text-sm pl-1">{filteredPackages.length} Itineraries</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPACT HIGH-DEFINITION 3D FLIP TILES GRID ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 max-w-md mx-auto px-6">
            <h3 className="text-base font-bold text-slate-900">No Target Manifest Located</h3>
            <p className="text-sm text-slate-500 mt-1">Try expanding budget scales or tweaking parameters.</p>
            <button 
              onClick={() => { setPriceRange(200000); setScopeFilter('all'); setSearchQuery(''); }}
              className="mt-5 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredPackages.map(pkg => {
              const isFavorited = favorites.includes(pkg.id);
              const isFlipped = flippedCardIds.includes(pkg.id);
              
              return (
                <div key={pkg.id} className="perspective-canvas h-[420px] w-full">
                  <div className={`flipper-node w-full h-full ${isFlipped ? 'node-flipped' : ''}`}>
                    
                    {/* ── SIDE A: VIEWPORT FRONT FACE LAYER (COMPACT & DENSE) ── */}
                    <div className="face-front bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs flex flex-col justify-between">
                      
                      {/* Expanded Immersive Image Frame */}
                      <div 
                        onClick={() => handleCardFlipToggle(pkg.id)}
                        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 cursor-pointer group"
                        title="Click image to reveal detailed site documentation logs"
                      >
                        <img 
                          src={pkg.image} 
                          alt={pkg.name} 
                          loading="lazy" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                        
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="px-3 py-1.5 bg-white/95 text-[11px] font-black uppercase tracking-wider text-slate-950 rounded-lg shadow-sm border border-slate-200">
                            Read Chronicles 🔄
                          </span>
                        </div>

                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded shadow-xs">
                            {pkg.scope}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-extrabold text-slate-800 bg-white border border-slate-100 rounded shadow-xs">
                            {pkg.tag}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                          <button
                            onClick={(e) => sharePackage(e, pkg.name)}
                            className="w-8 h-8 bg-white/95 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => toggleFavorite(e, pkg.id)}
                            className="w-8 h-8 bg-white/95 rounded-xl flex items-center justify-center transition-colors shadow-2xs"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Tightly Nested Description Text Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-slate-400 min-w-0">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span className="text-xs font-bold truncate text-slate-500">{pkg.destination}</span>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span className="text-[10px] font-black text-amber-900">{pkg.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <h3 className="text-sm font-black text-slate-950 tracking-tight leading-tight line-clamp-1">
                            {pkg.name}
                          </h3>
                          
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>

                        {/* Metadata Parameter Info Sub-row */}
                        <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 
                            <span>{pkg.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5 justify-end sm:justify-start">
                            <Users className="w-3.5 h-3.5 text-slate-400" /> 
                            <span className="truncate">{pkg.travelers}</span>
                          </div>
                        </div>

                        {/* Footer cost parameters tracking layout */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Estimated Cost</span>
                            <span className="text-base font-black text-slate-950 font-mono tracking-tight">
                              ₹{pkg.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <button 
                            onClick={() => alert(`Launching itinerary setup routing loop for ID: ${pkg.id}`)}
                            className="px-3.5 py-2 bg-slate-950 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition-colors duration-150"
                          >
                            Lock Route
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* ── SIDE B: VIEWPORT REVERSE PACKAGES LOGS PANEL LAYER ── */}
                    <div className="face-back bg-[#0F172A] rounded-2xl border border-slate-800 p-4 shadow-2xl flex flex-col justify-between text-slate-200">
                      
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-indigo-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chronicle Profile Logs</span>
                        </div>
                        <button 
                          onClick={() => handleCardFlipToggle(pkg.id)}
                          className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3 text-indigo-400" /> Return Face
                        </button>
                      </div>

                      {/* Primary Textual Insights Content Body */}
                      <div className="flex-1 py-2.5 space-y-3 overflow-y-auto no-scroller pr-0.5">
                        <div className="space-y-0.5">
                          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">What is this coordinate?</h4>
                          <p className="text-xs text-slate-300 leading-normal font-semibold">{pkg.what}</p>
                        </div>

                        <div className="space-y-0.5">
                          <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Why is it historically vital?</h4>
                          <p className="text-xs text-slate-300 leading-normal font-semibold">{pkg.why}</p>
                        </div>

                        <div className="space-y-0.5">
                          <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">How is transit operated?</h4>
                          <p className="text-xs text-slate-300 leading-normal font-semibold">{pkg.how}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500">
                        <div>
                          <span className="text-[9px] block text-slate-600 font-black">MANIFEST SEQUENCE</span>
                          <span className="font-mono text-slate-400">#HERITAGE-{pkg.id.toString().padStart(4, '0')}</span>
                        </div>
                        <button 
                          onClick={() => handleCardFlipToggle(pkg.id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider"
                        >
                          Flip Back
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;