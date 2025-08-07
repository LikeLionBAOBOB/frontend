import React from 'react';
import styled from 'styled-components';
import Seat from './seat';

const SeatTable = ({ onSeatClick }) => {
  const seatLayout = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];

  const seatStatus = {
    1: 'available',
    2: 'reserved',
    3: 'occupied',
    4: 'available',
    5: 'reserved',
    6: 'occupied',
  };

  return (
    <TableWrapper>
      {seatLayout.map((row, i) => (
        <Row key={i}>
          {row.map((id) => (
            <Seat key={id} status={seatStatus[id]} onClick={() => onSeatClick(id)} />
          ))}
        </Row>
      ))}
    </TableWrapper>
  );
};

export default SeatTable;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;
