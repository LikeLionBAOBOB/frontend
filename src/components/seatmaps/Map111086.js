import React from "react";
import TablesMap, { seatsOnRectSides, seatsAboveBelowBar } from "./common";

/**
 * 마포구립 서강도서관 (30석)
 * - 상단 가로바 + 아래 6좌석
 * - 3행 × 2열 세로 사각 테이블 (각 4좌석: 좌우 2+2)
 * - 테이블 세로 간격 최소 7px
 */
const Map111086 = ({ available, total }) => {
  const bar = { type: "bar", x: 56, y: 32, w: 220, h: 28 };

  const rects = [
    { type: "rect", x: 64,  y: 110, w: 62, h: 82 },
    { type: "rect", x: 204, y: 110, w: 62, h: 82 },
    { type: "rect", x: 64,  y: 199, w: 62, h: 82 },
    { type: "rect", x: 204, y: 199, w: 62, h: 82 },
    { type: "rect", x: 64,  y: 288, w: 62, h: 82 },
    { type: "rect", x: 204, y: 288, w: 62, h: 82 },
  ];
  const shapes = [bar, ...rects];

  const chairsRaw = [
    ...seatsAboveBelowBar(bar, { countTop: 0, countBottom: 6 }),
    ...rects.flatMap((r) => seatsOnRectSides(r)),
  ];
  const chairs = [...chairsRaw].sort(() => Math.random() - 0.5);

  // 부모에서 내려오는 available = "현재 좌석 수(=사용 중)"
  // TablesMap은 "이용 가능 수"를 기대하므로 변환
  const availableFree = Math.max((total || 30) - (available || 0), 0);

  return <TablesMap shapes={shapes} chairs={chairs} total={total} available={availableFree} />;
};
export default Map111086;
