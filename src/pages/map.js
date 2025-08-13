//일반모드 홈화면 
import React from "react";
import { useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import HeaderBack from '../components/header_back.js'; // 헤더 컴포넌트
import statusBar from '../assets/images/StatusBar.png';
import searchIcon from '../assets/icons/search.png';
import green from '../assets/icons/green_marker.png'
import red from '../assets/icons/red_marker.png'
import yellow from '../assets/icons/yellow_marker.png'


const API_BASE = process.env.REACT_APP_API_BASE || 'https://baobob.pythonanywhere.com';

const MapPage = () => {
    const navigate = useNavigate(); 
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
    const initMap = () => {
        if (!window.naver || !window.naver.maps || !mapDivRef.current) return;

        // 현재 위치
        const center = new window.naver.maps.LatLng(37.559285765296, 126.94568079431);

        mapRef.current = new window.naver.maps.Map(mapDivRef.current, {
            center,
            zoom: 12,
            zoomControl: false,
            mapDataControl: false,
        });

        // 마커
        const libraries = [
            { id:"111514", name:"마포소금나루도서관", lat:37.5495159, lng:126.9462201, congestion:"보통", congestion_level:2 },
            { id:"111252", name:"홍은도담도서관",   lat:37.6017769, lng:126.9489945, congestion:"보통", congestion_level:2 },
            { id:"111051", name:"서대문구립이진아기념도서관", lat:37.5730502, lng:126.9555345, congestion:"보통", congestion_level:2 },
            { id:"111257", name:"해오름작은도서관", lat:37.5557827, lng:126.9424619, congestion:"보통", congestion_level:2 },
            { id:"111467", name:"마포중앙도서관",   lat:37.5637955, lng:126.9082019, congestion:"보통", congestion_level:2 },
            { id:"711596", name:"마포나루메타버스도서관", lat:37.5373236, lng:126.9442549, congestion:"보통", congestion_level:2 },
            { id:"111086", name:"마포서강도서관",   lat:37.5477444, lng:126.93206,   congestion:"보통", congestion_level:2 },
            { id:"111179", name:"남가좌새롬어린이도서관", lat:37.5783377, lng:126.9240475, congestion:"보통", congestion_level:2 },
        ];

        // id(도서관)별로 혼잡도 레벨 지정 (여유: 1, 보통: 2, 혼잡: 3) -> 임시
        const FIXED_CONGESTION = {
            "111514": 2, // 마포소금나루도서관
            "111252": 1, // 홍은도담도서관   
            "111051": 3, // 서대문구립이진아기념도서관 
            "111257": 2, // 해오름작은도서관
            "111467": 1, // 마포중앙도서관
            "711596": 2, // 마포나루메타버스도서관
            "111086": 3, // 마포서강도서관
            "111179": 2, // 남가좌새롬어린이도서관
        };

        const getIconByLevel = (level) => ({
            1: green,   // 여유
            2: yellow,  // 보통
            3: red,     // 혼잡
        }[level]);

        libraries.forEach((p) => {
            const fixedLevel = FIXED_CONGESTION[p.id] ?? p.congestion_level;

            new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(p.lat, p.lng),
                map: mapRef.current,
                icon: {
                url: getIconByLevel(fixedLevel),          
                size: new window.naver.maps.Size(32, 32),
                origin: new window.naver.maps.Point(0, 0),
                anchor: new window.naver.maps.Point(16, 32),
                },
                title: p.name,
            });
        });
    }
        if (window.naver && window.naver.maps) {
        initMap();
        } else {

        window.naver = window.naver || {};
        window.naver.maps = window.naver.maps || {};
        const prev = window.naver.maps.onJSContentLoaded;
        window.naver.maps.onJSContentLoaded = function () {
            if (typeof prev === "function") prev();
            initMap();
        };
        }

        const handleResize = () => {
        if (mapRef.current) {
            window.naver.maps.Event.trigger(mapRef.current, "resize");
        }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return(
        <Wrapper>
            <img src={statusBar} alt="상태바"/>
            <Header>
                <HeaderBack/>
                <TitleText>도서관 찾기</TitleText>
                <SubText>주변의 공공도서관을 확인할 수 있어요.</SubText>
            </Header>
            <Container>
                <Main>
                    <MapArea>
                        <SearchRow>
                            <SearchBox onClick={() => navigate("/search")}>
                                <SearchInput 
                                    placeholder="공공도서관 이름, 지역 검색"
                                    readOnly 
                                />
                                <Icon src={searchIcon} alt="검색아이콘" />
                            </SearchBox>
                        </SearchRow>
                        <Legend>
                            <LegendRow>
                                <LegendIcon src={green} alt="여유" />
                                <span>여유</span>
                            </LegendRow>
                            <LegendRow>
                                <LegendIcon src={yellow} alt="보통" />
                                <span>보통</span>
                            </LegendRow>
                            <LegendRow>
                                <LegendIcon src={red} alt="혼잡" />
                                <span>혼잡</span>
                            </LegendRow>
                        </Legend>
                        <MapCanvas ref={mapDivRef} />
                    </MapArea>
                </Main>
            </Container>
        </Wrapper>


    );
};

export default MapPage;

//styled-components 스타일 정의

//상단 헤더 부분
//상단바 
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
    flex: 1;        
    min-height: 0;
`;
const Header = styled.header`
    width: 393px;   
    height: 147px;
`;

//텍스트
const TitleText = styled.h1`
    text-align: center;
    font-family: "Pretendard GOV Variable";
    font-size: 24px;
    font-weight: 600;
    line-height: 150%; 
    padding: 20px 0px 0px 0px;
    margin: 0px;
    margin-bottom: 4px;
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

//메인 부분 (지도, 검색창)
const Main = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
`;
const MapArea = styled.div`
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
`;
const MapCanvas = styled.div`
    width: 100%;
    height: 100%;
    border-top: 1px solid #eee;
`;
const SearchRow = styled.div`
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
`;
const SearchBox = styled.div`
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 321px;
    height: 24px;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #C6C6C6;
    background: #FFF;
    margin: 12px 19.5px 0px 20.5px;
`;
const SearchInput = styled.input`
    color: #1D1D1D;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.5px;
    border: none;
    outline: none;
    &::placeholder {
        color: #8E8E8E;
    }
`;
const Icon = styled.img`
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
`;
//지도 왼쪽 상단에 텍스트 추가
const Legend = styled.div`
    position: absolute;
    top: 64px;         
    left: 12px;
    z-index: 12;
    padding: 20px 10px;
    font-size: 12px;
    color: #555;
    font-weight: 500;
    line-height: 150%;
    pointer-events: none;  
    align-items: center;
    justify-content: center;
`;

const LegendRow = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 4px 0;
`;

const LegendIcon = styled.img`
    width: 20px;
    height: 20px;
    display: block;
    border-radius: 50%;
`;
