
import React from 'react';
import styled from 'styled-components';
import logoIcon from '../assets/icon/logo.png';
import hamburgerIcon from '../assets/icon/menu.png';
import backIcon from '../assets/icon/back.png';

const HeaderBack = () => {
  return (
    <HeaderWrapper>
      <Icons>
        <img src={backIcon} alt="뒤로가기" />
        <img src={logoIcon} alt="로고" />
        <img src={hamburgerIcon} alt="햄버거" />
      </Icons>
    </HeaderWrapper>
  );
};

export default HeaderBack;

// 스타일 컴포넌트
const HeaderWrapper = styled.header`
  width: 393px;   
  height: 64px;
  background: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(10px);
`;

const Icons = styled.div`
  padding: 4px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
