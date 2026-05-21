import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, Mail, Lock, ArrowRight, ArrowLeft, Github, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── FIREBASE IMPORTS ──
import { auth, googleProvider } from '../firebaseConfig';
import { sendPasswordResetEmail, signInWithRedirect, getRedirectResult } from 'firebase/auth';

/* ══════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════ */
const injectGlobals = () => {
  if (document.getElementById('login-globals')) return;

  const font = document.createElement('link');
  font.rel  = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap';
  document.head.appendChild(font);

  const style = document.createElement('style');
  style.id = 'login-globals';
  style.textContent = `
    .login-input {
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      caret-color: #2563eb !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 14px !important;
      font-weight: 400 !important;
    }
    .login-input::placeholder {
      color: #94a3b8 !important;
      -webkit-text-fill-color: #94a3b8 !important;
      opacity: 1 !important;
    }
    .login-input:-webkit-autofill,
    .login-input:-webkit-autofill:hover,
    .login-input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 9999px #f8faff inset !important;
      -webkit-text-fill-color: #0f172a !important;
    }

    @keyframes kb0 { from { transform: scale(1.00) translate(0,0); } to { transform: scale(1.10) translate(-15px,-8px); } }
    @keyframes kb1 { from { transform: scale(1.00) translate(0,0); } to { transform: scale(1.10) translate(12px,-10px); } }
    @keyframes kb2 { from { transform: scale(1.00) translate(0,0); } to { transform: scale(1.10) translate(-10px,8px); } }
    @keyframes kb3 { from { transform: scale(1.00) translate(0,0); } to { transform: scale(1.12) translate(8px,-12px); } }
    .kb0 { animation: kb0 8s ease-in-out infinite alternate; }
    .kb1 { animation: kb1 8s ease-in-out infinite alternate; }
    .kb2 { animation: kb2 8s ease-in-out infinite alternate; }
    .kb3 { animation: kb3 8s ease-in-out infinite alternate; }

    @keyframes form-up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    .form-up { animation: form-up 0.5s cubic-bezier(0.22,1,0.36,1) both; }

    @keyframes dot-pulse { 0%,100__ { box-shadow:0 0 0 0 rgba(37,99,235,0.45); } 50% { box-shadow:0 0 0 6px rgba(37,99,235,0); } }
    .dot-pulse { animation: dot-pulse 1.8s ease-out infinite; }

    @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
    .btn-shimmer {
      background: linear-gradient(90deg, #1e40af 0%, #2563eb 40%, #1e40af 100%);
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }

    .social-btn { transition: all .2s !important; }
    .social-btn:hover { background:#eff6ff !important; border-color:#bfdbfe !important; }
  `;
  document.head.appendChild(style);
};

