import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane, MapPin, Search, Globe, ShieldCheck, Headset, Train, Bus, Star,
  Clock, Tag, ArrowRight, Sparkles, Heart, Share2, Compass, Layers,
  SlidersHorizontal, Send, ArrowUpRight, Hotel, RotateCcw
} from 'lucide-react';

/* ─── 3D flip + utility CSS ─── */
const STYLE = `
  .preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
  .perspective-1200 { perspective: 1200px; }
  .no-scroll::-webkit-scrollbar { display: none; }
  .no-scroll { -ms-overflow-style:none; scrollbar-width:none; }
  .flipper { transition: transform 0.65s cubic-bezier(.4,.2,.2,1); }
  .flipper.flipped { transform: rotateY(180deg); }

  /* equal-height card columns */
  .card-col { display: flex; flex-direction: column; }
  .card-front, .card-back {
    position: absolute; inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 20px;
    overflow: hidden;
  }
  .card-back { transform: rotateY(180deg); }

  /* hover lift on cards */
  .dest-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
  .dest-card { transition: transform .25s, box-shadow .25s; }

  /* nav underline */
  .nav-a { position:relative; padding-bottom:2px; }
  .nav-a::after { content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:#2563eb; transition:width .25s; }
  .nav-a:hover::after { width:100%; }

  @keyframes spin-slow { to { transform: rotate(360deg); } }
  .spin-slow { animation: spin-slow 6s linear infinite; }
`;

