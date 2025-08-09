//일반모드 홈화면 
import React from "react";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import HeaderProfile from '../components/header_profile.js'; //프로필있는 헤더 컴포넌트 
import homelogoIcon from '../assets/icons/home_logo.png';
import homebackground from '../assets/images/home_background.png';
import statusBar from '../assets/images/StatusBar.png';


const HomePageAdmin = () => {
    return(
        <Wrapper>
            <img src={statusBar} alt="상태바"/>
            <HeaderProfile/>
            <Container>
                <Main>
                    {/* 상단 */}
                    <LogoImage src={homelogoIcon} alt="홈로고"/>
                    <LogoText>열람:뜰</LogoText>
                    <SubText>공공도서관 좌석 확인 · 관리 서비스</SubText>
                </Main>
            </Container>
        </Wrapper>

    );
};

export default HomePageAdmin;

//styled-components 스타일 정의
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
    background-size: 393px 793px;;
`;
//메인 부분
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
