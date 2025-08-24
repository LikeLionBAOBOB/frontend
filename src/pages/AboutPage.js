import React  from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderBack from '../components/header_back.js'; // 헤더 컴포넌트
import statusBar from '../assets/images/StatusBar.png';
import introimg from '../assets/images/intro.png';
import lineimg from '../assets/images/line.png';

const AboutPage = () => {
    return(
        <Wrapper>
            <StatusBarImg src={statusBar} alt="상태바"/>
            <HeaderBack/>
            <Container>
                <Main>
                    <MainText>열람:뜰</MainText>
                    <SubText>공정하고 편리한 도서관 이용을 위한 한걸음</SubText>
                    <IntroImg src={introimg}/>
                </Main>
                <Descriptions>
                    {/* Feature 1 */}
                    <FeatureLabel>Key feature 1</FeatureLabel>
                    <FeatureHeader>
                        <FeatureTitle>실시간 좌석 확인</FeatureTitle>
                        <LoginBadge>일반 로그인</LoginBadge>
                    </FeatureHeader>
                    <Callout>
                        좌석 없을까 걱정하지 말고, 확인하고 출발하세요!
                    </Callout>
                    <FeatureBody>
                        혼잡도 지도와 도서관별 좌석 현황을 실시간으로 확인할 수 <br />있어
                        이용자의 헛걸음을 줄이고, 빈자리에 대한 불안 없이 <br />도서관을
                        이용할 수 있습니다.
                    </FeatureBody>

                    <Line src={lineimg} />

                    {/* Feature 2 */}
                    <FeatureLabel>Key feature 2</FeatureLabel>
                    <FeatureHeader>
                        <FeatureTitle>실시간 좌석 관리</FeatureTitle>
                        <LoginBadge $muted>사서 로그인</LoginBadge>
                    </FeatureHeader>
                    <Callout>
                        모두를 위한 공정한 좌석 관리, AI가 시작합니다.
                    </Callout>
                    <FeatureBody>
                        AI가 CCTV 영상의 장시간 비워진 사석화 좌석을 자동으로 <br />
                        감지해 도서관 이용자에게는 공정한 좌석 이용 기회를, <br />사서에게는 수기
                        순찰 없이도 효율적이고 정확한 사석화 <br />로그를 제공합니다.
                    </FeatureBody>

                </Descriptions>
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
    letter-spacing: 0.96px;
    padding: 20px 160px 8px 160px;
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
    padding: 0px 95px 28px 94px;
    margin:0px;
`;
const IntroImg = styled.img`
    width: 393px;
    height: 196px;
`;

//하단 설명
const Descriptions = styled.section`
    display: flex;
    flex-direction: column;
    padding: 24px 20px 60px 20px;
`;

const FeatureLabel = styled.span`
    color: #FB9028;
    font-family: "Pretendard Variable";
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const FeatureHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
`;

const FeatureTitle = styled.h4`
    color: #383838;
    font-family: "Pretendard GOV Variable";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; 
    margin: 0px;
`;

const LoginBadge = styled.span`
    padding: 6px 10px;
    color: #8E8E8E;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: -25px;
`;

const Callout = styled.div`
    margin-top: 16px;
    margin-bottom: 16px;
    padding: 16px 33px 16px 33px;
    border: 1.5px solid #FFD0A2;
    background: #FFF7F0;
    backdrop-filter: blur(7.5px);
    color: #555;
    border-radius: 25px;
    font-family: "Pretendard Variable";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const FeatureBody = styled.p`
    width: 353px;
    color: #5F5F5F;
    font-family: "Pretendard Variable";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; 
    margin: 0px;
`;

const Line = styled.img`
    width: 353px;
    height: 1px;
    margin-top: 32px;
    margin-bottom: 24px;
`;
