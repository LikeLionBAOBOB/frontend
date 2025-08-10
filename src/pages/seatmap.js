
import React, { useState, useCallback } from "react";
import styled from "styled-components";
import HeaderBackHero from "../components/header_ad";
import SeatTable from "../components/seattable";

const SEATS = [
  { id: 1, status: "free" }, { id: 2, status: "free" },
  { id: 3, status: "free" }, { id: 4, status: "free" },
  { id: 5, status: "free" }, { id: 6, status: "free" },
  { id: 7, status: "free" }, { id: 8, status: "free" },
  { id:12, status: "free" }, { id:13, status: "hogged_60" },
];

/* 로그 목데이터 */
const LOGS = {
  13: [
    { time: "14:00", text: "사석화가 시작되었습니다.", ended: true },
    { time: "14:10", text: "사석화가 진행중입니다.", ended: true },
    { time: "14:20", text: "사석화가 진행중입니다.", ended: true },
    { time: "14:30", text: "사석화가 진행중입니다.", ended: true },
    { time: "14:40", text: "사석화가 진행중입니다.", ended: true },
    { time: "15:00", text: "사석화가 진행중입니다.", ended: false },
    { time: "15:10", text: "사석화가 60분 경과했습니다.", over60: true },
  ],
};

const SeatMapPage = () => {
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const usingCount = 3, totalCount = 10;

  const onSeatClick = useCallback((id, status) => {
    if (status !== "hogged_60") return;
    setSelectedSeatId(prev => (prev === id ? null : id));
  }, []);

  const logs = selectedSeatId ? (LOGS[selectedSeatId] || []) : [];

  return (
    <Page>
      <HeaderBackHero
        title="해오름 작은도서관"
        address="서울 마포구 신촌로26길 10 우리마을작은집 2층"
      />

      <Main>
        <SectionTitle>실시간 좌석 관리</SectionTitle>

        <TopRow>
          <Left>
            <Line>
              <Count>{usingCount} / {totalCount}</Count>
              <Badge>여유</Badge>
            </Line>
            <Sub>(현재 좌석 수 / 전체 좌석 수)</Sub>
          </Left>

          <Right>
            <LegendItem><span>이용 가능한 좌석</span><Dot $t="free" /></LegendItem>
            <LegendItem><span>이용 중인 좌석</span><Dot $t="occ" /></LegendItem>
            <LegendItem><span>1시간 이상 사석화된 좌석</span><Dot $t="hog" /></LegendItem>
          </Right>
        </TopRow>

        <Board>
          <SeatTable seats={SEATS} selectedSeatId={selectedSeatId} onSeatClick={onSeatClick} />
        </Board>

        {/* ▼ 좌석 배치도 아래 로그 패널 (내용 길이에 맞게 자동 높이) */}
        {selectedSeatId && (
          <LogCard>
            <LogTitle>{selectedSeatId}번 좌석 로그</LogTitle>
            <LogList>
              {logs.map((r, i) => (
                <LogRow key={i} $ended={r.ended} $over60={r.over60}>
                  <time>{r.time}</time>
                  <span>{r.text}</span>
                </LogRow>
              ))}
            </LogList>
          </LogCard>
        )}
      </Main>
    </Page>
  );
};

export default SeatMapPage;

/* styles */
const Page = styled.div` width:393px; margin:0 auto; `;
const Main = styled.div` padding: 0 12px 16px; `;
const SectionTitle = styled.h3`
  margin: 5px 4px 8px;
  font-size: 18px; font-weight: 700;
`;
const TopRow = styled.div`
  display:flex; justify-content:space-between; gap:12px; padding:0 4px;
`;
const Left = styled.div``;
const Line = styled.div` display:flex; align-items:center; gap:8px; `;
const Count = styled.span` font-size:18px; `;
const Badge = styled.span`
  border-radius:20px; background:#33A14B; color:#fff; font-size:12px; padding:4px 10px;
`;
const Sub = styled.div` font-size:11px; color:#919191; margin-top:4px; `;

const Right = styled.div`
  display:flex; flex-direction:column; align-items:flex-end; gap:6px;
`;
const LegendItem = styled.div`
  display:flex; align-items:center; gap:6px;
  font-size:12px; color:#666;
`;
const Dot = styled.span`
  width:10px; height:10px; border-radius:50%;
  border:1px solid var(--text-disabled,#8E8E8E);
  background: ${p => p.$t==="free" ? "var(--bg-1,#F8F8F8)"
                    : p.$t==="occ" ? "var(--border,#C6C6C6)"
                    : "var(--red-soft, rgba(239,62,94,.5))"};
`;


const Board = styled.div`
  margin-top: 28px;
  width: 353px;
  height: 439px;
  box-sizing: border-box;           
  border-radius: 15px;
  border: 1px solid var(--Disabled, #E4E4E4);
  background: var(--Background-1, #F8F8F8);
  display:flex; justify-content:center; align-items:center;
  margin-left:auto; margin-right:auto;
`;


const LogCard = styled.div`
  margin: 12px auto 0;
  width: 353px;
  box-sizing: border-box;            
  background: #FFE3E6;               
  border: 1px solid #FFD6DB;
  border-radius: 15px;
  padding: 20px 20px 24px;            
`;
const LogTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
`;
const LogList = styled.div`
  display: grid;
  gap: 6px;                         
`;
const LogRow = styled.div`
  display: flex; gap: 10px; align-items: baseline;
  line-height: 1.45;                 
  opacity: ${p => (p.$ended ? .45 : 1)};           
  color: ${p => (p.$over60 ? "#C41E3A" : "#333")}; 
  time { width: 44px; font-variant-numeric: tabular-nums; }
`;
