// src/pages/LibrarianLoginPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import HeaderBack from '../components/header_back';
import statusBar from '../assets/images/StatusBar.png';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://baobob.pythonanywhere.com'; 
const ADMIN_LOGIN_URL = `${API_BASE}/accounts/admin/login//`;
const LOGOUT_URL = `${API_BASE}/accounts/logout/`;

const LibrarianLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('email과 password를 모두 입력해 주세요.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch(ADMIN_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const raw = await res.text();
      let data = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch {}

      if (!res.ok) {
        setErrorMsg(data?.error || `로그인 실패 (${res.status})`);
        setSubmitting(false);
        return;
      }

      const { access_token, refresh_token, data: userData } = data || {};
      if (access_token) localStorage.setItem('access_token', access_token);
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
      if (userData?.name) localStorage.setItem('user_name', userData.name);

      navigate('/home-ad');
    } catch {
      setErrorMsg('네트워크 오류가 발생했습니다.');
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <StatusBarImg src={statusBar} alt="상태바"/>
      <HeaderBack />
      <Container>
        <Title>사서 로그인</Title>

        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="abc@lib.or.kr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />

        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="8자 이상의 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />

        <Button onClick={handleLogin} disabled={submitting}>
          {submitting ? '로그인 중…' : '로그인'}
        </Button>
        {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

        <Notice>권한을 가진 공공도서관 직원만 로그인 가능합니다.</Notice>
      </Container>
    </Wrapper>
  );
};

export default LibrarianLoginPage;

const StatusBarImg = styled.img`
  width: 393px;
  height: 59px;
  `
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
  margin: 64px 0;
  margin-bottom: 56px;
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
const Notice = styled.p`
  font-size: 12px;
  color: #8e8e8e;
  margin-top: 20px;
  text-align: center;
`;
const ErrorMsg = styled.p`
  margin-top: 12px;
  color: #d32f2f;
  font-size: 13px;
  text-align: center;
`;
