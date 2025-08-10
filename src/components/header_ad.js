import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import backIcon from "../assets/icons/back.png";
import hamburgerIcon from "../assets/icons/hamburger.png";
import logoIcon from "../assets/icons/logo.png";
import bgImage from "../assets/images/해오름_배경.png";
import bottomShadow from "../assets/icons/frame_shadow.png";

const HeaderBackHero = ({ title, address }) => {
  const navigate = useNavigate();
  return (
    <Wrap>
      <Bg src={bgImage} alt="hero" />

      <ShadowWrap>
        <ShadowPng src={bottomShadow} alt="" />
        <ShadowGrad />
      </ShadowWrap>

      <IconBar>
        <IconBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img src={backIcon} alt="back" />
        </IconBtn>
        <Logo onClick={() => navigate("/")}>
          <img src={logoIcon} alt="logo" />
        </Logo>
        <IconBtn aria-label="메뉴">
          <img src={hamburgerIcon} alt="menu" />
        </IconBtn>
      </IconBar>

      <TitleBox>
        <h1>{title}</h1>
        <p>{address}</p>
      </TitleBox>
    </Wrap>
  );
};

export default HeaderBackHero;

/* styles */
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
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.96) 58%, #fff 100%);
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
  all: unset; cursor: pointer;
  img { width: 24px; height: 24px; display:block; }
`;
const Logo = styled.div`
  img { height: 24px; display:block; cursor: pointer; }
`;

const TitleBox = styled.div`
  position: absolute;
  top: 127px;
  left: 0; right: 0;
  text-align: center;

  h1 { margin:0; font-size:20px; font-weight:700; }
  p  { margin:4px 0 0; font-size:12px; color:#7a7a7a; }
`;
