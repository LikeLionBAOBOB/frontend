// src/components/seatmaps/Map111086.jsx
import React from "react";
import TablesMap from "./common";

const tables = [
  { x: 16, y: 20, w: 140, h: 90, seats: 8 },
  { x: 190, y: 24, w: 140, h: 90, seats: 8 },
  { x: 16, y: 150, w: 140, h: 90, seats: 6 },
];

const Map111086 = ({ available, total }) => {
  return <TablesMap tables={tables} available={available} total={total} />;
};

export default Map111086;
