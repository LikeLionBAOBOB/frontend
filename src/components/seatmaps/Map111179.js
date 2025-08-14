// src/components/seatmaps/Map111179.js
import React from "react";
import TablesMap, { STAGE_W, STAGE_H } from "./common"; // ← default + named 같이 사용 가능(필요시)

const tables = [
  { x: 48,  y: 32,  w: 70,  h: 110, seats: 4 }, // 위-왼쪽
  { x: 200, y: 104, w: 70,  h: 110, seats: 4 }, // 가운데-오른쪽
  { x: 48,  y: 196, w: 70,  h: 110, seats: 4 }, // 아래-왼쪽
];

const Map111179 = ({ available, total }) => {
  return <TablesMap tables={tables} available={available} total={total} />;
};

export default Map111179;
