import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Lock, Eye, Globe, Mail, Phone, MapPin, Heart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Preferences = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: 'English',
    currency: 'INR',
    destination: '',
    pricePreference: 'moderate',
    travelStyle: 'adventure',
    groupSize: '2-4 people',
    seasons: ['monsoon', 'summer'],
    notifications_type: {
      deals: true,
      newTrips: true,
      weather: true,
      reminders: true
    }
  });

  const T = {
    bg: '#F1F5F9',
    accent: '#2563EB',
    text: '#0F172A',
    muted: '#64748B',
    white: '#ffffff',
  };

  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    alert('Preferences saved successfully! 🎉');
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (type) => {
    setPreferences(prev => ({
      ...prev,
      notifications_type: {
        ...prev.notifications_type,
        [type]: !prev.notifications_type[type]
      }
    }));
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', paddingTop: '60px' }}>
      {/* Header */}
      <div style={{ background: T.white, borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={24} color={T.accent} />
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: T.text }}>⚙️ Preferences</h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'profile', label: 'Profile Settings', icon: '👤' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' },
            { id: 'travel', label: 'Travel Preferences', icon: '✈️' },
            { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
            { id: 'account', label: 'Account', icon: '👥' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                border: activeTab === tab.id ? `2px solid ${T.accent}` : 'none',
                background: activeTab === tab.id ? `${T.accent}15` : 'transparent',
                color: activeTab === tab.id ? T.accent : T.muted,
                textAlign: 'left',
                fontWeight: activeTab === tab.id ? '700' : '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '14px'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: T.white, borderRadius: '16px', padding: '30px' }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: T.text }}>Profile Settings</h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: T.muted, marginBottom: '8px' }}>Favorite Destination</label>
                  <input
                    type="text"
                    value={preferences.destination}
                    onChange={(e) => handlePreferenceChange('destination', e.target.value)}
                    placeholder="e.g., Maldives, Tokyo, Paris"
                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: T.muted, marginBottom: '8px' }}>Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: T.muted, marginBottom: '8px' }}>Currency</label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                    >
                      <option>INR</option>
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: T.text }}>Notification Preferences</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { key: 'deals', label: 'Special Deals & Offers', desc: 'Get notified about exclusive travel deals' },
                  { key: 'newTrips', label: 'New Trip Suggestions', desc: 'Personalized trip recommendations' },
                  { key: 'weather', label: 'Weather Updates', desc: 'Real-time weather for your destinations' },
                  { key: 'reminders', label: 'Trip Reminders', desc: 'Reminders for upcoming trips' }
                ].map(notif => (
                  <div key={notif.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: `${T.accent}08`, borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: T.text }}>{notif.label}</div>
                      <div style={{ fontSize: '12px', color: T.muted }}>{notif.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifications_type[notif.key]}
                      onChange={() => handleNotificationChange(notif.key)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'travel' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: T.text }}>Travel Preferences</h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: T.muted, marginBottom: '8px' }}>Travel Style</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {['adventure', 'luxury', 'budget'].map(style => (
                      <button
                        key={style}
                        onClick={() => handlePreferenceChange('travelStyle', style)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: preferences.travelStyle === style ? `2px solid ${T.accent}` : '1px solid #e2e8f0',
                          background: preferences.travelStyle === style ? `${T.accent}15` : T.white,
                          color: preferences.travelStyle === style ? T.accent : T.text,
                          fontWeight: '600',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: T.muted, marginBottom: '8px' }}>Group Size</label>
                  <select
                    value={preferences.groupSize}
                    onChange={(e) => handlePreferenceChange('groupSize', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option>Solo</option>
                    <option>2 people</option>
                    <option>2-4 people</option>
                    <option>4-6 people</option>
                    <option>Group (6+)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: T.muted, marginBottom: '8px' }}>Preferred Seasons</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {['spring', 'summer', 'monsoon', 'winter'].map(season => (
                      <button
                        key={season}
                        onClick={() => {
                          const newSeasons = preferences.seasons.includes(season)
                            ? preferences.seasons.filter(s => s !== season)
                            : [...preferences.seasons, season];
                          handlePreferenceChange('seasons', newSeasons);
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: preferences.seasons.includes(season) ? `2px solid ${T.accent}` : '1px solid #e2e8f0',
                          background: preferences.seasons.includes(season) ? `${T.accent}15` : T.white,
                          color: preferences.seasons.includes(season) ? T.accent : T.text,
                          fontWeight: '600',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: T.text }}>Privacy & Security</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#92400e' }}>🔒 Two-Factor Authentication</div>
                  <p style={{ fontSize: '12px', color: '#92400e', margin: '8px 0 0 0' }}>Enhance your account security with 2FA</p>
                  <button style={{ marginTop: '8px', padding: '8px 16px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Enable 2FA</button>
                </div>
                <div style={{ padding: '16px', background: '#e0e7ff', borderRadius: '8px', borderLeft: '4px solid #4f46e5' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#3730a3' }}>🔑 Change Password</div>
                  <p style={{ fontSize: '12px', color: '#3730a3', margin: '8px 0 0 0' }}>Update your password regularly for security</p>
                  <button style={{ marginTop: '8px', padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Change Password</button>
                </div>
                <div style={{ padding: '16px', background: '#dcfce7', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#15803d' }}>👁️ Privacy Settings</div>
                  <p style={{ fontSize: '12px', color: '#15803d', margin: '8px 0 0 0' }}>Control who can see your profile and trips</p>
                  <button style={{ marginTop: '8px', padding: '8px 16px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Manage Privacy</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: T.text }}>Account Management</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <button style={{ padding: '16px', background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px', color: T.text, fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#bfdbfe'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#dbeafe'}
                >
                  📧 Update Email Address
                </button>
                <button style={{ padding: '16px', background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px', color: T.text, fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#bfdbfe'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#dbeafe'}
                >
                  📱 Update Phone Number
                </button>
                <button style={{ padding: '16px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                >
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ padding: '12px 24px', borderRadius: '10px', border: `2px solid ${T.accent}`, background: 'transparent', color: T.accent, fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              Cancel
            </button>
            <button
              onClick={savePreferences}
              style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: T.accent, color: T.white, fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
