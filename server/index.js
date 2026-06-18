require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const { generateOTP, sendOTPEmail } = require('./mailer');
const { saveOTP, verifyOTP, isRateLimited } = require('./otpStore');
const { findUser, createUser, userExists }  = require('./userStore');

const app  = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({ origin: clientUrl, credentials: true }));

// Global rate limiter
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Strict OTP send limiter
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: 'Too many OTP requests. Please wait and try again.' },
});

// ── POST /api/auth/send-otp ─────────────────────────────────
app.post('/api/auth/send-otp', otpLimiter, async (req, res) => {
  const { email, name, type } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Please provide a valid email address.' });

  if (type === 'signup' && !name?.trim())
    return res.status(400).json({ message: 'Name is required for signup.' });

  if (type === 'login' && !userExists(email))
    return res.status(404).json({ message: 'No account found with this email. Please sign up first.' });

  if (type === 'signup' && userExists(email))
    return res.status(409).json({ message: 'An account with this email already exists. Please log in.' });

  if (isRateLimited(email))
    return res.status(429).json({ message: 'Please wait 30 seconds before requesting another OTP.' });

  try {
    const length  = parseInt(process.env.OTP_LENGTH) || 6;
    const expiry  = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
    const otp     = generateOTP(length);

    saveOTP(email, otp, expiry);
    await sendOTPEmail(email, otp, name || '', type);

    console.log(`[OTP] Sent → ${email} | type: ${type}`);
    return res.json({ message: `OTP sent to ${email}. Check your inbox.` });
  } catch (err) {
    console.error('[OTP Error]', err.message);
    return res.status(500).json({ message: 'Failed to send OTP. Check your .env email config.' });
  }
});

// ── POST /api/auth/verify-otp ───────────────────────────────
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp, name, type } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: 'Email and OTP are required.' });

  const result = verifyOTP(email, otp);
  if (!result.valid)
    return res.status(401).json({ message: result.reason });

  let user;
  if (type === 'signup') {
    user = createUser({ name: name || 'User', email });
    console.log(`[Auth] Registered → ${email}`);
  } else {
    user = findUser(email);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    console.log(`[Auth] Login → ${email}`);
  }

  return res.json({
    message: 'OTP verified successfully.',
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Serve React build in production ────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email: ${process.env.EMAIL_USER || '(not set — fill in .env)'}\n`);
  });
}

module.exports = app;
