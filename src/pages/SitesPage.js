//도서관 바로가기 화면  
import React from "react";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import HeaderBack from '../components/header_back.js'; // 헤더 컴포넌트
import statusBar from '../assets/images/StatusBar.png';
import mapoIcon from '../assets/images/mapo_logo.png';
import seodaemunIcon from '../assets/images/seodaemun_logo.png';
import nationalIcon from '../assets/images/national_logo.png';
import goIcon from '../assets/icons/go.png';

const SitesPage = () => {
    return(
        <Wrapper>
            <img src={statusBar} alt="상태바"/>
            <Header>
                <HeaderBack/>
                <TitleText>사이트 바로가기</TitleText>
                <SubText>공식 도서관 사이트 모음입니다.</SubText>
            </Header>
            <Container>
                <Main>
                    <CardLink href="https://mplib.mapo.go.kr/intro/index.do" target="_blank">
                        <Card>
                            <Logo src={mapoIcon} alt="마포구립도서관 로고" />
                            <Info>
                                <LibName>
                                    <Name>마포구립도서관</Name>
                                    <GoBtn src={goIcon} alt="바로가기아이콘"/>
                                </LibName>
                                <Desc>마포구에서 운영하는 구립도서관 정보를 ㅤ한데 모아 제공하는 통합 사이트입니다.</Desc>
                                <LinkText>https://mplib.mapo.go.kr/intro/index.do</LinkText>
                            </Info>
                        </Card>
                    </CardLink>

                    <CardLink href="https://lib.sdm.or.kr/sdmlib/index.do" target="_blank">
                        <Card>
                            <Logo src={seodaemunIcon} alt="서대문구립도서관 로고" />
                            <Info>
                                <LibName>
                                    <Name>서대문구립도서관</Name>
                                    <GoBtn src={goIcon} alt="바로가기아이콘"/>
                                </LibName>
                                <Desc>서대문구에서 운영하는 구립도서관 정보를 한데 모아 제공하는 통합 사이트입니다.</Desc>
                                <LinkText>https://lib.sdm.or.kr/sdmlib/index.do</LinkText>
                            </Info>
                        </Card>
                    </CardLink>

                    <CardLink href="https://books.nl.go.kr/PU/main/index.do" target="_blank">
                        <Card>
                            <Logo src={nationalIcon}alt="국립중앙도서관 로고" />
                            <Info>
                                <LibName>
                                    <Name>국립중앙도서관</Name>
                                    <GoBtn src={goIcon} alt="바로가기아이콘"/>
                                </LibName>
                                <Desc>한국 도서관의 중심 기관으로, 다양한 자료와 서비스를 제공합니다.</Desc>
                                <LinkText>https://books.nl.go.kr/PU/main/index.do</LinkText>
                            </Info>
                        </Card>
                    </CardLink>
                </Main>
            </Container>
        </Wrapper>

    );
};

export default SitesPage;

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
const Header = styled.header`
    width: 393px;   
    height: 147px;
    margin-bottom: 28px;
`;

//텍스트
const TitleText = styled.h1`
    text-align: center;
    font-family: "Pretendard GOV Variable";
    font-size: 24px;
    font-weight: 600;
    line-height: 150%; 
    padding: 20px 0px 0px 0px;
    margin-bottom: 4px;
    margin-top: 0px;
    justify-content: center;
    align-items: center;
`;
const SubText = styled.p`
    color: #555;
    text-align: center;
    font-family: "Pretendard GOV Variable";
    font-size: 12px;
    font-weight: 400;
    line-height: 125%;
    margin: 0px;
    justify-content: center;
    align-items: center;
`;

//메인 부분
const Main = styled.div`
    background-color: #F0F0F0; 
    width: 393px;
    height: 646px;
    gap: 12px;
    align-items: center;
    padding-top: 20px;
`;
const Card = styled.div`
    display: flex;
    width: 353px;
    height: 120px;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    margin-left: 20px;
`;

const Logo = styled.img`
    width: 100px;
    height: 120px;
`;

const Info = styled.div`
    margin: 18px 22px 16px 16px;
`;
const LibName = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const GoBtn = styled.img`
    width: 24px;
    height: 24px;

`;
const Name = styled.h3`
    color: #0F0F0F;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-weight: 700;
    margin: 0px;
    padding-bottom: 16px;
`;

const Desc = styled.p`
    color: #555;
    font-family: "Pretendard GOV Variable";
    font-size: 12px;
    font-weight: 400;
    line-height: 125%; 
    padding: 0px;
    margin: 0px;
    padding-bottom: 8px;
`;

const LinkText = styled.div`
    color: #8E8E8E;
    font-family: "Pretendard GOV Variable";
    font-size: 10px;
    font-weight: 300;
    line-height: 125%;
`;
const CardLink = styled.a`
    text-decoration: none;
    color: inherit;
    display: block;
`;