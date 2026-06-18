const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const password = process.env.EMAIL_PASS
    ? process.env.EMAIL_PASS.replace(/['"\s]/g, '')
    : '';

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: password,
    },
  });
  return transporter;
}

function generateOTP(length = 6) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

async function sendOTPEmail(to, otp, name = '', type = 'login') {
  const fromName = process.env.EMAIL_FROM_NAME || 'OTPAuth';
  const expiry   = process.env.OTP_EXPIRY_MINUTES || 10;
  const greeting = name ? `Hi ${name}` : 'Hi there';
  const action   = type === 'signup' ? 'complete your registration' : 'sign in to your account';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body{margin:0;padding:0;background:#0b0f1a;font-family:'Segoe UI',Arial,sans-serif;}
    .wrap{max-width:520px;margin:40px auto;padding:0 20px;}
    .card{background:#111827;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:44px 40px;text-align:center;}
    .logo{font-size:1.1rem;font-weight:700;color:#6366f1;margin-bottom:28px;}
    h1{color:#f1f5f9;font-size:1.5rem;margin:0 0 10px;}
    .sub{color:#94a3b8;font-size:.9rem;line-height:1.6;margin:0 0 32px;}
    .otp-row{display:flex;gap:10px;justify-content:center;margin-bottom:28px;}
    .digit{width:52px;height:60px;background:rgba(99,102,241,.1);border:1.5px solid rgba(99,102,241,.4);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:700;color:#14b8a6;font-family:monospace;}
    .expiry{color:#475569;font-size:.8rem;margin-bottom:32px;}
    .note{background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.15);border-radius:10px;padding:14px 18px;color:#94a3b8;font-size:.82rem;line-height:1.6;text-align:left;}
    .footer{color:#334155;font-size:.78rem;margin-top:28px;text-align:center;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="logo">⬡ OTPAuth</div>
      <h1>${greeting} 👋</h1>
      <p class="sub">Use the code below to ${action}.<br/>This code is single-use and expires in <strong style="color:#f1f5f9">${expiry} minutes</strong>.</p>
      <div class="otp-row">
        ${otp.split('').map(d => `<span class="digit">${d}</span>`).join('')}
      </div>
      <p class="expiry">⏱ Expires in ${expiry} minutes &nbsp;·&nbsp; Single-use only</p>
      <div class="note">
        🔒 <strong style="color:#f1f5f9">Security reminder:</strong> Never share this code with anyone.
        OTPAuth staff will never ask for your OTP.
        If you didn't request this, you can safely ignore this email.
      </div>
    </div>
    <p class="footer">© ${new Date().getFullYear()} OTPAuth &nbsp;·&nbsp; Sent to ${to}</p>
  </div>
</body>
</html>`;

  const text = `${greeting},\n\nYour OTP: ${otp}\n\nExpires in ${expiry} minutes. Single-use.\n\nIf you didn't request this, ignore this email.\n\n— OTPAuth`;

  await getTransporter().sendMail({
    from: `"${fromName}" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${otp} is your OTPAuth verification code`,
    text,
    html,
  });
}

module.exports = { generateOTP, sendOTPEmail };
