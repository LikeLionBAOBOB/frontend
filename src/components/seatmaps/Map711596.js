// src/components/seatmaps/Map711596.jsx
import React from "react";
import TablesMap from "./common";

const tables = [
  { x: 24, y: 24, w: 120, h: 80, seats: 6 },
  { x: 170, y: 20, w: 160, h: 90, seats: 8 },
  { x: 40, y: 140, w: 140, h: 90, seats: 6 },
];

const Map711596 = ({ available, total }) => {
  return <TablesMap tables={tables} available={available} total={total} />;
};

export default Map711596;
