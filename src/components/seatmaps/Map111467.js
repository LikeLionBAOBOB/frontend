import React from "react";
import TablesMap from "./common";

const SEAT = 12;
const GAP = 14;
const OFFSET = 12;

const vcol = (x, yStart, count, gap = GAP, size = SEAT) =>
  Array.from({ length: count }, (_, i) => ({ x, y: yStart + i * (size + gap), w: size, h: size }));

const vcolCenteredOnRect = (rect, side = "left", count = 3) => {
  const totalH = count * SEAT + (count - 1) * GAP;
  const yStart = rect.y + (rect.h - totalH) / 2;
  const x = side === "left" ? rect.x - OFFSET - SEAT : rect.x + rect.w + OFFSET;
  return vcol(x, yStart, count);
};

const LEFT = { type: "rect", x: 44,  y: 54,  w: 34,  h: 230 };
const RIGHT_TOP = { type: "rect", x: 208, y: 74,  w: 56, h: 110 };
const RIGHT_BOT = { type: "rect", x: 208, y: 220, w: 56, h: 110 };

const shapes = [LEFT, RIGHT_TOP, RIGHT_BOT];

const leftCol8 = vcol(LEFT.x + LEFT.w + OFFSET, 70, 8);
const rtLeft  = vcolCenteredOnRect(RIGHT_TOP, "left", 3);
const rtRight = vcolCenteredOnRect(RIGHT_TOP, "right", 3);
const rbLeft  = vcolCenteredOnRect(RIGHT_BOT, "left", 3);
const rbRight = vcolCenteredOnRect(RIGHT_BOT, "right", 3);

const chairs = [...leftCol8, ...rtLeft, ...rtRight, ...rbLeft, ...rbRight];

const Map111467 = ({ available, total, seatStates }) => {
  const _total = total || chairs.length;
  return <TablesMap shapes={shapes} chairs={chairs} available={available} total={_total} seatStates={seatStates} />;
};

export default Map111467;
