// src/components/seatmaps/common.jsx
import React from "react";
import styled from "styled-components";

/**
 * 공통 좌석 렌더러
 * props:
 *  - tables: [{ x, y, w, h, seats }]
 *  - available: number  // 이용 가능 좌석 수
 *  - total: number      // 전체 좌석 수
 */
const TablesMap = ({ tables = [], available = 0, total = 0 }) => {
  // 간단한 규칙: total 중 available 만큼을 앞에서부터 free 로 표시
  let freeLeft = Math.max(available, 0);
  const tableSeatsState = tables.map((t) =>
    Array.from({ length: t.seats }, () => {
      const isFree = freeLeft > 0;
      if (freeLeft > 0) freeLeft -= 1;
      return isFree ? "free" : "used";
    })
  );

  return (
    <SeatPanel>
      <SeatCanvas>
        {tables.map((t, i) => (
          <TableBox key={i} style={{ left: t.x, top: t.y, width: t.w, height: t.h }}>
            {tableSeatsState[i].map((state, k) => {
              // 3열 그리드로 점 배치(간단)
              const col = 3;
              const x = 8 + (k % col) * 18;
              const y = 8 + Math.floor(k / col) * 18;
              return (
                <SeatDotAbs
                  key={k}
                  $state={state}
                  style={{ left: x, top: y }}
                  title={state === "free" ? "이용 가능" : "이용 중"}
                />
              );
            })}
          </TableBox>
        ))}
      </SeatCanvas>
    </SeatPanel>
  );
};

export default TablesMap;

/* styles */
const SeatPanel = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  background: #fff;
  padding: 16px;
`;
const SeatCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 320px; /* 필요 시 조정 */
  background: #fafafa;
  border-radius: 12px;
  overflow: hidden;
`;
const TableBox = styled.div`
  position: absolute;
  background: #e5e5e5;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
`;
const SeatDotAbs = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${(p) => (p.$state === "free" ? "#dfeff2" : "#e9e9e9")};
  border: 1px solid ${(p) => (p.$state === "free" ? "#5aa3b3" : "#cfcfcf")};
`;
