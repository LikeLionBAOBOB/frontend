// src/components/seatmaps/Map111252.jsx
import React from "react";
import TablesMap from "./common";

const tables = [
  { x: 24, y: 24, w: 140, h: 80, seats: 6 },
  { x: 200, y: 30, w: 140, h: 90, seats: 8 },
  { x: 24, y: 140, w: 120, h: 80, seats: 4 },
  { x: 210, y: 160, w: 110, h: 70, seats: 4 },
];

const Map111252 = ({ available, total }) => {
  return <TablesMap tables={tables} available={available} total={total} />;
};

export default Map111252;
