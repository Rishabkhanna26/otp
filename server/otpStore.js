/**
 * otpStore.js — In-memory OTP store with expiry & attempt limiting.
 * For production, swap this with Redis.
 */

const store = new Map();

function saveOTP(email, otp, expiryMinutes = 10) {
  const key = email.toLowerCase().trim();
  store.set(key, {
    otp,
    expiresAt: Date.now() + expiryMinutes * 60 * 1000,
    attempts: 0,
    sentAt: Date.now(),
  });
}

function verifyOTP(email, inputOtp) {
  const key = email.toLowerCase().trim();
  const record = store.get(key);

  if (!record) return { valid: false, reason: 'No OTP found. Please request a new one.' };
  if (Date.now() > record.expiresAt) {
    store.delete(key);
    return { valid: false, reason: 'OTP has expired. Please request a new one.' };
  }
  if (record.attempts >= 5) {
    store.delete(key);
    return { valid: false, reason: 'Too many failed attempts. Please request a new OTP.' };
  }
  if (record.otp !== inputOtp.toString()) {
    record.attempts += 1;
    return { valid: false, reason: `Invalid OTP. ${5 - record.attempts} attempt(s) remaining.` };
  }

  store.delete(key); // single-use: consume after success
  return { valid: true };
}

function isRateLimited(email) {
  const key = email.toLowerCase().trim();
  const record = store.get(key);
  if (!record) return false;
  return Date.now() - record.sentAt < 30 * 1000; // 30-second cooldown
}

// Auto-cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (now > val.expiresAt) store.delete(key);
  }
}, 5 * 60 * 1000);

module.exports = { saveOTP, verifyOTP, isRateLimited };
