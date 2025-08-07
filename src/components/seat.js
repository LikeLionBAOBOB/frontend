import React from 'react';
import styled from 'styled-components';

const Seat = ({ status, onClick }) => {
  const getColor = (status) => {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'occupied': return '#F44336';
      case 'reserved': return '#9E9E9E';
      default: return '#E0E0E0';
    }
  };

  return <SeatBox color={getColor(status)} onClick={onClick} />;
};

export default Seat;

const SeatBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  cursor: pointer;
`;
