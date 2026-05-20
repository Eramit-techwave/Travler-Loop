import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Users, Calendar, 
  Heart, Share2, Filter, Compass, Flame, 
  SlidersHorizontal, Search, RotateCcw, HelpCircle, Globe, Landmark
} from 'lucide-react';

// --- ANCHOR PATTERNS FOR GENUINE VARIATION GENERATION ---
const SECULAR_INDIAN_TILES = [
  { base: 'Taj Mahal Imperial Marvel', city: 'Agra', state: 'Uttar Pradesh', type: 'historic', what: 'The white-marble mausoleum commissioned in 1632 by Mughal Emperor Shah Jahan.', why: 'Stands as the universal monument to eternal love and ultimate Mughal symmetry engineering.', how: 'Direct Gatimaan Express high-speed rail routing straight out from New Delhi networks.' },
  { base: 'Ayodhya Ram Janmabhoomi Mandir', city: 'Ayodhya', state: 'Uttar Pradesh', type: 'devotional', what: 'The historic traditional Nagara architectural temple structure built at Ram Janmabhoomi.', why: 'Revered as the holy cosmic birthplace of Lord Rama, anchoring Indian spiritual civilization.', how: 'Fly to Maharishi Valmiki International Airport followed by private sedan escorts.' },
  { base: 'Kashi Vishwanath Jyotirlinga Sanctum', city: 'Varanasi', state: 'Uttar Pradesh', type: 'devotional', what: 'The ancient sacred temple complex housing Lord Shivas glorious manifestation beside Ganga.', why: 'The oldest continuously living spiritual city on Earth holding profound Vedic morning rituals.', how: 'Best explored via early dawn wooden boat cruises charting along the historical river ghats.' },
  { base: 'Kedarnath Himalayan High Shrine', city: 'Kedarnath', state: 'Uttarakhand', type: 'devotional', what: 'An ancient stone monolithic shrine dedicated to Lord Shiva in the Garhwal snow peaks.', why: 'One of the holy Chardham points built traditionally by Pandavas to tap cosmic energy lines.', how: 'Accessible via a scenic mountain foot trek from Gaurikund or private heli-charter paths.' },
  { base: 'Somnath Ocean Shore Mandir', city: 'Veraval', state: 'Gujarat', type: 'devotional', what: 'The legendary first holy Jyotirlinga shrine constructed right on the edge of the Arabian Sea.', why: 'A magnificent symbol of cultural resilience, reconstructed seven times across imperial history.', how: 'Direct highway networks connecting from Rajkot junctions or Diu coastal airport bays.' },
  { base: 'Dwarkadhish Coastal Krishna Kingdom', city: 'Dwarka', state: 'Gujarat', type: 'devotional', what: 'A majestic 5-story chalcolithic temple setup tracking back over 2,500 years of coastal history.', why: 'Stands as the historical administrative capital city established directly by Lord Krishna.', how: 'Broad-gauge express rail networks routing smoothly through Jamnagar and Ahmedabad distribution lines.' },
  { base: 'Konark Chariot Sun Temple', city: 'Konark', state: 'Odisha', type: 'historic', what: 'A monumental 13th-century stone temple sculpted as a massive chariot with 24 intricate wheels.', why: 'Built by King Narasimhadeva I, representing the absolute peak of medieval Kalinga engineering.', how: 'A crisp 1-hour scenic marine drive out from Biju Patnaik International Airport in Bhubaneswar.' },
  { base: 'Meenakshi Amman Multicolored Gopuram', city: 'Madurai', state: 'Tamil Nadu', type: 'devotional', what: 'A giant 14-gopuram active temple complex containing over 33,000 detailed stone deity sculptures.', why: 'The historical core of classic Dravidian architecture, Sangam poetry and advanced geometric grids.', how: 'Direct international connections via Madurai Airport terminals paired with specialized guides.' },
  { base: 'Brihadeeswarar Granite Chola Fort', city: 'Thanjavur', state: 'Tamil Nadu', type: 'historic', what: 'The grand all-granite living temple structure constructed completely without binding material elements.', why: 'Built by Emperor Raja Raja Chola I in 1010 AD to manifest peak military sovereign wealth.', how: 'Bespoke car arrangements operating straight from Trichy international airport hubs.' },
  { base: 'Hampi Vijayanagara Boulder Ruins', city: 'Hampi', state: 'Karnataka', type: 'historic', what: 'An expansive valley matrix containing monolithic stone carvings, aqueducts, and structural stables.', why: 'The historical wealthy capital base of the medieval Hindu Vijayanagara Empire network layers.', how: 'Overnight premium train options or regional direct flights into close Jindal Vidyanagar strips.' },
  { base: 'Khajuraho Sandstone Chandela Shrines', city: 'Khajuraho', state: 'Madhya Pradesh', type: 'historic', what: 'A refined group of medieval Nagara-style temples intricately carved out of golden sandstone rock blocks.', why: 'Commissioned by Chandela Rajputs to celebrate cosmic balance, philosophy and human emotions.', how: 'Direct flight tracks linking out from New Delhi directly to Khajuraho domestic runways.' },
  { base: 'Harmandir Sahib Golden Sanctum', city: 'Amritsar', state: 'Punjab', type: 'devotional', what: 'The ultimate holy shrine of Sikhism layered in pure gold sheets, floating inside an Amrit Sarovar.', why: 'Designed by Guru Arjan Dev to actively preach universal human equality and open access portals.', how: 'Fly straight into Sri Guru Ram Dass Jee International Airport paired with VIP private vehicle transfers.' }
];

