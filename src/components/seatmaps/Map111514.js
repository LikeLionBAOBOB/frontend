// src/components/seatmaps/Map111514.jsx
import React from "react";
import TablesMap from "./common";

const tables = [
  { x: 20, y: 20, w: 140, h: 90, seats: 6 },
  { x: 200, y: 24, w: 140, h: 90, seats: 6 },
  { x: 24, y: 140, w: 120, h: 80, seats: 4 },
  { x: 210, y: 150, w: 120, h: 80, seats: 4 },
];

const Map111514 = ({ available, total }) => {
  return <TablesMap tables={tables} available={available} total={total} />;
};

export default Map111514;
