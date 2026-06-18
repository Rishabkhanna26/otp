import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const FEATURES = [
  { icon: '🔐', title: 'No Passwords',    desc: 'Forget creating or remembering passwords. Just your email and a code.' },
  { icon: '⚡', title: 'Instant Access',  desc: 'Receive your OTP in seconds and get straight into your account.' },
  { icon: '🕐', title: '48-Hour Sessions',desc: 'Once verified, stay logged in for 48 hours — just like DigiLocker.' },
  { icon: '🛡️', title: 'Secure by Design',desc: 'OTPs expire in minutes and are single-use — inherently safer than passwords.' },
];

const STEPS = [
  { num: '01', title: 'Enter your email', desc: 'Provide the email address linked to your account.' },
  { num: '02', title: 'Receive OTP',      desc: 'A one-time code arrives in your inbox within seconds.' },
  { num: '03', title: 'Verify & enter',   desc: 'Type the code — paste support included.' },
  { num: '04', title: "You're in",        desc: 'Access granted. Session stays active for 48 hours.' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__glow" />
        <div className="hero__content">
          <h1 className="hero__title">
            Sign in with a code,<br />
            <span className="hero__gradient">not a password</span>
          </h1>
          <p className="hero__sub">
            OTPAuth replaces passwords entirely. Enter your email, get a 6-digit code,
            and you're in — securely, instantly, for 48 hours.
          </p>
          <div className="hero__cta">
            {user ? (
              <Link to="/dashboard" className="btn primary lg">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/signup" className="btn primary lg">Get Started Free</Link>
                <Link to="/login"  className="btn ghost   lg">Login with OTP</Link>
              </>
            )}
          </div>
          <p className="hero__note">No credit card · No password · Works like DigiLocker</p>
        </div>

        {/* Floating OTP card */}
        <div className="hero__card-wrap">
          <div className="hero__card">
            <div className="hero__card-dots">
              <span style={{ background: '#ef4444' }} />
              <span style={{ background: '#f59e0b' }} />
              <span style={{ background: '#22c55e' }} />
            </div>
            <p className="hero__card-label">Your OTP code</p>
            <div className="hero__card-digits">
              {['4','2','7','9','1','3'].map((d, i) => (
                <span key={i} className="hero__card-digit" style={{ animationDelay: `${i * 0.1}s` }}>{d}</span>
              ))}
            </div>
            <p className="hero__card-exp">Expires in 10:00 · Single-use</p>
            <div className="hero__card-bar" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section features-section">
        <div className="section__inner">
          <h2 className="section__title">Why OTPAuth?</h2>
          <p className="section__sub">Authentication rebuilt from the ground up — simpler for users, stronger on security.</p>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feat-card">
                <span className="feat-card__icon">{f.icon}</span>
                <h3 className="feat-card__title">{f.title}</h3>
                <p className="feat-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section how-section">
        <div className="section__inner">
          <h2 className="section__title">How it works</h2>
          <p className="section__sub">Four steps, under thirty seconds.</p>
          <div className="how-grid">
            {STEPS.map((s) => (
              <div key={s.num} className="how-step">
                <div className="how-step__num">{s.num}</div>
                <h3 className="how-step__title">{s.title}</h3>
                <p className="how-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to ditch passwords forever?</h2>
          <p className="cta-sub">Join a smarter, frictionless sign-in experience.</p>
          <Link to="/signup" className="btn primary lg">Create your account →</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer__inner">
          <div>
            <p className="footer__logo">⬡ OTPAuth</p>
            <p className="footer__tagline">Secure. Simple. Passwordless.</p>
          </div>
          <div className="footer__links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} OTPAuth. Built with React &amp; Node.js.</p>
      </footer>

    </main>
  );
}