const SECULAR_GLOBAL_TILES = [
  { base: 'Giza Great Pyramids Complex', country: 'Egypt', type: 'historic', what: 'The last remaining wonder of the ancient world built using 2.3 million limestone block units.', why: 'Built as monumental royal resurrection tombs for old-kingdom Pharaohs over 4,500 years ago.', how: 'Private desert camel caravans led by specialized accredited academic Egyptologists.' },
  { base: 'Colosseum Imperium Amphitheater', country: 'Italy', type: 'historic', what: 'The massive stone and concrete freestanding stadium layout constructed under Flavian emperors.', why: 'The central public arena hosting gladiatorial combat matches and imperial Roman assemblies.', how: 'Skip-the-line early morning executive entries arranged via curated historic access tokens.' },
  { base: 'Angkor Wat Lost Khmer Spire', country: 'Cambodia', type: 'devotional', what: 'The largest religious monument infrastructure layout on earth with iconic stone lotus towers.', why: 'Originally engineered as a grand Hindu layout for Lord Vishnu before transforming into a Buddhist hub.', how: 'Private temple tour configurations deploying directly via luxury vehicles from Siem Reap.' },
  { base: 'Parthenon Acropolis Citadel Trails', country: 'Greece', type: 'historic', what: 'The ancient white-marble classical fortress complex standing tall over the city lines of Athens.', why: 'Built in the 5th Century BC to house Athena and celebrate foundational human democracy concepts.', how: 'Bespoke sunset walking tours coupled with custom access parameters to private museum layers.' },
  { name: 'Machu Picchu Incan Sanctuary Mountain', country: 'Peru', type: 'historic', what: 'A pristine 15th-century hidden Incan citadel built high into the mist-covered ridge lines of the Andes.', why: 'An elite imperial country estate matching advanced celestial astrological alignments and terrace rules.', how: 'The high-end Hiram Bingham private luxury vintage train operating directly out of Cusco.' },
  { name: 'Petra Rose-Red Nabatean Canyon', country: 'Jordan', type: 'historic', what: 'An entire commercial trading city carved into desert canyon sandstone walls through cliffside engineering.', why: 'The wealthy ancient desert capital city of Nabataeans controlling critical historic silk and spice trade routes.', how: 'Horseback or walking access passing down through the massive narrow canyon framework known as the Siq.' },
  { name: 'Kyoto Fushimi Inari Torii Shrines', country: 'Japan', type: 'devotional', what: 'A beautiful dense mountain path layout layered neatly underneath over 10,000 vivid vermilion wooden Shinto Torii gates.', why: 'Dedicated traditionally to Inari, the ancient Shinto deity of mountain rice and commercial success.', how: 'Bespoke custom walking tracks arranged directly out from historical Kyoto imperial boutique hotels.' },
  { name: 'Vatican St. Peters Basilica Crypts', country: 'Vatican City', type: 'devotional', what: 'The global epicenter of Catholic architecture holding masterpieces created by Michelangelo and Bernini.', why: 'The sacred historical burial site of St. Peter, standing as the supreme operational core of Christian art history.', how: 'VIP private morning gallery access skip-the-crowds managed via certified art history research curators.' }
];

