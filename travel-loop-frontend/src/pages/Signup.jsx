import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // --- SLIDESHOW LOGIC (Matches Login for Brand Consistency) ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      url: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1200&auto=format",
      text: "Start your journey today."
    },
    {
      url: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=1200&auto=format",
      text: "Your passport to adventure."
    },
    {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format",
        text: "Explore the unexplored."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Backend Signup API Call
      // Make sure your backend route is /api/auth/register or /api/auth/signup
      const response = await axios.post('https://travler-loop.onrender.com/api/auth/register', formData);
      if (response.data.success) {
        alert("Account Created Successfully! 🚀");
        navigate('/login');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed! Try a different email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden">
      
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-40"></div>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 md:top-10 md:left-10 z-30 flex items-center gap-2 text-gray-400 font-black text-[10px] tracking-[2px] hover:text-blue-700 transition-all group uppercase"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" /> Back to Home
      </button>

      <div className="w-full max-w-[1150px] min-h-[700px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 border border-white">
        
        {/* --- LEFT SIDE: ANIMATED SLIDESHOW --- */}
        <div className="hidden lg:block relative overflow-hidden bg-slate-900">
          {slides.map((slide, index) => (
            <div key={index} className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}>
              <img src={slide.url} className="h-full w-full object-cover" alt="Travel" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-transparent flex flex-col justify-end p-16">
                <h2 className="text-5xl font-black text-white leading-tight uppercase italic drop-shadow-xl">{slide.text}</h2>
                
                {/* Indicators */}
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

        {/* --- RIGHT SIDE: SIGNUP FORM --- */}
        <div className="p-8 md:p-20 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-2xl font-black text-blue-700 mb-4">
              <Plane className="rotate-45" size={28} /> <span className="tracking-tighter">TRAVELOOP</span>
            </div>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Create Your <br/> Account</h3>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[4px] mt-4">Join the global explorers</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition" size={20} />
                <input required name="username" type="text" onChange={handleChange} placeholder="Amit Dubey" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition" size={20} />
                <input required name="email" type="email" onChange={handleChange} placeholder="amit@traveloop.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition" size={20} />
                <input required name="password" type="password" onChange={handleChange} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-800" />
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black text-xs tracking-[3px] uppercase hover:bg-blue-800 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 transform active:scale-[0.98]">
              {isLoading ? "Preparing Passport..." : "Register Now"} <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
            Already a member? <span onClick={() => navigate('/login')} className="text-blue-700 cursor-pointer hover:underline ml-1">Log In</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;