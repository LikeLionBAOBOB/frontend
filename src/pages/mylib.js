// src/pages/mylib.js
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
              {/* 왼쪽 썸네일: 100x122 고정 */}
              <Thumb style={{ backgroundImage: `url(${lib.image})` }} />

              {/* 우측 정보 */}
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

/* =============== styled-components =============== */

/* 배경 흰색, 중앙 정렬 */
const Outer = styled.div`
  min-height: 100dvh;
  background: #fff;
  display: flex;
  justify-content: center;
`;

/* 프레임 393x852, 가로 오버플로우 차단 */
const PhoneFrame = styled.div`
  width: 393px;
  height: 852px;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;              /* ✅ 가로 스크롤 방지 */
  box-sizing: border-box;          /* 내부 폭 계산 안정화 */
`;

const StatusImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

/* 타이틀 */
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

/* 타이틀 아래 미색 바(문장↔바 간격 28px) */
const BeigeBand = styled.div`
  width: 100%;
  height: 12px;
  background: #efefef;
  margin-top: 28px;                /* ✅ */
`;

/* 리스트 컨테이너: 좌우 20px(시안) */
const ListWrap = styled.div`
  width: 100%;
  background: #efefef;
  padding: 12px 20px 24px 20px;    /* ✅ 양쪽 20px */
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
`;

/* 카드: 컨테이너 안에서 100% = 353px, 높이 122 */
const Card = styled.div`
  width: 100%;
  height: 122px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  display: grid;
  grid-template-columns: 100px 1fr;      /* ✅ 썸네일 100px + 내용 */
  column-gap: 12px;
  overflow: hidden;                       /* 라운드 안 벗어나게 */
`;

/* 왼쪽 이미지 */
const Thumb = styled.div`
  width: 100px;                            /* ✅ */
  height: 122px;                           /* ✅ */
  flex-shrink: 0;                          /* ✅ */
  background: #ddd center/cover no-repeat;
`;

/* 내용 */
const Info = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 8px 10px 0;                /* 우측 여백만 살짝 */
  min-width: 0;                             /* 텍스트 줄바꿈 제어 */
  gap: 6px;
  box-sizing: border-box;
`;

/* 상단 한 줄: 이름 - Pill - 화살표 */
const TopLine = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 24px;    /* 이름 · Pill · 화살표 */
  align-items: center;
  column-gap: 8px;
`;

/* 도서관 이름 타이포 */
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
  min-width: 0;                             /* ✅ grid 내 축약 허용 */
`;

/* 혼잡/보통/여유 Pill — 지시값 그대로 + border-box로 총폭 48px 유지 */
const Pill = styled.span`
  display: flex;
  width: 48px;                              /* ✅ */
  padding: 4px 16px;                        /* ✅ */
  justify-content: center;                  /* ✅ */
  align-items: center;                      /* ✅ */
  gap: 10px;                                /* ✅ */
  border-radius: 20px;                      /* ✅ */
  box-sizing: border-box;                   /* ✅ 총폭 48px 유지 */
  background: ${({ $level }) => PILL_COLOR[$level]?.bg || "#ccc"};
  color: ${({ $level }) => PILL_COLOR[$level]?.color || "#222"};
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  white-space: nowrap;
`;

/* 화살표 24x24 */
const Arrow = styled.img`
  width: 24px; height: 24px; aspect-ratio: 1 / 1;
  object-fit: contain;
  justify-self: end;
`;

/* 좌석/운영 텍스트 */
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
