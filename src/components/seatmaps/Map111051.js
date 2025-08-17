// src/components/seatmaps/Map111051.js
import React from "react";
import TablesMap from "./common";

const tables = [
  { x: 64,  y: 64,  w: 58, h: 52, seats: 4 },
  { x: 206, y: 64,  w: 58, h: 52, seats: 4 },
  { x: 64,  y: 140, w: 58, h: 52, seats: 4 },
  { x: 206, y: 140, w: 58, h: 52, seats: 4 },
  { x: 64,  y: 216, w: 58, h: 52, seats: 4 },
  { x: 206, y: 216, w: 58, h: 52, seats: 4 },
];

const Map111051 = ({ available, total, occupied, seatStates }) => {
  // seatStates가 오면 그 값을 우선 사용하므로 free 보정은 그대로 유지
  let free = available;
  if (typeof occupied === "number" && typeof total === "number") {
    free = Math.max(total - occupied, 0);
  } else if (typeof available === "number" && typeof total === "number") {
    free = Math.max(total - available, 0);
  }
  return <TablesMap tables={tables} available={free} total={total} seatStates={seatStates} />;
};

export default Map111051;
