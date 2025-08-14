import React from "react";
import styled from "styled-components";

/* ===== 스테이지/좌석 공통 상수 ===== */
export const STAGE_W = 320;   // iPhone 미색 캔버스 기준 폭
export const STAGE_H = 340;   // 세로 여유
const PADDING = 20;           // 캔버스 안쪽 여백 (사방 20px 보장)
export const SEAT_SIZE = 12;  // 좌석 정사각형 크기
export const SEAT_GAP = 12;   // 같은 줄 간격(요청: 10~15px)
export const SEAT_OFFSET = 12; // 테이블/바와의 간격(밖으로 돌출)

/* ----------------------------------------------------------------
 * 좌석 유틸 1) 세로 직사각형 책상 양 옆에 2+2
 * rect: { x, y, w, h }
 * ---------------------------------------------------------------- */
export function seatsOnRectSides(
  rect,
  { seatSize = SEAT_SIZE, gap = SEAT_GAP, offset = SEAT_OFFSET } = {}
) {
  if (!rect) return [];
  const { x, y, w, h } = rect;
  const cy = y + h / 2;
  const leftX = x - offset - seatSize;
  const rightX = x + w + offset;
  const topY = cy - (seatSize + gap / 2);
  const botY = cy + gap / 2;

  return [
    { x: leftX,  y: topY, w: seatSize, h: seatSize },
    { x: leftX,  y: botY, w: seatSize, h: seatSize },
    { x: rightX, y: topY, w: seatSize, h: seatSize },
    { x: rightX, y: botY, w: seatSize, h: seatSize },
  ];
}

/* ----------------------------------------------------------------
 * 좌석 유틸 2) 가로 막대(bar) 위/아래에 N개 씩
 * bar: { x, y, w, h }
 * ---------------------------------------------------------------- */
export function seatsAboveBelowBar(
  bar,
  { countTop = 0, countBottom = 0, seatSize = SEAT_SIZE, offset = SEAT_OFFSET, spacing = SEAT_GAP } = {}
) {
  if (!bar) return [];
  const { x, y, w, h } = bar;
  const out = [];

  if (countTop > 0) {
    const rowW = countTop * seatSize + (countTop - 1) * spacing;
    const startX = x + (w - rowW) / 2;
    const yy = y - offset - seatSize;
    for (let i = 0; i < countTop; i++) {
      out.push({ x: startX + i * (seatSize + spacing), y: yy, w: seatSize, h: seatSize });
    }
  }
  if (countBottom > 0) {
    const rowW = countBottom * seatSize + (countBottom - 1) * spacing;
    const startX = x + (w - rowW) / 2;
    const yy = y + h + offset;
    for (let i = 0; i < countBottom; i++) {
      out.push({ x: startX + i * (seatSize + spacing), y: yy, w: seatSize, h: seatSize });
    }
  }
  return out;
}

/* ----------------------------------------------------------------
 * 좌석 유틸 3) 원형 테이블 위/아래에 세로 줄 배치
 * circle: { cx, cy, r }
 * ---------------------------------------------------------------- */
export function seatsAroundCircle(
  circle,
  { countTop = 0, countBottom = 0, seatSize = SEAT_SIZE, gap = SEAT_GAP, offset = SEAT_OFFSET } = {}
) {
  if (!circle) return [];
  const { cx, cy, r } = circle;
  const out = [];
  const xCenter = cx - seatSize / 2;

  if (countTop > 0) {
    const totalH = countTop * seatSize + (countTop - 1) * gap;
    const startY = cy - r - offset - seatSize - (totalH - seatSize);
    for (let i = 0; i < countTop; i++) {
      out.push({ x: xCenter, y: startY + i * (seatSize + gap), w: seatSize, h: seatSize });
    }
  }
  if (countBottom > 0) {
    const startY = cy + r + offset;
    for (let i = 0; i < countBottom; i++) {
      out.push({ x: xCenter, y: startY + i * (seatSize + gap), w: seatSize, h: seatSize });
    }
  }
  return out;
}

/* ----------------------------------------------------------------
 * 내부 유틸: 바운딩 박스 계산
 * ---------------------------------------------------------------- */