/* ─── DATA ─── */
const DESTINATIONS = [
  { id: 1, city: 'Manali', region: 'Himachal Pradesh', scope: 'India', type: 'Mountains', price: '₹5,999', rating: 4.8, tag: 'Best Seller', img: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?w=600&auto=format&fit=crop&q=70', tagline: 'Alpine paradise amidst whispering pines', intro: 'A high-altitude Himalayan resort town known as a backpacking and honeymoon hub.', why: 'Famous for Solang Valley adventure sports and Rohtang Pass snow views.', attractions: 'Hadimba Temple, Solang Valley, Jogini Waterfalls', time: 'Oct – Feb', food: 'Siddu, Khatta, Trout Fish Curry', fact: 'Named after sage Manu; means "home of Manu".' },
  { id: 2, city: 'Goa', region: 'Coastal India', scope: 'India', type: 'Beaches', price: '₹3,499', rating: 4.9, tag: 'Trending', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=70', tagline: 'Sunkissed shores and Portuguese legacy', intro: 'A blend of Indian and Portuguese cultures with endless pristine shorelines.', why: 'Global beach festivals, nightlife, and baroque architecture.', attractions: 'Baga Beach, Basilica of Bom Jesus, Dudhsagar', time: 'Nov – Feb', food: 'Fish Curry Rice, Bebinca, Vindaloo', fact: 'Goa hosts Asia\'s largest floating casinos.' },
  { id: 3, city: 'Kedarnath', region: 'Uttarakhand', scope: 'India', type: 'Devotional', price: '₹14,999', rating: 5.0, tag: 'Sacred Elite', img: 'https://i.pinimg.com/736x/a5/f0/ea/a5f0eac0539b54b2d937bd60073cc21d.jpg', tagline: 'Cosmic energy lines meet eternal snows', intro: 'Ancient stone shrine of Lord Shiva at 11,755 ft in the Garhwal Himalayas.', why: 'One of the twelve sacred Jyotirlingas.', attractions: 'Kedarnath Temple, Bhairav Temple, Chorabari Lake', time: 'May – Oct', food: 'Aloo ke Gutke, Phaanu', fact: 'Survived 2013 floods due to a boulder protecting its rear.' },
  { id: 4, city: 'Varanasi', region: 'Uttar Pradesh', scope: 'India', type: 'Devotional', price: '₹4,999', rating: 4.9, tag: 'Spiritual Core', img: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&auto=format&fit=crop&q=70', tagline: 'Where time begins and eternity rests', intro: 'The spiritual heart of India where Vedic river rituals run uninterrupted.', why: 'Oldest continuously inhabited city on the planet.', attractions: 'Kashi Vishwanath, Dashashwamedh Ghat, Sarnath', time: 'Oct – Mar', food: 'Kachori Sabzi, Banarasi Paan', fact: 'Mark Twain called it older than history and legend.' },
  { id: 5, city: 'Jaipur', region: 'Rajasthan', scope: 'India', type: 'Historical', price: '₹4,500', rating: 4.8, tag: 'Royal Heritage', img: 'https://chalbanjare.com/crmnew/img_master/package/HawaMahal_17714014690.webp', tagline: 'The symphonic pink city of royalty', intro: 'Capital of Rajasthan famed for symmetrical design and terracotta pink streets.', why: 'Complex fortress layouts and astronomical structures.', attractions: 'Amber Palace, Hawa Mahal, Jantar Mantar', time: 'Nov – Mar', food: 'Dal Baati Churma, Laal Maas', fact: 'Painted pink in 1876 to welcome Prince Albert of Wales.' },
  { id: 6, city: 'Kashmir', region: 'Jammu & Kashmir', scope: 'India', type: 'Mountains', price: '₹12,500', rating: 5.0, tag: 'Rare Paradise', img: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?w=600&auto=format&fit=crop&q=70', tagline: 'The ultimate canvas of heaven on earth', intro: 'An ethereal valley surrounded by snow-capped peaks, glassy lakes, and pine forests.', why: 'Luxury houseboat stays and high-altitude alpine meadows.', attractions: 'Dal Lake, Gulmarg Gondola, Shalimar Bagh', time: 'Mar – Oct', food: 'Rogan Josh, Yakhni, Kehwa', fact: 'India\'s only floating vegetable market operates on Dal Lake.' },
  { id: 7, city: 'Leh Ladakh', region: 'Kashmir Border', scope: 'India', type: 'Hidden Gems', price: '₹18,999', rating: 4.9, tag: 'Adventure Pro', img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=70', tagline: 'The high-altitude desert of mystics', intro: 'Rugged cold desert passes and Tibetan Buddhist monasteries.', why: 'Top destination for motorcycle expeditions and deep stargazing.', attractions: 'Pangong Lake, Khardung La, Thiksey Monastery', time: 'Jun – Sep', food: 'Thukpa, Momos, Butter Tea', fact: 'Magnetic Hill appears to pull vehicles upward.' },
  { id: 8, city: 'Kerala Backwaters', region: 'South India', scope: 'India', type: 'Nature', price: '₹8,999', rating: 4.7, tag: 'Serene Nature', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=70', tagline: 'Emerald standard of tropical serenity', intro: 'Labyrinthine brackish lagoons, lakes, and peaceful canals.', why: 'Bespoke Kettuvallam luxury houseboat cruises.', attractions: 'Vembanad Lake, Kumarakom Bird Sanctuary', time: 'Sep – Mar', food: 'Karimeen Pollichathu, Malabar Parotta', fact: 'Home of the legendary Nehru Trophy Snake Boat Race.' },
  { id: 9, city: 'Hampi', region: 'Karnataka', scope: 'India', type: 'Historical', price: '₹6,499', rating: 4.8, tag: 'UNESCO Site', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrRhiLDdMOnMqaMpJ5YwPG2TRla3GjV_c-2A&s', tagline: 'An architectural stone canvas of empires', intro: 'Open-air museum with monolithic temples and boulder mountains.', why: 'Ancient throne city of the wealthy Vijayanagara Empire.', attractions: 'Virupaksha Temple, Stone Chariot, Lotus Mahal', time: 'Oct – Feb', food: 'Bisi Bele Bath, Akki Roti', fact: 'Carvings emit distinct musical notes when tapped.' },
  { id: 10, city: 'Andaman Islands', region: 'Bay of Bengal', scope: 'India', type: 'Beaches', price: '₹22,500', rating: 4.9, tag: 'Exotic Ocean', img: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?w=600&auto=format&fit=crop&q=70', tagline: 'Turquoise waters and colonial secrets', intro: 'Tropical islands boasting coral reefs and biome-rich rainforests.', why: 'Premier deep-sea scuba diving and historical monuments.', attractions: 'Radhanagar Beach, Cellular Jail, Havelock', time: 'Oct – May', food: 'Seafood Platters, Coconut Prawn Curry', fact: 'Barren Island has South Asia\'s only active volcano.' },
  { id: 11, city: 'Bali', region: 'Indonesia', scope: 'International', type: 'Luxury', price: '₹45,000', rating: 4.7, tag: 'Luxury Tier', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=70', tagline: 'The tropical playground of the gods', intro: 'Island paradise defined by volcanic ranges, rice paddies, and pristine beaches.', why: 'Major global hub for luxury eco-resorts and wellness retreats.', attractions: 'Ubud Monkey Forest, Uluwatu, Tanah Lot', time: 'Apr – Oct', food: 'Nasi Goreng, Sate Lilit, Babi Guling', fact: 'Nyepi day of silence shuts even the international airport.' },
  { id: 12, city: 'Paris', region: 'France', scope: 'International', type: 'Historical', price: '₹85,000', rating: 5.0, tag: 'Romantic Epic', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=70', tagline: 'The permanent capital of art and high fashion', intro: 'Global epicenter for art, haute couture, gastronomy, and architectural history.', why: 'World\'s most iconic destination for romantic cityscapes.', attractions: 'Eiffel Tower, Louvre Museum, Notre-Dame', time: 'Apr – Jun, Sep – Oct', food: 'Croissants, Escargot, Macarons', fact: 'Only one Stop sign exists in the entire city of Paris.' },
  { id: 13, city: 'Santorini', region: 'Greece', scope: 'International', type: 'Beaches', price: '₹1,10,000', rating: 4.9, tag: 'Luxury Tier', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop&q=70', tagline: 'Vivid azure domes over volcanic calderas', intro: 'Cyclades island reshaped by a devastating ancient volcanic eruption.', why: 'Whitewashed villas and breathtaking sunset views over the sea.', attractions: 'Oia Sunsets, Akrotiri Site, Red Beach', time: 'May – Oct', food: 'Tomato Gefthedes, Grilled Octopus', fact: 'The entire island is technically still an active volcanic caldera.' },
  { id: 14, city: 'Maldives', region: 'Indian Ocean', scope: 'International', type: 'Luxury', price: '₹95,000', rating: 4.8, tag: 'Honeymoon Choice', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&auto=format&fit=crop&q=70', tagline: 'Private water villas on hyper-clear lagoons', intro: 'Tropical nation composed of 26 ring-shaped atolls in the Indian Ocean.', why: 'Gold standard for luxury overwater bungalows and private islands.', attractions: 'Male City, Vaadhoo Bioluminescence, Reefs', time: 'Nov – Apr', food: 'Garudhiya, Mas Huni, Reef Fish', fact: 'Flattest country on Earth, averaging 1.5 m above sea level.' },
  { id: 15, city: 'Switzerland Alps', region: 'Europe', scope: 'International', type: 'Mountains', price: '₹1,40,000', rating: 5.0, tag: 'Premium', img: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=600&auto=format&fit=crop&q=70', tagline: 'The pinnacle of global pristine beauty', intro: 'Mountainous Central European nation home to lakes, alpine villages, and peaks.', why: 'Legendary ski resorts, hiking trails, and precision train journeys.', attractions: 'Matterhorn, Interlaken, Jungfraujoch', time: 'Jun – Aug, Dec – Mar', food: 'Cheese Fondue, Swiss Chocolate, Rösti', fact: 'Swiss law requires guinea pigs to be kept in pairs.' },
  { id: 16, city: 'Tokyo', region: 'Japan', scope: 'International', type: 'Historical', price: '₹1,20,000', rating: 4.9, tag: 'Cultural Icon', img: 'https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=600&auto=format&fithttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQK2p8VfiUFvGwzz3yXW472igtn4hY5oL69w&shttps://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/b7/0d/16/caption.jpg?w=300&h=300&s=1=crop&q=70', tagline: 'Where ancient temples meet neon skylines', intro: 'World\'s largest city blending millennia of tradition with hyper-modern innovation.', why: 'Sushi culture, temples, cherry blossoms, Mt Fuji day trips.', attractions: 'Shibuya Crossing, Senso-ji, Shinjuku, Mt Fuji', time: 'Mar – May, Oct – Nov', food: 'Sushi, Ramen, Tempura, Yakitori', fact: 'Tokyo has more Michelin-starred restaurants than any other city.' },
];

const OFFERS = [
  { title: 'Early Bird Monsoon', discount: '20% OFF ALL ROUTES', code: 'RAIN20', bg: '#f0fdf4', border: '#bbf7d0', txt: '#14532d', dtxt: '#166534', desc: 'Valid on domestic mountain treks and valley routes.' },
  { title: 'First International', discount: 'Flat ₹5,000 OFF', code: 'FLYHIGH', bg: '#eff6ff', border: '#bfdbfe', txt: '#1e3a8a', dtxt: '#1d4ed8', desc: 'Applicable on all premier cross-border itineraries.' },
  { title: 'Sacred Bharat Trail', discount: '15% Off Shrines', code: 'DEVOTION', bg: '#fffbeb', border: '#fde68a', txt: '#78350f', dtxt: '#b45309', desc: 'Priority pass across high-energy devotional nodes.' },
];

const STAYS = [
  { name: 'Amanpuri Pavilions', location: 'Phuket, Thailand', price: '₹1,20,000/Night', rating: 4.9, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=70', amenity: 'Private Beach Access' },
  { name: 'Taj Mahal Palace', location: 'Mumbai, India', price: '₹45,000/Night', rating: 5.0, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=70', amenity: 'Sea-Facing Royal Suite' },
  { name: 'Amangiri Retreat', location: 'Utah, USA', price: '₹2,10,000/Night', rating: 4.9, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=70', amenity: 'Canyon Horizon Oasis' },
  { name: 'The Oberoi Grand', location: 'Kolkata, India', price: '₹35,000/Night', rating: 4.8, img: 'https://images.unsplash.com/photo-1585399781346-39cd7b5bf4de?w=500&auto=format&fit=crop&q=70', amenity: 'Heritage Luxury Suite' },
  { name: 'Santorini Villas', location: 'Santorini, Greece', price: '₹1,80,000/Night', rating: 5.0, img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&auto=format&fit=crop&q=70', amenity: 'Caldera View Terrace' },
  { name: 'Leela Palace Udaipur', location: 'Udaipur, India', price: '₹55,000/Night', rating: 4.9, img: 'https://images.unsplash.com/photo-1571020614830-f3b30098d08c?w=500&auto=format&fit=crop&q=70', amenity: 'Lake Palace Room' },
];

const TRANSPORT = [
  { name: 'SkyBridge Airlines', type: 'Flight', price: '₹8,999', rating: 4.8, img: 'https://images.unsplash.com/photo-1552521514-5fefe8c9ef14?w=500&auto=format&fit=crop&q=70', amenity: 'Premium Cabin', routes: '150+ Routes' },
  { name: 'Rapid Rail Express', type: 'Train', price: '₹2,499', rating: 4.7, img: 'https://images.unsplash.com/photo-1570168268183-56eacde2fa16?w=500&auto=format&fit=crop&q=70', amenity: 'AC First Class', routes: '280+ Routes' },
  { name: 'LuxeCoach Travels', type: 'Bus', price: '₹1,999', rating: 4.6, img: 'https://images.unsplash.com/photo-1576583537228-f3ba8c7c2436?w=500&auto=format&fit=crop&q=70', amenity: 'Recliner Seats', routes: '450+ Routes' },
];

const TESTIMONIALS = [
  { name: 'Aishwarya Roy', location: 'Mumbai', text: 'The helicopter transit maps to Kedarnath were flawlessly synchronized. The 3D flip card description matched reality perfectly.', stars: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=70' },
  { name: 'Marcus Vance', location: 'London', text: 'Booking our Kyoto Zen path through Traveloop was unmatched. Clean UI, exceptional support, and great transparency on regional facts.', stars: 5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=70' },
  { name: 'Dr. Vikram Mehta', location: 'Delhi', text: 'Highly fluid engine. The live budget trackers instantly unlocked customized routes without any hidden overhead steps.', stars: 5, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=70' },
];

const MEMORY_IMGS = [
  { img: 'https://images.unsplash.com/photo-1483684446660-706fdc82875f?w=700&auto=format&fit=crop&q=70', title: 'Alpine Pass Treks', span: 'row-span-2' },
  { img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=700&auto=format&fit=crop&q=70', title: 'Global Collectives', span: '' },
  { img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&auto=format&fit=crop&q=70', title: 'Desert Expeditions', span: 'row-span-2' },
  { img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=700&auto=format&fit=crop&q=70', title: 'Hidden Lagoons', span: '' },
  { img: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=700&auto=format&fit=crop&q=70', title: 'Coastal Walkways', span: 'col-span-2' },
];

/* ─── Section header helper ─── */
const SectionHead = ({ eyebrow, title, sub, center }) => (
  <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 32 }}>
    {eyebrow && <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 8 }}>{eyebrow}</p>}
    <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: '#64748b', marginTop: 8, fontWeight: 400, maxWidth: center ? 520 : 400, margin: center ? '8px auto 0' : '8px 0 0' }}>{sub}</p>}
  </div>
);

/* ─── STAR ROW ─── */
const Stars = ({ n }) => (
  <div style={{ display: 'flex', gap: 1 }}>
    {[...Array(n)].map((_, i) => <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />)}
  </div>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('All');
  const [type, setType] = useState('All');
  const [budget, setBudget] = useState(200000);
  const [flipped, setFlipped] = useState(null);
  const [wish, setWish] = useState([]);
  const [visible, setVisible] = useState(8);
  const [formLoc, setFormLoc] = useState('');
  const [formTier, setFormTier] = useState('Luxury');

  const filtered = useMemo(() => DESTINATIONS.filter(d => {
    const q = query.toLowerCase();
    const txt = d.city.toLowerCase().includes(q) || d.region.toLowerCase().includes(q);
    const sc = scope === 'All' || d.scope === scope;
    const tp = type === 'All' || d.type === type;
    const price = parseInt(d.price.replace(/[^\d]/g, ''), 10) || 0;
    return txt && sc && tp && price <= budget;
  }), [query, scope, type, budget]);

  const toggleWish = (e, id) => { e.stopPropagation(); setWish(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };

  const doSearch = () => {
    setQuery(formLoc);
    if (formTier === 'Economy') setBudget(35000);
    else if (formTier === 'Premium') setBudget(80000);
    else setBudget(200000);
    document.getElementById('dest-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  /* shared layout constants */
  const PX = 'clamp(16px, 5vw, 64px)';
  const MAX = '1280px';

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#0f172a', overflowX: 'hidden' }}>
      <style>{STYLE}</style>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 50,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${PX}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{ width: 36, height: 36, background: '#2563eb', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plane size={17} color="#fff" style={{ transform: 'rotate(45deg)' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: 15, letterSpacing: '-0.02em', color: '#0f172a', textTransform: 'uppercase' }}>TRAVELOOP</span>
        </div>

        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[['Destinations', '#dest-section'], ['Stays', '#stays'], ['Transport', '#transport'], ['Offers', '#offers']].map(([l, h]) => (
            <a key={l} href={h} className="nav-a" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>{l}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', borderRadius: 100, border: '1px solid #e2e8f0', background: 'transparent', fontSize: 11, fontWeight: 700, color: '#475569', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Login</button>
          <button onClick={() => navigate('/signup')} style={{ padding: '8px 20px', borderRadius: 100, background: '#2563eb', color: '#fff', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sign Up</button>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <header style={{ paddingTop: 64, background: '#f8fafc', minHeight: 520, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1400&auto=format&fit=crop&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: MAX, margin: '0 auto', padding: `40px ${PX}`, width: '100%', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'center' }}>

          {/* Left copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 20 }}>
              <Sparkles size={11} /> Season Edition 2026 Live
            </div>
            <h1 style={{ fontSize: 'clamp(44px,7vw,80px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 18 }}>
              Dream<br />
              <span style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Further</span>
            </h1>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.65, maxWidth: 440, marginBottom: 28, fontWeight: 400 }}>
              Premium algorithmic travel pathways tailored for modern adventurers, couples, and heritage collectors.
            </p>
            <div style={{ display: 'flex', gap: 32 }}>
              {[['200+', 'Destinations'], ['50K+', 'Travelers'], ['4.9★', 'Rating']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search card */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Compass size={15} color="#2563eb" className="spin-slow" /> Plan Your Journey
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Destination input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                <MapPin size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                <input type="text" placeholder="Where to escape?" value={formLoc} onChange={e => setFormLoc(e.target.value)}
                  style={{ flex: 1, outline: 'none', border: 'none', background: 'transparent', fontSize: 13, fontWeight: 500, color: '#0f172a' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                  <Clock size={14} color="#2563eb" />
                  <select style={{ flex: 1, outline: 'none', border: 'none', background: 'transparent', fontSize: 12, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                    <option>1 Week</option><option>3–5 Days</option><option>2+ Weeks</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                  <Layers size={14} color="#2563eb" />
                  <select value={formTier} onChange={e => setFormTier(e.target.value)}
                    style={{ flex: 1, outline: 'none', border: 'none', background: 'transparent', fontSize: 12, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                    <option>Luxury</option><option>Premium</option><option>Economy</option>
                  </select>
                </div>
              </div>
              <button onClick={doSearch}
                style={{ width: '100%', padding: '13px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 14, fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}>
                Search Routes <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════ OFFERS ══════════ */}
      <section id="offers" style={{ padding: `28px ${PX}`, maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {OFFERS.map((o, i) => (
            <div key={i} style={{ background: o.bg, border: `1px solid ${o.border}`, borderRadius: 18, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: o.txt, opacity: 0.7 }}>{o.title}</span>
                <ArrowUpRight size={15} color={o.dtxt} />
              </div>
              <p style={{ fontSize: 20, fontWeight: 900, color: o.txt, lineHeight: 1.1, margin: 0 }}>{o.discount}</p>
              <p style={{ fontSize: 11, color: o.dtxt, fontWeight: 400, margin: 0, lineHeight: 1.5 }}>{o.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: `1px solid ${o.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff', padding: '4px 10px', borderRadius: 8, border: `1px solid ${o.border}` }}>
                  <Tag size={11} color="#2563eb" />
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 800, color: '#0f172a', letterSpacing: '0.06em' }}>{o.code}</span>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: o.dtxt, opacity: 0.7 }}>Apply</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ DESTINATIONS ══════════ */}
      <section id="dest-section" style={{ padding: `36px ${PX} 48px`, maxWidth: MAX, margin: '0 auto' }}>

        {/* Header + scope toggles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <SectionHead eyebrow="Algorithmic Index" title="Explore Global Coordinates" />
          <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 14 }}>
            {['All', 'India', 'International'].map(s => (
              <button key={s} onClick={() => { setScope(s); setFlipped(null); }}
                style={{ padding: '7px 18px', borderRadius: 10, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', background: scope === s ? '#fff' : 'transparent', color: scope === s ? '#0f172a' : '#94a3b8', boxShadow: scope === s ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all .2s' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['All', 'Mountains', 'Beaches', 'Devotional', 'Historical', 'Luxury', 'Nature', 'Hidden Gems'].map(t => (
              <button key={t} onClick={() => { setType(t); setFlipped(null); }}
                style={{ padding: '6px 14px', borderRadius: 10, border: `1px solid ${type === t ? '#2563eb' : 'transparent'}`, background: type === t ? '#eff6ff' : 'transparent', color: type === t ? '#2563eb' : '#64748b', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all .2s', letterSpacing: '0.04em' }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 240 }}>
            <SlidersHorizontal size={13} color="#94a3b8" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', marginBottom: 4 }}>
                <span>Max Budget</span>
                <span style={{ color: '#0f172a', fontFamily: 'monospace' }}>₹{budget.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="3000" max="200000" step="5000" value={budget} onChange={e => setBudget(+e.target.value)}
                style={{ width: '100%', accentColor: '#2563eb', height: 4, cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 16 }}>
          Showing {Math.min(filtered.length, visible)} of {filtered.length} destinations
        </p>

        {/* ── CARDS GRID ── */}
        <div className="perspective-1200" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 18 }}>
          {filtered.slice(0, visible).map(item => {
            const isFlipped = flipped === item.id;
            const inWish = wish.includes(item.id);
            return (
              <div key={item.id}
                className="dest-card"
                onClick={() => setFlipped(isFlipped ? null : item.id)}
                style={{ height: 380, position: 'relative', cursor: 'pointer' }}>
                <div className={`flipper preserve-3d${isFlipped ? ' flipped' : ''}`} style={{ width: '100%', height: '100%' }}>

                  {/* ── FRONT ── */}
                  <div className="card-front" style={{ background: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ height: 200, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <img src={item.img} alt={item.city} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)' }} />
                      {/* Tag */}
                      <span style={{ position: 'absolute', top: 10, left: 10, padding: '3px 9px', background: 'rgba(255,255,255,0.92)', borderRadius: 8, fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2563eb' }}>{item.tag}</span>
                      {/* Wish */}
                      <button onClick={e => toggleWish(e, item.id)} style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Heart size={13} fill={inWish ? '#ef4444' : 'transparent'} color={inWish ? '#ef4444' : '#94a3b8'} />
                      </button>
                      {/* Rating */}
                      <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.92)', padding: '3px 8px', borderRadius: 7 }}>
                        <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>{item.rating}</span>
                      </div>
                      {/* Flip hint */}
                      <span style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 8, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.08em' }}>TAP ↻</span>
                    </div>
                    {/* Body */}
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                        <MapPin size={11} color="#94a3b8" />
                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.region}</span>
                      </div>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{item.city}</h3>
                      <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, margin: '0 0 auto', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.tagline}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginTop: 10, borderTop: '1px solid #f1f5f9' }}>
                        <div>
                          <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>From</p>
                          <p style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: '2px 0 0', fontFamily: 'monospace' }}>{item.price}</p>
                        </div>
                        <span style={{ padding: '6px 12px', background: '#eff6ff', borderRadius: 8, fontSize: 10, fontWeight: 700, color: '#2563eb', border: '1px solid #bfdbfe' }}>Explore</span>
                      </div>
                    </div>
                  </div>

                  {/* ── BACK ── */}
                  <div className="card-back" style={{ background: 'linear-gradient(160deg,#0f172a 0%,#1e293b 100%)', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #334155' }}>
                      <p style={{ fontSize: 9, fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 4px' }}>Journey Details</p>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{item.city}</h3>
                    </div>
                    <div className="no-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        ['Overview', item.intro, '#fbbf24'],
                        ['Why Visit', item.why, '#34d399'],
                        ['Attractions', item.attractions, '#60a5fa'],
                        ['Best Time', item.time, '#a78bfa'],
                      ].map(([lbl, val, col]) => (
                        <div key={lbl}>
                          <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: col, margin: '0 0 3px' }}>{lbl}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>{val}</p>
                        </div>
                      ))}
                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '8px 10px', border: '1px solid #334155' }}>
                        <p style={{ fontSize: 9, fontWeight: 800, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 3px' }}>Did You Know?</p>
                        <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.45, margin: 0, fontStyle: 'italic' }}>"{item.fact}"</p>
                      </div>
                    </div>
                    <div style={{ padding: '10px 16px 14px', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button onClick={e => { e.stopPropagation(); alert(`Booking: ${item.city}`); }}
                        style={{ padding: '10px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
                        Book This Destination
                      </button>
                      <button onClick={e => { e.stopPropagation(); setFlipped(null); }}
                        style={{ padding: '8px 0', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid #334155', borderRadius: 10, fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        ↺ Back
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {filtered.length > visible && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => setVisible(v => v + 8)}
              style={{ padding: '11px 32px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 100, fontSize: 11, fontWeight: 800, color: '#475569', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
              Load More Destinations
            </button>
          </div>
        )}
      </section>

      {/* ══════════ MEMORIES MOSAIC ══════════ */}
     {/* ══════════ SOCIAL GRID LOGS (EMOTIONAL CHRONICLES) ══════════ */}
<section id="memories" className="py-24 px-6 md:px-16 bg-slate-50 border-y border-slate-200/60">
  <div className="max-w-7xl mx-auto">
    
    {/* Section Title Unit */}
    <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
      <span className="text-xs font-black uppercase tracking-[3px] text-blue-600">Social Grid Logs</span>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">Emotional Chronicles</h2>
      <p className="text-slate-400 text-sm font-medium">Real snapshot captures from premium expeditions across our global member networks.</p>
    </div>

    {/* Perfectly Organized, Symmetric Card Grid (No weird offsets or uneven gaps) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { 
          title: 'Alpine Ridges Trek', 
          location: 'Switzerland Alps',
          img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80' 
        },
        { 
          title: 'Tropical Ocean Lagoons', 
          location: 'Maldives Islands',
          img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=80' 
        },
        { 
          title: 'Desert Trail Expeditions', 
          location: 'Cairo Outskirts',
          img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&auto=format&fit=crop&q=80' 
        },
        { 
          title: 'Ancient Temple Paths', 
          location: 'Kyoto, Japan',
          img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80' 
        },
        { 
          title: 'Coastal Horizon Hikes', 
          location: 'Santorini Cliffs',
          img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80' 
        },
        { 
          title: 'Sacred High Shrines', 
          location: 'Kedarnath Valley',
          img: 'https://images.unsplash.com/photo-1561361531-99e224e9f331?w=800&auto=format&fit=crop&q=80' 
        },
        { 
          title: 'Mughal Imperial Architecture', 
          location: 'Agra, India',
          img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80' 
        },
        { 
          title: 'Bespoke Friend Retreats', 
          location: 'Bali Villa Greens',
          img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80' 
        }
      ].map((m, i) => (
        <div 
          key={i} 
          className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-[340px]"
        >
          {/* Symmetric Image Frame Container */}
          <div className="h-[230px] overflow-hidden relative bg-slate-100 shadow-3xs">
            <img 
              src={m.img} 
              alt={m.title} 
              loading="lazy" 
              className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105" 
            />
            {/* Clean Location Tag on Top-Left */}
            <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-md rounded-xl text-[9px] font-black tracking-widest text-slate-800 uppercase border border-slate-100 shadow-2xs">
              {m.location}
            </span>
          </div>

          {/* Structured Text Content Panel (Keeps the alignment uniform across rows) */}
          <div className="p-5 flex-1 flex flex-col justify-center text-left bg-white">
            <p className="text-[9px] font-black uppercase tracking-[3px] text-blue-600">Expedition Instance</p>
            <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug mt-1 group-hover:text-blue-600 transition-colors line-clamp-1">
              {m.title}
            </h3>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-100 pt-2.5">
              <span>Verified Log</span>
              <span className="text-blue-600/80 uppercase tracking-widest text-[9px]">View Assets →</span>
            </div>
          </div>

        </div>
      ))}
    </div>

  </div>
</section>
      {/* ══════════ STAYS ══════════ */}
      <section id="stays" className="py-20 px-6 md:px-16 max-w-7xl mx-auto w-full">

        {/* Header Setup with Flex Control */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6 text-left">
          <SectionHead
            eyebrow="Premium Resides"
            title="Bespoke Eco-Resorts"
            sub="High-tier stays with private lounge amenities."
          />
          <button
            onClick={() => alert('Viewing all luxury arrays')}
            className="group px-6 py-3 border border-slate-200 hover:border-slate-300 rounded-full bg-white text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-2xs flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Responsive Balanced Grid System (Bigger & Structured Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: 'Amanpuri Pavilions Oasis',
              location: 'Phuket, Thailand',
              price: '₹1,20,000/Night',
              rating: '4.9',
              amenity: 'Private Beach Access',
              img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
            },
            {
              name: 'The Taj Mahal Palace Imperial',
              location: 'Mumbai, India',
              price: '₹45,000/Night',
              rating: '5.0',
              amenity: 'Sea-Facing Royal Suite',
              img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'
            },
            {
              name: 'Amangiri Canyon Retreat',
              location: 'Utah, USA',
              price: '₹2,10,000/Night',
              rating: '4.9',
              amenity: 'Desert Horizon View',
              img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80'
            }
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-full group"
            >
              {/* Expanded Image Framing Ecosystem (Height Adjusted to 220px) */}
              <div className="h-[220px] overflow-hidden relative bg-slate-100 shadow-3xs">
                <img
                  src={s.img}
                  alt={s.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.97]"
                />
                {/* Glassmorphism Amenity Tag */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-xs border border-slate-100/60">
                  <Hotel size={11} className="text-blue-600" />
                  <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">{s.amenity}</span>
                </div>
              </div>

              {/* Card Data Content Text Area */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-extrabold uppercase tracking-wider">{s.location}</span>
                    <div className="flex items-center gap-0.5 font-bold text-amber-500 text-[11px] bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/40">
                      <Star size={11} fill="currentColor" /> <span>{s.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                    {s.name}
                  </h3>
                </div>

                {/* Pricing Config & Action Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Rate Value</p>
                    <p className="text-lg font-mono font-black text-slate-900 mt-0.5">{s.price}</p>
                  </div>
                  <button
                    onClick={() => alert(`Launching lodging secure matrix for ${s.name}`)}
                    className="px-5 py-2.5 bg-slate-50 hover:bg-blue-600 border border-slate-200 text-slate-700 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs active:scale-95"
                  >
                    Book Now
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ══════════ TRANSPORT ══════════ */}
      <section id="transport" className="py-16 px-6 md:px-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">

          <SectionHead
            eyebrow="Journey Options"
            title="Book Transportation"
            sub="Flights, trains, and premium coaches with real-time availability."
          />

          {/* Responsive Modern Grid - Auto adjusting layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {[
              {
                name: 'Sky High Vectors',
                type: 'Aviation',
                amenity: 'First Class Lounge',
                routes: '240+ Active Channels',
                rating: '4.9',
                price: '₹4,999',
                img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80'
              },
              {
                name: 'Track Master Express',
                type: 'Railways',
                amenity: 'Vande Bharat Elite',
                routes: '580+ Broad Routes',
                rating: '4.8',
                price: '₹1,299',
                img: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=800&auto=format&fit=crop&q=80'
              },
              {
                name: 'Road King Cruising',
                type: 'Premium Bus',
                amenity: 'Luxury Sleeper AC',
                routes: '1200+ Active Couches',
                rating: '4.7',
                price: '₹799',
                img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'
              }
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/80 rounded-[28px] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-full group"
              >
                {/* Bigger Image Framing Ecosystem with Smooth Zoom Animation */}
                <div className="height-[200px] sm:h-[220px] overflow-hidden relative bg-slate-100">
                  <img
                    src={t.img}
                    alt={t.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Top Right Type Tag */}
                  <span className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-md rounded-xl text-[9px] font-black tracking-widest text-blue-600 uppercase shadow-xs border border-slate-100">
                    {t.type}
                  </span>
                  {/* Bottom Left Amenity Tag */}
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-blue-600/90 backdrop-blur-md rounded-xl text-[9px] font-black tracking-widest text-white uppercase shadow-xs">
                    {t.amenity}
                  </span>
                </div>

                {/* Card Content Data Hub */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {t.routes}
                      </span>
                      <div className="flex items-center gap-0.5 font-bold text-amber-500 text-[11px] bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/40">
                        <Star size={11} fill="currentColor" /> <span>{t.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                      {t.name}
                    </h3>
                  </div>

                  {/* Price Config & Button Trigger */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Starting From</p>
                      <p className="text-xl font-mono font-black text-slate-900 mt-0.5">{t.price}</p>
                    </div>
                    <button
                      onClick={() => alert(`Initializing booking matrix loop for ${t.name}`)}
                      className="px-5 py-2.5 bg-blue-50 hover:bg-blue-600 border border-blue-200/60 text-blue-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      Book Ride
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section style={{ padding: `40px ${PX}`, maxWidth: MAX, margin: '0 auto' }}>
        <SectionHead eyebrow="Operational Validation" title="Trust Verifications" center />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {TESTIMONIALS.map((r, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Stars n={r.stars} />
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, margin: 0, fontStyle: 'italic', flex: 1 }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                <img src={r.img} alt={r.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: 0 }}>{r.name}</p>
                  <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ NEWSLETTER ══════════ */}
      <section style={{ padding: `0 ${PX} 40px`, maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)', border: '1px solid #bfdbfe', borderRadius: 24, padding: '32px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 420 }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Subscribe to the Ledger</h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>Get real-time updates on flash discounts, devotional charter passes, and curated route maps.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, background: '#fff', padding: 6, borderRadius: 14, border: '1px solid #e2e8f0', minWidth: 300 }}>
            <input type="email" placeholder="Your email address..." style={{ flex: 1, outline: 'none', border: 'none', background: 'transparent', fontSize: 13, fontWeight: 500, color: '#0f172a', padding: '6px 10px' }} />
            <button onClick={() => alert('Subscribed!')} style={{ padding: '9px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Subscribe <Send size={11} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: '#0f172a', padding: `32px ${PX}` }}>
        <div style={{ maxWidth: MAX, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 32, paddingBottom: 24, borderBottom: '1px solid #1e293b' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plane size={15} color="#fff" style={{ transform: 'rotate(45deg)' }} />
              </div>
              <span style={{ fontWeight: 900, fontSize: 14, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>TRAVELOOP</span>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, maxWidth: 280, margin: 0 }}>Transforming luxury travel planning into a seamless digital experience. Curated by Amit Dubey.</p>
          </div>
          <div>
            <h5 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#94a3b8', marginBottom: 16 }}>Secure Hubs</h5>
            {['System Support', 'Insurance Matrix', 'Data Privacy'].map(l => (
              <p key={l} style={{ fontSize: 12, color: '#475569', fontWeight: 600, margin: '0 0 10px', cursor: 'pointer', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}>{l}</p>
            ))}
          </div>
          <div>
            <h5 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#94a3b8', marginBottom: 16 }}>Contact</h5>
            <p style={{ fontSize: 12, color: '#475569', fontWeight: 600, margin: '0 0 8px' }}>support@traveindia.com</p>
            <p style={{ fontSize: 12, color: '#475569', fontFamily: 'monospace', margin: 0 }}>+91  9598228507</p>
          </div>
        </div>
        <div style={{ maxWidth: MAX, margin: '0 auto', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>© 2026 Traveloop Core. Crafted and hosted by Mr.Amit Dubey , Contact Number : 9598288507</p>
          <div style={{ display: 'flex', gap: 14 }}>
            {[Globe, ShieldCheck, Headset].map((Icon, i) => (
              <Icon key={i} size={16} color="#475569" style={{ cursor: 'pointer', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
