import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, Mail, Lock, ArrowRight, Github, Chrome, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // --- SLIDESHOW LOGIC ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format",
      text: "The world is waiting for you."
    },
    {
      url: "https://images.unsplash.com/photo-1506929113675-b9299d39bb14?q=80&w=1200&auto=format",
      text: "Find your next adventure."
    },
    {
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format",
      text: "Escape the ordinary."
    },
    {
      url: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=1200&auto=format",
      text: "Explore hidden gems."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4500); 
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password
      });

      if (response.data.success) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (error) {
      alert("Invalid Credentials! Please check your email or password.");
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px] opacity-40"></div>

      {/* Back to Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 md:top-10 md:left-10 z-30 flex items-center gap-2 text-gray-400 font-black text-[10px] tracking-[2px] hover:text-blue-700 transition-all group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" /> BACK TO EXPLORE
      </button>

      <div className="w-full max-w-[1150px] min-h-[700px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 border border-white">
        
        {/* --- LEFT SIDE: ANIMATED SLIDESHOW --- */}
        <div className="hidden lg:block relative overflow-hidden bg-slate-900">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
            >
              <img 
                src={slide.url} 
                className="h-full w-full object-cover"
                alt="Travel Destination"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-transparent flex flex-col justify-end p-16">
                <h2 className="text-5xl font-black text-white leading-tight uppercase italic drop-shadow-xl">
                  {slide.text}
                </h2>
                
                {/* Slide Indicators */}
                <div className="flex gap-3 mt-8">
                  {slides.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === currentSlide ? "w-12 bg-blue-500" : "w-3 bg-white/30"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="p-8 md:p-20 flex flex-col justify-center bg-white">
          <div className="mb-12">
            <div className="flex items-center gap-2 text-2xl font-black text-blue-700 mb-4">
              <Plane className="rotate-45" size={28} /> <span className="tracking-tighter">TRAVELOOP</span>
            </div>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Confirm <br/> Your Booking</h3>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[4px] mt-4">Welcome back, Traveler</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition" size={20} />
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your E-mail @gmail.com" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Key</label>
                <a href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition" size={20} />
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-800"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black text-xs tracking-[3px] uppercase hover:bg-blue-800 transition-all shadow-2xl shadow-blue-200 transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isLoading ? "Validating Passport..." : "Initiate Takeoff"} <ArrowRight size={20} />
            </button>
          </form>

          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] font-black text-gray-300 uppercase tracking-[4px]">
              <span className="bg-white px-6">Gate Entry</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl font-bold text-xs text-gray-500 hover:bg-slate-50 transition active:scale-95 uppercase tracking-widest">
              <Chrome size={18} className="text-red-500" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl font-bold text-xs text-gray-500 hover:bg-slate-50 transition active:scale-95 uppercase tracking-widest">
              <Github size={18} className="text-black" /> Github
            </button>
          </div>

          <p className="mt-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
            New to the tribe? <span onClick={() => navigate('/signup')} className="text-blue-700 cursor-pointer hover:underline ml-1">Join Traveloop</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;