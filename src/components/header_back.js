
import React from 'react';
import styled from 'styled-components';
import logoIcon from '../assets/icon/logo.png';
import hamburgerIcon from '../assets/icon/menu.png';
import backIcon from '../assets/icon/back.png';
import statusBar from '../assets/StatusBar.png';
const HeaderBack = () => {
  return (
    <HeaderWrapper>
      <StatusBarImage src={statusBar} alt="상태바" />
      <Icons>
        <img src={backIcon} alt="뒤로가기" />
        <img src={logoIcon} alt="로고" />
        <img src={hamburgerIcon} alt="햄버거" />
      </Icons>
    </HeaderWrapper>
  );
};

export default HeaderBack;

const HeaderWrapper = styled.header`
  width: 393px;
  background: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
`;

const StatusBarImage = styled.img`
  width: 100%;
  height: auto;
`;

const Icons = styled.div`
  padding: 4px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
`;
