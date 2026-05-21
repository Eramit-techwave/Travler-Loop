import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Users, Calendar, 
  Heart, Share2, SlidersHorizontal, Search, RotateCcw, HelpCircle, Globe, Landmark, Compass, Sparkles
} from 'lucide-react';

// --- ACCURATE CURATED GEOGRAPHIC & HISTORICAL DATA MATRIX ---
const INDIAN_DESTINATIONS = [
  { 
    name: 'Taj Mahal Imperial Wonder', city: 'Agra', region: 'Uttar Pradesh', type: 'historic', 
    what: 'The ultimate pinnacle of Mughal white-marble architecture commissioned in 1632 by Emperor Shah Jahan.', 
    why: 'Built as a monumental mausoleum to house the tomb of Mumtaz Mahal, symbolizing timeless architectural dedication.', 
    how: 'Direct high-speed Gatimaan Express train loops operating daily straight out of New Delhi central terminal tracks.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Ayodhya Ram Mandir Divine Dham', city: 'Ayodhya', region: 'Uttar Pradesh', type: 'devotional', 
    what: 'The newly inaugurated traditional Nagara-style grand temple complex standing at the Ram Janmabhoomi site.', 
    why: 'Revered universally as the sacred birthplace of Lord Rama, serving as a core anchor of Hindu history and spiritual identity.', 
    how: 'Fly directly into the newly operational Maharishi Valmiki International Airport followed by private premium sedans.',
    image: 'https://images.unsplash.com/photo-1707150146036-7c6cc299719f?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Kashi Vishwanath Sacred Sanctum', city: 'Varanasi', region: 'Uttar Pradesh', type: 'devotional', 
    what: 'One of the oldest continuously living spiritual hubs holding the holy Jyotirlinga temple complex beside the Ganga.', 
    why: 'The beating spiritual heart of India where timeless Vedic evening Ganga Aarti rituals have run uninterrupted for centuries.', 
    how: 'Best explored via private dawn wooden boat cruises navigating alongside the historical river ghat networks.',
    image: 'https://images.unsplash.com/photo-1561361531-99e224e9f331?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Kedarnath Himalayan High Shrine', city: 'Kedarnath', region: 'Uttarakhand', type: 'devotional', 
    what: 'An ancient stone temple structure dedicated to Lord Shiva, resting at 11,755 feet in the snow-capped Garhwal Himalayas.', 
    why: 'One of the holiest Chardham mountain shrines traditionally built by the Pandavas to tap immense cosmic energy lines.', 
    how: 'Reach via an intensive 16km mountain valley trek from Gaurikund base or premium private heli-charter flight slots.',
    image: 'https://images.unsplash.com/photo-1542442828-287217bfb87f?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Somnath Temple Oceanic Mandir', city: 'Veraval', region: 'Gujarat', type: 'devotional', 
    what: 'The legendary first holy Jyotirlinga shrine constructed architectural-scale directly on the rocky edge of the Arabian Sea.', 
    why: 'A magnificent historical symbol of cultural resilience, reconstructed seven times across history after major invasions.', 
    how: 'Seamless highway routes connecting out from Rajkot junctions or Diu coastal airport bays paired with premium guides.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Dwarkadhish Lord Krishna Kingdom', city: 'Dwarka', region: 'Gujarat', type: 'devotional', 
    what: 'A majestic 5-story chalcolithic temple structure architectural layout tracing back over 2,500 years of coastal legacy.', 
    why: 'Stands as the historical capital administrative kingdom established by Lord Krishna on the western tip of the peninsula.', 
    how: 'Connected smoothly via broad-gauge express rail links routing through Jamnagar and Ahmedabad railway distribution lines.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Sun Temple Stone Chariot', city: 'Konark', region: 'Odisha', type: 'historic', 
    what: 'A monumental 13th-century stone temple engineered completely as a massive astronomical chariot with 24 intricate wheels.', 
    why: 'Built by King Narasimhadeva I to honor the Sun God Surya, displaying flawless medieval structural mathematics.', 
    how: 'A scenic 1-hour smooth coastal marine drive operating directly out from Biju Patnaik International Airport in Bhubaneswar.',
    image: 'https://images.unsplash.com/photo-1601999109332-542b18dbec57?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Meenakshi Amman Dravidian Splendor', city: 'Madurai', region: 'Tamil Nadu', type: 'devotional', 
    what: 'A massive 14-gopuram active temple complex containing over 33,000 highly detailed multicolored stone deity sculptures.', 
    why: 'The historical cultural nucleus of ancient Sangam literature traditions and sophisticated classical geometry.', 
    how: 'Direct global connections via Madurai International Airport terminals paired with specialized city historians.',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Brihadeeswarar Chola Masterpiece', city: 'Thanjavur', region: 'Tamil Nadu', type: 'historic', 
    what: 'The grand all-granite living temple structure constructed completely without using any binding material elements.', 
    why: 'Built by Emperor Raja Raja Chola I in 1010 AD to manifest the absolute sovereign wealth and security of the empire.', 
    how: 'Bespoke private car arrangements operating straight from Trichy international airport hubs running through local fields.',
    image: 'https://images.unsplash.com/photo-1610123598147-f632aa18b275?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Hampi Vijayanagara Ruin Citadels', city: 'Hampi', region: 'Karnataka', type: 'historic', 
    what: 'An expansive UNESCO boulder landscape containing detailed monolithic stone carvings, aqueducts, and royal stables.', 
    why: 'The prosperous historical capital city of the extraordinarily wealthy medieval Hindu Vijayanagara Empire network.', 
    how: 'Overnight premium train options or regional direct executive charter flights into the close Jindal Vidyanagar airstrip.',
    image: 'https://images.unsplash.com/photo-1600100397608-f01017df39fb?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Khajuraho Chandela Sculpted Shrines', city: 'Khajuraho', region: 'Madhya Pradesh', type: 'historic', 
    what: 'A refined group of medieval Nagara-style temples intricately carved out of rich golden sandstone rock blocks.', 
    why: 'Commissioned by the Chandela Rajput dynasty to celebrate cosmic balance, spiritual integration, and earthly emotions.', 
    how: 'Direct daily flight tracks linking out from New Delhi directly to the newly upgraded Khajuraho domestic runways.',
    image: 'https://images.unsplash.com/photo-1612450790715-6ddc9e78bdcf?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Golden Temple Sanctum of Harmandir', city: 'Amritsar', region: 'Punjab', type: 'devotional', 
    what: 'The ultimate holy shrine of Sikhism layered in pure gold sheets, floating inside a massive curative water tank (Amrit Sarovar).', 
    why: 'Designed by Guru Arjan Dev to actively preach universal human equality, open access doorways, and selfless community service.', 
    how: 'Fly straight into Sri Guru Ram Dass Jee International Airport paired with VIP private vehicle hotel transfers.',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&auto=format&fit=crop&q=80'
  }
];

