import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import hamburgerIcon from "../assets/icons/hamburger.png";
import closeArrow from "../assets/icons/return.png";
import profileIcon from "../assets/icons/profile.png";
import smileProfile from "../assets/icons/proimg.png";

const API_BASE = process.env.REACT_APP_API_BASE || 'https://baobob.pythonanywhere.com';

const FRAME_W = 393;
const FRAME_H = 852;

const slideInRight = keyframes`
  from{transform:translateX(100%)} 
  to{transform:translateX(0)}
`;

const slideOutRight = keyframes`
  from{transform:translateX(0)} 
  to{transform:translateX(100%)}
`;

const slideInLeft  = keyframes`
  from{transform:translateX(-100%)} 
  to{transform:translateX(0)}
`;

const slideOutLeft = keyframes`
  from{transform:translateX(0)} 
  to{transform:translateX(-100%)}
`;

const HeaderProfileHome = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  // 로그인 시 localStorage에서 닉네임 읽어오기 
  const [nickname, setNickname] = useState(localStorage.getItem("nickname") || localStorage.getItem("user_name") || "");
    useEffect(() => {
      if (isLoggedIn) setNickname(localStorage.getItem("nickname") || localStorage.getItem("user_name") || "");
      else setNickname("");
    }, [isLoggedIn]);

  // 오른쪽 드로어
  const [rOpen, setROpen] = useState(false);
  const [rMount, setRMount] = useState(false);
  const openRight = () => { setRMount(true); requestAnimationFrame(()=>setROpen(true)); };
  const closeRight = () => { setROpen(false); setTimeout(()=>setRMount(false), 250); };

  // 왼쪽 드로어
  const [lOpen, setLOpen] = useState(false);
  const [lMount, setLMount] = useState(false);
  const openLeft  = () => { 
    if (!!localStorage.getItem("access_token")) {
      setNickname(localStorage.getItem("nickname") || localStorage.getItem("user_name") || "");
    }
    setLMount(true); 
    requestAnimationFrame(()=>setLOpen(true)); 
  };
  const closeLeft = () => { 
    setLOpen(false); 
    setTimeout(()=>setLMount(false), 250); 
  };

  // 로그아웃
  const logout = async () => {
    const token = localStorage.getItem("access_token");
    try {
      if (token) {
        await fetch(`${API_BASE}/accounts/logout/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("nickname");
      setNickname("");
      closeLeft(); closeRight();
      navigate("/login", { replace: true });
    }
  };

  const go = useCallback((pathOrUrl) => {
    closeLeft(); closeRight();
    if (/^https?:\/\//.test(pathOrUrl)) window.location.href = pathOrUrl;
    else navigate(pathOrUrl);
  }, [navigate]);

  const topMenu = [
    { label: "도서관 검색", to: "/map", color: "#222" },
    ...(isLoggedIn ? [{ label: "나의 도서관", to: "/mylib", color: "#222" }] : []),
    { label: "사이트 바로가기", to: "/sites", color: "#222" },
  ];
  const bottomMenu = [
    { label: "서비스 소개", to: "/about", color: "#555" },
    { label: "문의", to: "/contact", color: "#555" },
  ];

  const anyMount = rMount || lMount;       
  const anyOpen  = rOpen  || lOpen;

  return (
    <>
      <HeaderWrapper>
        <Icons>
          <img 
            src={profileIcon} 
            alt="프로필" 
            role="button" 
            onClick={() => { openLeft(); setROpen(false); }} 
          />
          <img src={hamburgerIcon} 
          alt="메뉴" 
          role="button" 
          onClick={() => { openRight(); setLOpen(false); }} 
          />
        </Icons>
      </HeaderWrapper>

      {anyMount && (
        <>
          <Scrim onClick={() => { closeLeft(); closeRight(); }} $open={anyOpen} />

          {/* 오른쪽 드로어 */}
          {rMount && (
            <SidebarRight role="dialog" aria-modal="true" $open={rOpen}>
              <SidebarTop align="flex-end" $isLeft={false}>
                <CloseBtn onClick={closeRight} aria-label="닫기">
                  <img src={closeArrow} alt="닫기" />
                </CloseBtn>
              </SidebarTop>

              <MenuGroupRight>
                {topMenu.map(m => (
                  <MenuItemRight key={m.label} style={{color:m.color}} onClick={() => go(m.to)}>{m.label}</MenuItemRight>
                ))}
              </MenuGroupRight>

              <Divider />
              <MenuGroupRight>
                {bottomMenu.map(m => (
                  <MenuItemRight key={m.label} style={{color:m.color}} onClick={() => go(m.to)}>{m.label}</MenuItemRight>
                ))}
              </MenuGroupRight>
            </SidebarRight>
          )}

          {/* 왼쪽 드로어 (로그인/비로그인 분기) */}
          {lMount && (
            <SidebarLeft role="dialog" aria-modal="true" $open={lOpen}>
              <SidebarTop align="flex-start" $isLeft={true}>
                <CloseBtn onClick={closeLeft} aria-label="닫기"><img src={closeArrow} alt="닫기" /></CloseBtn>
              </SidebarTop>

              {isLoggedIn ? (
                <>
                  <ProfileRow>
                    <Avatar src={smileProfile} alt="프로필" />
                    <div>
                      <Nick>{nickname || "사용자"}</Nick>
                    </div>
                  </ProfileRow>
                  <LogoutBtn type="button" onClick={logout}>로그아웃</LogoutBtn>
                </>
              ) : (
                <>
                <LoginBtns>
                  <LoginBtn type="button" onClick={() => go("/login")}>일반 로그인</LoginBtn>
                  <LoginBtn type="button" onClick={() => go("/login-ad")}>사서 로그인</LoginBtn>
                </LoginBtns>
                </>
              )}
            </SidebarLeft>
          )}
        </>
      )}
    </>
  );
};

export default HeaderProfileHome;


const HeaderWrapper = styled.header`
  width: ${FRAME_W}px; 
  height: 44px;
  background: rgba(255,255,255,.8);
  backdrop-filter: blur(10px);
  display: flex; 
  flex-direction: column;
`;
const Icons = styled.div`
  padding: 4px 20px; 
  height: 64px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  img[role="button"]{cursor:pointer;}
`;

const Scrim = styled.div`
  position: fixed; 
  top: 60px; 
  left: calc(50% - ${FRAME_W/2}px);
  width: ${FRAME_W}px; 
  height: ${FRAME_H-52}px;
  background: rgba(0,0,0,.18);
  opacity: ${({$open})=>$open?1:0}; 
  transition: opacity .25s ease; 
  z-index: 998;
`;

/* 오른쪽 드로어 */
const SidebarRight = styled.aside`
  position: fixed; 
  top: 60px; 
  right: calc(50% - ${FRAME_W/2}px);
  width: 281px; 
  height: ${FRAME_H-52}px;
  background: rgba(255,255,255,.8); 
  backdrop-filter: blur(10px);
  z-index: 999; 
  animation: ${({$open})=>$open?slideInRight:slideOutRight} .25s ease forwards;
  display: flex; 
  flex-direction: column; 
  padding: 12px 20px 24px; 
  box-sizing: border-box;
`;

/* 왼쪽 드로어 */
const SidebarLeft = styled.aside`
  position: fixed; 
  top: 60px; 
  left: calc(50% - ${FRAME_W/2}px);
  width: 294px; 
  height: ${FRAME_H-52}px;
  background: rgba(255,255,255,.8); 
  backdrop-filter: blur(10px);
  z-index: 999; 
  animation:${({$open})=>$open?slideInLeft:slideOutLeft} .25s ease forwards;
  display: flex; 
  flex-direction: column; 
  padding: 12px 20px 24px; 
  box-sizing: border-box;
`;

const SidebarTop = styled.div`
  display: flex; 
  justify-content: ${({ align }) => align || "flex-end"}; 
  align-items: center;
  height: auto;
  padding-top: 20px;
  margin-bottom: ${({ $isLeft }) => ($isLeft ? "16px" : "72px")};
`;

const CloseBtn = styled.button`
  border:0; 
  background: transparent; 
  width: 36px; 
  height: 36px; 
  cursor: pointer; 
  img{ width:36px; height:36px; }
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
  font-size: 20px; 
  font-weight: 600; 
  text-align: right; 
  cursor: pointer;
`;
const Divider = styled.hr`
  border: 0; 
  height: 1px; 
  background: rgba(0,0,0,.1); 
  margin: 14px 0;
`;

/* 왼쪽 드로어 내부 */
const ProfileRow = styled.div`
  display: flex; 
  align-items: center; 
  gap: 4px; 
  padding: 8px 7px;
`;
const Avatar = styled.img`
  width: 28px;
  height: 28px; 
`;
const Nick = styled.span`
  color: var(--Tect--Lighter, #383838);
  font-family: "Pretendard GOV Variable";
  font-size: 14px;
  font-weight: 400;
  line-height: 17.5px;
`;
const LogoutBtn = styled.button`
  margin-top: 16px; 
  border: 0; 
  background: transparent; 
  font-size: 20px; 
  font-weight: 600; 
  cursor: pointer;
  padding-left: 15px;
  display: flex;
`;
const LoginBtn = styled(LogoutBtn)``;
const LoginBtns = styled.div`
  text-align: left;
`;