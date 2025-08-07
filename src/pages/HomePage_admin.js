//운영자모드 홈화면 
import React from "react";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import homelogoIcon from '../assets/icons/home_logo.png';
import hamburgerIcon from '../assets/icons/hamburger.png';
import profileIcon from '../assets/icons/profile.png';
import homebackground from '../assets/images/home_background.png';
import bookIcon from '../assets/icons/book.png';
import starIcon from '../assets/icons/star.png';
import leftIcon from '../assets/icons/left.png';
import statusBar from '../assets/images/StatusBar.png';

const HomePage = () => {
    return(
        <FullscreenWrapper>
            <img src={statusBar} alt="상태바"/>
            <Header>
                <img src={profileIcon} alt="프로필로고" />
                <img src={hamburgerIcon} alt="햄버거로고" />
            </Header>
            <Main>
                {/* 상단 */}
                <LogoImage src={homelogoIcon} alt="홈로고"/>
                <LogoText>열람:뜰</LogoText>
                <SubText>공공도서관 좌석 확인 · 관리 서비스</SubText>
            </Main>
        </FullscreenWrapper>

    );
};

export default HomePage;

//styled-components 스타일 정의


//상단 헤더 부분
const FullscreenWrapper = styled.div`
    width: 393px;
    height: 793px;
`;
const Header = styled.header`
    width: 353px;   
    height: 44px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
//메인 부분
const Main = styled.div`
    width: 100%;
    height: 749px;
    background-image: url(${homebackground});
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
