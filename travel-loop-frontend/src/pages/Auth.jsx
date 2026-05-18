import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plane, Mail, Lock, User, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ═══════════════════════════════════════════
   FONT + GLOBAL CSS INJECTION
═══════════════════════════════════════════ */
const injectGlobals = () => {
  if (document.getElementById('auth-globals')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap';
  document.head.appendChild(link);

  const style = document.createElement('style');
  style.id = 'auth-globals';
  style.textContent = `
    /* ── Input text always dark — beats any framework reset ── */
    .auth-field-input {
      color: #1a1a2e !important;
      -webkit-text-fill-color: #1a1a2e !important;
      caret-color: #c9a96e !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 14px !important;
      font-weight: 400 !important;
    }
    .auth-field-input::placeholder {
      color: #9ca3af !important;
      -webkit-text-fill-color: #9ca3af !important;
      opacity: 1 !important;
    }
    .auth-field-input:-webkit-autofill,
    .auth-field-input:-webkit-autofill:hover,
    .auth-field-input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 9999px #fafaf8 inset !important;
      -webkit-text-fill-color: #1a1a2e !important;
      caret-color: #c9a96e !important;
    }
    /* Slide keyframes */
    @keyframes slideshow-ken-burns {
      0%   { transform: scale(1.00) translate(0px, 0px); }
      100% { transform: scale(1.12) translate(-20px, -10px); }
    }
    @keyframes slide-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slide-fade-out {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    @keyframes form-in {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes badge-float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(201,169,110,0.4); }
      70%  { box-shadow: 0 0 0 12px rgba(201,169,110,0); }
      100% { box-shadow: 0 0 0 0 rgba(201,169,110,0); }
    }
    .auth-form-animate {
      animation: form-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
    }
    .badge-float { animation: badge-float 4s ease-in-out infinite; }
    .btn-shimmer {
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
    .dot-active { animation: pulse-ring 1.5s ease-out infinite; }
  `;
  document.head.appendChild(style);
};

/* ═══════════════════════════════════════════
   SLIDESHOW DATA
   Pure CSS gradient scenes — no external images
═══════════════════════════════════════════ */
const SLIDES = [
  {
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a1035 30%, #0d2444 60%, #0a3d62 100%)',
    overlay:  'linear-gradient(160deg, rgba(10,10,26,0.55) 0%, rgba(201,169,110,0.08) 100%)',
    accent:   '#c9a96e',
    label:    'FIRST CLASS',
    heading:  'Where\nJourneys\nBegin.',
    sub:      'Curated travel experiences for the discerning explorer.',
    shape:    'M0,0 L550,0 L550,720 L0,720 Z',
    orbs: [
      { cx: 420, cy: 120, r: 220, fill: 'rgba(201,169,110,0.10)' },
      { cx: 80,  cy: 600, r: 160, fill: 'rgba(37,99,235,0.12)'  },
      { cx: 300, cy: 350, r: 90,  fill: 'rgba(255,255,255,0.03)'},
    ],
  },
  {
    gradient: 'linear-gradient(135deg, #0d1b0d 0%, #1a2e1a 30%, #0d2d1a 60%, #0a3d2a 100%)',
    overlay:  'linear-gradient(160deg, rgba(10,26,10,0.55) 0%, rgba(110,201,130,0.06) 100%)',
    accent:   '#6ec982',
    label:    'ADVENTURE',
    heading:  'Discover\nHidden\nGems.',
    sub:      'Off-the-beaten-path destinations reserved for true wanderers.',
    orbs: [
      { cx: 400, cy: 150, r: 200, fill: 'rgba(110,201,130,0.10)' },
      { cx: 100, cy: 580, r: 180, fill: 'rgba(37,99,235,0.10)'   },
      { cx: 280, cy: 330, r: 100, fill: 'rgba(255,255,255,0.03)' },
    ],
  },
  {
    gradient: 'linear-gradient(135deg, #1a0a0a 0%, #2e1515 30%, #3d0d1a 60%, #2a0a2a 100%)',
    overlay:  'linear-gradient(160deg, rgba(26,10,10,0.55) 0%, rgba(201,110,130,0.08) 100%)',
    accent:   '#e07b9a',
    label:    'LUXURY',
    heading:  'Travel\nBeyond\nOrdinary.',
    sub:      'Five-star service delivered wherever your compass points.',
    orbs: [
      { cx: 440, cy: 100, r: 240, fill: 'rgba(201,110,130,0.10)' },
      { cx: 60,  cy: 620, r: 150, fill: 'rgba(120,37,200,0.10)'  },
      { cx: 260, cy: 360, r: 80,  fill: 'rgba(255,255,255,0.04)' },
    ],
  },
  {
    gradient: 'linear-gradient(135deg, #0a1020 0%, #101830 30%, #0a2038 60%, #102840 100%)',
    overlay:  'linear-gradient(160deg, rgba(10,16,32,0.55) 0%, rgba(110,160,201,0.08) 100%)',
    accent:   '#7eb8e0',
    label:    'ESCAPE',
    heading:  'Your\nNext\nHorizon.',
    sub:      'Every flight is the start of a story worth telling.',
    orbs: [
      { cx: 410, cy: 130, r: 210, fill: 'rgba(110,160,201,0.12)' },
      { cx: 90,  cy: 590, r: 170, fill: 'rgba(37,80,200,0.10)'   },
      { cx: 290, cy: 340, r: 95,  fill: 'rgba(255,255,255,0.04)' },
    ],
  },
];

/* ═══════════════════════════════════════════
   SOCIAL ICONS
═══════════════════════════════════════════ */
const GoogleSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const AppleSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#1a1a2e">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
const FacebookSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  useEffect(() => { setIsLogin(location.pathname === '/login'); }, [location.pathname]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ── FIXED ACTION LOGIC ── */
const handleAction = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  // Path fix
  const path = isLogin ? 'login' : 'register';
  const finalURL = `https://travler-loop.onrender.com/api/auth/${path}`;

  try {
    const response = await axios.post(finalURL, formData);
    
    // Check karo 'success' true hai ya nahi
    if (response.data.success) {
      alert(isLogin ? "Welcome back!" : "Account created!");

      // Login ke case mein data save karna zaroori hai
      if (isLogin) {
        // Token aur User details local storage mein daalo
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // redirect to dashboard
        window.location.href = '/dashboard'; 
        // Note: Agar 'navigate' kaam nahi kar raha, toh 'window.location.href' pakka chalega
      } else {
        // Signup ke baad login page par bhejo
        setIsLogin(true); 
      }
    }
  } catch (error) {
    console.error("Login Error:", error.response);
    alert(error.response?.data?.message || "Login fail ho gaya!");
  } finally {
    setIsLoading(false);
  }
};
  /* ── END ORIGINAL LOGIC ── */

  /* ── Slideshow state ── */
  const [slide,     setSlide]     = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [fading,    setFading]    = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (fading || idx === slide) return;
    setPrevSlide(slide);
    setFading(true);
    setTimeout(() => {
      setSlide(idx);
      setPrevSlide(null);
      setFading(false);
    }, 700);
  };

  const next = () => goTo((slide + 1) % SLIDES.length);
  const prev = () => goTo((slide - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [slide, fading]);

  /* ── Focus state ── */
  const [focused, setFocused] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const switchMode = (dest) => {
    navigate(dest);
    setFormKey(k => k + 1); // re-mount form for animation
  };

  const cur  = SLIDES[slide];
  const prev2 = prevSlide !== null ? SLIDES[prevSlide] : null;

  /* ── Shared input style ── */
  const inputSt = (fid) => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 13px 13px 44px',
    background: focused === fid ? '#ffffff' : '#fafaf8',
    border: `1px solid ${focused === fid ? '#c9a96e' : '#e8e4dc'}`,
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color .25s, background .25s, box-shadow .25s',
    boxShadow: focused === fid ? '0 0 0 3px rgba(201,169,110,0.15)' : 'none',
  });

  /* ─────────────────────────────
     RENDER
  ───────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: '#f0ece4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Subtle page texture */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,169,110,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(37,99,235,0.04) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{ position: 'fixed', top: '28px', left: '28px', zIndex: 999, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid #e8e4dc', borderRadius: '100px', padding: '8px 16px 8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#6b6560', fontSize: '11px', fontWeight: '600', letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", transition: 'all .2s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* ═══ MAIN CARD ═══ */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1060px', minHeight: '680px', display: 'flex', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.6) inset' }}>

        {/* ══════════════════════════════════
            LEFT — FORM PANEL
        ══════════════════════════════════ */}
        <div style={{ flex: 1, background: '#fdfcf9', padding: '52px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>

          {/* Logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '44px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d50 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plane size={16} color="#c9a96e" style={{ transform: 'rotate(45deg)' }} />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: '700', color: '#1a1a2e', letterSpacing: '.04em' }}>Traveloop</span>
          </div>

          {/* Form wrapper — key forces re-animation on switch */}
          <div key={formKey} className="auth-form-animate">

            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: '0', background: '#f0ece4', borderRadius: '10px', padding: '3px', marginBottom: '32px', width: 'fit-content' }}>
              {[{ label: 'Sign In', path: '/login' }, { label: 'Register', path: '/signup' }].map(({ label, path }) => {
                const active = isLogin === (path === '/login');
                return (
                  <button
                    key={path}
                    onClick={() => switchMode(path)}
                    style={{ padding: '8px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '600', letterSpacing: '.02em', transition: 'all .25s', background: active ? '#fdfcf9' : 'transparent', color: active ? '#1a1a2e' : '#9ca3af', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.10)' : 'none' }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Heading */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '.22em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '8px' }}>
                {isLogin ? 'Welcome back, Pilot' : 'Join the journey'}
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', fontWeight: '700', color: '#1a1a2e', lineHeight: '1', letterSpacing: '-.01em', margin: 0 }}>
                {isLogin ? <>Confirm<br />Your Takeoff</> : <>Create Your<br />Pilot Profile</>}
              </h2>
            </div>

            {/* ── FORM ── */}
            <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Full name — signup only */}
              {!isLogin && (
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: focused === 'name' ? '#c9a96e' : '#c4bdb0', transition: 'color .2s', pointerEvents: 'none' }} />
                  <input
                    required
                    name="username"
                    type="text"
                    placeholder="Full name"
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    className="auth-field-input"
                    style={inputSt('name')}
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? '#c9a96e' : '#c4bdb0', transition: 'color .2s', pointerEvents: 'none' }} />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email address"
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className="auth-field-input"
                  style={inputSt('email')}
                />
              </div>

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: focused === 'pass' ? '#c9a96e' : '#c4bdb0', transition: 'color .2s', pointerEvents: 'none' }} />
                <input
                  required
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused(null)}
                  className="auth-field-input"
                  style={inputSt('pass')}
                />
              </div>

              {isLogin && (
                <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                  <span style={{ fontSize: '12px', color: '#c9a96e', cursor: 'pointer', fontWeight: '500' }}>Forgot password?</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-shimmer"
                style={{
                  width: '100%', padding: '14px', marginTop: '4px',
                  background: 'linear-gradient(90deg, #1a1a2e 0%, #2d2050 40%, #1a1a2e 100%)',
                  backgroundSize: '200% auto',
                  color: '#f0ece4', border: 'none', borderRadius: '10px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px', fontWeight: '600',
                  letterSpacing: '.1em', textTransform: 'uppercase',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? .65 : 1,
                  transition: 'opacity .2s, transform .15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {isLoading
                  ? (isLogin ? 'Signing in…' : 'Creating profile…')
                  : (isLogin ? <>Clear for Takeoff <ArrowRight size={14} /></> : <>Create Account <ArrowRight size={14} /></>)
                }
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e8e4dc' }} />
              <span style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '.14em', textTransform: 'uppercase', color: '#c4bdb0' }}>or</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e8e4dc' }} />
            </div>

            {/* Social */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'g', Icon: GoogleSVG,   label: 'Google'   },
                { id: 'a', Icon: AppleSVG,    label: 'Apple'    },
                { id: 'f', Icon: FacebookSVG, label: 'Facebook' },
              ].map(({ id, Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '11px 8px', background: '#fdfcf9', border: '1px solid #e8e4dc', borderRadius: '10px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', color: '#4b4640', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5f1eb'; e.currentTarget.style.borderColor = '#c9a96e'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fdfcf9'; e.currentTarget.style.borderColor = '#e8e4dc'; }}
                >
                  <Icon /> {label}
                </button>
              ))}
            </div>

            {/* Switch */}
            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#9ca3af', fontWeight: '400' }}>
              {isLogin ? "New to Traveloop? " : 'Already have an account? '}
              <span
                onClick={() => switchMode(isLogin ? '/signup' : '/login')}
                style={{ color: '#c9a96e', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════
            RIGHT — SLIDESHOW PANEL
            Pure CSS gradients, no images
        ══════════════════════════════════ */}
        <div style={{ width: '440px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>

          {/* Outgoing slide */}
          {prev2 && (
            <div style={{ position: 'absolute', inset: 0, background: prev2.gradient, opacity: fading ? 0 : 1, transition: 'opacity .7s ease', zIndex: 1 }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 440 680" preserveAspectRatio="xMidYMid slice">
                {prev2.orbs.map((o, i) => <circle key={i} cx={o.cx} cy={o.cy} r={o.r} fill={o.fill} />)}
              </svg>
            </div>
          )}

          {/* Current slide */}
          <div style={{ position: 'absolute', inset: 0, background: cur.gradient, opacity: 1, transition: 'opacity .7s ease', zIndex: 2 }}>

            {/* Animated SVG shapes — Ken Burns feel via CSS */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animation: 'slideshow-ken-burns 8s ease-in-out infinite alternate' }}
              viewBox="0 0 440 680"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="dots-panel" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.07)" />
                </pattern>
              </defs>
              <rect width="440" height="680" fill="url(#dots-panel)" />
              {cur.orbs.map((o, i) => <circle key={i} cx={o.cx} cy={o.cy} r={o.r} fill={o.fill} />)}
              {/* Geometric accent lines */}
              <line x1="0" y1="680" x2="440" y2="0" stroke={`${cur.accent}18`} strokeWidth="1" />
              <line x1="80" y1="680" x2="440" y2="80" stroke={`${cur.accent}10`} strokeWidth="1" />
              {/* Decorative rings */}
              <circle cx="220" cy="340" r="160" fill="none" stroke={`${cur.accent}0A`} strokeWidth="1" />
              <circle cx="220" cy="340" r="110" fill="none" stroke={`${cur.accent}10`} strokeWidth="1" />
              <circle cx="220" cy="340" r="55"  fill="none" stroke={`${cur.accent}15`} strokeWidth="1" />
            </svg>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 3, height: '100%', padding: '52px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

              {/* Top — label + badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '100px', border: `1px solid ${cur.accent}40`, background: `${cur.accent}15`, marginBottom: '0' }}>
                    <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '.2em', color: cur.accent }}>{cur.label}</span>
                  </div>
                </div>
                {/* Floating plane badge */}
                <div
                  className="badge-float"
                  style={{ width: '50px', height: '50px', borderRadius: '16px', background: `${cur.accent}20`, border: `1px solid ${cur.accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plane size={20} color={cur.accent} style={{ transform: 'rotate(45deg)' }} />
                </div>
              </div>

              {/* Center — heading */}
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '58px', fontWeight: '600', fontStyle: 'italic', color: '#f5f0e8', lineHeight: '.92', letterSpacing: '-.02em', marginBottom: '16px', whiteSpace: 'pre-line' }}>
                  {cur.heading.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {i === cur.heading.split('\n').length - 1
                        ? <span style={{ color: cur.accent }}>{line}</span>
                        : <>{line}<br /></>}
                    </React.Fragment>
                  ))}
                </h2>
                <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '13px', fontWeight: '300', lineHeight: '1.65', maxWidth: '280px' }}>
                  {cur.sub}
                </p>
              </div>

              {/* Bottom — stats + controls */}
              <div>
                {/* Stats row */}
                <div style={{ display: 'flex', gap: '0', marginBottom: '32px' }}>
                  {[['2.4M', 'Travelers'], ['180+', 'Destinations'], ['4.9★', 'Rating']].map(([val, lbl], i) => (
                    <React.Fragment key={lbl}>
                      {i > 0 && <div style={{ width: '1px', background: 'rgba(255,255,255,0.10)', margin: '0 20px', alignSelf: 'stretch' }} />}
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: '700', color: cur.accent, lineHeight: '1' }}>{val}</div>
                        <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.40)', marginTop: '3px' }}>{lbl}</div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Slideshow controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Dot indicators */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {SLIDES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={i === slide ? 'dot-active' : ''}
                        style={{
                          width: i === slide ? '24px' : '6px',
                          height: '6px',
                          borderRadius: '100px',
                          background: i === slide ? cur.accent : 'rgba(255,255,255,0.25)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all .4s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                      />
                    ))}
                  </div>

                  {/* Prev / Next */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[{ fn: prev, Icon: ChevronLeft }, { fn: next, Icon: ChevronRight }].map(({ fn, Icon }, idx) => (
                      <button
                        key={idx}
                        onClick={fn}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.15)`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,240,232,0.7)', transition: 'all .2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${cur.accent}25`; e.currentTarget.style.borderColor = `${cur.accent}50`; e.currentTarget.style.color = cur.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(245,240,232,0.7)'; }}
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end right panel */}

      </div>
    </div>
  );
};

export default Auth;