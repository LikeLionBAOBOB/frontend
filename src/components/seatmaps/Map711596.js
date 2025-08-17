import React from "react";
import TablesMap, { seatsAboveBelowBar } from "./common";

/**
 * 마포나루 스페이스 (36석)
 */
const Map711596 = ({ available, total, seatStates }) => {
  const BAR_W = 120;
  const BAR_H = 30;
  const COL_X = [56, 194];
  const ROW_Y = [58, 140, 222];

  const bars = [
    { type: "bar", x: COL_X[0], y: ROW_Y[0], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[1], y: ROW_Y[0], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[0], y: ROW_Y[1], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[1], y: ROW_Y[1], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[0], y: ROW_Y[2], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[1], y: ROW_Y[2], w: BAR_W, h: BAR_H },
  ];

  const chairs = bars.flatMap((b) =>
    seatsAboveBelowBar(b, { countTop: 4, countBottom: 4, offset: 8, spacing: 12 })
  );

  // available=사용 중 좌석 수 → 이용 가능 수로 보정
  const availableFree = Math.max((total || 36) - (available || 0), 0);

  return (
    <TablesMap
      shapes={bars}
      chairs={chairs}
      total={total}
      available={availableFree}
      seatStates={seatStates}
    />
  );
};

export default Map711596;