const SLIDES = [
  { url:'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format', tag:'FIRST CLASS', line1:'The World',    line2:'Is Waiting.',   sub:'Premium travel for the discerning explorer.', kb:'kb0' },
  { url:'https://images.unsplash.com/photo-1506929113675-b9299d39bb14?q=80&w=1200&auto=format', tag:'ADVENTURE',   line1:'Find Your',     line2:'Next Story.',    sub:'Off-the-beaten-path destinations.',           kb:'kb1' },
  { url:'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format', tag:'ESCAPE',      line1:'Escape The',    line2:'Ordinary.',      sub:'Every journey starts with one booking.',      kb:'kb2' },
  { url:'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=1200&auto=format', tag:'DISCOVER',    line1:'Explore',       line2:'Hidden Gems.',   sub:'Curated routes to places maps forget.',       kb:'kb3' },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f172a">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [curSlide,  setCurSlide]  = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [inTrans,   setInTrans]   = useState(false);
  const [focused,   setFocused]   = useState(null);
  const [gLoading,  setGLoading]  = useState(false);

  useEffect(() => { injectGlobals(); }, []);

  // Handle Google OAuth redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (!result?.user) return;

        const user = result.user;
        const apiUrl = import.meta.env.VITE_API_URL || 'https://travler-loop.onrender.com';
        const response = await axios.post(`${apiUrl}/api/auth/google`, {
          username: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
        });

        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify({
            ...response.data.user,
            profilePic: user.photoURL,
          }));
          navigate('/dashboard');
        } else {
          throw new Error(response.data.message || 'Login failed');
        }
      } catch (error) {
        console.error('[Auth] Google login error:', error);
        alert('Google login failed. Please try again.');
      }
    };

    handleRedirectResult();
  }, [navigate]);

  // Auto-advance slideshow
  useEffect(() => {
    const t = setInterval(() => goTo((curSlide + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, [curSlide, inTrans]);

  const goTo = (idx) => {
    if (inTrans || idx === curSlide) return;
    setPrevSlide(curSlide);
    setInTrans(true);
    setTimeout(() => { setCurSlide(idx); setPrevSlide(null); setInTrans(false); }, 800);
  };

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://travler-loop.onrender.com';
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } else {
        alert(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('[Auth] Login error:', err);
      alert(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // ── GOOGLE OAUTH LOGIN ──
  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('[Auth] Google sign-in error:', error);
      alert('Google sign-in failed. Please try again.');
    }
  };

  // Password Reset
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const resetEmail = prompt('Enter your registered email:');
    if (!resetEmail) return;
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Password reset link sent to your email');
    } catch (error) {
      console.error('[Auth] Password reset error:', error);
      alert('Password reset failed. Please try again.');
    }
  };

  // Coming Soon Alert
  const handleComingSoon = (platform) => {
    alert(`${platform} integration is coming in the next update`);
  };

  const cur  = SLIDES[curSlide];
  const prev = prevSlide !== null ? SLIDES[prevSlide] : null;

  const inputSt = (fid) => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 14px 14px 48px',
    background: focused === fid ? '#ffffff' : '#f8faff',
    border: `1.5px solid ${focused === fid ? '#2563eb' : '#e2e8f0'}`,
    borderRadius: '14px',
    outline: 'none',
    boxShadow: focused === fid ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
    transition: 'border-color .2s, background .2s, box-shadow .2s',
  });

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4ff', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:"'DM Sans', sans-serif", position:'relative', overflow:'hidden' }}>

      {/* Blobs */}
      <div style={{ position:'fixed', top:'-10%', left:'-10%', width:'40%', height:'40%', background:'rgba(191,219,254,0.4)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-10%', right:'-10%', width:'40%', height:'40%', background:'rgba(199,210,254,0.4)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={{ position:'fixed', top:'24px', left:'24px', zIndex:100, background:'rgba(255,255,255,0.9)', backdropFilter:'blur(8px)', border:'1px solid #e2e8f0', borderRadius:'100px', padding:'8px 16px 8px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', color:'#64748b', fontSize:'10px', fontWeight:'600', letterSpacing:'.14em', textTransform:'uppercase', fontFamily:"'DM Sans', sans-serif", boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}
      >
        <ArrowLeft size={14} /> Back to Explore
      </button>

      {/* Main Container Card */}
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'1150px', minHeight:'700px', display:'grid', gridTemplateColumns:'1fr 1fr', borderRadius:'32px', overflow:'hidden', boxShadow:'0 40px 80px rgba(0,0,0,0.18)', background:'#fff' }}>

        {/* SLIDESHOW (LEFT) */}
        <div style={{ position:'relative', overflow:'hidden', background:'#0f172a' }}>
          {prev && (
            <div style={{ position:'absolute', inset:0, zIndex:1, opacity: inTrans ? 0 : 1, transition:'opacity .8s ease' }}>
              <img src={prev.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
          )}
          <div style={{ position:'absolute', inset:0, zIndex:2, overflow:'hidden' }}>
            <img key={curSlide} src={cur.url} alt="Destination" className={cur.kb} style={{ width:'100%', height:'100%', objectFit:'cover', transformOrigin:'center center' }} />
          </div>
          <div style={{ position:'absolute', inset:0, zIndex:3, background:'linear-gradient(to top, rgba(10,20,60,0.92) 0%, rgba(10,20,60,0.25) 55%, rgba(10,20,60,0.10) 100%)' }} />
          
          <div style={{ position:'absolute', inset:0, zIndex:4, padding:'52px 48px', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
            <div style={{ display:'inline-flex', alignItems:'center', padding:'4px 12px', borderRadius:'100px', border:'1px solid rgba(255,255,255,0.22)', background:'rgba(255,255,255,0.08)', backdropFilter:'blur(4px)', marginBottom:'16px', width:'fit-content' }}>
              <span style={{ fontSize:'9px', fontWeight:'700', letterSpacing:'.2em', color:'#93c5fd' }}>{cur.tag}</span>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'58px', fontWeight:'600', fontStyle:'italic', color:'#f8fafc', lineHeight:'.90', letterSpacing:'-.02em', marginBottom:'14px' }}>
              {cur.line1}<br /><span style={{ color:'#60a5fa' }}>{cur.line2}</span>
            </h2>
            <p style={{ color:'rgba(248,250,252,0.50)', fontSize:'13px', fontWeight:'300', lineHeight:'1.6', maxWidth:'280px', marginBottom:'32px' }}>{cur.sub}</p>
            <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} className={i === curSlide ? 'dot-pulse' : ''} style={{ width: i === curSlide ? '28px' : '7px', height:'7px', borderRadius:'100px', background: i === curSlide ? '#3b82f6' : 'rgba(255,255,255,0.28)', border:'none', cursor:'pointer', padding:0, transition:'all .4s cubic-bezier(0.34,1.56,0.64,1)' }} />
              ))}
            </div>
          </div>
        </div>

        {/* LOGIN CONTENT (RIGHT) */}
        <div style={{ padding:'52px 56px', display:'flex', flexDirection:'column', justifyOffset:'center', background:'#ffffff', overflowY:'auto' }}>
          <div className="form-up">
            
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'40px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#1e3a8a,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Plane size={17} color="#fff" style={{ transform:'rotate(45deg)' }} />
              </div>
              <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'20px', fontWeight:'700', color:'#1e3a8a', letterSpacing:'.04em' }}>Traveloop</span>
            </div>

            {/* Header Title */}
            <div style={{ marginBottom:'28px' }}>
              <p style={{ fontSize:'10px', fontWeight:'600', letterSpacing:'.22em', textTransform:'uppercase', color:'#2563eb', marginBottom:'8px' }}>Welcome back, Traveler</p>
              <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'40px', fontWeight:'700', color:'#0f172a', lineHeight:'1', margin:0 }}>Confirm Your<br />Booking</h3>
            </div>

            {/* Regular Form */}
            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div>
                <label style={{ display:'block', fontSize:'10px', fontWeight:'600', letterSpacing:'.18em', textTransform:'uppercase', color:'#94a3b8', marginBottom:'6px' }}>Email Address</label>
                <div style={{ position:'relative' }}>
                  <Mail size={16} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color: focused==='email' ? '#2563eb' : '#cbd5e1', transition:'color .2s', pointerEvents:'none' }} />
                  <input required type="email" value={email} placeholder="Enter registered email" onChange={e => setEmail(e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} className="login-input" style={inputSt('email')} />
                </div>
              </div>

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <label style={{ fontSize:'10px', fontWeight:'600', letterSpacing:'.18em', textTransform:'uppercase', color:'#94a3b8' }}>Security Key</label>
                  <button type="button" onClick={handleForgotPassword} style={{ fontSize:'10px', fontWeight:'600', color:'#2563eb', background:'none', border:'none', cursor:'pointer', letterSpacing:'.1em', textTransform:'uppercase', fontFamily:"'DM Sans', sans-serif" }}>Forgot?</button>
                </div>
                <div style={{ position:'relative' }}>
                  <Lock size={16} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color: focused==='pass' ? '#2563eb' : '#cbd5e1', transition:'color .2s', pointerEvents:'none' }} />
                  <input required type="password" value={password} placeholder="••••••••" onChange={e => setPassword(e.target.value)} onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)} className="login-input" style={inputSt('pass')} />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-shimmer" style={{ width:'100%', padding:'15px', border:'none', borderRadius:'14px', color:'#fff', fontFamily:"'DM Sans', sans-serif", fontSize:'12px', fontWeight:'600', letterSpacing:'.14em', textTransform:'uppercase', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? .65 : 1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'4px' }}>
                {isLoading ? 'Checking Clearance…' : 'Initiate Takeoff'} <ArrowRight size={16} />
              </button>
            </form>

            <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'22px 0' }}>
              <hr style={{ flex:1, border:'none', borderTop:'1px solid #f1f5f9' }} />
              <span style={{ fontSize:'10px', fontWeight:'600', letterSpacing:'.18em', textTransform:'uppercase', color:'#cbd5e1' }}>Gate Entry</span>
              <hr style={{ flex:1, border:'none', borderTop:'1px solid #f1f5f9' }} />
            </div>

            {/* Social Authentication Grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <button type="button" onClick={handleGoogleLogin} disabled={gLoading} className="social-btn" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'13px', border:'1.5px solid #e2e8f0', borderRadius:'14px', background:'#fff', cursor: gLoading ? 'not-allowed' : 'pointer', fontFamily:"'DM Sans', sans-serif", fontSize:'13px', fontWeight:'600', color:'#374151', opacity: gLoading ? .65 : 1 }}>
                <GoogleIcon /> {gLoading ? 'Opening…' : 'Google'}
              </button>

              <button type="button" onClick={() => handleComingSoon('Github')} className="social-btn" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'13px', border:'1.5px solid #e2e8f0', borderRadius:'14px', background:'#fff', cursor:'pointer', fontFamily:"'DM Sans', sans-serif", fontSize:'13px', fontWeight:'600', color:'#374151' }}>
                <Github size={18} /> Github
              </button>

              <button type="button" onClick={() => handleComingSoon('Facebook')} className="social-btn" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'13px', border:'1.5px solid #e2e8f0', borderRadius:'14px', background:'#fff', cursor:'pointer', fontFamily:"'DM Sans', sans-serif", fontSize:'13px', fontWeight:'600', color:'#374151' }}>
                <Facebook size={18} color="#1877F2" /> Facebook
              </button>

              <button type="button" onClick={() => handleComingSoon('Apple')} className="social-btn" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'13px', border:'1.5px solid #e2e8f0', borderRadius:'14px', background:'#fff', cursor:'pointer', fontFamily:"'DM Sans', sans-serif", fontSize:'13px', fontWeight:'600', color:'#374151' }}>
                <AppleIcon /> Apple
              </button>
            </div>

            <p style={{ marginTop:'28px', textAlign:'center', fontSize:'13px', color:'#94a3b8' }}>
              New to the tribe? <span onClick={() => navigate('/signup')} style={{ color:'#2563eb', fontWeight:'600', cursor:'pointer', textDecoration:'underline', textUnderlineOffset:'3px' }}>Join Traveloop</span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;