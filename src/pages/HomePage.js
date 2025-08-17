//일반모드 홈화면 
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { createGlobalStyle } from 'styled-components';
import HeaderProfileHome from '../components/header_home.js'; //프로필있는 헤더 컴포넌트 
import homelogoIcon from '../assets/icons/home_logo.png';
import homebackground from '../assets/images/home_background.png';
import bookIcon from '../assets/icons/book.png';
import starIcon from '../assets/icons/star.png';
import leftIcon from '../assets/icons/left.png';
import statusBar from '../assets/images/StatusBar.png';


const HomePage = () => {
    const navigate = useNavigate();
    return(
        <Wrapper>
            <img src={statusBar} alt="상태바"/>
            <HeaderProfileHome/>
            <Container>
                <Main>
                    {/* 상단 */}
                    <LogoImage src={homelogoIcon} alt="홈로고"/>
                    <LogoText>열람:뜰</LogoText>
                    <SubText>공공도서관 좌석 확인 · 관리 서비스</SubText>
                    {/*하단 버튼 */}
                    <ButtonsContainer>
                        <ActionButton onClick={() => navigate("/map")}>
                            <Left>
                                <Icon src={bookIcon} alt="책아이콘" />
                                <BtnText>도서관 검색</BtnText>
                            </Left>
                            <ArrowIcon src={leftIcon} alt="우화살표" />
                        </ActionButton>

                        <ActionButton onClick={() => navigate("/mylib")}>
                            <Left>
                                <Icon src={starIcon} alt="별아이콘" />
                                <BtnText>나의 도서관</BtnText>
                            </Left>
                            <ArrowIcon src={leftIcon} alt="우화살표" />
                        </ActionButton>
                    </ButtonsContainer>
                </Main>
            </Container>
        </Wrapper>

    );
};

export default HomePage;

//styled-components 스타일 정의
const Wrapper = styled.div`
    width: 100%;
    height: 852px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
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
//하단 버튼 부분
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