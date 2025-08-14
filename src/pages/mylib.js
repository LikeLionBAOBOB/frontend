// src/pages/MyLibraries.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import StatusBar from "../assets/icons/StatusBar.png";
import HeaderBack from "../components/header_back";
import arrowRight from "../assets/icons/arrow_rightup.png";
import clockIcon from "../assets/icons/clock.png";
import defaultImg from "../assets/images/lib/111051/1.jpg";

const BASE_URL = "https://baobob.pythonanywhere.com/";
const FAVORITES_LIST_URL = `${BASE_URL}/libraries/favorites/`;
const FAVORITE_ITEM_URL = (library_id) =>
  `${BASE_URL}/libraries/${library_id}/favorites/`;

const PILL_COLOR = {
  혼잡: { bg: "#FF474D", color: "#fff" },
  보통: { bg: "#FFB724", color: "#222" },
  여유: { bg: "#33A14B", color: "#fff" },
};

/* ▼ 로컬 이미지 자동 로드 */
const libImages = require.context(
  "../assets/images/lib",
  true,
  /\.(png|jpe?g|webp)$/
);
const getLibraryImage = (id) => {
  const candidates = [
    `./${id}/1.jpg`,
    `./${id}/1.jpeg`,
    `./${id}/1.png`,
    `./${id}/1.webp`,
  ];
  for (const p of candidates) {
    try {
      return libImages(p);
    } catch {}
  }
  return defaultImg;
};

const MyLibraries = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = useMemo(
    () => localStorage.getItem("access_token") || "",
    []
  );

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
      try {
        data = raw ? JSON.parse(raw) : [];
      } catch {}
      if (!res.ok) {
        if (res.status === 401)
          setErr("인증이 필요합니다. 로그인 후 다시 시도해 주세요.");
        else setErr(data?.message || `목록 조회 실패 (${res.status})`);
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
  }, [fetchFavorites]);


  useEffect(() => {
    const onChanged = (e) => {
      const { libraryId, fav } = e.detail || {};
      if (!libraryId) return;

      if (fav) {
        fetchFavorites();
      } else {
        setItems((prev) =>
          prev.filter(
            (x) =>
              String((x.library_id ?? x.id ?? x.code ?? x.name_id)) !==
              String(libraryId)
          )
        );
      }
    };
    window.addEventListener("favorites:changed", onChanged);
    return () => window.removeEventListener("favorites:changed", onChanged);
  }, [fetchFavorites]);

  const getId = (lib) => lib.library_id ?? lib.id;

  const isFavorited = useCallback(
    (library_id) =>
      items.some((x) => String(getId(x)) === String(library_id)),
    [items]
  );

  const addFavorite = useCallback(
    async (library_id) => {
      const res = await fetch(FAVORITE_ITEM_URL(library_id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ library_id }),
      });
      if (res.ok || res.status === 400) return;
      const raw = await res.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {}
      throw new Error(data?.message || `추가 실패 (${res.status})`);
    },
    [token]
  );

  const removeFavorite = useCallback(
    async (library_id) => {
      const res = await fetch(FAVORITE_ITEM_URL(library_id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ library_id }),
      });

      if (res.ok || res.status === 400) return;
      const raw = await res.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {}
      throw new Error(data?.message || `삭제 실패 (${res.status})`);
    },
    [token]
  );

  const toggleFavorite = useCallback(
    async (library_id) => {
      try {
        if (isFavorited(library_id)) {
          setItems((prev) =>
            prev.filter((x) => String(getId(x)) !== String(library_id))
          );
          await removeFavorite(library_id);
        } else {
          await addFavorite(library_id);
          await fetchFavorites();
        }
      } catch (e) {
        setErr(e.message || "처리 중 오류가 발생했습니다.");
        fetchFavorites();
      }
    },
    [isFavorited, addFavorite, removeFavorite, fetchFavorites]
  );

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
          {!loading && !err && items.length === 0 && (
            <Hint>즐겨찾기한 도서관이 없습니다.</Hint>
          )}

          {!loading &&
            !err &&
            items.map((lib) => {
              const id = getId(lib);
              const imgSrc = getLibraryImage(id);
              return (
                <Card key={id}>
                  <Thumb style={{ backgroundImage: `url(${imgSrc})` }} />
                  <Info>
                    <TopLine>
                      <LibName title={lib.name}>{lib.name}</LibName>
                      <Pill $level={lib.congestion}>{lib.congestion}</Pill>
                      <Arrow src={arrowRight} alt="자세히" />
                    </TopLine>

                    <Seats>
                      <strong>{lib.current_seats}</strong> / {lib.total_seats}
                    </Seats>

                    <MetaRow>
                      <MetaIcon src={clockIcon} alt="" />
                      <Meta>
                        {lib.is_open} {lib.operating_time}
                      </Meta>
                    </MetaRow>

                    <FavRow>
                      <FavButton onClick={() => toggleFavorite(id)}>
                        {isFavorited(id) ? "★ 즐겨찾기" : "☆ 즐겨찾기"}
                      </FavButton>
                    </FavRow>
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

/* styles */
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
  width: 100%;
  height: 122px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 100px 1fr;
  column-gap: 12px;
  overflow: hidden;
`;
const Thumb = styled.div`
  width: 100px;
  height: 122px;
  flex-shrink: 0;
  background: #ddd center/cover no-repeat;
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 8px 10px 0;
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
  font-size: 16px;
  font-weight: 700;
  line-height: 150%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
`;
const Pill = styled.span`
  display: flex;
  width: 48px;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  box-sizing: border-box;
  background: ${({ $level }) => PILL_COLOR[$level]?.bg || "#ccc"};
  color: ${({ $level }) => PILL_COLOR[$level]?.color || "#222"};
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  white-space: nowrap;
`;
const Arrow = styled.img`
  width: 24px;
  height: 24px;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  justify-self: end;
`;
const Seats = styled.div`
  font-size: 14px;
  color: #111;
  strong {
    font-weight: 800;
  }
`;
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const MetaIcon = styled.img`
  width: 12px;
  height: 12px;
  object-fit: contain;
  display: block;
`;
const Meta = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1;
`;
const FavRow = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
`;
const FavButton = styled.button`
  padding: 8px 10px;
  border: 1px solid #e6e6e6;
  background: #fff;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;
