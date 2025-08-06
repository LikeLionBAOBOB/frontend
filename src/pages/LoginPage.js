import React, { useState } from 'react';
import './LoginPage.css';
import Header from '../components/header';

export default function LoginPage() {
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    alert(`입력된 번호: ${phone}`);
  };

  return (
    <div className="login-wrapper">
      <Header />
      <div className="login-container">
        <h2>일반 로그인</h2>

        <label htmlFor="phone">전화번호</label>
        <input
          id="phone"
          type="text"
          placeholder="000-0000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button onClick={handleLogin}>로그인</button>
      </div>
    </div>
  );
}