const INTERNATIONAL_DESTINATIONS = [
  { 
    name: 'Giza Great Pyramids Complex', country: 'Egypt', type: 'historic', 
    what: 'The last remaining wonder of the ancient world built using 2.3 million interlocking limestone block units.', 
    why: 'Built as monumental royal resurrection tombs for old-kingdom Pharaohs over 4,500 historical years ago.', 
    how: 'Private desert camel caravans led by specialized accredited academic Egyptologists tracking historical records.',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Colosseum & Roman Forum Spaces', country: 'Italy', type: 'historic', 
    what: 'The massive stone and concrete freestanding stadium layout constructed under the Flavian emperors.', 
    why: 'The central public amphitheater hosting gladiatorial combat matches, public drama displays, and ancient Roman assemblies.', 
    how: 'Skip-the-line early morning executive entries arranged via curated historic custom access tokens.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Angkor Wat Khmer Empire Spire', country: 'Cambodia', type: 'devotional', 
    what: 'The largest religious monument infrastructure layout on earth with iconic stone lotus towers hidden deep inside the jungle.', 
    why: 'Originally engineered as a grand Hindu temple layout for Lord Vishnu before transforming into a regional Buddhist hub.', 
    how: 'Private temple tour configurations deploying directly via luxury vehicles from Siem Reap international air terminals.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Parthenon Acropolis Citadel Trails', country: 'Greece', type: 'historic', 
    what: 'The ancient white-marble classical fortress complex standing tall over the historic modern city line of Athens.', 
    why: 'Built in the 5th Century BC to house the legendary goddess Athena and celebrate foundational human democracy concepts.', 
    how: 'Bespoke sunset walking tours coupled with custom access parameters to private archaeological museum displays.',
    image: 'https://images.unsplash.com/photo-1608805877484-448fab5a5491?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Machu Picchu Incan Sanctuary Mountain', country: 'Peru', type: 'historic', 
    what: 'A pristine 15th-century hidden Incan citadel built high into the mist-covered ridge lines of the Andes mountain ranges.', 
    why: 'An elite imperial country estate matching advanced celestial astrological alignments and complex agriculture terrace rules.', 
    how: 'The high-end Hiram Bingham private luxury vintage train operating directly out of historical Cusco stations.',
    image: 'https://images.unsplash.com/photo-1509216242873-7786f446f465?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Petra Rose-Red Nabatean Canyon', country: 'Jordan', type: 'historic', 
    what: 'An entire commercial trading city carved into deep desert canyon sandstone walls through exquisite cliffside engineering.', 
    why: 'The wealthy ancient desert capital city of the Nabataeans controlling critical historic silk, spice, and incense trade routes.', 
    how: 'Horseback or walking access passing down through the massive narrow canyon gorge framework known globally as the Siq.',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Kyoto Fushimi Inari Torii Shrines', country: 'Japan', type: 'devotional', 
    what: 'A beautiful dense mountain path layout layered neatly underneath over 10,000 vivid vermilion wooden Shinto Torii gates.', 
    why: 'Dedicated traditionally to Inari, the ancient Shinto deity of mountain rice, commercial success, and overall house prosperity.', 
    how: 'Bespoke custom walking tracks arranged directly out from historical Kyoto imperial boutique ryokan hotels.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Vatican St. Peters Basilica Crypts', country: 'Vatican City', type: 'devotional', 
    what: 'The ultimate global epicenter of Catholic architecture holding artistic masterpieces created by Michelangelo and Bernini.', 
    why: 'The sacred historical burial site of St. Peter, standing as the supreme operational core of Christian art history records.', 
    how: 'VIP private morning gallery access skip-the-crowds managed via certified art history research curators.',
    image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&auto=format&fit=crop&q=80'
  }
];

