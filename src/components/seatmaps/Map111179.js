import React from "react";
import TablesMap, { STAGE_W, STAGE_H } from "./common";

const tables = [
  { x: 48,  y: 32,  w: 70,  h: 110, seats: 4 },
  { x: 200, y: 104, w: 70,  h: 110, seats: 4 },
  { x: 48,  y: 196, w: 70,  h: 110, seats: 4 },
];

const Map111179 = ({ available, total, seatStates }) => {
  return <TablesMap tables={tables} available={available} total={total} seatStates={seatStates} />;
};

export default Map111179;
