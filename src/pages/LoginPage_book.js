import React, { useState } from 'react';
import styled from 'styled-components';
import HeaderBack from '../components/header_back';
import statusBar from '../assets/images/StatusBar.png';

const LibrarianLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    alert(`입력된 이메일: ${email}\n입력된 비밀번호: ${password}`);
  };

  return (
    <Wrapper>
      <img src={statusBar} alt="상태바"/>
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
        />

        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="8자 이상의 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin}>로그인</Button>
        <Notice>권한을 가진 공공도서관 직원만 로그인 가능합니다.</Notice>
      </Container>
    </Wrapper>
  );
};

export default LibrarianLoginPage;

const Wrapper = styled.div`
  width: 100vw;
  height: 852px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
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

const Notice = styled.p`
  font-size: 12px;
  color: #8e8e8e;
  margin-top: 20px;
  text-align: center;
`;
