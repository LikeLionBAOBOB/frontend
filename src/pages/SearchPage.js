//도서관 검색 화면 
import React, { useState } from "react";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import HeaderBack from '../components/header_back.js'; // 헤더 컴포넌트
import homebackground from '../assets/images/home_background.png';
import statusBar from '../assets/images/StatusBar.png';
import searchIcon from '../assets/icons/search.png';


const SearchPage = () => {
    //검색 기능 구현
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);

    const accessToken = localStorage.getItem('accessToken');

    const handleSearch = async() => {
        if (!keyword.trim()) return; //검색어 없을 경우 리턴x
        
        try {
            const response = await fetch('/admin_panel/myLibrary/info/', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response.ok) throw new Error('API 요청 실패');

            const data = await response.json();
            
            // 혼잡도에 따라 tag, tagColor 결정
            let tag = '';
            let tagColor = '';

            if (data.congestion === '여유') {
            tag = '여유';
            tagColor = '#33A14B'; 
            } else if (data.congestion === '보통') {
            tag = '보통';
            tagColor = '#FFB724'; 
            } else if (data.congestion === '혼잡') {
            tag = '혼잡';
            tagColor = '#FF474D'; 
            }

            const transformedData = {
                libraryName: data.name,
                imageUrl: '/images/library_example.jpg', // 명세서에 아직 없음 
                currentSeats: data.current_seats,
                totalSeats: data.total_seats,
                libCongestion: data.congestion,
                openTime: data.open_time,
                closeTime: data.close_time,
                isOpen: data.is_open,
                tag: tag,
                tagColor: tagColor
            };

            setResults([transformedData]);
        } catch (error) {
            console.error("도서관 정보 조회 실패:", error);
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
                    <GuideText>공공도서관의 이름이나 지역을 검색해보세요!</GuideText>
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
    color: #8E8E8E;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.5px;
    border: none;
    outline: none;
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
const Icon = styled.img`
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
`;