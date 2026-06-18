import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import OTPInput from '../components/OTPInput';
import './AuthPage.css';

export default function SignUpPage() {
  const [step, setStep]       = useState('details');
  const [form, setForm]       = useState({ name: '', email: '' });
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [timer, setTimer]     = useState(0);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const startTimer = () => {
    setTimer(30);
    const iv = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000);
  };

  const handleDetails = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', { email: form.email, name: form.name, type: 'signup' });
      setStep('otp');
      startTimer();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-otp', { email: form.email, name: form.name, otp, type: 'signup' });
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
      setOtp('');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError(''); setOtp(''); setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', { email: form.email, name: form.name, type: 'signup' });
      startTimer();
    } catch (err) { setError('Failed to resend OTP.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__glow" />
      <div className="auth-card">
        <span className="auth-card__icon">✨</span>

        {step === 'details' ? (
          <>
            <h1 className="auth-card__title">Create account</h1>
            <p className="auth-card__sub">No password needed — verify your email with an OTP.</p>
            <form onSubmit={handleDetails} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input type="text" className="form-input" placeholder="Your name"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input type="email" className="form-input" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Send Verification OTP →'}
              </button>
            </form>
            <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          </>
        ) : (
          <>
            <h1 className="auth-card__title">Verify your email</h1>
            <p className="auth-card__sub">We sent a 6-digit code to <strong>{form.email}</strong></p>
            <form onSubmit={handleVerify} className="auth-form">
              <div className="form-group">
                <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: 16 }}>Enter your OTP</label>
                <OTPInput length={6} value={otp} onChange={setOtp} />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-btn" disabled={loading || otp.length < 6}>
                {loading ? <span className="spinner" /> : 'Create Account'}
              </button>
            </form>
            <div className="auth-resend">
              {timer > 0
                ? <p className="auth-resend__timer">Resend in {timer}s</p>
                : <button className="auth-resend__btn" onClick={handleResend} disabled={loading}>Resend code</button>}
            </div>
            <button className="auth-back" onClick={() => { setStep('details'); setOtp(''); setError(''); }}>
              ← Edit details
            </button>
          </>
        )}
      </div>
    </div>
  );
}
