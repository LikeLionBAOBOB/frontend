import React from "react";
import TablesMap, { seatsAboveBelowBar, seatsAroundCircle } from "./common";

// 바
const BAR = { type: "bar", x: 40, y: 96, w: 240, h: 36 };
const BAR_SEATS = seatsAboveBelowBar(
  { x: BAR.x, y: BAR.y, w: BAR.w, h: BAR.h },
  { countTop: 7, countBottom: 7, seatSize: 12, offset: 8, spacing: 12 }
);

// 원형 3개
const C1 = { type: "round", cx: 96,  cy: 220, r: 28 };
const C2 = { type: "round", cx: 168, cy: 220, r: 28 };
const C3 = { type: "round", cx: 240, cy: 220, r: 28 };
const CIRCLE_SEATS = [
  ...seatsAroundCircle({ cx: C1.cx, cy: C1.cy, r: C1.r }, { countTop: 1, countBottom: 1, seatSize: 12, gap: 16, offset: 8 }),
  ...seatsAroundCircle({ cx: C2.cx, cy: C2.cy, r: C2.r }, { countTop: 1, countBottom: 1, seatSize: 12, gap: 16, offset: 8 }),
  ...seatsAroundCircle({ cx: C3.cx, cy: C3.cy, r: C3.r }, { countTop: 1, countBottom: 1, seatSize: 12, gap: 16, offset: 8 }),
];

const shapes = [BAR, C1, C2, C3];
const chairs = [...BAR_SEATS, ...CIRCLE_SEATS];

const Map111514 = ({ available, total, seatStates }) => {
  const _total = total || chairs.length;
  return <TablesMap shapes={shapes} chairs={chairs} available={available} total={_total} seatStates={seatStates} />;
};

export default Map111514;
