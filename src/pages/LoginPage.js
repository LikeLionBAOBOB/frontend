// src/pages/LibrarianLoginPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import HeaderBack from '../components/header_back.js';
import statusBar from '../assets/images/StatusBar.png';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://baobob.pythonanywhere.com'; 
const LOGIN_URL = `${API_BASE}/accounts/user/login/`;
const LOGOUT_URL = `${API_BASE}/accounts/logout/`;

const LibrarianLoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!phone.trim()) {
      setErrorMsg('전화번호를 입력해 주세요.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data?.error || '로그인에 실패했습니다.');
        setSubmitting(false);
        return;
      }
      const { access_token, refresh_token, data: userData } = data || {};
      if (access_token) localStorage.setItem('access_token', access_token);
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
      if (userData?.name) localStorage.setItem('user_name', userData.name);
      navigate('/');
    } catch {
      setErrorMsg('네트워크 오류가 발생했습니다.');
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <img src={statusBar} alt="상태바" />
      <HeaderBack />
      <Container>
        <Title>일반 로그인</Title>

        <Label htmlFor="phone">휴대폰 번호</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="하이픈(-)을 제외하고 입력해주세요"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={submitting}
        />

        <Button onClick={handleLogin} disabled={submitting}>
          {submitting ? '로그인 중…' : '로그인'}
        </Button>

        {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
        

        <Spacer />
        {/* <LogoutButton to="/login" /> */}
      </Container>
    </Wrapper>
  );
};

export default LibrarianLoginPage;

async function logoutRequest() {
  const token = localStorage.getItem('access_token');
  try {
    if (token) {
      await fetch(LOGOUT_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
    }
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
  }
}

// const LogoutButton = ({ to = '/login', children = '로그아웃' }) => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const onClick = async () => {
//     if (loading) return;
//     setLoading(true);
//     await logoutRequest();
//     navigate(to);
//   };
//   return <LogoutBtn onClick={onClick} disabled={loading}>{loading ? '처리 중…' : children}</LogoutBtn>;
// };

/* styles */
const Wrapper = styled.div`
  width: 100%;
  height: 852px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;
const Container = styled.div`
  width: 393px;
  padding: 20px 24px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1D1D1D;
  text-align: center;
  margin: 64px 0 56px;
`;
const Label = styled.label`
  font-size: 14px;
  color: #555555;
  margin-bottom: 8px;
`;
const Input = styled.input`
  padding: 12px;
  border: 1px solid #c6c6c6;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 32px;
  background-color: #ffffff;
  &::placeholder { color: #8e8e8e; }
`;
const Button = styled.button`
  padding: 14px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: #212121;
  font-weight: bold;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const ErrorMsg = styled.p`
  margin-top: 12px;
  color: #d32f2f;
  font-size: 13px;
  text-align: center;
`;
const Spacer = styled.div`
  height: 32px;
`;
// const LogoutBtn = styled.button`
//   padding: 10px 14px;
//   background: #f0f0f0;
//   border: none;
//   border-radius: 10px;
//   font-size: 14px;
//   font-weight: 600;
//   cursor: pointer;
//   align-self: center;
//   &:disabled { opacity: .6; cursor: not-allowed; }
// `;