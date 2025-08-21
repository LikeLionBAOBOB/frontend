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
  "111514",
  "111051",
  "711596",
  "111179",
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

  useEffect(() => {
    fetchFavorites();
    const onFavChanged = () => fetchFavorites();
    window.addEventListener("favorites:changed", onFavChanged);
    return () => window.removeEventListener("favorites:changed", onFavChanged);
  }, [fetchFavorites]);

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
  padding: 16px 16px 17px 8px;
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
