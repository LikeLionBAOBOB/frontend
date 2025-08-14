// src/components/seatmaps/Map711596.js
import React from "react";
import TablesMap, { seatsAboveBelowBar } from "./common";

/**
 * 마포나루 스페이스 (36석)
 *  - 가로 테이블 6개(3행 x 2열)
 *  - 각 테이블 위/아래 4좌석씩
 *  - 의자↔테이블 간격(offset)은 줄이고(=8),
 *    의자끼리 가로 간격은 유지(spacing 12),
 *    행 간 배치는 y 값으로 세로 여백을 조금 더 줌.
 */
const Map711596 = ({ available, total }) => {
  // 테이블 크기/열 배치(두 열)
  const BAR_W = 120;
  const BAR_H = 30;

  // 열 x 좌표(왼/오)
  const COL_X = [56, 194];

  // 행 y 좌표(세로 여백을 눈에 띄게 확보)
  // 1행, 2행, 3행
  const ROW_Y = [58, 140, 222];

  // 바(테이블) 도형 6개 생성
  const bars = [
    { type: "bar", x: COL_X[0], y: ROW_Y[0], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[1], y: ROW_Y[0], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[0], y: ROW_Y[1], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[1], y: ROW_Y[1], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[0], y: ROW_Y[2], w: BAR_W, h: BAR_H },
    { type: "bar", x: COL_X[1], y: ROW_Y[2], w: BAR_W, h: BAR_H },
  ];

  // 의자 생성:
  // - 의자↔테이블 거리는 offset=8 로 더 붙임
  // - 같은 줄(가로) 의자 간격은 spacing=12 유지
  const chairs = bars.flatMap((b) =>
    seatsAboveBelowBar(b, { countTop: 4, countBottom: 4, offset: 8, spacing: 12 })
  );

  // common의 색 규칙에 맞추기:
  //   used = total - available, free = availableFree
  const availableFree = Math.max((total || 36) - (available || 0), 0);

  return (
    <TablesMap
      shapes={bars}
      chairs={chairs}
      total={total}
      available={availableFree}
    />
  );
};

export default Map711596;
