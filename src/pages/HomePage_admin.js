//일반모드 홈화면 
import React, { useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import homelogoIcon from '../assets/icons/home_logo.png';
import homebackground from '../assets/images/home_background.png';
import statusBar from '../assets/images/StatusBar.png';
import hamburgerIcon from '../assets/icons/hamburger.png';
import profileimageIcon from '../assets/icons/proimg.png';
import leftIcon from '../assets/icons/left.png';
import bookIcon from '../assets/icons/book.png';
import returnIcon from '../assets/icons/return.png';

const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
`;
const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
`;

const HomePageAdmin = () => {
  const [openLeft, setOpenLeft] = useState(false);
  const [openRight, setOpenRight] = useState(false);


  const closeAll = () => { setOpenLeft(false); setOpenRight(false); };

  return (
    <Wrapper>
      <img src={statusBar} alt="상태바" />
      <Header>
        <Nickname onClick={() => { setOpenLeft(true); setOpenRight(false); }}>
          <Profileimg src={profileimageIcon} alt="프로필이미지" />
          <Name>닉네임</Name>
        </Nickname>


        <img
          src={hamburgerIcon}
          alt="햄버거로고"
          onClick={() => { setOpenRight(true); setOpenLeft(false); }}
          style={{ cursor: 'pointer' }}
        />
      </Header>

      <Container>
        <Main>

          <LogoImage src={homelogoIcon} alt="홈로고" />
          <LogoText>열람:뜰</LogoText>
          <SubText>공공도서관 좌석 확인 · 관리 서비스</SubText>


          <ButtonsContainer>
            <ActionButton>
              <Left>
                <Icon src={bookIcon} alt="책아이콘" />
                <BtnText>좌석 관리</BtnText>
              </Left>
              <ArrowIcon src={leftIcon} alt="우화살표" />
            </ActionButton>
          </ButtonsContainer>
        </Main>
      </Container>


      {openLeft && (
        <Overlay onClick={closeAll}>
          <DrawerLeft onClick={(e) => e.stopPropagation()}>
            <img src={statusBar} alt="상태바" />
            <DrawerHeaderLeft>
              <BackBtn onClick={closeAll}>
                <img src={returnIcon} alt="뒤로가기" />
              </BackBtn>
            </DrawerHeaderLeft>


            <DrawerNicknameLeft>
              <Profileimg src={profileimageIcon} alt="프로필이미지" />
              <Name>닉네임</Name>
            </DrawerNicknameLeft>


            <LogoutLeft>로그아웃</LogoutLeft>
          </DrawerLeft>
        </Overlay>
      )}


      {openRight && (
        <Overlay onClick={closeAll}>
          <DrawerRight onClick={(e) => e.stopPropagation()}>
            <img src={statusBar} alt="상태바" />
            <DrawerHeaderRight>
              <BackBtn onClick={closeAll}>
                <img src={returnIcon} alt="닫기" />
              </BackBtn>
            </DrawerHeaderRight>


            <MenuList>
              <MenuItemButton
                type="button"
                onClick={() => { /* navigate('/admin-seat') or window.location.href=... */ }}
              >
                좌석 관리 사이트 바로가기
              </MenuItemButton>

              <MenuItemButton
                type="button"
                onClick={() => { /* navigate('/about') or open modal */ }}
              >
                서비스 소개 / 문의
              </MenuItemButton>
            </MenuList>
          </DrawerRight>
        </Overlay>
      )}
    </Wrapper>
  );
};

export default HomePageAdmin;

// ===== styled-components =====

// 헤더
const Header = styled.header`
  width: 353px;
  height: 44px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Nickname = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;
const Name = styled.span`
  color: #383838;
  font-family: "Pretendard GOV Variable";
  font-size: 14px;
  font-weight: 400;
  line-height: 125%;
`;
const Profileimg = styled.img`
  padding: 4px;
`;

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
  margin-top: 0px;
  margin-bottom: 0px;
`;
const SubText = styled.p`
  color: #555;
  text-align: center;
  font-family: "Pretendard GOV Variable";
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 400px 20px 156px 20px;
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
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0px 16px 23px;
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


const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between; 
  align-items: stretch;
  z-index: 999;
`;


const DrawerLeft = styled.aside`
  width: 294px;
  height: 100%;
  background: rgba(255,255,255,0.8);
  display: flex;
  flex-direction: column;
  animation: ${slideInLeft} 0.25s ease forwards;
  transform: translateX(0);
  padding-left: 12px;
`;
const DrawerHeaderLeft = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  padding: 4px 0 4px 8px; 
`;
const DrawerNicknameLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 0 8px 8px; 
`;
const LogoutLeft = styled.span`
  color: #0F0F0F;
  font-family: "Pretendard GOV Variable";
  font-size: 20px;
  font-weight: 600;
  padding: 12px 0 0 8px; 
`;

const BackBtn = styled.button`
  width: 36px;
  height: 36px;
  cursor: pointer;
  background: transparent;
  border: none;
`;

const DrawerRight = styled.aside`
  width: 294px;
  height: 100%;
  margin-left: auto;          
  background: rgba(255,255,255,0.8);
  display: flex;
  flex-direction: column;
  animation: ${slideInRight} 0.25s ease forwards;
  transform: translateX(0);
`;
const DrawerHeaderRight = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 20px 4px 0px; 
`;


const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  gap: 8px;
`;
const MenuItemButton = styled.button`
  width: 100%;
  height: 48px;
  text-align: left;                
  padding: 0 12px;
  border-radius: 12px;
  background: rgba(255,255,255,0.6);
  box-shadow: 0 3px 6px rgba(0,0,0,.08);
  backdrop-filter: blur(8px);
  border: none;
  font-family: "Pretendard GOV Variable";
  font-weight: 600;
  font-size: 16px;
  color: #0F0F0F;
  cursor: pointer;
`;
