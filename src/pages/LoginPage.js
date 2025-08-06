import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/header_back';  // ✅ import!

export default function LoginPage() {
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    alert(`입력된 번호: ${phone}`);
  };

  return (
    <Wrapper>
      <Header /> 
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
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;

  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 393px;
  margin-top: 100px;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #1d1d1d;
  text-align: center;
  margin-bottom: 32px;
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
  background-color: #f0f0f0;

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
