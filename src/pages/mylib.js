
import React, { useMemo } from "react";
import styled from "styled-components";

import StatusBar from "../assets/icons/StatusBar.png";
import HeaderBack from "../components/header_back";

import arrowRight from "../assets/icons/arrow_rightup.png";
import clockIcon from "../assets/icons/clock.png";

// MOCKDATA
const MOCKDATA = [
  { name: "마포나루 스페이스", image: "/media/libraries/도서관코드.png", current_seats: 118, total_seats: 133, congestion: "혼잡", is_open: "운영 중", operating_time: "09:00-18:00" },
  { name: "마포중앙도서관",   image: "/media/libraries/도서관코드.png", current_seats: 95,  total_seats: 180, congestion: "보통", is_open: "운영 중", operating_time: "09:00-22:00" },
  { name: "해오름 작은 도서관", image: "/media/libraries/도서관코드.png", current_seats: 6,   total_seats: 21,  congestion: "여유", is_open: "운영 중", operating_time: "09:00-22:00" },
];

const PILL_COLOR = {
  혼잡: { bg: "#FF474D", color: "#fff" },
  보통: { bg: "#FFB724", color: "#222" },
  여유: { bg: "#33A14B", color: "#fff" },
};

const MyLibraries = () => {
  const libraries = useMemo(() => MOCKDATA, []);

  return (
    <Outer>
      <PhoneFrame>
        <StatusImg src={StatusBar} alt="상태바" />
        <HeaderBack />

        <TitleBox>
          <H1>나의 도서관</H1>
          <Subtitle>내가 즐겨찾기한 도서관을 모아볼 수 있어요.</Subtitle>
        </TitleBox>

        <BeigeBand />

        <ListWrap>
          {libraries.map((lib) => (
            <Card key={lib.name}>

              <Thumb style={{ backgroundImage: `url(${lib.image})` }} />

              <Info>
                <TopLine>
                  <LibName>{lib.name}</LibName>
                  <Pill $level={lib.congestion}>{lib.congestion}</Pill>
                  <Arrow src={arrowRight} alt="자세히" />
                </TopLine>

                <Seats>
                  <strong>{lib.current_seats}</strong> / {lib.total_seats}
                </Seats>

                <MetaRow>
                  <MetaIcon src={clockIcon} alt="" />
                  <Meta>운영중 {lib.operating_time}</Meta>
                </MetaRow>
              </Info>
            </Card>
          ))}
        </ListWrap>
      </PhoneFrame>
    </Outer>
  );
};

export default MyLibraries;



const Outer = styled.div`
  min-height: 100dvh;
  background: #fff;
  display: flex;
  justify-content: center;
`;


const PhoneFrame = styled.div`
  width: 393px;
  height: 852px;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;              
  box-sizing: border-box;          
`;

const StatusImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;


const TitleBox = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const H1 = styled.h1`
  color: #222;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 6px 0;
`;
const Subtitle = styled.p`
  color: #777;
  font-size: 12px;
  margin: 0;
`;

const BeigeBand = styled.div`
  width: 100%;
  height: 12px;
  background: #efefef;
  margin-top: 28px;                
`;


const ListWrap = styled.div`
  width: 100%;
  background: #efefef;
  padding: 12px 20px 24px 20px;    
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
`;


const Card = styled.div`
  width: 100%;
  height: 122px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  display: grid;
  grid-template-columns: 100px 1fr;       
  column-gap: 12px;
  overflow: hidden;                      
`;


const Thumb = styled.div`
  width: 100px;                            
  height: 122px;                           
  flex-shrink: 0;                          
  background: #ddd center/cover no-repeat;
`;


const Info = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 8px 10px 0;               
  min-width: 0;                             
  gap: 6px;
  box-sizing: border-box;
`;


const TopLine = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 24px;    
  align-items: center;
  column-gap: 8px;
`;


const LibName = styled.div`
  color: var(--Tect--Lighter, #383838);
  font-family: "Pretendard GOV Variable", system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 24px */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;                             
`;

const Pill = styled.span`
  display: flex;
  width: 48px;                              
  padding: 4px 16px;                        
  justify-content: center;                  
  align-items: center;                   
  gap: 10px;                                
  border-radius: 20px;                     
  box-sizing: border-box;                   
  background: ${({ $level }) => PILL_COLOR[$level]?.bg || "#ccc"};
  color: ${({ $level }) => PILL_COLOR[$level]?.color || "#222"};
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  white-space: nowrap;
`;

const Arrow = styled.img`
  width: 24px; height: 24px; aspect-ratio: 1 / 1;
  object-fit: contain;
  justify-self: end;
`;


const Seats = styled.div`
  font-size: 14px;
  color: #111;
  strong { font-weight: 800; }
`;
const MetaRow = styled.div`
  display: flex; align-items: center; gap: 6px;
`;
const MetaIcon = styled.img`
  width: 12px; height: 12px; object-fit: contain; display: block;
`;
const Meta = styled.div`
  font-size: 12px; color: #666; line-height: 1;
`;
