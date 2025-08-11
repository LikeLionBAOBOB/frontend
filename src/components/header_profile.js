
import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import HeaderProfile from '../components/header_profile.js'; 
import homelogoIcon from '../assets/icons/home_logo.png';
import homebackground from '../assets/images/home_background.png';
import bookIcon from '../assets/icons/book.png';
import starIcon from '../assets/icons/star.png';
import leftIcon from '../assets/icons/left.png';
import statusBar from '../assets/images/StatusBar.png';

import closeArrow from "../assets/icons/return.png";

const FRAME_W = 393;
const FRAME_H = 852;
const STATUSBAR_H = 60;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
`;

const HomePage = () => {
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

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeSidebar();
    if (mount) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mount]);

  const go = useCallback((pathOrUrl) => {
    closeSidebar();
    if (/^https?:\/\//.test(pathOrUrl)) window.location.href = pathOrUrl;
    else navigate(pathOrUrl);
  }, [navigate]);


  const topMenu = [
    { label: "도서관 검색", to: "/search", color: "#222" },
    { label: "나의 도서관", to: "/mylib", color: "#222" },
    { label: "사이트 바로가기", to: "https://example.com", color: "#222" },
  ];
  const bottomMenu = [
    { label: "서비스 소개", to: "/about", color: "#555555" },
    { label: "문의", to: "/contact", color: "#555555" },
  ];

  return(
    <Wrapper>
      <img src={statusBar} alt="상태바"/>

      <HeaderProfile
        onHamburgerClick={openSidebar}
        onBackClick={() => navigate('/')}
        onLogoClick={() => navigate('/')}
      />

      <Container>
        <Main>

          <LogoImage src={homelogoIcon} alt="홈로고"/>
          <LogoText>열람:뜰</LogoText>
          <SubText>공공도서관 좌석 확인 · 관리 서비스</SubText>

          {/* 하단 버튼 */}
          <ButtonsContainer>
            <ActionButton onClick={() => navigate('/search')}>
              <Left>
                <Icon src={bookIcon} alt="책아이콘" />
                <BtnText>도서관 검색</BtnText>
              </Left>
              <ArrowIcon src={leftIcon} alt="우화살표" />
            </ActionButton>

            <ActionButton onClick={() => navigate('/mylib')}>
              <Left>
                <Icon src={starIcon} alt="별아이콘" />
                <BtnText>나의 도서관</BtnText>
              </Left>
              <ArrowIcon src={leftIcon} alt="우화살표" />
            </ActionButton>
          </ButtonsContainer>
        </Main>
      </Container>

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
    </Wrapper>
  );
};

export default HomePage;


const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 393px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: url(${homebackground}) no-repeat center;
  background-size: 393px 793px;
`;


const Main = styled.div`
  width: 100%;
  height: 749px;
  position: relative;
`;

const LogoImage = styled.img`
  display: block;
  padding: 12px 166px 12px 167px;
`;

const LogoText = styled.h1`
  text-align: center;
  font-family: "Pretendard GOV Variable";
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  margin-top: 0;
  margin-bottom: 0;
`;

const SubText = styled.p`
  color: #555;
  text-align: center;
  font-family: "Pretendard GOV Variable";
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
  margin-top: 0;
  margin-bottom: 0;
`;


const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 324px 20px 156px 20px;
`;

const ActionButton = styled.div`
  width: 353px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.60);
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
  cursor: pointer;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0 16px 23px;
  gap: 12px;
`;

const BtnText = styled.div`
  color: #383838;
  font-family: "Pretendard GOV Variable";
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
`;

const ArrowIcon = styled.img`
  flex-shrink: 0;
  padding: 10px 16px 10px;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
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
  background: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(10px);
  box-shadow: -4px 0 24px rgba(0,0,0,0.12);
  z-index: 999;

  animation: ${slideIn} 0.25s ease forwards;
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});

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
  font-size: 16px;
  font-weight: 600;
  text-align: right;
  cursor: pointer;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: rgba(0,0,0,0.1);
  margin: 14px 0;
`;
