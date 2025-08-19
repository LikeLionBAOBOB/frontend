// src/pages/mylib.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import StatusBar from "../assets/icons/StatusBar.png";
import HeaderBack from "../components/header_back";
import arrowRight from "../assets/icons/arrow_rightup.png";
import clockIcon from "../assets/icons/clock.png";
import defaultImg from "../assets/images/lib/111051/1.jpg";

const BASE_URL = "https://baobob.pythonanywhere.com";
const FAVORITES_LIST_URL = `${BASE_URL}/libraries/favorites/`;

const SPECIAL_LIB_IDS = new Set([
            "111514", // 마포소금나루도서관 
            "111051", // 서대문구립이진아기념도서관 
            "711596", // 마포나루메타버스도서관
            "111179", // 남가좌새롬어린이도서관 
        ]);

function formatLibraryName(name) {
    return name
        .replace("소금나루", "소금나루\n")   
        .replace("이진아", "이진아\n")
        .replace("메타버스", "메타버스\n") 
        .replace("어린이", "어린이\n");   
}

const PILL_COLOR = { 혼잡:{bg:"#FF474D"}, 보통:{bg:"#FFB724"}, 여유:{bg:"#33A14B"} };

let libImages;
try { libImages = require.context("../assets/images/lib", true, /\.(png|jpe?g|webp)$/); } catch {}
const fileExists = (loader, p) => { try { return loader(p); } catch { return null; } };

const getLocalImageById = (id) => {
  if (!id) return null;
  const c = [`./${id}/1.png`, `./${id}/1.jpg`, `./${id}/1.jpeg`, `./${id}/1.webp`];
  if (libImages) for (const p of c) { const hit = fileExists(libImages, p); if (hit) return hit; }
  for (const p of ["1.png", "1.jpg", "1.jpeg", "1.webp"]) {
    try { return new URL(`../assets/images/lib/${id}/${p}`, import.meta.url).href; } catch {}
  }
  return null;
};

const extractIdFromImagePath = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return "";
  const m = imagePath.match(/(\d{4,})/);
  return m ? m[1] : "";
};

// 즐겨찾기 응답 구조가 조금씩 달라도 최대한 ID를 얻도록 보강
const getLibId = (lib) => {
  const nested = lib?.library || lib?.lib || {};
  const candidates = [
    lib.library_id, lib.libraryId, lib.id,
    nested.id, nested.library_id, nested.libraryId,
    extractIdFromImagePath(lib.image),
    extractIdFromImagePath(nested.image),
  ];
  const hit = candidates.find(v => v !== undefined && v !== null && `${v}`.trim() !== "");
  return hit ? String(hit) : "";
};

// 좌석 비율로 혼잡도 산출(기본 규칙: 여유≥60%, 보통 20~60, 혼잡<20)
const calcCongestion = (total, free) => {
  if (!total) return "-";
  const ratio = (free / total) * 100;
  if (ratio >= 60) return "여유";
  if (ratio >= 20) return "보통";
  return "혼잡";
};

