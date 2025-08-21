// src/pages/seatmap.js
import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import HeaderBackHero from "../components/header_ad";
import SeatTable from "../components/seattable";

const BASE_URL = "https://baobob.pythonanywhere.com";

const mapStatus = (s) =>
  s === "이용 중" ? "occupied" :
  s === "사석화" ? "hogged_60" :
  "free";

const SeatMapPage = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsErr, setLogsErr] = useState("");
  const [err, setErr] = useState("");

  const [usingCount, setUsingCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [badge, setBadge] = useState("");

  useEffect(() => {
    let alive = true;
    const fetchCongestion = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        const r = await fetch(`${BASE_URL}/adminpanel/congestion/?_ts=${Date.now()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        const raw = await r.text().catch(() => "");
        let js = {};
        try { js = raw ? JSON.parse(raw) : {}; } catch {}
        if (!r.ok) throw new Error(js?.message || `HTTP ${r.status}`);
        if (!alive) return;
        setUsingCount(Number(js.current_seats ?? 0));
        setTotalCount(Number(js.total_seats ?? 0));
        setBadge(String(js.congestion || ""));
        setErr("");
      } catch (e) {
        if (!alive) return;
        setErr(String(e?.message || ""));
      }
    };
    fetchCongestion();
    const t = setInterval(fetchCongestion, 10000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  useEffect(() => {
    let alive = true;
    const fetchSeats = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        const r = await fetch(`${BASE_URL}/adminpanel/seats/?_ts=${Date.now()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        const raw = await r.text().catch(() => "");
        let js = {};
        try { js = raw ? JSON.parse(raw) : {}; } catch {}
        if (!r.ok) throw new Error(js?.message || `HTTP ${r.status}`);
        if (!alive) return;
        const arr = (js.seats || []).map(s => ({
          id: Number(s.seat_id),
          status: mapStatus(String(s.status)),
        }));
        setSeats(arr);
        setErr("");
      } catch (e) {
        if (!alive) return;
        setErr(String(e?.message || ""));
        setSeats([]);
      }
    };
    fetchSeats();
    const t = setInterval(fetchSeats, 10000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const onSeatClick = useCallback(async (id, status) => {
    if (status !== "hogged_60") {
      setSelectedSeatId(null);
      setLogs([]); setLogsErr(""); setLogsLoading(false);
      return;
    }
    setSelectedSeatId(id);
    setLogs([]); setLogsErr(""); setLogsLoading(true);
    try {
      const token = localStorage.getItem("access_token") || "";
      const r = await fetch(`${BASE_URL}/adminpanel/${id}/seats/?_ts=${Date.now()}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), Accept: "application/json" },
        cache: "no-store",
      });
      const raw = await r.text().catch(() => "");
      let js = {};
      try { js = raw ? JSON.parse(raw) : {}; } catch {}
      if (!r.ok) throw new Error(js?.message || `HTTP ${r.status}`);
      const list = Array.isArray(js.log) ? js.log.map((row, i, arr) => ({
        time: String(row.time ?? ""),
        text: String(row.status ?? ""),
        ended: i < arr.length - 1,
        over60: /60분/.test(String(row.status ?? "")),
      })) : [];
      setLogs(list);
    } catch (e) {
      setLogs([]); setLogsErr(String(e?.message || ""));
    } finally {
      setLogsLoading(false);
    }
  }, []);

  return (
    <Page>
      <HeaderBackHero
        title="해오름 작은도서관"
        address="서울 마포구 신촌로26길 10 우리마을작은집 2층"
      />

      <Main>
        <SectionTitle>실시간 좌석 관리</SectionTitle>

        <TopRow>
          <Left>
            <Line>
              <Count>{usingCount} / {totalCount}</Count>
              <Badge $level={badge}>{badge || "-"}</Badge>
            </Line>
            <Sub>(현재 좌석 수 / 전체 좌석 수)</Sub>
            {err && <Sub style={{color:"#C41E3A"}}>{err}</Sub>}
          </Left>

          <Right>
            <LegendItem><span>이용 가능한 좌석</span><Dot $t="free" /></LegendItem>
            <LegendItem><span>이용 중인 좌석</span><Dot $t="occ" /></LegendItem>
            <LegendItem><span>1시간 이상 사석화된 좌석</span><Dot $t="hog" /></LegendItem>
          </Right>
        </TopRow>

        <Board>
          <SeatTable
            seats={seats}
            selectedSeatId={selectedSeatId}
            onSeatClick={onSeatClick}
          />
        </Board>

        {selectedSeatId && (
          <LogCard>
            <LogTitle>{selectedSeatId}번 좌석 로그</LogTitle>
            {logsLoading && <Sub>불러오는 중…</Sub>}
            {logsErr && <Sub style={{color:"#C41E3A"}}>{logsErr}</Sub>}
            {!logsLoading && !logsErr && logs.length === 0 && <Sub>표시할 로그가 없습니다.</Sub>}
            <LogList>
              {logs.map((r, i) => (
                <LogRow key={i} $ended={r.ended} $over60={r.over60}>
                  <time>{r.time}</time>
                  <span>{r.text}</span>
                </LogRow>
              ))}
            </LogList>
          </LogCard>
        )}
      </Main>
    </Page>
  );
};

export default SeatMapPage;

const Page = styled.div` width:393px; margin:0 auto; `;
const Main = styled.div`
  padding: 0 12px 16px;
  `;
const SectionTitle = styled.h3` margin: 5px 4px 8px; font-size: 18px; font-weight: 700; `;
const TopRow = styled.div` display:flex; justify-content:space-between; gap:12px; padding:0 4px; `;
const Left = styled.div``;
const Line = styled.div` display:flex; align-items:center; gap:8px; `;
const Count = styled.span` font-size:18px; `;
const Badge = styled.span`
  border-radius:20px;
  font-size:12px;
  padding:4px 10px;
  color:#fff;
  background:${p =>
    p.$level === "여유" ? "#33A14B" :
    p.$level === "보통" ? "#FFB724" :
    p.$level === "혼잡" ? "#FF474D" :
    "#bbb"};
`;
const Sub = styled.div` font-size:11px; color:#919191; margin-top:4px; `;
const Right = styled.div` display:flex; flex-direction:column; align-items:flex-end; gap:6px; `;
const LegendItem = styled.div` display:flex; align-items:center; gap:6px; font-size:12px; color:#666; `;
const Dot = styled.span`
  width:10px; height:10px; border-radius:50%;
  border:1px solid var(--text-disabled,#8E8E8E);
  background:${p => p.$t==="free" ? "#FFFFFF" : p.$t==="occ" ? "var(--border,#C6C6C6)" : "var(--red-soft, rgba(239,62,94,.5))"};
`;
const Board = styled.div`
  margin-top: 28px; width: 353px; height: 439px; box-sizing: border-box;
  border-radius: 15px; border: 1px solid var(--Disabled, #E4E4E4);
  background: var(--Background-1, #F8F8F8);
  display:flex; justify-content:center; align-items:center;
  margin-left:auto; margin-right:auto;
`;
const LogCard = styled.div`
  margin: 12px auto 0; width: 353px; box-sizing: border-box;
  background: #FFE3E6; border: 1px solid #FFD6DB; border-radius: 15px;
  padding: 20px 20px 24px;
`;
const LogTitle = styled.div` font-weight: 700; margin-bottom: 8px; `;
const LogList = styled.div` display: grid; gap: 6px; `;
const LogRow = styled.div`
  display: flex; gap: 10px; align-items: baseline; line-height: 1.45;
  opacity: ${p => (p.$ended ? .45 : 1)};
  color: ${p => (p.$over60 ? "#C41E3A" : "#000000ff")};
  time { width: 44px; font-variant-numeric: tabular-nums; }
`;
