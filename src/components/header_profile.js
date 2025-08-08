// components/header_profile.js

import React from 'react';
import styled from 'styled-components';
import hamburgerIcon from '../assets/icons/hamburger.png';
import profileIcon from '../assets/icons/profile.png';

const HeaderProfile = () => {
  return (
    <Header>
      <img src={profileIcon} alt="프로필로고" />
      <img src={hamburgerIcon} alt="햄버거로고" />
    </Header>
  );
};

export default HeaderProfile;

// 스타일 컴포넌트

const Header = styled.header`
    width: 353px;   
    height: 44px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;