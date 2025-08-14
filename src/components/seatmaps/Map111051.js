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

const Map111051 = ({ available, total, occupied }) => {
  // ✅ 정규화: TablesMap은 available=“이용 가능 좌석 수”를 기대함.
  // 만약 available prop이 "이용 중 좌석 수(occupied)"로 들어온다면 total - occupied로 환산.
  // 1) occupied prop이 있으면 그 값을 사용
  // 2) occupied prop이 없고, available을 occupied로 넘겨온 상황이면 total - available로 보정
  let free = available;
  if (typeof occupied === "number" && typeof total === "number") {
    free = Math.max(total - occupied, 0);
  } else if (typeof available === "number" && typeof total === "number") {
    // heuristics: 상위에서 available을 occupied로 넘긴 경우 보정
    free = Math.max(total - available, 0);
  }

  return <TablesMap tables={tables} available={free} total={total} />;
};

export default Map111051;
