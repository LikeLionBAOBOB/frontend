import React from "react";
import TablesMap, {
  SEAT_SIZE,
  SEAT_GAP,
  SEAT_OFFSET,
  seatsAboveBelowBar,
} from "./common";

// 테이블 모양만 정의
const topBar  =  { type: "bar",  x: 70,  y: 48,  w: 200, h: 28 };
const midRect = { type: "rect", x: 150, y: 120, w: 60,  h: 140 };
const botBar  =  { type: "bar",  x: 96,  y: 290, w: 160, h: 28 };
const shapes = [topBar, midRect, botBar];

// 의자(수동 배치)
const topRowChairs = seatsAboveBelowBar(topBar, {
  countTop: 0, countBottom: 5, seatSize: SEAT_SIZE, offset: SEAT_OFFSET, spacing: SEAT_GAP,
});
const lineYs = [140, 165, 195, 225];
const leftX  = midRect.x - SEAT_OFFSET - SEAT_SIZE;
const rightX = midRect.x + midRect.w + SEAT_OFFSET;
const midLeftChairs  = lineYs.map((y) => ({ x: leftX,  y, w: SEAT_SIZE, h: SEAT_SIZE }));
const midRightChairs = lineYs.map((y) => ({ x: rightX, y, w: SEAT_SIZE, h: SEAT_SIZE }));
const bottomRowChairs = seatsAboveBelowBar(botBar, {
  countTop: 2, countBottom: 0, seatSize: SEAT_SIZE, offset: 6, spacing: SEAT_GAP,
});
const chairs = [...topRowChairs, ...midLeftChairs, ...midRightChairs, ...bottomRowChairs];

const Map111252 = ({ available, total, seatStates }) => {
  const computedTotal = total || chairs.length;
  return (
    <TablesMap
      shapes={shapes}
      chairs={chairs}
      available={available}
      total={computedTotal}
      seatStates={seatStates}
    />
  );
};

export default Map111252;
