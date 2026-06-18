# OTPAuth — Passwordless Auth (Single Project)

React + Express + Nodemailer in **one folder**, one `package.json`, one `npm run dev`.

---

## 📁 Structure

```
otp-auth-app/
├── server/
│   ├── index.js        ← Express server + all API routes
│   ├── mailer.js       ← Nodemailer + HTML email template
│   ├── otpStore.js     ← In-memory OTP store (expiry, attempts)
│   └── userStore.js    ← In-memory user store
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── OTPInput.jsx
│   ├── context/
│   │   └── AuthContext.jsx   ← 48-hour session (localStorage)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignUpPage.jsx
│   │   └── DashboardPage.jsx
│   ├── App.jsx
│   └── index.js
├── public/
│   └── index.html
├── .env                ← ⬅ Fill in your Gmail credentials
└── package.json        ← One package.json for everything
```

---

## ⚙️ Setup

### 1. Install everything
```bash
npm install
```

### 2. Configure `.env`
Open `.env` and fill in:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
```

> **How to get a Gmail App Password:**
> 1. Go to https://myaccount.google.com/security
> 2. Turn on **2-Step Verification**
> 3. Search **App passwords** → create one for "Mail"
> 4. Copy the 16-character code (no spaces)

### 3. Run
```bash
npm run dev
```
This starts **both** the Express backend (port 5000) and React dev server (port 3000) simultaneously using `concurrently`.

Open → **http://localhost:3000**

---

## 🚀 Production build
```bash
npm run build   # builds React into /build
npm start       # serves React build + API from Express on port 5000
```

---

## 🔄 OTP Flow

```
Sign Up: name + email → POST /api/auth/send-otp → OTP email → verify → account created
Login:   email        → POST /api/auth/send-otp → OTP email → verify → signed in (48h)
```

---

## 🛡️ Security
- OTP expires in 10 min (configurable in `.env`)
- Single-use: deleted after first successful verify
- 5 failed attempts → OTP invalidated
- 30-second per-email resend cooldown
- Express rate limiting: 5 OTP sends / 10 min per IP
