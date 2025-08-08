import React, { useState } from 'react';
import styled from 'styled-components';
import HeaderBack from '../components/header_back.js'; // 헤더 컴포넌트

const LoginPage = () => {
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    alert(`입력된 번호: ${phone}`);
  };

  return (
    <Wrapper>
      <HeaderBack />
      <Container>
        <Title>일반 로그인</Title>
        <Label htmlFor="phone">전화번호</Label>
        <Input
          id="phone"
          type="text"
          placeholder="000-0000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button onClick={handleLogin}>로그인</Button>
      </Container>
    </Wrapper>
  );
};

export default LoginPage;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-bottom: 24px;
  background-color: #ffffff;

  &::placeholder {
    color: #8e8e8e;
  }
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
`;