const DESIGNATORS = ['Heritage', 'Sanctum', 'Citadel', 'Archaeological', 'Palace Reserve', 'Enclave', 'Shrine Circuit', 'Legacy Matrix', 'Monolith Vault', 'Royal Court'];
const AMBIENT_TAGS = ['Best Seller', 'UNESCO Heritage', 'Ancient Wonder', 'Rare Experience', 'Top Rated'];

// RANDOM IMAGE STABILITY GENERATOR USING HIGH RESOLUTION SYSTEM TAGS UNRELATED TO DYNAMIC MATHEMATICAL CODES
const getDeterministicImage = (index, type) => {
  const devotionalImages = [
    'https://images.unsplash.com/photo-1561361531-99e224e9f331?w=600&auto=format&fit=crop&q=80', // Varanasi Ghats
    'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80', // Himalayan Steps
    'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&auto=format&fit=crop&q=80', // Dravidian Gopuram
    'https://images.unsplash.com/photo-1542442828-287217bfb87f?w=600&auto=format&fit=crop&q=80', // Ancient Rock Structures
    'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=600&auto=format&fit=crop&q=80', // Mystic Rivers
    'https://images.unsplash.com/photo-1518098268026-4e43a1a009de?w=600&auto=format&fit=crop&q=80', // Golden hour shrines
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80', // South Coast Pillars
    'https://images.unsplash.com/photo-1609137144813-09758f1bf6cf?w=600&auto=format&fit=crop&q=80'  // Stone carvings
  ];

  const historicalImages = [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80', // Taj Mahal Front
    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600&auto=format&fit=crop&q=80', // Great Pyramids
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80', // Roman Colosseum
    'https://images.unsplash.com/photo-1600577916048-804c9191e36c?w=600&auto=format&fit=crop&q=80', // Rajput Sandstone Fort
    'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=600&auto=format&fit=crop&q=80', // Greek Pillar Ruins
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80', // Santorini Structure
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80', // Jaipur Amber Palace
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=80'  // Pagoda Tower
  ];

  if (type === 'devotional') {
    return devotionalImages[index % devotionalImages.length];
  }
  return historicalImages[index % historicalImages.length];
};

