import React from 'react';
import './Header.css';
import backIcon from '../assets/back.png';
import logoIcon from '../assets/logo.png';
import menuIcon from '../assets/menu.png';

export default function Header() {
  return (
    <header className="header">
      <img src={backIcon} alt="뒤로가기" className="icon" />
      <img src={logoIcon} alt="로고" className="logo" />
      <img src={menuIcon} alt="메뉴" className="icon" />
    </header>
  );
}
