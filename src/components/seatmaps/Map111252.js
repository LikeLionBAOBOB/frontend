import React from "react";
import TablesMap, {
  SEAT_SIZE,
  SEAT_GAP,
  SEAT_OFFSET,
  seatsAboveBelowBar,
} from "./common";

/**
 * 요구사항
 * - 상단 가로 테이블 아래 의자 5개
 * - 중앙 세로 테이블 좌/우 각각 4개(총 8개)
 * - 하단 가로 테이블 위 의자 2개
 *
 * NOTE:
 * - common.js의 자동 좌석 생성을 피하기 위해 `tables` 대신
 *   `shapes`(테이블 모양)과 `chairs`(의자 좌표)로 분리 전달.
 */

// 테이블 모양만 정의(좌석 자동생성 없음)
const topBar =  { type: "bar",  x: 70,  y: 48,  w: 200, h: 28 };
const midRect = { type: "rect", x: 150, y: 120, w: 60,  h: 140 };
const botBar =  { type: "bar",  x: 96,  y: 290, w: 160, h: 28 };
const shapes = [topBar, midRect, botBar];

// ---------- 의자(좌표 수동 배치) ---------- //
// 상단: 바 아래 5개
const topRowChairs = seatsAboveBelowBar(topBar, {
  countTop: 0,
  countBottom: 5,      // 아래 5개
  seatSize: SEAT_SIZE,
  offset: SEAT_OFFSET,
  spacing: SEAT_GAP,
});

// 중앙: rect 좌/우 각 4개 (세로 줄)
const lineYs = [140, 165, 195, 225]; // midRect 내부에 균등한 y 위치
const leftX  = midRect.x - SEAT_OFFSET - SEAT_SIZE;          // 왼쪽 줄 x
const rightX = midRect.x + midRect.w + SEAT_OFFSET;          // 오른쪽 줄 x
const midLeftChairs = lineYs.map((y) => ({
  x: leftX, y, w: SEAT_SIZE, h: SEAT_SIZE,
}));
const midRightChairs = lineYs.map((y) => ({
  x: rightX, y, w: SEAT_SIZE, h: SEAT_SIZE,
}));

// 하단: 바 위 2개
const bottomRowChairs = seatsAboveBelowBar(botBar, {
  countTop: 2,         // 위 2개
  countBottom: 0,
  seatSize: SEAT_SIZE,
  offset: 6,
  spacing: SEAT_GAP,
});

const chairs = [
  ...topRowChairs,
  ...midLeftChairs,
  ...midRightChairs,
  ...bottomRowChairs,
];

const Map111252 = ({ available, total }) => {
  // total이 안 들어오면 의자 개수로 자동 계산
  const computedTotal = total || chairs.length;
  return (
    <TablesMap
      shapes={shapes}
      chairs={chairs}
      available={available}
      total={computedTotal}
    />
  );
};

export default Map111252;