// --- UNIQUE VARIATION DATA GENERATOR (215 COMPLETE SEPARATED RECORDS) ---
const generateRobustDatabase = () => {
  const masterList = [];
  let currentId = 1;

  for (let i = 0; i < 215; i++) {
    const isIndia = i % 2 === 0;
    const tag = AMBIENT_TAGS[i % AMBIENT_TAGS.length];
    const designator = DESIGNATORS[i % DESIGNATORS.length];
    const rating = parseFloat((4.5 + (i % 5) * 0.1).toFixed(1));
    const reviews = 110 + (i * 13);
    const duration = `${4 + (i % 5)} Days`;
    const travelers = i % 3 === 0 ? '1-2 Guests' : '2-4 Guests';

    if (isIndia) {
      const blueprint = SECULAR_INDIAN_TILES[i % SECULAR_INDIAN_TILES.length];
      const imageAsset = getDeterministicImage(i, blueprint.type);
      
      masterList.push({
        id: currentId++,
        name: `${blueprint.base} ${designator}`,
        destination: `${blueprint.city}, ${blueprint.state}, India`,
        scope: 'india',
        type: blueprint.type,
        price: 18000 + ((i % 15) * 7000),
        duration, travelers, rating, reviews, tag,
        image: imageAsset,
        category: blueprint.type === 'devotional' ? 'adventure' : 'luxury',
        description: `Delve into an authentic exploration tracking historical timelines and preserved design ethics surrounding ${blueprint.city}.`,
        what: blueprint.what,
        why: blueprint.why,
        how: blueprint.how
      });
    } else {
      const blueprint = SECULAR_GLOBAL_TILES[i % SECULAR_GLOBAL_TILES.length];
      const imageAsset = getDeterministicImage(i, blueprint.type);
      const customLocName = blueprint.base || blueprint.name;
      const customCountry = blueprint.country || blueprint.country;

      masterList.push({
        id: currentId++,
        name: `${customLocName} Premium ${designator}`,
        destination: customCountry,
        scope: 'international',
        type: blueprint.type,
        price: 65000 + ((i % 12) * 11500),
        duration, travelers, rating, reviews, tag,
        image: imageAsset,
        category: blueprint.type === 'devotional' ? 'adventure' : 'city',
        description: `Cross trans-continental routes to observe architectural masonry configurations inside iconic ${customCountry}.`,
        what: blueprint.what,
        why: blueprint.why,
        how: blueprint.how
      });
    }
  }
  return masterList;
};

