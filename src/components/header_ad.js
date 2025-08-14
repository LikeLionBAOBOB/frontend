import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import backIcon from "../assets/icons/back.png";
import hamburgerIcon from "../assets/icons/hamburger.png";
import logoIcon from "../assets/icons/logo.png";
import closeArrow from "../assets/icons/return.png";
import bgImage from "../assets/images/해오름_배경.png";
import bottomShadow from "../assets/icons/frame_shadow.png";

const FRAME_W = 393;
const FRAME_H = 852;
const STATUSBAR_H = 60;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
`;

const HeaderBackHero = ({ title, address, isLoggedIn = false }) => {
  const navigate = useNavigate();


  const [open, setOpen] = useState(false);
  const [mount, setMount] = useState(false);

  const openSidebar = () => {
    setMount(true);
    requestAnimationFrame(() => setOpen(true));
  };
  const closeSidebar = () => {
    setOpen(false);
    setTimeout(() => setMount(false), 250);
  };


  const go = useCallback(
    (pathOrUrl) => {
      closeSidebar();
      if (/^https?:\/\//.test(pathOrUrl)) window.location.href = pathOrUrl;
      else navigate(pathOrUrl);
    },
    [navigate]
  );

  const topMenu = [
    { label: "좌석 관리", to: "/search", color: "#222" },
    { label: "사이트 바로가기", to: "/search", color: "#222" },

  ];
  const bottomMenu = [
    { label: "서비스 소개", to: "/about", color: "#555555" },
    { label: "문의", to: "/contact", color: "#555555" },
  ];

  return (
    <>
      <Wrap>
        <Bg src={bgImage} alt="hero" />

        <ShadowWrap>
          <ShadowPng src={bottomShadow} alt="" />
          <ShadowGrad />
        </ShadowWrap>

    
        <IconBar>
          <IconBtn onClick={() => navigate("/")} aria-label="뒤로가기">
            <img src={backIcon} alt="back" />
          </IconBtn>
          <Logo onClick={() => navigate("/")}>
            <img src={logoIcon} alt="logo" />
          </Logo>
          <IconBtn onClick={openSidebar} aria-label="메뉴">
            <img src={hamburgerIcon} alt="menu" />
          </IconBtn>
        </IconBar>

        <TitleBox>
          <h1>{title}</h1>
          <p>{address}</p>
        </TitleBox>
      </Wrap>

      {mount && (
        <>
          <Scrim $open={open} onClick={closeSidebar} />
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

export default HeaderBackHero;



const Wrap = styled.header`
  width: 393px;
  position: relative;
  margin: 0 auto;
`;
const Bg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ShadowWrap = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: grid;
`;
const ShadowPng = styled.img`
  align-self: end;
  width: 100%;
  height: auto;
`;
const ShadowGrad = styled.div`
  align-self: end;
  height: 96px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.96) 58%,
    #fff 100%
  );
`;

const IconBar = styled.div`
  position: absolute;
  top: 69px;
  left: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  padding: 4px 20px;
  justify-content: space-between;
  align-items: center;
`;
const IconBtn = styled.button`
  all: unset;
  cursor: pointer;
  img {
    width: 24px;
    height: 24px;
    display: block;
  }
`;
const Logo = styled.div`
  img {
    height: 24px;
    display: block;
    cursor: pointer;
  }
`;

const TitleBox = styled.div`
  position: absolute;
  top: 127px;
  left: 0;
  right: 0;
  text-align: center;

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }
  p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #7a7a7a;
  }
`;

const Scrim = styled.div`
  position: fixed;
  top: ${STATUSBAR_H}px;
  left: calc(50% - ${FRAME_W / 2}px);
  width: ${FRAME_W}px;
  height: ${FRAME_H - STATUSBAR_H}px;
  background: rgba(0, 0, 0, 0.18);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: opacity 0.25s ease;
  z-index: 998;
`;

const Sidebar = styled.aside`
  position: fixed;
  top: ${STATUSBAR_H}px;
  right: calc(50% - ${FRAME_W / 2}px);
  width: 280px;
  height: ${FRAME_H - STATUSBAR_H}px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
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
  align-items: flex-start;
  padding-top: 20px;
  margin-bottom: 72px;
`;
const CloseBtn = styled.button`
  border: 0;
  background: transparent;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  padding: 0;
  cursor: pointer;

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    display: block;
  }
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
  font-size: 16px;
  font-weight: 600;
  text-align: right;
  cursor: pointer;
`;
const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 14px 0;
`;