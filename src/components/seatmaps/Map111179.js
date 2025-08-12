// src/components/seatmaps/Map111179.jsx
import React from "react";
import TablesMap from "./common";

const tables = [
  { x: 16, y: 16, w: 120, h: 80, seats: 6 },
  { x: 160, y: 24, w: 140, h: 90, seats: 8 },
  { x: 24, y: 130, w: 120, h: 80, seats: 4 },
  { x: 190, y: 150, w: 120, h: 80, seats: 4 },
];

const Map111179 = ({ available, total }) => {
  return <TablesMap tables={tables} available={available} total={total} />;
};

export default Map111179;
