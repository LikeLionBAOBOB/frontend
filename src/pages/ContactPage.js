import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import HeaderBack from '../components/header_back.js'; // 헤더 컴포넌트
import statusBar from '../assets/images/StatusBar.png';

const AboutPage = () => {
    return(
        <Wrapper>
            <StatusBarImg src={statusBar} alt="상태바"/>
            <HeaderBack/>
            <Container>
                <Main>
                    <GuideText>추후 제공 예정인 서비스입니다.</GuideText>
                </Main>
            </Container>
        </Wrapper>
    );
};

export default AboutPage;

//styled-components 스타일 정의

//상단 헤더 부분
//상단바 
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
`;
const StatusBarImg = styled.img`
  width: 393px;
  height: 59px;
`
//메인
const Main = styled.div`
    display: flex;
    flex-direction: column;
`;
const GuideText = styled.h3`
    margin: 0px;
    color: #8E8E8E;
    font-family: "Pretendard GOV Variable";
    font-size: 15px;
    font-weight: 400;
    line-height: 125%;
    padding: 120px 56px 549px 56px;
    margin-left: 47px;
`;