import React from 'react';
import { Plane, MapPin, Search, Globe, ShieldCheck, Headset, Train, Bus, Star, Clock, Tag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  // Destinations Data
  const destinations = [
    { id: 1, city: 'Manali, India', price: '₹5,999', rating: 4.8, img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&auto=format', tag: 'Best Seller' },
    { id: 2, city: 'Goa, India', price: '₹3,499', rating: 4.9, img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format', tag: 'Trending' },
    { id: 3, city: 'Bali, Indonesia', price: '₹45,000', rating: 4.7, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format', tag: 'Luxury' },
    { id: 4, city: 'Paris, France', price: '₹85,000', rating: 5.0, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format', tag: 'Romantic' },
    { id: 5, city: 'Ujjain, MP', price: '₹5,000', rating: 5.0, img: 'https://images.unsplash.com/photo-1622325333919-6188e7f1e6f4?q=80&w=600&auto=format', tag: "Devotional" }
  ];

  const offers = [
    { title: 'Early Bird Monsoon', discount: '20% OFF', code: 'RAIN20', color: 'bg-emerald-600' },
    { title: 'First International Trip', discount: 'Flat ₹5000 OFF', code: 'FLYHIGH', color: 'bg-blue-800' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* --- 1. PREMIUM NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-2 text-2xl font-black text-blue-700 cursor-pointer" onClick={() => navigate('/')}>
          <Plane className="rotate-45" /> <span className="tracking-tighter uppercase">TRAVELOOP</span>
        </div>
        
        <div className="hidden lg:flex gap-10 font-bold text-[11px] uppercase tracking-[2px] text-gray-500">
          <a href="#destinations" className="hover:text-blue-700 transition">Destinations</a>
          <a href="#transport" className="hover:text-blue-700 transition">Transport</a>
          <a href="#offers" className="hover:text-blue-700 transition">Offers</a>
          <a href="#about" className="hover:text-blue-700 transition">About</a>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/login')} className="hidden md:block px-6 py-2.5 font-bold text-blue-700 hover:bg-blue-50 rounded-full transition text-xs uppercase tracking-widest">Login</button>
          <button onClick={() => navigate('/signup')} className="px-8 py-3 bg-blue-700 text-white font-bold rounded-full hover:bg-blue-800 shadow-xl shadow-blue-200 transition-all text-xs transform hover:-translate-y-0.5 uppercase tracking-widest">Sign Up</button>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <header className="relative h-[95vh] flex items-center justify-center pt-10 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Luxury Beach"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10"></div>

        <div className="relative z-10 w-full px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[3px] uppercase">New Season 2026</span>
            <h1 className="text-6xl md:text-[100px] font-black leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">Dream <br/> Further</h1>
            <p className="text-xl md:text-2xl font-medium text-gray-200 max-w-lg">Premium travel experiences tailored for adventurers, couples, and families.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Plan Your Trip</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
                <MapPin className="text-blue-600" size={20} />
                <div className="flex-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Location</p>
                  <input type="text" placeholder="Where to?" className="w-full outline-none text-gray-800 font-bold bg-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
                  <Clock className="text-blue-600" size={20} />
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Duration</p>
                    <select className="w-full outline-none bg-transparent font-bold text-gray-800 text-sm">
                      <option>3-5 Days</option>
                      <option>1 Week</option>
                      <option>2+ Weeks</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
                  <Star className="text-blue-600" size={20} />
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Budget</p>
                    <select className="w-full outline-none bg-transparent font-bold text-gray-800 text-sm">
                      <option>Economy</option>
                      <option>Premium</option>
                      <option>Luxury</option>
                    </select>
                  </div>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-blue-700 transition-all shadow-lg active:scale-95">FIND PACKAGES</button>
            </div>
          </div>
        </div>
      </header>

      {/* --- 3. TRENDING OFFERS --- */}
      <section id="offers" className="py-12 px-6 md:px-16 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer, idx) => (
            <div key={idx} className={`${offer.color} rounded-[32px] p-8 text-white flex justify-between items-center shadow-2xl transition-transform hover:scale-[1.02]`}>
              <div>
                <h4 className="text-sm font-bold opacity-80 mb-2 uppercase tracking-widest">{offer.title}</h4>
                <p className="text-3xl font-black mb-4">{offer.discount}</p>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl border border-white/30 w-fit">
                  <Tag size={16} /> <span className="font-mono font-bold tracking-widest">{offer.code}</span>
                </div>
              </div>
              <ArrowRight size={40} className="opacity-40" />
            </div>
          ))}
        </div>
      </section>

      {/* --- 4. DESTINATIONS --- */}
      <section id="destinations" className="py-24 px-6 md:px-16 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">The Best <br/> <span className="text-blue-700 underline decoration-blue-200 underline-offset-8">Adventure</span></h2>
          </div>
          <button className="group flex items-center gap-2 bg-slate-50 border border-slate-100 px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest hover:bg-blue-700 hover:text-white transition-all uppercase">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {destinations.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative h-[420px] overflow-hidden rounded-[35px] mb-6 shadow-xl bg-slate-200">
                <img src={item.img || 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1'} className="h-full w-full object-cover transition duration-1000 group-hover:scale-110" alt={item.city}/>
                <div className="absolute top-5 left-5 bg-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest text-blue-700 uppercase shadow-lg">
                  {item.tag}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end">
                    <button className="w-full bg-white text-blue-700 py-4 rounded-2xl font-black text-xs tracking-widest uppercase active:scale-95 transition shadow-2xl">Book Now</button>
                </div>
              </div>
              <div className="px-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-gray-900 leading-none">{item.city}</h3>
                    <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                        <Star size={14} fill="currentColor" /> {item.rating}
                    </div>
                </div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Starting from <span className="text-blue-700 text-lg ml-1">{item.price}</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 5. TRANSPORT --- */}
      <section id="transport" className="py-24 px-6 md:px-16 bg-slate-50">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Your Way, Your Move</h2>
            <p className="text-gray-500 font-medium mt-2">Multiple ways to reach your dream destination.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { name: 'Sky High', icon: <Plane size={40} />, count: '200+ Flights' },
            { name: 'Track Master', icon: <Train size={40} />, count: '500+ Routes' },
            { name: 'Road King', icon: <Bus size={40} />, count: '1000+ Buses' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-12 rounded-[50px] text-center border border-gray-100 hover:border-blue-200 transition-all group">
              <div className="mx-auto w-24 h-24 bg-slate-50 rounded-[30px] flex items-center justify-center text-blue-700 mb-6 group-hover:bg-blue-700 group-hover:text-white transition-all rotate-3 group-hover:rotate-0">
                {item.icon}
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-2">{item.name}</h4>
              <p className="text-blue-600 font-bold text-sm tracking-[2px] uppercase">{item.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 6. FOOTER --- */}
      <footer className="bg-white pt-24 pb-12 px-6 md:px-16 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-xl font-black text-blue-700 mb-6">
              <Plane className="rotate-45" size={24} /> <span className="tracking-tighter uppercase">TRAVELOOP</span>
            </div>
            <p className="text-gray-500 font-medium max-w-sm">Making luxury travel accessible for everyone. Plan your next stay with Amit Dubey's expert curation.</p>
          </div>
          <div>
            <h5 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-[10px]">Quick Links</h5>
            <ul className="space-y-4 text-gray-500 font-bold text-xs uppercase tracking-wider">
              <li className="hover:text-blue-700 cursor-pointer transition">Support</li>
              <li className="hover:text-blue-700 cursor-pointer transition">Insurance</li>
              <li className="hover:text-blue-700 cursor-pointer transition">Privacy</li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-[10px]">Contact</h5>
            <p className="text-gray-500 font-bold text-xs tracking-wider">hello@traveloop.com</p>
            <p className="text-gray-500 font-bold text-xs tracking-wider">+91 98765 43210</p>
          </div>
        </div>
        <div className="pt-12 border-t border-gray-50 flex justify-between items-center">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">© 2026 Traveloop. By Amit Dubey.</p>
          <div className="flex gap-6 text-gray-400">
            <Globe size={18} className="hover:text-blue-700 transition cursor-pointer" />
            <ShieldCheck size={18} className="hover:text-blue-700 transition cursor-pointer" />
            <Headset size={18} className="hover:text-blue-700 transition cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;