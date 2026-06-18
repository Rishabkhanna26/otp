import React, { useRef, useEffect } from 'react';
import './OTPInput.css';

export default function OTPInput({ length = 6, value, onChange }) {
  const inputs = useRef([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const next = [...digits];
    next[idx] = val[val.length - 1];
    onChange(next.join(''));
    if (idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const next = [...digits];
      if (digits[idx]) { next[idx] = ''; onChange(next.join('')); }
      else if (idx > 0) { inputs.current[idx - 1]?.focus(); next[idx - 1] = ''; onChange(next.join('')); }
    }
    if (e.key === 'ArrowLeft'  && idx > 0)          inputs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, '').slice(0, length));
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="otp-input">
      {digits.map((d, i) => (
        <input
          key={i} ref={(el) => (inputs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1} value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className={`otp-box ${d ? 'filled' : ''}`}
        />
      ))}
    </div>
  );
}