const PACKAGES_DATABASE = generateRobustDatabase();

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

  // --- FIXED ROBUST SEARCH FILTER MATCH ENGINE ---
  const filteredPackages = useMemo(() => {
    return PACKAGES_DATABASE.filter(pkg => {
      // 1. Structural Category Tab Filtering Match
      let scopeMatch = true;
      if (scopeFilter === 'india') scopeMatch = pkg.scope === 'india';
      else if (scopeFilter === 'international') scopeMatch = pkg.scope === 'international';
      else if (scopeFilter === 'devotional') scopeMatch = pkg.type === 'devotional';

      // 2. Budget Parameter Slider check
      const priceMatch = pkg.price <= priceRange;

      // 3. Normalized Global Query String Search matching logic
      const targetQuery = searchQuery.trim().toLowerCase();
      const textMatch = !targetQuery ? true : (
        pkg.name.toLowerCase().includes(targetQuery) ||
        pkg.destination.toLowerCase().includes(targetQuery) ||
        pkg.tag.toLowerCase().includes(targetQuery)
      );

      return scopeMatch && priceMatch && textMatch;
    });
  }, [scopeFilter, priceRange, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* 3D MECHANICAL TRANSFORM PERSPECTIVE RULES */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-canvas { perspective: 1600px; }
        .flipper-node {
          transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
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

      {/* ── STICKY CONTROL BRAND BAR HEADER ── */}
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
                  {PACKAGES_DATABASE.length} Coordinates Indexed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold hidden sm:block">Click any card image layout frame to trigger a 3D asset description flip.</p>
            </div>
          </div>
          
          {/* Smart Live Search Dynamic Input */}
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

      {/* ── BROAD CENTRAL CONTROLS DECK (ADVANCED SYSTEM FILTERS) ── */}
      <section className="bg-white border-b border-slate-200 py-5 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Scope Selection Pills Framework */}
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

          {/* Pricing parameters slider */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-0.5">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 shadow-2xs">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                  <span>Investment Scope Limits</span>
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

      {/* ── CARD GRID FEATURING 3D MECHANICAL FILIPPERS ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 max-w-md mx-auto px-6">
            <h3 className="text-base font-bold text-slate-900">No Target Manifest Located</h3>
            <p className="text-sm text-slate-500 mt-1">Try expanding budget scales or resetting system parameters.</p>
            <button 
              onClick={() => { setPriceRange(200000); setScopeFilter('all'); setSearchQuery(''); }}
              className="mt-5 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredPackages.map(pkg => {
              const isFavorited = favorites.includes(pkg.id);
              const isFlipped = flippedCardIds.includes(pkg.id);
              
              return (
                <div key={pkg.id} className="perspective-canvas h-[465px] w-full">
                  <div className={`flipper-node w-full h-full ${isFlipped ? 'node-flipped' : ''}`}>
                    
                    {/* ── SIDE A: FACE FRONT CARD LAYER ── */}
                    <div className="face-front bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs flex flex-col justify-between">
                      
                      {/* Image Frame Deck Component */}
                      <div 
                        onClick={() => handleCardFlipToggle(pkg.id)}
                        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer group"
                        title="Click image to reveal structural documentation details"
                      >
                        <img 
                          src={pkg.image} 
                          alt={pkg.name} 
                          loading="lazy" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                        
                        {/* Interactive Visual Overlay Mask */}
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="px-3 py-2 bg-white/95 text-xs font-black uppercase tracking-wider text-slate-950 rounded-xl shadow-md border border-slate-200/80">
                            Reveal Chronicles 🔄
                          </span>
                        </div>

                        {/* Floating pill tags indicator blocks */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
                          <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded shadow-sm">
                            {pkg.scope}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-extrabold text-slate-800 bg-white border border-slate-100 rounded shadow-xs">
                            {pkg.tag}
                          </span>
                        </div>

                        {/* Isolated Actions Parameters */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={(e) => sharePackage(e, pkg.name)}
                            className="w-8.5 h-8.5 bg-white/95 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => toggleFavorite(e, pkg.id)}
                            className="w-8.5 h-8.5 bg-white/95 rounded-xl flex items-center justify-center transition-colors shadow-2xs"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Lower description body context */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-slate-400 min-w-0">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-xs font-bold truncate text-slate-500">{pkg.destination}</span>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span className="text-[10px] font-black text-amber-900">{pkg.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <h3 className="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-snug line-clamp-1">
                            {pkg.name}
                          </h3>
                          
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>

                        {/* Structural metadata parameter blocks row */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 
                            <span>{pkg.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5 justify-end sm:justify-start">
                            <Users className="w-3.5 h-3.5 text-slate-400" /> 
                            <span className="truncate">{pkg.travelers}</span>
                          </div>
                        </div>

                        {/* Footer booking pricing tracking action */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Estimated Cost</span>
                            <span className="text-base font-black text-slate-950 font-mono tracking-tight">
                              ₹{pkg.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <button 
                            onClick={() => alert(`Launching itinerary setup routing loop for ID: ${pkg.id}`)}
                            className="px-4 py-2 bg-slate-950 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors duration-150"
                          >
                            Lock Route
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* ── SIDE B: FACE BACK ARCHIVE PANEL LAYER ── */}
                    <div className="face-back bg-[#0F172A] rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between text-slate-200">
                      
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-indigo-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chronicle Dossier Logs</span>
                        </div>
                        <button 
                          onClick={() => handleCardFlipToggle(pkg.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3 text-indigo-400" /> Return Face
                        </button>
                      </div>

                      {/* Primary Textual Insights Content Body */}
                      <div className="flex-1 py-3.5 space-y-4 overflow-y-auto no-scroller pr-0.5">
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">What is this coordinate?</h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">{pkg.what}</p>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-[11px] font-black text-amber-400 uppercase tracking-widest">Why is it historically vital?</h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">{pkg.why}</p>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">How is transit operated?</h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">{pkg.how}</p>
                        </div>
                      </div>

                      {/* Foot layout identifier labels */}
                      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500">
                        <div>
                          <span className="text-[9px] block text-slate-600 font-black">MANIFEST SEQUENCE</span>
                          <span className="font-mono text-slate-400">#HERITAGE-{pkg.id.toString().padStart(4, '0')}</span>
                        </div>
                        <button 
                          onClick={() => handleCardFlipToggle(pkg.id)}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider"
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