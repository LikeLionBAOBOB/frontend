// src/components/seatmaps/Map111514.js
import React from "react";
import TablesMap, {
  seatsAboveBelowBar,
  seatsAroundCircle,
} from "./common";

/**
 * 변경 포인트
 * 1) tables → (shapes + chairs)로 전환: 공통의 2+2 자동 배치 비활성화
 * 2) 상단 가로 바(bar) 높이를 키워서 "윗줄/아랫줄" 의자 간 세로 간격 ↑
 * 3) 의자-책상 간격 offset은 줄여서 의자와 책상이 더 붙어 보이게 (요청사항)
 * 4) 원형 테이블 3개: 위/아래 1개씩만 배치, 세로 간격은 offset으로 제어
 */

// ---------- 1) 가로 바(무대/테이블 느낌) ----------
const BAR = { type: "bar", x: 40, y: 96, w: 240, h: 36 }; // h를 36으로 키워 윗줄↔아랫줄 간격 증가

// 바 위/아래 좌석: 의자-책상 간격(offset) ↓, 의자 가로 간격(spacing) 기본 유지
const BAR_SEATS = seatsAboveBelowBar(
  { x: BAR.x, y: BAR.y, w: BAR.w, h: BAR.h },
  {
    countTop: 7,       // 위쪽 12개
    countBottom: 7,    // 아래쪽 10개 (시안처럼 조금 덜 촘촘)
    seatSize: 12,
    offset: 8,          // ↓ 의자-바 간격 축소 (기본 12 → 8)
    spacing: 12         // 가로 간격은 유지 (가로는 늘리지 말라는 요청)
  }
);

// ---------- 2) 원형 테이블 3개 ----------
const C1 = { type: "round", cx: 96,  cy: 220, r: 28 };
const C2 = { type: "round", cx: 168, cy: 220, r: 28 };
const C3 = { type: "round", cx: 240, cy: 220, r: 28 };

// 각 원형테이블 위/아래 1좌석씩, 의자-테이블 간격만 살짝 줄임
const CIRCLE_SEATS = [
  ...seatsAroundCircle({ cx: C1.cx, cy: C1.cy, r: C1.r }, { countTop: 1, countBottom: 1, seatSize: 12, gap: 16, offset: 8 }),
  ...seatsAroundCircle({ cx: C2.cx, cy: C2.cy, r: C2.r }, { countTop: 1, countBottom: 1, seatSize: 12, gap: 16, offset: 8 }),
  ...seatsAroundCircle({ cx: C3.cx, cy: C3.cy, r: C3.r }, { countTop: 1, countBottom: 1, seatSize: 12, gap: 16, offset: 8 }),
];

// ---------- 최종 shapes / chairs ----------
const shapes = [BAR, C1, C2, C3];
const chairs = [...BAR_SEATS, ...CIRCLE_SEATS];

const Map111514 = ({ available, total }) => {
  // total/available을 상단 요약과 동기화하려면 total은 chairs.length로 두는 게 안전
  const _total = total || chairs.length;
  return <TablesMap shapes={shapes} chairs={chairs} available={available} total={_total} />;
};

export default Map111514;
