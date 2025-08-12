// src/components/seatmaps/Map111467.jsx
import React from "react";
import TablesMap from "./common";

const tables = [
  { x: 16, y: 16, w: 150, h: 90, seats: 8 },
  { x: 200, y: 24, w: 140, h: 90, seats: 8 },
  { x: 24, y: 140, w: 120, h: 80, seats: 6 },
];

const Map111467 = ({ available, total }) => {
  return <TablesMap tables={tables} available={available} total={total} />;
};

export default Map111467;
