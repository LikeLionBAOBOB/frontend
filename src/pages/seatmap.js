import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/header_star';
import SeatTable from '../components/seattable';

const SeatMapPage = () => {
  const [log, setLog] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatClick = (seatId) => {
    if (selectedSeat === seatId) {
      setLog('');
      setSelectedSeat(null);
    } else {
      setLog(`좌석 ${seatId}은 14:20에 사석화 되었고, 15:10에 점유되었습니다.`);
      setSelectedSeat(seatId);
    }
  };

  return (
    <PageWrapper>
      <Header />
      <LibraryInfo>
        <h2>남가좌새롬도서관</h2>
        <p>서울 서대문구 증가로10길 16-15</p>
      </LibraryInfo>
      <TabBar>
        <Tab active>좌석 정보</Tab>
        <Tab>도서관 정보</Tab>
      </TabBar>
      <StatusBar>
        <StatusText>
          <span>6 / 12</span>
          <StatusBadge>보통</StatusBadge>
        </StatusText>
        <Legend>
          <LegendItem color="#4CAF50">이용 가능한 좌석</LegendItem>
          <LegendItem color="#F44336">이용 중인 좌석</LegendItem>
        </Legend>
      </StatusBar>
      <SeatMapArea>
        <SeatTable onSeatClick={handleSeatClick} />
      </SeatMapArea>
      {log && <LogBox>{log}</LogBox>}
    </PageWrapper>
  );
};

export default SeatMapPage;

// --- styled-components (아래는 그대로)
const PageWrapper = styled.div`
  background-color: #ffffff;
  padding: 0;
  margin: 0 auto;
  width: 393px;
`;

const LibraryInfo = styled.div`
  text-align: center;
  padding: 12px;
  h2 {
    margin: 0;
    font-size: 18px;
    color: #1D1D1D;
  }
  p {
    margin: 4px 0 0 0;
    font-size: 12px;
    color: #666666;
  }
`;

const TabBar = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.div`
  padding: 10px;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  border-bottom: ${({ active }) => (active ? '2px solid #000' : 'none')};
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  align-items: center;
`;

const StatusText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span`
  background-color: #ffeb3b;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
`;

const Legend = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
`;

const LegendItem = styled.span`
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: ${(props) => props.color};
    border-radius: 50%;
    margin-right: 6px;
  }
`;

const SeatMapArea = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
`;

const LogBox = styled.div`
  padding: 12px;
  margin: 0 16px 16px;
  font-size: 14px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #ccc;
`;
