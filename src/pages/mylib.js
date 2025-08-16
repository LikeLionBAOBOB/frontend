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

const PILL_COLOR = {
  혼잡: { bg: "#FF474D" },
  보통: { bg: "#FFB724" },
  여유: { bg: "#33A14B" },
};

let libImages;
try {
  libImages = require.context("../assets/images/lib", true, /\.(png|jpe?g|webp)$/);
} catch {}

const fileExists = (loader, p) => {
  try { return loader(p); } catch { return null; }
};

const getLocalImageById = (id) => {
  if (!id) return null;
  const candidates = [`./${id}/1.png`, `./${id}/1.jpg`, `./${id}/1.jpeg`, `./${id}/1.webp`];
  if (libImages) {
    for (const p of candidates) {
      const hit = fileExists(libImages, p);
      if (hit) return hit;
    }
  }
  for (const p of ["1.png", "1.jpg", "1.jpeg", "1.webp"]) {
    try {
      return new URL(`../assets/images/lib/${id}/${p}`, import.meta.url).href;
    } catch {}
  }
  return null;
};

const extractIdFromImagePath = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return "";
  const m = imagePath.match(/(\d{4,})/);
  return m ? m[1] : "";
};

const getLibId = (lib) =>
  String(lib.library_id ?? lib.id ?? extractIdFromImagePath(lib.image) ?? "") || "";

const MyLibraries = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = useMemo(() => localStorage.getItem("access_token") || "", []);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(FAVORITES_LIST_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = await res.text();
      let data = [];
      try { data = raw ? JSON.parse(raw) : []; } catch {}
      if (!res.ok) {
        setErr(data?.message || `목록 조회 실패 (${res.status})`);
        setItems([]);
      } else {
        setItems(Array.isArray(data) ? data : []);
      }
    } catch {
      setErr("네트워크 오류가 발생했습니다.");
      setItems([]);
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

            const apiImg =
              lib.image ? (lib.image.startsWith("http") ? lib.image : `${BASE_URL}${lib.image}`) : null;
            const localImg = getLocalImageById(id);
            const imgSrc = apiImg || localImg || defaultImg;

            const level = lib.congestion || "-";

            return (
              <Card key={`${id || "x"}_${idx}`}>
                <Thumb style={{ backgroundImage: `url(${imgSrc})` }} />
                <Info>
                  <TopLine>
                    <LibName title={lib.name}>{lib.name}</LibName>
                    <Pill $level={level}><span>{level}</span></Pill>
                    <ArrowButton
                      aria-label="도서관 상세로 이동"
                      onClick={() => id && navigate(`/detaillib/${id}`)}
                      disabled={!id}
                      title={id ? "상세로 이동" : "ID 없음"}
                    >
                      <Arrow src={arrowRight} alt="" />
                    </ArrowButton>
                  </TopLine>

                  <Seats>
                    <strong>{lib.current_seats ?? 0}</strong> / {lib.total_seats ?? 0}
                  </Seats>
                  <SeatsHint>(현재 좌석 수 / 전체 좌석 수)</SeatsHint>

                  <MetaRow>
                    <MetaIcon src={clockIcon} alt="" />
                    <Meta>{lib.is_open} {lib.operating_time}</Meta>
                  </MetaRow>
                </Info>
              </Card>
            );
          })}
        </ListWrap>
      </PhoneFrame>
    </Outer>
  );
};

export default MyLibraries;

const Outer = styled.div`
  min-height: 100dvh;
  background: #fff;
  display: flex;
  justify-content: center;
`;

const PhoneFrame = styled.div`
  width: 393px;
  height: 852px;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const StatusImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const TitleBox = styled.div`
  margin-top: 20px;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const H1 = styled.h1`
  color: #222;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 6px 0;
`;
const Subtitle = styled.p`
  color: #777;
  font-size: 12px;
  margin: 0;
`;

const BeigeBand = styled.div`
  width: 100%;
  height: 12px;
  background: #efefef;
  margin-top: 28px;
`;

const ListWrap = styled.div`
  width: 100%;
  height: 646px;
  background: #efefef;
  padding: 12px 20px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
`;

const Hint = styled.div`
  color: #666;
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
`;
const ErrorMsg = styled.div`
  color: #d32f2f;
  font-size: 14px;
  text-align: center;
  padding: 16px 0;
`;

const Card = styled.div`
  width: 353px;
  height: 122px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
  display: grid;
  grid-template-columns: 100px 1fr;
  column-gap: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
`;

const Thumb = styled.div`
  width: 100px;
  height: 122px;
  flex-shrink: 0;
  background: #ddd center/cover no-repeat;
  border-radius: 10px 0 0 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 12px 10px 0;
  min-width: 0;
  gap: 6px;
  box-sizing: border-box;
`;

const TopLine = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 24px;
  align-items: center;
  column-gap: 8px;
`;

const LibName = styled.div`
  color: #383838;
  font-family: "Pretendard GOV Variable";
  font-weight: 700;
  line-height: 150%;
  font-size: clamp(12px, 2.8vw, 16px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  min-width: 0;
`;

const Pill = styled.span`
  display: flex;
  width:30px;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: ${({ $level }) => PILL_COLOR[$level]?.bg || "#ccc"};
  color: #fff;
  font-family: "Pretendard GOV Variable";
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
`;

const ArrowButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  &[disabled] { opacity: .4; cursor: not-allowed; }
`;
const Arrow = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  object-fit: contain;
`;

const Seats = styled.div`
  color: #0F0F0F;
  font-family: "Pretendard GOV Variable";
  font-size: 14px;
  font-weight: 600;
  line-height: 140%;
`;
const SeatsHint = styled.div`
  color: #8E8E8E;
  font-family: "Pretendard GOV Variable";
  font-size: 8px;
  font-weight: 300;
  line-height: 140%;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const MetaIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  object-fit: contain;
`;
const Meta = styled.div`
  color: #555;
  font-family: "Pretendard GOV Variable";
  font-size: 10px;
  font-weight: 400;
  line-height: 150%;
`;
