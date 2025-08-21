import React from "react";
import styled from "styled-components";

const TABLE_W = 49.678;
const TABLE_H = 114.074;
const SEAT = 20;
const GAP_TABLE_SEAT = 13;
const SEAT_GAP = 24;
const CIRCLE = 60;
const GAP_CIRCLE_SEAT = 11;

const CANVAS_W = 353;
const CANVAS_H = 439;

const SeatTable = ({ seats = [], selectedSeatId, onSeatClick }) => {
  const get = id => seats.find(s => s.id === id) || { id, status:"free" };
  const Seat = (s) => (
    <SeatDot
      key={s.id}
      $status={s.status}
      $selected={selectedSeatId===s.id}
      onClick={() => onSeatClick?.(s.id, s.status)}
    />
  );

  const cx = CANVAS_W / 2;
  const cy = CANVAS_H / 2;

  const topY = 53 + TABLE_W / 2;
  const botY = CANVAS_H - (53 + TABLE_W / 2);

  const leftX  = CANVAS_W * 0.28;
  const rightX = CANVAS_W * 0.72;

  return (
    <Stage style={{ width: CANVAS_W, height: CANVAS_H }}>
      {/* 상단 좌측 바: 좌석 1,2 (바 아래) */}
      <RectTable style={{ left:leftX,  top:topY }} />
      <SeatRow style={{ left:leftX,  top: topY + (TABLE_W/2 + GAP_TABLE_SEAT) }}>
        {Seat(get(1))}<Spacer style={{ width: SEAT_GAP }} />{Seat(get(2))}
      </SeatRow>

      {/* 상단 우측 바: 좌석 3,4 (바 아래) */}
      <RectTable style={{ left:rightX, top:topY }} />
      <SeatRow style={{ left:rightX, top: topY + (TABLE_W/2 + GAP_TABLE_SEAT) }}>
        {Seat(get(3))}<Spacer style={{ width: SEAT_GAP }} />{Seat(get(4))}
      </SeatRow>

      {/* 하단 좌측 바: 좌석 5,6 (바 위) */}
      <RectTable style={{ left:leftX,  top:botY }} />
      <SeatRow style={{ left:leftX,  top: botY - (TABLE_W/2 + GAP_TABLE_SEAT) }}>
        {Seat(get(5))}<Spacer style={{ width: SEAT_GAP }} />{Seat(get(6))}
      </SeatRow>

      {/* 하단 우측 바: 좌석 7,8 (바 위) */}
      <RectTable style={{ left:rightX, top:botY }} />
      <SeatRow style={{ left:rightX, top: botY - (TABLE_W/2 + GAP_TABLE_SEAT) }}>
        {Seat(get(7))}<Spacer style={{ width: SEAT_GAP }} />{Seat(get(8))}
      </SeatRow>

      {/* 원형: 좌(9), 우(10) */}
      <Circle style={{ left:cx, top:cy }} />
      <SeatRow style={{ left: cx - (CIRCLE/2 + GAP_CIRCLE_SEAT + SEAT/2), top: cy }}>
        {Seat(get(9))}
      </SeatRow>
      <SeatRow style={{ left: cx + (CIRCLE/2 + GAP_CIRCLE_SEAT + SEAT/2), top: cy }}>
        {Seat(get(10))}
      </SeatRow>
    </Stage>
  );
};

export default SeatTable;

const Stage = styled.div`
  position: relative;
`;

const RectTable = styled.div`
  position: absolute;
  transform: translate(-50%, -50%) rotate(90deg);
  width: ${TABLE_W}px;
  height: ${TABLE_H}px;
  background: var(--border, #C6C6C6);
  border-radius: 0;
`;

const SeatRow = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex; align-items: center;
`;

const Spacer = styled.div``;

const SeatDot = styled.button`
  width: ${SEAT}px; height: ${SEAT}px;
  transform: rotate(90deg);
  border: none; border-radius: 0;

  background: #FFFFFF;
  border: 1px solid #cfcfcf;

  ${p => p.$status==="occupied" && `background:#A8A8A8;`}
  ${p => p.$status==="hogged_30" && `background:rgba(239,62,94,.25);`}
  ${p => p.$status==="hogged_60" && `background:rgba(239,62,94,1);`}

  cursor: ${p => p.$status==="hogged_60" ? "pointer" : "default"};
  box-shadow: ${p => p.$selected ? "0 0 0 2px rgba(239,62,94,.32)" : "none"};
`;

const Circle = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  width: ${CIRCLE}px; height: ${CIRCLE}px;
  background: #C6C6C6; border-radius: 50%;
`;
