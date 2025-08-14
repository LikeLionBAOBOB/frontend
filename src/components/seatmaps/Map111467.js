// src/components/seatmaps/Map111467.js
import React from "react";
import TablesMap from "./common";

// 좌석 크기/세로 간격(가로 간격은 유지)
const SEAT = 12;
const GAP = 14;
const OFFSET = 12; // 책상 변과 좌석 사이 가로 오프셋

// 세로 좌석 열 생성
const vcol = (x, yStart, count, gap = GAP, size = SEAT) =>
  Array.from({ length: count }, (_, i) => ({
    x,
    y: yStart + i * (size + gap),
    w: size,
    h: size,
  }));

// 특정 직사각형(rect) 변을 기준으로, "세로 중앙 정렬"된 3좌석 열 생성
// side: "left" | "right"  (책상의 왼쪽/오른쪽에 붙일지)
const vcolCenteredOnRect = (rect, side = "left", count = 3) => {
  const totalH = count * SEAT + (count - 1) * GAP;               // 좌석열 전체 높이
  const yStart = rect.y + (rect.h - totalH) / 2;                 // 세로 중앙 정렬
  const x =
    side === "left"
      ? rect.x - OFFSET - SEAT
      : rect.x + rect.w + OFFSET;
  return vcol(x, yStart, count);
};

/* ================== 테이블(사각형) ================== */
// 왼쪽 긴 기둥
const LEFT = { type: "rect", x: 44,  y: 54,  w: 34,  h: 230 };
// 오른쪽 상·하 테이블 2개
const RIGHT_TOP = { type: "rect", x: 208, y: 74,  w: 56, h: 110 };
const RIGHT_BOT = { type: "rect", x: 208, y: 220, w: 56, h: 110 };

const shapes = [LEFT, RIGHT_TOP, RIGHT_BOT];

/* ================== 의자(요청 배치) ==================
 * 1) 왼쪽 기둥 오른쪽에 "8개 1줄"
 * 2) 오른쪽 두 책상 각각의 좌/우에 "3개 1줄" — 책상 높이 기준 세로 중앙 정렬
 */
// 1) 왼쪽 8개 1줄 (기존 그대로)
const leftCol8 = vcol(LEFT.x + LEFT.w + OFFSET, 70, 8);

// 2) 오른쪽 상단 책상 좌/우 3개씩(세로 중앙 정렬)
const rtLeft  = vcolCenteredOnRect(RIGHT_TOP, "left", 3);
const rtRight = vcolCenteredOnRect(RIGHT_TOP, "right", 3);

// 3) 오른쪽 하단 책상 좌/우 3개씩(세로 중앙 정렬)
const rbLeft  = vcolCenteredOnRect(RIGHT_BOT, "left", 3);
const rbRight = vcolCenteredOnRect(RIGHT_BOT, "right", 3);

const chairs = [
  ...leftCol8,
  ...rtLeft, ...rtRight,
  ...rbLeft, ...rbRight,
];

const Map111467 = ({ available, total }) => {
  const _total = total || chairs.length; // total 미지정 시 의자 수로 자동
  return <TablesMap shapes={shapes} chairs={chairs} available={available} total={_total} />;
};

export default Map111467;
