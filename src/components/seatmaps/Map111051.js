// src/components/seatmaps/Map111051.jsx
import React from "react";
import TablesMap from "./common";

const tables = [
  { x: 20, y: 20, w: 150, h: 90, seats: 8 },
  { x: 210, y: 20, w: 130, h: 80, seats: 6 },
  { x: 40, y: 140, w: 140, h: 90, seats: 6 },
];

const Map111051 = ({ available, total }) => {
  return <TablesMap tables={tables} available={available} total={total} />;
};

export default Map111051;
