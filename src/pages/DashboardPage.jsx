import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const session   = JSON.parse(localStorage.getItem('otp_session') || '{}');
  const loginTime = new Date(session.loginTime || Date.now());
  const expiry    = new Date(loginTime.getTime() + 48 * 60 * 60 * 1000);

  const fmt = (d) => d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="dash">
      <div className="dash__glow" />
      <div className="dash__inner">

        {/* Header */}
        <div className="dash__header">
          <div className="dash__avatar">{user?.name?.charAt(0)?.toUpperCase() || '?'}</div>
          <div>
            <h1 className="dash__greeting">
              Welcome back, <span>{user?.name?.split(' ')[0] || 'User'}</span> 👋
            </h1>
            <p className="dash__email">{user?.email}</p>
          </div>
        </div>

        {/* Cards */}
        <div className="dash__cards">
          <div className="dash-card dash-card--active">
            <p className="dash-card__label">Session Status</p>
            <p className="dash-card__val green"><span className="dash-card__dot" /> Active</p>
            <p className="dash-card__meta">Expires: {fmt(expiry)}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card__label">Signed in at</p>
            <p className="dash-card__val">{fmt(loginTime)}</p>
            <p className="dash-card__meta">OTP verified</p>
          </div>
          <div className="dash-card">
            <p className="dash-card__label">Auth Method</p>
            <p className="dash-card__val">OTP</p>
            <p className="dash-card__meta">No password required</p>
          </div>
        </div>

        {/* Info */}
        <div className="dash__info">
          <span className="dash__info-icon">🛡️</span>
          <div>
            <p className="dash__info-title">Your session is active for 48 hours</p>
            <p className="dash__info-desc">
              Just like DigiLocker, once you verify via OTP you stay signed in for 48 hours
              without needing to re-verify.
            </p>
          </div>
        </div>

        <button className="dash__signout" onClick={() => { logout(); navigate('/'); }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
