//도서관 검색 화면 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import HeaderBack from '../components/header_back.js'; // 헤더 컴포넌트
import homebackground from '../assets/images/home_background.png';
import statusBar from '../assets/images/StatusBar.png';
import searchIcon from '../assets/icons/search.png';
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


const SearchPage = () => {
    //검색 기능 구현
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false); //검색 시도 여부 
    const [loading, setLoading] = useState(false);

    const accessToken = localStorage.getItem('access_token');

    const LIBRARY_ID_MAP = {
        "마포소금나루도서관": "111514",
        "홍은도담도서관": "111252",
        "서대문구립이진아기념도서관": "111051",
        "해오름작은도서관": "111257",
        "마포중앙도서관": "111467",
        "마포나루메타버스도서관": "711596",
        "마포서강도서관": "111086",
        "남가좌새롬어린이도서관": "111179",
    };

    // 카드 디자인 따로 지정해 줄 도서관들
        const SPECIAL_LIB_IDS = new Set([
            "111514", // 마포소금나루도서관 
            "111051", // 서대문구립이진아기념도서관 
            "711596", // 마포나루메타버스도서관
            "111179", // 남가좌새롬어린이도서관 
        ]);


    const handleSearch = async() => {
        if (!keyword.trim()){ //검색어 비어있는 경우
            setSearched(true);
            setResults([]);
            return; //api 호출 없이 함수 종료 
        }  

        //검색어 비어있지 않은 경우
        setSearched(true); 
        setLoading(true);
        try {
            const url = `${API_BASE}/libraries/search/?q=${encodeURIComponent(keyword)}`;

            const headers = {};
                if (accessToken) {
                    headers['Authorization'] = `Bearer ${accessToken}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (response.status === 400) {
                const err = await response.json().catch(() => ({}));
                console.warn(err?.message || '요청 오류');
                setResults([]);
                return;
            }

            if (response.status == 404){
                setResults([]);
                return;
            }
            if (!response.ok) throw new Error('API 요청 실패'); // 그 외 오류 

            const data = await response.json(); // 상태 체크 위에서 한 후, API 응답을 JSON으로 변환하여 data에 담기
            const list = Array.isArray(data?.results) ? data.results : [];
            
            // 혼잡도에 따라 tag, tagColor 결정
            const toTag = (cong) => {
                if (cong === '여유') return { tag: '여유', tagColor: '#33A14B' };
                if (cong === '보통') return { tag: '보통', tagColor: '#FFB724' };
                if (cong === '혼잡') return { tag: '혼잡', tagColor: '#FF474D' };
                return { tag: cong || '', tagColor: '#C6C6C6' };
            };

            const mapped = list.map((it) => {
                const { tag, tagColor } = toTag(it.congestion);
                const mappedId = LIBRARY_ID_MAP[it.name] || it.id;

                return {
                    id: mappedId,
                    rawName: it.name,
                    displayName: formatLibraryName(it.name),
                    imageUrl: it.image ? `${API_BASE}${it.image}` : null,
                    currentSeats: it.current_seats,
                    totalSeats: it.total_seats,
                    libCongestion: it.congestion,
                    operatingTime: it.operating_time,
                    isOpen: it.is_open,
                    tag,
                    tagColor,
                    isSpecial: SPECIAL_LIB_IDS.has(mappedId),  
                };
            });

            setResults(mapped);
        } catch (error) {
            console.error("도서관 정보 조회 실패:", error);
            setResults([]);
        } finally {
            setLoading(false);   // 로딩 꺼줌
}
    };

    return(
        <Wrapper>
            <StatusBarImg src={statusBar} alt="상태바"/>
            <HeaderBack/>
            <Container>
                <Main>
                    <SearchBox>
                        <SearchInput 
                            type="text" 
                            placeholder="공공도서관 이름, 지역 검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Icon src={searchIcon} alt="검색아이콘" onClick={handleSearch}/>
                    </SearchBox>

                    {loading && <LoadingText>검색 중...</LoadingText>}

                    {!loading && !searched && ( 
                        <GuideText>공공도서관의 이름이나 지역을 검색해보세요!</GuideText>
                    )}

                    {!loading && searched && results.length === 0 && ( 
                        <EmptyText>검색 결과가 존재하지 않습니다.</EmptyText>
                    )}

                    {!loading && results.length > 0 && ( // 검색 결과 있는 경우
                        // 결과 리스트 렌더링 (results 배열의 원소를 순회하며 ResyltsCard로 렌더링)
                        <ResultsList>
                            {results.map((item, idx) => (
                                <BottomCard 
                                key={idx} 
                                onClick={() => navigate(`/detaillib/${item.id}`)}
                                $tall={!!item.isSpecial}>
                                    {/* 썸네일 */}
                                    <Thumb
                                    src={item.imageUrl}
                                    alt={item.libraryName}
                                    $tall={!!item.isSpecial}
                                    />
                                    {/* 상단 (이름,혼잡도,아이콘) */}
                                    <CardMain>
                                        <HeaderRow>
                                            <Name style={{ whiteSpace: "pre-line" }} $tall={!!item.isSpecial}>
                                                {item.displayName}
                                            </Name>
                                            <RightInline>
                                            <Tag style={{ backgroundColor: item.tagColor }}>
                                                {item.tag}
                                            </Tag>
                                            <GoIconImg src={goIcon} alt="정보이동아이콘"/>
                                            </RightInline>
                                        </HeaderRow>

                                        {/* 도서관 정보 */}
                                        <Detail>
                                            <SeatsInfo>
                                                <SeatsNum>
                                                    {item.currentSeats}/{item.totalSeats}
                                                </SeatsNum>
                                                <Info>(현재 좌석 수 / 전체 좌석 수)</Info>
                                            </SeatsInfo>
                                            <OpenTime>
                                                <ClockIcon src={clockIcon} alt="시계아이콘"/>
                                                {item.isOpen || ""}
                                                {item.operatingTime ? ` ${item.operatingTime}` : ""}
                                            </OpenTime>
                                        </Detail>
                                    </CardMain>
                                </BottomCard>
                            ))}
                        </ResultsList>
                    )}
                </Main>
            </Container>
        </Wrapper>
    );
};

export default SearchPage;

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
    overflow-x: hidden;
`;
const Container = styled.div`
    width: 393px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`;

//메인
const Main = styled.div`
    display: flex;
    flex-direction: column;
`;
const SearchBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 321px;
    height: 24px;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #C6C6C6;
    background: #FFF;
    margin: 12px 19.5px 8px 20.5px;
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
const GuideText = styled.h3`
    margin: 0px;
    color: #8E8E8E;
    font-family: "Pretendard GOV Variable";
    font-size: 15px;
    font-weight: 400;
    line-height: 125%;
    padding: 120px 56px 549px 56px;
`;
const EmptyText = styled.h3`
    margin: 0px;
    color: #8E8E8E;
    font-family: "Pretendard GOV Variable";
    font-size: 15px;
    font-weight: 400;
    line-height: 125%;
    padding: 120px 97px 549px 97px;
`;
const LoadingText = styled.h3`
    margin: 0px;
    color: #8E8E8E;
    font-family: "Pretendard GOV Variable";
    font-size: 15px;
    font-weight: 400;
    line-height: 125%;
    padding: 120px 165px 549px 165px;
`;
const Icon = styled.img`
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
`;

//도서관 카드
const ResultsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;
const BottomCard = styled.div`
    width: 353px;
    height: ${({ $tall }) => ($tall ? '150px' : '122px')};
    margin: 12px 20px 0px 20px;
    z-index: 20;
    display: flex;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #C6C6C6;
    align-items: center;
`;
const Thumb = styled.img`
    width: 100px; 
    height: ${({ $tall }) => ($tall ? '150px' : '122px')};
    border-radius: 10px 0px 0px 10px;
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