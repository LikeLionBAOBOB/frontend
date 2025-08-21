import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import logoIcon from "../assets/icons/logo.png";
import hamburgerIcon from "../assets/icons/hamburger.png";
import backIcon from "../assets/icons/back.png";
import closeArrow from "../assets/icons/return.png";

const FRAME_W = 393;
const FRAME_H = 852;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
`;

const HeaderBack = ({ isLoggedIn = false }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); 
  const [mount, setMount] = useState(false);

  // 열기
  const openSidebar = () => {
    setMount(true);
    requestAnimationFrame(() => setOpen(true));
  };


  const closeSidebar = () => {
    setOpen(false);
    setTimeout(() => setMount(false), 250);
  };


  const go = useCallback((pathOrUrl) => {
    closeSidebar();
    if (/^https?:\/\//.test(pathOrUrl)) window.location.href = pathOrUrl;
    else navigate(pathOrUrl);
  }, [navigate]);

  const topMenu = [
    { label: "도서관 찾기", to: "/map", color: "#222" },
    ...(isLoggedIn ? [{ label: "나의 도서관", to: "/mylib", color: "#222" }] : []),
    { label: "사이트 바로가기", to: "/sites", color: "#222" },
    
  ];
  const bottomMenu = [
    { label: "서비스 소개", to: "/about", color: "#555555" },
    { label: "문의", to: "/contact", color: "#555555" },     
  ];

  return (
    <>
      <HeaderWrapper>
        <Icons>
          <BackIcon
            src={backIcon}
            alt="뒤로가기"
            role="button"
            onClick={() => (mount ? closeSidebar() : navigate(-1))} 
          />
          <LogoIcon
            src={logoIcon}
            alt="로고"
            role="button"
            onClick={() => navigate("/")}
          />
          <HamIcon
            src={hamburgerIcon}
            alt="메뉴"
            role="button"
            onClick={openSidebar}   
          />
        </Icons>
      </HeaderWrapper>

      {mount && (
        <>
          <Scrim onClick={closeSidebar} $open={open} />

          <Sidebar role="dialog" aria-modal="true" $open={open}>
            <SidebarTop>
              <CloseBtn onClick={closeSidebar} aria-label="닫기">
                <img src={closeArrow} alt="닫기" />
              </CloseBtn>
            </SidebarTop>

            <MenuGroupRight>
              {topMenu.map((m) => (
                <MenuItemRight
                  key={m.label}
                  style={{ color: m.color }}
                  onClick={() => go(m.to)}
                >
                  {m.label}
                </MenuItemRight>
              ))}
            </MenuGroupRight>

            <Divider />

            <MenuGroupRight>
              {bottomMenu.map((m) => (
                <MenuItemRight
                  key={m.label}
                  style={{ color: m.color }}
                  onClick={() => go(m.to)}
                >
                  {m.label}
                </MenuItemRight>
              ))}
            </MenuGroupRight>
          </Sidebar>
        </>
      )}
    </>
  );
};

export default HeaderBack;

const BackIcon = styled.img`
  width: 36px;
  height: 36px;
`
const HamIcon = styled.img`
  width: 36px;
  height: 36px;
`
const LogoIcon = styled.img`
  width: 46px;
  height: 24px;
`
const HeaderWrapper = styled.header`
  width: ${FRAME_W}px;
  height: 44px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
`;

const Icons = styled.div`
  padding: 4px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;

  img[role="button"] { cursor: pointer; }
`;


const Scrim = styled.div`
  position: fixed;
  top: 60px;
  left: calc(50% - ${FRAME_W / 2}px);
  width: ${FRAME_W}px;
  height: ${FRAME_H- 52}px;
  background: rgba(0, 0, 0, 0.18);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: opacity 0.25s ease;
  z-index: 998;
`;


const Sidebar = styled.aside`
  position: fixed;
  top: 60px;
  right: calc(50% - ${FRAME_W / 2}px);
  width: 281px;
  height: ${FRAME_H-52}px;
  background: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(10px);
  z-index: 999;

  animation: ${slideIn} 0.25s ease forwards;
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};

  display: flex;
  flex-direction: column;
  padding: 12px 20px 24px;
  box-sizing: border-box;
`;

const SidebarTop = styled.div`
  display: flex;
  justify-content: flex-end;  
  align-items: center;
  height: auto;
  padding-top: 20px;
  margin-bottom: 72px; 
`;

const CloseBtn = styled.button`
  border: 0;
  background: transparent;
  width: 36px;
  flex-shrink: 0;
  height: 36px;
  padding: 4;
  cursor: pointer;

  img { width: 36px; height: 36px; object-fit: contain; display: block; }
`;


const MenuGroupRight = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-end;   

  gap: 18px;
  padding: 10px 0;
`;

const MenuItemRight = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  text-align: right;       
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: rgba(0,0,0,0.1);
  margin: 14px 0;
`;
