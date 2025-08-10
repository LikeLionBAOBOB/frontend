//도서관 검색 화면 
import React, { useState } from "react";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import HeaderBack from '../components/header_back.js'; // 헤더 컴포넌트
import homebackground from '../assets/images/home_background.png';
import statusBar from '../assets/images/StatusBar.png';
import searchIcon from '../assets/icons/search.png';
import goIcon from '../assets/icons/go.png';
import clockIcon from '../assets/icons/clock.png';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000';

const SearchPage = () => {
    //검색 기능 구현
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false); //검색 시도 여부 

    const accessToken = localStorage.getItem('accessToken');

    const handleSearch = async() => {
        if (!keyword.trim()){ //검색어 비어있는 경우
            setSearched(true);
            setResults([]);
            return; //api 호출 없이 함수 종료 
        }  

        //검색어 비어있지 않은 경우
        setSearched(true); 
        
        try {
            const url = `${API_BASE}/libraries/search?search_word=${encodeURIComponent(keyword)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
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
                return {
                    libraryName: it.name,
                    imageUrl: '/images/library_example.jpg', // 임시
                    currentSeats: it.current_seats,
                    totalSeats: it.total_seats,
                    libCongestion: it.congestion,
                    openTime: it.open_time,
                    closeTime: it.close_time,
                    isOpen: it.is_open,
                    tag,
                    tagColor,
                };
            });

            setResults(mapped);
        } catch (error) {
            console.error("도서관 정보 조회 실패:", error);
            setResults([]);
        }
    };

    return(
        <Wrapper>
            <img src={statusBar} alt="상태바"/>
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
                    {!searched && ( // 아직 검색 시도 전 -> 가이드 문구 표시
                    <GuideText>공공도서관의 이름이나 지역을 검색해보세요!</GuideText>
                    )}
                    {searched && results.length === 0 && ( // 검색했는데 결과가 없는 경우
                    <EmptyText>검색 결과가 존재하지 않습니다.</EmptyText>
                    )}
                    {results.length > 0 && ( // 검색 결과 있는 경우
                        // 결과 리스트 렌더링 (results 배열의 원소를 순회하며 ResyltsCard로 렌더링)
                        <ResultsList>
                            {results.map((item, idx) => (
                                <ResultCard key={idx}>
                                    {/* 도서관 사진 썸네일 */}
                                    <img src={item.imageUrl} alt={item.libraryName} />

                                    {/* 상단 (이름,혼잡도,아이콘) */}
                                    <Name>{item.libraryName}</Name>
                                    <Tag style={{ backgroundColor: item.tagColor }}>
                                        {item.tag}
                                    </Tag>
                                    <GoIcon src={goIcon} alt="정보이동아이콘"/>

                                    {/* 도서관 정보 */}
                                    <Detail>
                                        <SeatsInfo>
                                            <SeatsNum>{item.currentSeats}/{item.totalSeats}</SeatsNum>
                                            <Info>(현재 좌석 수 / 전체 좌석 수)</Info>
                                        </SeatsInfo>
                                        <OpenTime>
                                            운영중 {item.openTime}~{item.closeTime}
                                            <ClockIcon src={clockIcon} alt="시계아이콘"/>
                                        </OpenTime>
                                    </Detail>
                                </ResultCard>
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
const ResultCard = styled.div`
    width: 353px;
    height: 122px;
    border-radius: 10px;
    border: 1px solid #C6C6C6;
    background: #FFF;
`;
const Name = styled.h3`
    color:  #383838;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-weight: 700;
    line-height: 150%; 
    margin: 0px;
`;
const Tag = styled.div`
    display: flex;
    width: 48px;
    padding: 4px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;
const GoIcon = styled.img`
    width: 24px;
    height: 24px;
`;
const Detail = styled.div`
    display: flex;
    flex-direction: column;
`;
const SeatsInfo = styled.div`
    display: flex;
    flex-direction: column;
`;
const SeatsNum = styled.span`
    color: #0F0F0F; 
    font-family: "Pretendard GOV Variable";
    font-size: 14px;
    font-weight: 600;
    line-height: 140%; 
`;
const Info = styled.div`
    color: #8E8E8E;
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
`;
const ClockIcon = styled.img`
    width: 16px;
    height: 16px;
`;
