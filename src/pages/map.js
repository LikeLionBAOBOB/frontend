import React from "react";
import { useEffect, useRef, useState  } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import HeaderBack from '../components/header_back.js'; // 헤더 컴포넌트
import statusBar from '../assets/images/StatusBar.png';
import searchIcon from '../assets/icons/search.png';
import green from '../assets/icons/green_1.png'
import red from '../assets/icons/red_1.png'
import yellow from '../assets/icons/yellow_1.png'
import green_2 from '../assets/icons/green_2.png'
import red_2 from '../assets/icons/red_2.png'
import yellow_2 from '../assets/icons/yellow_2.png'
import greenm from '../assets/icons/green_marker.png'
import redm from '../assets/icons/red_marker.png'
import yellowm from '../assets/icons/yellow_marker.png'
import goIcon from '../assets/icons/go.png';
import clockIcon from '../assets/icons/clock.png';


const API_BASE = process.env.REACT_APP_API_BASE || 'https://baobob.pythonanywhere.com';


function formatLibraryName(name) {
    return name
        .replace("소금나루", "소금나루\n")   
        .replace("이진아", "이진아\n")
        .replace("메타버스", "메타버스\n") 
        .replace("어린이", "어린이\n");   
}

const MapPage = () => {
    const navigate = useNavigate();
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const [selectedLib, setSelectedLib] = useState(null);

    const resolveImageUrl = (path) =>
        !path ? null : path.startsWith("http") ? path : `${API_BASE}${path}`;

    useEffect(() => {
        const initMap = () => {
            if (!window.naver || !window.naver.maps || !mapDivRef.current) return;

            const center = new window.naver.maps.LatLng(37.559285765296, 126.94568079431);

            mapRef.current = new window.naver.maps.Map(mapDivRef.current, {
            center,
            zoom: 12,
            zoomControl: false,
            mapDataControl: false,
            });

            const libraries = [
            { id: "111514", name: "마포소금나루도서관", lat: 37.5495159, lng: 126.9462201 },
            { id: "111252", name: "홍은도담도서관", lat: 37.6017769, lng: 126.9489945 },
            { id: "111051", name: "서대문구립이진아기념도서관", lat: 37.5730502, lng: 126.9555345 },
            { id: "111257", name: "해오름작은도서관", lat: 37.5557827, lng: 126.9424619 },
            { id: "111467", name: "마포중앙도서관", lat: 37.5637955, lng: 126.9082019 },
            { id: "711596", name: "마포나루메타버스도서관", lat: 37.5373236, lng: 126.9442549 },
            { id: "111086", name: "마포서강도서관", lat: 37.5477444, lng: 126.93206 },
            { id: "111179", name: "남가좌새롬어린이도서관", lat: 37.5783377, lng: 126.9240475 },
            ];

            const SPECIAL_LIB_IDS = new Set([
                "111514",
                "111051",
                "711596",
                "111179",
            ]);

            const getIconByLevel = (level) => ({ 1: green, 2: yellow, 3: red }[level]);
            const levelLabel = { 1: "여유", 2: "보통", 3: "혼잡" };
            const toTag = (level) => {
            if (level === 1) return { tag: "여유", tagColor: "#33A14B" };
            if (level === 2) return { tag: "보통", tagColor: "#FFB724" };
            if (level === 3) return { tag: "혼잡", tagColor: "#FF474D" };
            return { tag: "", tagColor: "#C6C6C6" };
            };

            libraries.forEach((p) => {
            // 기본값 보통
            let level = 2;

            // 조건 분기
            if (p.id === "111051" || p.id === "711596") {
                level = 1; // 여유
            } else if (p.id === "111179" || p.id === "111257") {
                level = 3; // 혼잡
            }

            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(p.lat, p.lng),
                map: mapRef.current,
                icon: {
                url: getIconByLevel(level),
                size: new window.naver.maps.Size(32, 32),
                origin: new window.naver.maps.Point(0, 0),
                anchor: new window.naver.maps.Point(16, 32),
                },
                title: p.name,
            });

            // 마커 클릭 시 카드 열기
            window.naver.maps.Event.addListener(marker, "click", async () => {
                mapRef.current.panTo(new window.naver.maps.LatLng(p.lat, p.lng));

                try {
                    const res = await fetch(`${API_BASE}/libraries/${p.id}/simple/`);
                    const detail = await res.json();

                    const imageUrl = resolveImageUrl(detail.image);
                    const newLevel =
                        detail.congestion === "여유" ? 1 :
                        detail.congestion === "혼잡" ? 3 : 2;
                    const { tag, tagColor } = toTag(newLevel);

                    setSelectedLib({
                        id: p.id,
                        libraryName: detail.name,
                        displayName: formatLibraryName(detail.name),
                        imageUrl,
                        currentSeats: detail.current_seats,
                        totalSeats: detail.total_seats,
                        libCongestion: detail.congestion,
                        operatingTime: detail.operating_time,
                        isOpen: detail.is_open,
                        tag,
                        tagColor,
                        level: newLevel,
                        isSpecial: SPECIAL_LIB_IDS.has(p.id),
                    });
                } catch (e) {
                    console.error("API 불러오기 실패:", e);
                    const { tag, tagColor } = toTag(level);
                    setSelectedLib({
                        id: p.id,
                        libraryName: p.name,
                        displayName: formatLibraryName(p.name),
                        imageUrl: null,
                        currentSeats: 0,
                        totalSeats: 0,
                        libCongestion: levelLabel[level],
                        operatingTime: "",
                        isOpen: "정보 없음",
                        tag,
                        tagColor,
                        level,
                        isSpecial: SPECIAL_LIB_IDS.has(p.id),
                    });
                }
            });


            // 지도 빈 곳 클릭 시 카드 닫기
            window.naver.maps.Event.addListener(mapRef.current, "click", () => {
            setSelectedLib(null);
            });
        });
        };

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
            <StatusBarImg src={statusBar} alt="상태바"/>
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
                                <LegendIcon src={greenm} alt="여유" />
                                <span>여유</span>
                            </LegendRow>
                            <LegendRow>
                                <LegendIcon src={yellowm} alt="보통" />
                                <span>보통</span>
                            </LegendRow>
                            <LegendRow>
                                <LegendIcon src={redm} alt="혼잡" />
                                <span>혼잡</span>
                            </LegendRow>
                        </Legend>
                        {/* 하단 정보 카드 */}
                        {selectedLib && (
                            <BottomCard
                                $tall={!!selectedLib.isSpecial}
                                onClick={() => navigate(`/detaillib/${selectedLib.id}`)}
                            >
                                {/* 썸네일 */}
                                <Thumb
                                src={selectedLib.imageUrl}
                                alt={selectedLib.libraryName}
                                $tall={!!selectedLib.isSpecial}
                                />
                                <CardMain $tall={!!selectedLib.isSpecial}>
                                    <HeaderRow>
                                        <Name style={{ whiteSpace: "pre-line" }} $tall={!!selectedLib.isSpecial} >
                                            {selectedLib.displayName}
                                        </Name>
                                        <RightInline>
                                        <Tag style={{ backgroundColor: selectedLib.tagColor }}>
                                            {selectedLib.tag}
                                        </Tag>
                                        <GoIconImg src={goIcon} alt="정보이동아이콘" />
                                        </RightInline>
                                    </HeaderRow>

                                    <Detail>
                                        <SeatsInfo>
                                            <SeatsNum>
                                                {selectedLib.currentSeats}/{selectedLib.totalSeats}
                                            </SeatsNum>
                                            <Info>(현재 좌석 수 / 전체 좌석 수)</Info>
                                        </SeatsInfo>
                                        <OpenTime>
                                            <ClockIcon src={clockIcon} alt="시계아이콘" />
                                            {selectedLib.isOpen || ""}
                                            {selectedLib.operatingTime ? ` ${selectedLib.operatingTime}` : ""}
                                        </OpenTime>
                                    </Detail>
                                </CardMain>
                            </BottomCard>
                            )}
                        {/*지도 */}
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
const StatusBarImg = styled.img`
    width: 393px;
    height: 59px;
`
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
//하단 상세정보 간략 카드
const BottomCard = styled.div`
    width: 353px;
    height: ${({ $tall }) => ($tall ? '150px' : '122px')};
    position: absolute;
    margin: 0px 20px 44px 20px;
    bottom: 16px;
    z-index: 20;
    display: flex;
    gap: 12px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.20);
    align-items: center;
`;
const Thumb = styled.img`
    width: 100px; 
    height: ${({ $tall }) => ($tall ? '150px' : '122px')};
    border-radius: 10px 0 0 10px;
    object-fit: cover;
    flex-shrink: 0;
`;
const CardMain = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${({ $tall }) => ($tall ? '16px 16px 17px 8px' : '16px 16px 17px 16px')};
    flex: 1;
    gap: 12px;
`;
const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const RightInline = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;
const Name = styled.h3`
    color: #383838;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-weight: 700;
    line-height: 150%;
    margin: 0;
`;
const Tag = styled.div`
    display: flex;
    padding: 4px 16px;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #FFF;
    border-radius: 20px;
`;
const GoIconImg = styled.img`
    width: 24px;
    height: 24px;
`;
const Detail = styled.div`
    display: flex;
    flex-direction: column;
    gap: 9px;
`;
const SeatsInfo = styled.div`
    display: flex;
    flex-direction: column;
`;
const SeatsNum = styled.span`
    color: #0f0f0f;
    font-family: "Pretendard GOV Variable";
    font-size: 14px;
    font-weight: 600;
    line-height: 140%;
`;
const Info = styled.div`
    color: #8e8e8e;
    font-family: "Pretendard GOV Variable";
    font-size: 8px;
    font-weight: 300;
    line-height: 140%;
`;
const OpenTime = styled.div`
    color: #555;
    font-family: "Pretendard GOV Variable";
    font-size: 10px;
    font-weight: 400;
    line-height: 150%;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
`;
const ClockIcon = styled.img`
    width: 16px;
    height: 16px;
`;