const AMBIENT_TAGS = ['Best Seller', 'UNESCO Heritage', 'Ancient Wonder', 'Rare Experience', 'Top Rated'];

// 212 DATA STABILITY REGISTRY DATABASE GENERATOR
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
      const source = INDIAN_DESTINATIONS[Math.floor(i / 2) % INDIAN_DESTINATIONS.length];
      masterList.push({
        id: currentId++,
        name: `${source.name} - Unit ${Math.floor(i / (INDIAN_DESTINATIONS.length * 2)) + 1}`,
        destination: `${source.city}, ${source.region}`,
        scope: 'India 🇮🇳',
        type: source.type,
        price: 18000 + ((i % 15) * 6500),
        duration, travelers, rating, reviews, tag,
        image: source.image,
        category: source.type === 'devotional' ? 'adventure' : 'luxury',
        description: `Embark on an immersive cultural journey exploring the sacred legacy structures inside historical ${source.city}.`,
        what: source.what, why: source.why, how: source.how
      });
    } else {
      const source = INTERNATIONAL_DESTINATIONS[Math.floor(i / 2) % INTERNATIONAL_DESTINATIONS.length];
      masterList.push({
        id: currentId++,
        name: `${source.name} Premium - ${Math.floor(i / (INTERNATIONAL_DESTINATIONS.length * 2)) + 1}`,
        destination: source.country,
        scope: 'Global 🌍',
        type: source.type,
        price: 65000 + ((i % 12) * 11000),
        duration, travelers, rating, reviews, tag,
        image: source.image,
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
      if (scopeFilter === 'india') scopeMatch = pkg.scope.includes('India');
      else if (scopeFilter === 'international') scopeMatch = pkg.scope.includes('Global');
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* PERFECT 3D MECHANICAL GLASS PERSPECTIVE CSS SHEET */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-canvas { perspective: 2000px; }
        .flipper-node {
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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

      {/* ── DESIGNER HEADER BAR ── */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all border border-slate-200 shadow-2xs group"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 bg-gradient-to-r align-middle from-slate-950 to-slate-700 bg-clip-text text-transparent">Heritage Hub</h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Sparkles className="w-3 h-3 text-indigo-500" /> {PACKAGES_DATABASE.length} Nodes Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block mt-0.5">Click any architectural card framing system to flip dynamic chronicles.</p>
            </div>
          </div>
          
          {/* Smart Live Search Query Input Layout */}
          <div className="relative flex-1 max-w-xs md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Ram Mandir, Taj Mahal, Rome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-semibold text-slate-800 placeholder-slate-400 shadow-2xs"
            />
          </div>
        </div>
      </header>

      {/* ── INTEGRATED CONTROL SYSTEM SUB-DECK ── */}
      <section className="bg-white border-b border-slate-200/60 py-4 sticky top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Scope Selection Layout Filter row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scroller max-w-full">
              {[
                { id: 'all', label: 'All Global Expeditions', icon: <Compass className="w-4 h-4" /> },
                { id: 'india', label: 'Domestic India 🇮🇳', icon: <Landmark className="w-4 h-4" /> },
                { id: 'international', label: 'International 🌍', icon: <Globe className="w-4 h-4" /> },
                { id: 'devotional', label: 'Devotional Shrines ✨', icon: null }
              ].map(pill => {
                const isSelected = scopeFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => { setScopeFilter(pill.id); setFlippedCardIds([]); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border outline-none cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                        : 'bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {pill.icon && <span className="shrink-0">{pill.icon}</span>}
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl shadow-2xs">
              Unlocked Maps: <span className="text-indigo-600 font-mono font-bold text-sm pl-0.5">{filteredPackages.length} Logs</span>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Budget Metric System Slider row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Investment Scale Parameters</span>
                  <span className="text-slate-700 font-mono font-bold">Max Cap: ₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="200000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── HIGH DEFINITION 3D TILES COMPACT ARCHITECTURE GRID ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 max-w-md mx-auto px-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-200 text-slate-400 mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Historical Coordinates Located</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Try scaling up your budget bounds or configuring broad search parameters.</p>
            <button 
              onClick={() => { setPriceRange(200000); setScopeFilter('all'); setSearchQuery(''); }}
              className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer"
            >
              Reset Interface Matrix
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map(pkg => {
              const isFavorited = favorites.includes(pkg.id);
              const isFlipped = flippedCardIds.includes(pkg.id);
              
              return (
                <div key={pkg.id} className="perspective-canvas h-[430px] w-full group">
                  <div className={`flipper-node w-full h-full ${isFlipped ? 'node-flipped' : ''}`}>
                    
                    {/* ── SIDE A: FRONT EXQUISITE INTERFACE VIEW ── */}
                    <div className="face-front bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
                      
                      {/* Image Framing Ecosystem */}
                      <div 
                        onClick={() => handleCardFlipToggle(pkg.id)}
                        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 cursor-pointer overflow-hidden"
                      >
                        <img 
                          src={pkg.image} 
                          alt={pkg.name} 
                          loading="lazy" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        {/* Interactive Dark Layer Mask */}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                          <span className="px-3 py-1.5 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-950 rounded-xl shadow-md flex items-center gap-1">
                            Chronicle View 🔄
                          </span>
                        </div>

                        {/* Badges system */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none">
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white bg-indigo-600 rounded-md shadow-2xs">
                            {pkg.scope}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-bold text-slate-700 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-md shadow-2xs">
                            {pkg.tag}
                          </span>
                        </div>

                        {/* Quick Interactive Actions Anchor Row */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={(e) => sharePackage(e, pkg.name)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-xs rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs border border-slate-200/40 cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => toggleFavorite(e, pkg.id)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-xs rounded-xl flex items-center justify-center transition-colors shadow-2xs border border-slate-200/40 cursor-pointer"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Card Content & Text Alignment Hub */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-slate-400 min-w-0">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span className="text-xs font-semibold truncate text-slate-500">{pkg.destination}</span>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span className="text-[10px] font-bold text-amber-950">{pkg.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                            {pkg.name}
                          </h3>
                          
                          <p className="text-xs text-slate-400 font-normal line-clamp-2 leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>

                        {/* Parametric Data Grid Info Section */}
                        <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-semibold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 
                            <span>{pkg.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5 justify-end">
                            <Users className="w-3.5 h-3.5 text-slate-400" /> 
                            <span className="truncate">{pkg.travelers}</span>
                          </div>
                        </div>

                        {/* Footer Price Configurations */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Estimated Cost</span>
                            <span className="text-base font-extrabold text-slate-900 font-mono tracking-tight">
                              ₹{pkg.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <button 
                            onClick={() => alert(`Launching itinerary setup routing loop for ID: ${pkg.id}`)}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition-colors duration-200 cursor-pointer"
                          >
                            Lock Route
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* ── SIDE B: BACK METADATA DOCUMENTATION LAYER ── */}
                    <div className="face-back bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between text-slate-200">
                      
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-indigo-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Chronicle Profile Logs</span>
                        </div>
                        <button 
                          onClick={() => handleCardFlipToggle(pkg.id)}
                          className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3 text-indigo-400" /> Return Face
                        </button>
                      </div>

                      {/* Primary Textual Insights Panels */}
                      <div className="flex-1 py-3 space-y-3.5 overflow-y-auto no-scroller pr-0.5">
                        <div className="space-y-1">
                          <h4 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Architectural Construct</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{pkg.what}</p>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Historical Relevance</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{pkg.why}</p>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Transit Framework</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{pkg.how}</p>
                        </div>
                      </div>

                      {/* Reverse Layout Footer Metrics */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <div>
                          <span className="text-[8px] block text-slate-600 font-bold">SEQUENCE NODE</span>
                          <span className="font-mono text-slate-400">#HERITAGE-{pkg.id.toString().padStart(4, '0')}</span>
                        </div>
                        <button 
                          onClick={() => handleCardFlipToggle(pkg.id)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer"
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