import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, Mail, Lock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const T = {
  pageBg:      '#F1F5F9',
  white:       '#ffffff',
  text:        '#0F172A',
  muted:       '#64748B',
  border:      '#E2E8F0',
  inputBg:     '#F8FAFC',
  accent:      '#2563EB',
  accentHover: '#1D4ED8',
  blue200:     '#BFDBFE',
  blue400:     '#60A5FA',
  panelBg:     '#0B1120',
  panelText:   '#F1F5F9',
  panelSub:    '#94A3B8',
  radius:      '14px',
  radiusLg:    '32px',
  fontDisplay: "'Syne', sans-serif",
  fontBody:    "'Plus Jakarta Sans', sans-serif",
};

/* ── Inject Google Fonts once ── */
const injectFonts = () => {
  if (document.getElementById('auth-fonts')) return;
  const l = document.createElement('link');
  l.id  = 'auth-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap';
  document.head.appendChild(l);
};

/* ─────────────────────────────────────────
   BRAND SOCIAL ICONS — proper SVGs, no lucide hacks
───────────────────────────────────────── */
const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F172A">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const FacebookSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* ─────────────────────────────────────────
   PANEL DECORATION — zero images, pure SVG CSS
───────────────────────────────────────── */
const PanelDecor = () => (
  <svg
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    viewBox="0 0 550 720"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="dotgrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)" />
      </pattern>
    </defs>
    <rect width="550" height="720" fill="url(#dotgrid)" />
    <circle cx="430" cy="90"  r="210" fill="rgba(37,99,235,0.20)" />
    <circle cx="70"  cy="630" r="170" fill="rgba(99,102,241,0.15)" />
    <circle cx="275" cy="360" r="80"  fill="rgba(96,165,250,0.06)" />
    <circle cx="275" cy="360" r="165" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    <circle cx="275" cy="360" r="115" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    <circle cx="275" cy="360" r="62"  fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
    <line x1="0" y1="720" x2="550" y2="0" stroke="rgba(96,165,250,0.07)" strokeWidth="1" />
  </svg>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ── ORIGINAL LOGIC — UNTOUCHED ── */
  const [isLogin,   setIsLogin]   = useState(location.pathname === '/login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData,  setFormData]  = useState({ username: '', email: '', password: '' });

  useEffect(() => { setIsLogin(location.pathname === '/login'); }, [location.pathname]);
  useEffect(() => { injectFonts(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      if (response.data.success) {
        isLogin ? navigate('/dashboard') : navigate('/login');
      }
    } catch (error) {
      alert('Error: Details check karo!');
    } finally {
      setIsLoading(false);
    }
  };
  /* ── END ORIGINAL LOGIC ── */

  /* ── UI hover/focus state ── */
  const [focusedField,   setFocusedField]   = useState(null);
  const [hoveredSocial,  setHoveredSocial]  = useState(null);
  const [hoveredMainBtn, setHoveredMainBtn] = useState(null);
  const [hoveredOverlay, setHoveredOverlay] = useState(false);
  const [hoveredBack,    setHoveredBack]    = useState(false);

  /* ────────────────────────────────────────
     REUSABLE SUB-COMPONENTS
  ──────────────────────────────────────── */

  /* Input with leading icon */
  const Field = ({ fieldId, name, type, placeholder, Icon }) => {
    const focused = focusedField === fieldId;
    return (
      <div style={{ position: 'relative' }}>
        <Icon size={16} style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: focused ? T.accent : '#CBD5E1',
          transition: 'color .2s', pointerEvents: 'none',
        }} />
        <input
          required
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={() => setFocusedField(fieldId)}
          onBlur={() => setFocusedField(null)}
          style={{
            width: '100%',
            padding: '14px 14px 14px 42px',
            background: focused ? T.white : T.inputBg,
            border: `1.5px solid ${focused ? T.accent : T.border}`,
            borderRadius: T.radius,
            fontFamily: T.fontBody,
            fontSize: 14, fontWeight: 500, color: T.text,
            outline: 'none',
            transition: 'border-color .2s, background .2s',
          }}
        />
      </div>
    );
  };

  /* Divider with "or" */
  const Divider = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
      <hr style={{ flex: 1, border: 'none', borderTop: `1px solid ${T.border}` }} />
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#CBD5E1' }}>or</span>
      <hr style={{ flex: 1, border: 'none', borderTop: `1px solid ${T.border}` }} />
    </div>
  );

  /* Social button — full-width, branded icon, label */
  const SocialBtn = ({ id, label, Icon }) => {
    const hov = hoveredSocial === id;
    return (
      <button
        type="button"
        onMouseEnter={() => setHoveredSocial(id)}
        onMouseLeave={() => setHoveredSocial(null)}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '11px 16px',
          background: hov ? '#F1F5F9' : T.white,
          border: `1.5px solid ${hov ? T.blue200 : T.border}`,
          borderRadius: T.radius,
          cursor: 'pointer',
          fontFamily: T.fontBody,
          fontSize: 13, fontWeight: 600, color: T.text,
          transition: 'all .2s',
          marginBottom: 8,
        }}
      >
        <Icon /> Continue with {label}
      </button>
    );
  };

  /* Primary action button */
  const MainBtn = ({ formSide, label }) => {
    const hov = hoveredMainBtn === formSide;
    return (
      <button
        type="submit"
        disabled={isLoading}
        onMouseEnter={() => setHoveredMainBtn(formSide)}
        onMouseLeave={() => setHoveredMainBtn(null)}
        style={{
          width: '100%', padding: '16px',
          background: hov ? T.accentHover : T.accent,
          color: T.white, border: 'none',
          borderRadius: T.radius,
          fontFamily: T.fontDisplay,
          fontSize: 13, fontWeight: 800,
          letterSpacing: '.12em', textTransform: 'uppercase',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? .6 : 1,
          transition: 'background .2s, transform .15s',
          transform: hov && !isLoading ? 'translateY(-1px)' : 'none',
        }}
      >
        {label}
      </button>
    );
  };

  /* Overlay content per login/signup state */
  const ov = isLogin
    ? { tag: 'New here?',          line1: 'Explore',  line2: 'New Worlds.', sub: 'Your passport to premium travel awaits. Create an account and take off today.', cta: 'Join the Tribe', dest: '/signup' }
    : { tag: 'Already a member?',  line1: 'Welcome',  line2: 'Home.',        sub: 'All your saved flight paths and bookings in one place. We kept your seat.',     cta: 'Back to Login',  dest: '/login'  };

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <div style={{
      minHeight: '100vh', background: T.pageBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: T.fontBody,
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Page ambient blobs */}
      <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'rgba(37,99,235,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -200, right: -200, width: 500, height: 500, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', pointerEvents: 'none' }} />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        onMouseEnter={() => setHoveredBack(true)}
        onMouseLeave={() => setHoveredBack(false)}
        style={{
          position: 'absolute', top: 40, left: 40, zIndex: 100,
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          color: hoveredBack ? '#60A5FA' : '#475569',
          fontFamily: T.fontBody, fontSize: 10,
          fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase',
          transition: 'color .2s',
        }}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      {/* ── MAIN CARD ── */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 1100, minHeight: 720,
        background: T.white, borderRadius: T.radiusLg,
        display: 'flex', overflow: 'hidden',
        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.55)',
      }}>

        {/* ══════════════════════════════
            LEFT — LOGIN FORM
        ══════════════════════════════ */}
        <div style={{ width: '50%', padding: '60px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ display: 'block', width: 18, height: 1.5, background: T.accent, borderRadius: 2 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: T.accent }}>Access Portal</span>
          </div>
          <h3 style={{ fontFamily: T.fontDisplay, fontSize: 48, fontWeight: 800, color: T.text, lineHeight: 1, marginBottom: 8 }}>
            Confirm<br />Takeoff
          </h3>
          <p style={{ color: T.muted, fontSize: 12, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 28 }}>
            Identify yourself, Pilot
          </p>
          <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field fieldId="l-email"    name="email"    type="email"    placeholder="Email address" Icon={Mail} />
            <Field fieldId="l-password" name="password" type="password" placeholder="Password"      Icon={Lock} />
            <MainBtn formSide="login" label={isLoading ? 'Signing In…' : 'Sign In'} />
          </form>
          <Divider />
          <SocialBtn id="l-g" label="Google"   Icon={GoogleSVG}   />
          <SocialBtn id="l-a" label="Apple"    Icon={AppleSVG}    />
          <SocialBtn id="l-f" label="Facebook" Icon={FacebookSVG} />
        </div>

        {/* ══════════════════════════════
            RIGHT — SIGNUP FORM
        ══════════════════════════════ */}
        <div style={{ width: '50%', padding: '60px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ display: 'block', width: 18, height: 1.5, background: T.accent, borderRadius: 2 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: T.accent }}>New Member</span>
          </div>
          <h3 style={{ fontFamily: T.fontDisplay, fontSize: 48, fontWeight: 800, color: T.text, lineHeight: 1, marginBottom: 8 }}>
            Join the<br />Elite
          </h3>
          <p style={{ color: T.muted, fontSize: 12, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 28 }}>
            Create your profile
          </p>
          <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field fieldId="r-name"     name="username" type="text"     placeholder="Full name"     Icon={User} />
            <Field fieldId="r-email"    name="email"    type="email"    placeholder="Email address" Icon={Mail} />
            <Field fieldId="r-password" name="password" type="password" placeholder="Password"      Icon={Lock} />
            <MainBtn formSide="signup" label={isLoading ? 'Creating…' : 'Create Account'} />
          </form>
          <Divider />
          <SocialBtn id="r-g" label="Google"   Icon={GoogleSVG}   />
          <SocialBtn id="r-a" label="Apple"    Icon={AppleSVG}    />
          <SocialBtn id="r-f" label="Facebook" Icon={FacebookSVG} />
        </div>

        {/* ══════════════════════════════
            SLIDING OVERLAY PANEL
            pure CSS only — zero images
        ══════════════════════════════ */}
        <div style={{
          position: 'absolute', top: 0,
          left: isLogin ? '50%' : '0%',
          width: '50%', height: '100%',
          background: T.panelBg,
          zIndex: 10,
          transition: 'left .8s cubic-bezier(.77,0,.175,1)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>

          <PanelDecor />

          <div style={{
            position: 'relative', zIndex: 5,
            height: '100%', padding: '60px 56px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>

            {/* Icon badge */}
            <div style={{
              width: 56, height: 56,
              background: 'rgba(37,99,235,0.22)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 36,
            }}>
              <Plane size={24} color="#93C5FD" style={{ transform: 'rotate(45deg)' }} />
            </div>

            {/* Tag */}
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#3B82F6', marginBottom: 12, display: 'block' }}>
              {ov.tag}
            </span>

            {/* Heading — FIX: was using \n in string (doesn't work), now uses <br /> */}
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: 52, fontWeight: 800, color: T.panelText, lineHeight: .9, marginBottom: 20 }}>
              {ov.line1}
              <br />
              <span style={{ color: T.blue400 }}>{ov.line2}</span>
            </h2>

            {/* Sub */}
            <p style={{ color: T.panelSub, fontSize: 14, lineHeight: 1.7, maxWidth: 280, marginBottom: 44, fontWeight: 400 }}>
              {ov.sub}
            </p>

            {/* CTA */}
            <button
              onClick={() => navigate(ov.dest)}
              onMouseEnter={() => setHoveredOverlay(true)}
              onMouseLeave={() => setHoveredOverlay(false)}
              style={{
                width: 'fit-content',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '15px 32px',
                background: hoveredOverlay ? T.white : 'rgba(255,255,255,0.10)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: T.radius,
                fontFamily: T.fontDisplay,
                fontSize: 12, fontWeight: 800,
                letterSpacing: '.1em', textTransform: 'uppercase',
                color: hoveredOverlay ? T.text : T.panelText,
                cursor: 'pointer',
                transition: 'all .25s',
              }}
            >
              {ov.cta}
              <ArrowRight size={16} style={{ transition: 'transform .2s', transform: hoveredOverlay ? 'translateX(3px)' : 'none' }} />
            </button>

            {/* Stats strip */}
            <div style={{ position: 'absolute', bottom: 52, left: 56, right: 56, display: 'flex', alignItems: 'center' }}>
              {[['2.4M', 'Travelers'], ['180+', 'Destinations'], ['4.9★', 'Rating']].map(([val, lbl], i) => (
                <React.Fragment key={lbl}>
                  {i > 0 && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.08)', margin: '0 20px' }} />}
                  <div>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 800, color: T.panelText, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#475569', marginTop: 3 }}>{lbl}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>

          </div>
        </div>
        {/* end overlay */}

      </div>
    </div>
  );
};

export default Auth;