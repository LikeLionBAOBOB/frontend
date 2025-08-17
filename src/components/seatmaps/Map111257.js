import React from "react";
import TablesMap, {
  SEAT_SIZE,
  SEAT_GAP,
  SEAT_OFFSET,
  seatsAboveBelowBar,
} from "./common";

// ── 테이블(모양만)
const topLeftBar  = { type: "bar",  x: 56,  y: 60,  w: 110, h: 26 };
const topRightBar = { type: "bar",  x: 194, y: 60,  w: 110, h: 26 };
const centerRound = { type: "round", cx: 170, cy: 160, r: 26 };
const botLeftBar  = { type: "bar",  x: 56,  y: 230, w: 110, h: 26 };
const botRightBar = { type: "bar",  x: 194, y: 230, w: 110, h: 26 };
const shapes = [topLeftBar, topRightBar, centerRound, botLeftBar, botRightBar];

// ── 의자(수동 배치)
const topLeftChairs = seatsAboveBelowBar(topLeftBar,  { countTop: 0, countBottom: 2, seatSize: SEAT_SIZE, offset: SEAT_OFFSET, spacing: SEAT_GAP });
const topRightChairs= seatsAboveBelowBar(topRightBar, { countTop: 0, countBottom: 2, seatSize: SEAT_SIZE, offset: SEAT_OFFSET, spacing: SEAT_GAP });
const botLeftChairs = seatsAboveBelowBar(botLeftBar,  { countTop: 2, countBottom: 0, seatSize: SEAT_SIZE, offset: SEAT_OFFSET, spacing: SEAT_GAP });
const botRightChairs= seatsAboveBelowBar(botRightBar, { countTop: 2, countBottom: 0, seatSize: SEAT_SIZE, offset: SEAT_OFFSET, spacing: SEAT_GAP });

// 원형 좌/우 1개씩
const circleSideChairs = [
  { x: centerRound.cx - centerRound.r - SEAT_OFFSET - SEAT_SIZE, y: centerRound.cy - SEAT_SIZE / 2, w: SEAT_SIZE, h: SEAT_SIZE },
  { x: centerRound.cx + centerRound.r + SEAT_OFFSET,             y: centerRound.cy - SEAT_SIZE / 2, w: SEAT_SIZE, h: SEAT_SIZE },
];

const chairs = [
  ...topLeftChairs, ...topRightChairs,
  ...botLeftChairs, ...botRightChairs,
  ...circleSideChairs,
];

const Map111257 = ({ available, total, seatStates }) => {
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

export default Map111257;