const MyLibraries = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [favIds, setFavIds] = useState([]);

  const token = useMemo(() => localStorage.getItem("access_token") || "", []);

  const fetchFavorites = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const res = await fetch(FAVORITES_LIST_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const raw = await res.text();
      let data = [];
      try { data = raw ? JSON.parse(raw) : []; } catch {}
      if (!res.ok) {
        setErr(data?.message || `목록 조회 실패 (${res.status})`);
        setItems([]);
        setFavIds([]);
      } else {
        const list = Array.isArray(data) ? data : [];
        const ids = list.map(getLibId).filter(Boolean);
        if (!ids.length && list.length) {
          console.warn("[mylib] favorites has items but no usable ids. sample:", list[0]);
        }
        setItems(list);
        setFavIds(ids);
      }
    } catch {
      setErr("네트워크 오류가 발생했습니다.");
      setItems([]); setFavIds([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 좌석/상세 동시 갱신
  const refreshLive = useCallback(async (ids) => {
    if (!ids?.length) return;

    const getJson = async (url, withAuth=false) => {
      const headers = withAuth && token
        ? { Accept: "application/json", Authorization: `Bearer ${token}` }
        : { Accept: "application/json" };
      const r = await fetch(url, { method: "GET", headers, cache: "no-store" });
      const raw = await r.text().catch(() => "");
      let js = {};
      try { js = raw ? JSON.parse(raw) : {}; } catch {}
      return { ok: r.ok, status: r.status, data: js, raw };
    };

    try {
      const results = await Promise.all(ids.map(async (id) => {
        const idStr = String(id);

        // 1) 실시간 좌석
        let seatRes = await getJson(`${BASE_URL}/seats/${idStr}/`, false);
        if (!seatRes.ok && seatRes.status === 401) {
          // 일부 환경에서 인증 필요 시 재시도
          seatRes = await getJson(`${BASE_URL}/seats/${idStr}/`, true);
        }

        // 좌석 파싱
        let total = 0, free = 0;
        if (seatRes.ok && Array.isArray(seatRes.data?.seats)) {
          const seats = seatRes.data.seats;
          total = seats.length;
          free  = seats.filter(s => String(s.status).includes("이용 가능")).length;
        } else {
          console.warn(`[mylib] seats ${idStr} failed:`, seatRes.status, seatRes.data || seatRes.raw);
        }

        // 2) 도서관 상세(운영여부/시간 보강)
        let detRes = await getJson(`${BASE_URL}/libraries/${idStr}/detail/`, false);
        if (!detRes.ok && detRes.status === 401) {
          detRes = await getJson(`${BASE_URL}/libraries/${idStr}/detail/`, true);
        }

        const detail = detRes.ok ? detRes.data : {};
        const levelFromDetail = detail?.congestion ? String(detail.congestion) : null;
        const computedLevel = calcCongestion(total, free);

        return {
          id: idStr,
          current_seats: free,
          total_seats: total,
          // 상세에 혼잡도가 오면 우선 사용, 없으면 계산값 사용
          congestion: levelFromDetail || computedLevel,
          is_open: String(detail?.is_open ?? ""),
          operating_time: String(detail?.operating_time ?? ""),
          _errs: {
            seats: seatRes.ok ? 0 : seatRes.status,
            detail: detRes.ok ? 0 : detRes.status,
          },
        };
      }));

      const map = new Map(results.map(x => [x.id, x]));
      setItems(prev => prev.map(lib => {
        const id = getLibId(lib);
        const live = map.get(String(id));
        if (!live) return lib;
        return {
          ...lib,
          current_seats: live.current_seats ?? lib.current_seats ?? 0,
          total_seats: live.total_seats ?? lib.total_seats ?? 0,
          congestion: live.congestion ?? lib.congestion ?? "-",
          is_open: live.is_open ?? lib.is_open ?? "",
          operating_time: live.operating_time ?? lib.operating_time ?? "",
          _live_error_seats: live._errs?.seats,
          _live_error_detail: live._errs?.detail,
        };
      }));
    } catch (e) {
      console.error("[mylib] refreshLive error:", e);
    }
  }, [token]);

  useEffect(() => {
    fetchFavorites();
    const onFavChanged = () => fetchFavorites();
    window.addEventListener("favorites:changed", onFavChanged);
    return () => window.removeEventListener("favorites:changed", onFavChanged);
  }, [fetchFavorites]);

  useEffect(() => {
    if (!favIds.length) return;
    refreshLive(favIds);
    const t = setInterval(() => refreshLive(favIds), 10000);
    return () => clearInterval(t);
  }, [favIds, refreshLive]);

  return (
    <Outer>
      <PhoneFrame>
        <StatusImg src={StatusBar} alt="상태바" />
        <HeaderBack />

        <TitleBox>
          <H1>나의 도서관</H1>
          <Subtitle>내가 즐겨찾기한 도서관을 모아볼 수 있어요.</Subtitle>
        </TitleBox>

        <BeigeBand />

        <ListWrap>
          {loading && <Hint>불러오는 중…</Hint>}
          {!loading && err && <ErrorMsg>{err}</ErrorMsg>}
          {!loading && !err && items.length === 0 && <Hint>즐겨찾기한 도서관이 없습니다.</Hint>}

          {!loading && !err && items.map((lib, idx) => {
            const id = getLibId(lib);
            const apiImg = lib.image ? (lib.image.startsWith("http") ? lib.image : `${BASE_URL}${lib.image}`) : null;
            const localImg = getLocalImageById(id);
            const imgSrc = apiImg || localImg || defaultImg;
            const level = lib.congestion || "-";

            return (
              <BottomCard 
                key={`${id || "x"}_${idx}`}
                $tall={SPECIAL_LIB_IDS.has(id)}
                onClick={() => navigate(`/detaillib/${id}`)}
              >
                <Thumb 
                  src={imgSrc}
                  alt={lib.name}
                  $tall={SPECIAL_LIB_IDS.has(id)}
                />
                <CardMain $tall={SPECIAL_LIB_IDS.has(id)}>
                  <HeaderRow>
                    <Name style={{ whiteSpace: "pre-line" }} $tall={SPECIAL_LIB_IDS.has(id)}>
                      {formatLibraryName(lib.name)}
                    </Name>
                    <RightInline>
                      <Tag style={{ backgroundColor: PILL_COLOR[level]?.bg || "#ccc" }}>
                        {level}
                      </Tag>
                      <GoIconImg
                        src={arrowRight}
                        alt="상세 이동"
                        onClick={() => id && navigate(`/detaillib/${id}`)}
                      />
                    </RightInline>
                  </HeaderRow>

                  <Detail>
                    <SeatsInfo>
                      <SeatsNum>{lib.current_seats ?? 0}/{lib.total_seats ?? 0}</SeatsNum>
                      <Info>(현재 좌석 수 / 전체 좌석 수)</Info>
                    </SeatsInfo>
                    <OpenTime>
                      <ClockIcon src={clockIcon} alt="" />
                      {lib.is_open} {lib.operating_time}
                    </OpenTime>
                  </Detail>
                </CardMain>
              </BottomCard>
            );
          })}
        </ListWrap>
      </PhoneFrame>
    </Outer>
  );
};

export default MyLibraries;

/* styles */
const Outer = styled.div`
  min-height:100dvh; 
  background:#fff; 
  display:flex; 
  justify-content:center;
`;
const PhoneFrame = styled.div`
  width:393px; 
  height:852px; 
  background:#fff; 
  display:flex; 
  flex-direction:column;
  overflow-y:auto; 
  overflow-x:hidden; 
  box-sizing:border-box;
`;
const StatusImg = styled.img`
  width:100%; 
  height:auto; 
  display:block;
`;
const TitleBox = styled.div`
  margin-top:20px; 
  padding:0 16px; 
  display:flex; 
  flex-direction:column; 
  align-items:center;
`;
const H1 = styled.h1`
  color:#222; 
  font-size:20px; 
  font-weight:700; 
  margin:0 0 6px 0;
`;
const Subtitle = styled.p`
  color:#777; 
  font-size:12px; 
  margin:0;
`;
const BeigeBand = styled.div`
  width:100%; 
  height:12px; 
  background:#efefef; 
  margin-top:28px;
`;
const ListWrap = styled.div`
  width:100%; 
  height:646px; 
  background:#efefef; 
  padding:10px 20px 24px; 
  display:flex; 
  flex-direction:column; 
  gap:12px; 
  box-sizing:border-box;
`;
const Hint = styled.div`
  color:#666; 
  font-size:14px; 
  text-align:center; 
  padding:20px 0;
`;
const ErrorMsg = styled.div`
  color:#d32f2f; 
  font-size:14px; 
  text-align:center; 
  padding:16px 0;
`;


const BottomCard = styled.div`
    width: 353px;
    height: ${({ $tall }) => ($tall ? '150px' : '122px')};

    bottom: 16px;
    z-index: 20;
    display: flex;
    gap: 12px;
    background: #fff;
    border: 10px;
    border-radius: 10px;
    align-items: center;
`;
const Thumb = styled.img`
    width: 100px; 
    height: ${({ $tall }) => ($tall ? '150px' : '122px')};
    border-radius: 10px 0 0 10px;
    object-fit: cover;
    flex-shrink: 0;
`;
const CardMain = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${({ $tall }) => ($tall ? '16px 16px 17px 8px' : '16px 16px 17px 16px')};
    flex: 1;
    gap: 12px;
`;
const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const RightInline = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;
const Name = styled.h3`
    color: #383838;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-weight: 700;
    line-height: 150%;
    margin: 0;
`;
const Tag = styled.div`
    display: flex;
    padding: 4px 16px;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #FFF;
    border-radius: 20px;
`;
const GoIconImg = styled.img`
    width: 24px;
    height: 24px;
`;
const Detail = styled.div`
    display: flex;
    flex-direction: column;
    gap: 9px;
`;
const SeatsInfo = styled.div`
    display: flex;
    flex-direction: column;
`;
const SeatsNum = styled.span`
    color: #0f0f0f;
    font-family: "Pretendard GOV Variable";
    font-size: 14px;
    font-weight: 600;
    line-height: 140%;
`;
const Info = styled.div`
    color: #8e8e8e;
    font-family: "Pretendard GOV Variable";
    font-size: 8px;
    font-weight: 300;
    line-height: 140%;
`;
const OpenTime = styled.div`
    color: #555;
    font-family: "Pretendard GOV Variable";
    font-size: 10px;
    font-weight: 400;
    line-height: 150%;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
`;
const ClockIcon = styled.img`
    width: 16px;
    height: 16px;
`;