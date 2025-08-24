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
                    <MainText>문의 및 신고</MainText>
                    <SubText>보다 나은 도서관 문화를 함께 만들어주세요</SubText>
                </Main>
                <Descrip>
                        <Card>
                            <CardTitle>신고하기</CardTitle>
                            <CardSub>서비스 오류 및 개선 요청은 아래 이메일로 신고해주세요.</CardSub>
                            <CardLink>report@yeolramdeul.com</CardLink>
                        </Card>
                        <Card>
                            <CardTitle>문의하기</CardTitle>
                            <CardSub>AI 모델 도입 및 제휴 문의는 아래 이메일로 연락주세요.</CardSub>
                            <CardLink>contact@yeolramdeul.com</CardLink>
                        </Card>
                </Descrip>
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
const MainText = styled.h3`
    color: #1D1D1D;
    text-align: center;
    font-family: "Pretendard GOV Variable";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;  
    padding: 20px 135px 8px 135px;
    margin: 0px;
`;
const SubText = styled.h3`
    color:  #555;
    text-align: center;
    font-family: "Pretendard GOV Variable";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%; 
    padding: 0px 95px 24px 94px;
    margin:0px;
`;

//하단
const Descrip = styled.div`
    width: 393px;
    height: 646px;
    flex-shrink: 0;
    background: #F0F0F0;
`;
//카드
const Card = styled.div`
    width: 353px;
    height: 109px;
    flex-shrink: 0;
    border-radius: 15px;
    background: #FFF;
    margin: 20px 20px 12px 20px;
`;
const CardTitle = styled.div`
    color: #0F0F0F;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    padding: 18px 0px 0px 25px;

`;
const CardSub = styled.div`
    color: #555;
    font-family: "Pretendard GOV Variable";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%; 
    padding: 16px 61px 8px 25px;
`;
const CardLink = styled.div`
    color: #8E8E8E;
    font-family: "Pretendard GOV Variable";
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    line-height: 125%;
    padding: 0px 0px 20px 25px;
`;
