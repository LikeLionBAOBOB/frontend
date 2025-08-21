import React, { useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from '../components/header_home_admin.js'; // 헤더 컴포넌트
import homelogoIcon from '../assets/icons/home_logo.png';
import homebackground from '../assets/images/home_background.png';
import statusBar from '../assets/images/StatusBar.png';
import leftIcon from '../assets/icons/left.png';
import bookIcon from '../assets/icons/book.png';


const HomePageAdmin = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <StatusBarImg src={statusBar} alt="상태바" />
      <HeaderAdmin/>
      <Container>
        <Main>
          <LogoImage src={homelogoIcon} alt="홈로고" />
          <LogoText>열람:뜰</LogoText>
          <SubText>공공도서관 좌석 확인 · 관리 서비스</SubText>
          <ButtonsContainer>
            <ActionButton onClick={() => navigate("/admin-seat")}>
              <LeftCol>
                <TitleRow>
                  <Icon src={bookIcon} alt="책아이콘" />
                  <BtnText>좌석 관리</BtnText>
                </TitleRow>
                <WorkLib>해오름 작은도서관</WorkLib>
              </LeftCol>
              
              <ArrowIcon src={leftIcon} alt="우화살표" />
            </ActionButton>
          </ButtonsContainer>
        </Main>
      </Container>
    </Wrapper>
  );
};

export default HomePageAdmin;


const Wrapper = styled.div`
  width: 100%;
  height: 852px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
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
const StatusBarImg = styled.img`
  width: 393px;
  height: 59px;
  object-fit: cover;
  image-rendering: crisp-edges;
`
const LogoImage = styled.img`
  width: 60px;
  height: 31px;
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
  height: 81px;
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
const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0px 16px 23px;
  align-items: flex-start;
  gap: 7px;
`;
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; 
`;
const BtnText = styled.div`
  color: var(--Tect--Lighter, #383838);
  font-family: "Pretendard GOV Variable";
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
`;
const WorkLib = styled.p`
  color: var(--Tect--Lighter, #383838);
  font-size: 14px;
  font-weight: 400;
  margin: 0px;
  margin-left: 36px;   
`;
const ArrowIcon = styled.img`
  flex-shrink: 0;
  margin: 10px 16px 35px 0px;
`;
const Icon = styled.img`
  margin-top: 2px;
  width: 24px;
  height: 24px;
`;


