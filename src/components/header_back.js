import React from 'react';
import styled from 'styled-components';
<<<<<<< HEAD
import backIcon from '../assets/icon/back.png';
import logoIcon from '../assets/icon/logo.png';
import menuIcon from '../assets/icon/menu.png';
=======
import backIcon from '../assets/back.png';
import logoIcon from '../assets/logo.png';
import menuIcon from '../assets/menu.png';
>>>>>>> 90017ac727d12cabc0137f3b54c311028690a0dc

const HeaderWrapper = styled.header`
  display: flex;
  width: 393px;
  padding: 4px 20px;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  top: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Logo = styled.img`
  height: 30px;
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <Icon src={backIcon} alt="뒤로가기" />
      <Logo src={logoIcon} alt="로고" />
      <Icon src={menuIcon} alt="메뉴" />
    </HeaderWrapper>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 90017ac727d12cabc0137f3b54c311028690a0dc
