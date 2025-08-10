import React from 'react';
import styled from 'styled-components';
import backIcon from '../assets/icons/back.png';
import logoIcon from '../assets/icons/logo.png';
import starIcon from '../assets/icons/star.png';
import StatusBar from '../assets/icons/StatusBar.png';

const Header = () => {
  return (
    <>
      <StatusBarImage src={StatusBar} alt="상태바" />
      <HeaderWrapper>
        <IconGroup>
          <Icon src={backIcon} alt="뒤로가기" />
          <Logo src={logoIcon} alt="로고" />
          <Icon src={starIcon} alt="즐겨찾기" />
        </IconGroup>
      </HeaderWrapper>
    </>
  );
};

export default Header;
const StatusBarImage = styled.img`
  width: 100%;
  height: auto;
`;

const HeaderWrapper = styled.header`
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
`;

const IconGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Logo = styled.img`
  height: 28px;
`;