function rectsFromShapes(shapes = []) {
  const r = [];
  for (const s of shapes) {
    if (s.type === "rect" || s.type === "bar") r.push({ x: s.x, y: s.y, w: s.w, h: s.h });
    if (s.type === "round") r.push({ x: s.cx - s.r, y: s.cy - s.r, w: s.r * 2, h: s.r * 2 });
  }
  return r;
}
function bbox(rects = []) {
  if (!rects.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0, w: 0, h: 0 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of rects) {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.w);
    maxY = Math.max(maxY, r.y + r.h);
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

/* ================================================================
 * 공통 렌더러 (fit-to-canvas + 사방 20px 여백 보장)
 * ================================================================ */
const TablesMap = ({
  tables = [],
  shapes = [],
  chairs = [],
  total = 0,
  available = 0,
}) => {
  // 입력 정규화(레거시 tables → shapes/chairs)
  let _shapes = [...shapes];
  let _chairs = [...chairs];

  if (tables.length) {
    _shapes = tables.map((t) => ({ type: "rect", x: t.x, y: t.y, w: t.w, h: t.h }));
    for (const t of tables) {
      const unit = seatsOnRectSides({ x: t.x, y: t.y, w: t.w, h: t.h });
      const need = Math.max(Number(t.seats || 4), 0);
      for (let i = 0; i < need; i++) _chairs.push(unit[i % 4]);
    }
    if (!total) total = tables.reduce((s, t) => s + (t.seats || 0), 0);
  }

  // 콘텐츠 bbox
  const rects = [...rectsFromShapes(_shapes), ..._chairs.map((c) => ({ x: c.x, y: c.y, w: c.w, h: c.h }))];
  const bb = bbox(rects);

  // 캔버스 내부 영역(사방 20px)
  const innerW = STAGE_W - PADDING * 2;
  const innerH = STAGE_H - PADDING * 2;

  // 커지면 자동 축소 (비율 유지)
  const scaleW = bb.w ? innerW / bb.w : 1;
  const scaleH = bb.h ? innerH / bb.h : 1;
  const scale = Math.min(1, scaleW, scaleH);

  // 가운데 정렬 오프셋
  const contentW = bb.w * scale;
  const contentH = bb.h * scale;
  const dx = PADDING + (innerW - contentW) / 2 - bb.minX * scale;
  const dy = PADDING + (innerH - contentH) / 2 - bb.minY * scale;

  // 좌석 상태(회색=사용중, 흰색=가능) — used = total - available
  const usedCount = Math.max(total - Math.max(available, 0), 0);
  const states = _chairs.map((_, idx) => (idx < usedCount ? "used" : "free"));

  return (
    <SeatPanel>
      <SeatCanvas style={{ width: STAGE_W, height: STAGE_H }}>
        {_shapes.map((s, i) => {
          if (s.type === "round") {
            return (
              <Round
                key={`r-${i}`}
                style={{
                  left: s.cx * scale + dx - s.r * scale,
                  top:  s.cy * scale + dy - s.r * scale,
                  width:  s.r * 2 * scale,
                  height: s.r * 2 * scale,
                }}
              />
            );
          }
          return (
            <TableBox
              key={`t-${i}`}
              style={{
                left: s.x * scale + dx,
                top:  s.y * scale + dy,
                width:  s.w * scale,
                height: s.h * scale,
              }}
            />
          );
        })}

        {_chairs.map((c, i) => (
          <SeatDotAbs
            key={`s-${i}`}
            $state={states[i]}
            style={{
              left: c.x * scale + dx,
              top:  c.y * scale + dy,
              width:  c.w * scale,
              height: c.h * scale,
            }}
            title={states[i] === "free" ? "이용 가능" : "이용 중"}
          />
        ))}
      </SeatCanvas>
    </SeatPanel>
  );
};

export default TablesMap;

/* ================= styles ================ */
const SeatPanel = styled.div`
  border: 0;
  padding: 0;
  background: transparent;
`;
const SeatCanvas = styled.div`
  position: relative;
  margin: 0 auto;
  background: #fafafa;
  border-radius: 12px;
  overflow: hidden;
`;
const TableBox = styled.div`
  position: absolute;
  background: #d9d9d9;
  border: 1px solid #d0d0d0;
  border-radius: 0px;
`;
const Round = styled.div`
  position: absolute;
  background: #d9d9d9;
  border: 1px solid #d0d0d0;
  border-radius: 9999px;
`;
const SeatDotAbs = styled.div`
  position: absolute;
  border-radius: 0px;
  background: ${(p) => (p.$state === "free" ? "#ffffff" : "#bdbdbd")};
  border: 1px solid #cfcfcf;
`;
