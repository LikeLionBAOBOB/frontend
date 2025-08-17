import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import backIcon from "../assets/icons/back.png";
import starIcon from "../assets/icons/star.svg";
import starCheckedIcon from "../assets/icons/star_check.svg";
import logoIcon from "../assets/icons/logo.png";
import defaultBg from "../assets/images/해오름_배경.png";
import bottomShadow from "../assets/icons/frame_shadow.png";
import { HEADER_BG } from "../assets/libraryimages";

const BASE_URL = "https://baobob.pythonanywhere.com";

const extractIdFromImagePath = (p) => {
  if (!p || typeof p !== "string") return "";
  const m = p.match(/(\d{4,})/);
  return m ? m[1] : "";
};

const HeaderBackHero = ({ title, address, libraryId, bg }) => {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    const token = localStorage.getItem("access_token") || "";
    if (!token || !libraryId) return;

    fetch(`${BASE_URL}/libraries/favorites/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(async (r) => {
        if (!r.ok) return [];
        const raw = await r.text();
        return raw ? JSON.parse(raw) : [];
      })
      .then((list) => {
        if (!alive || !Array.isArray(list)) return;
        const exists = list.some((it) => {
          const idFromImg = extractIdFromImagePath(it.image);
          const anyId = String(it.library_id ?? it.id ?? idFromImg ?? "");
          return anyId === String(libraryId);
        });
        setFav(exists);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [libraryId]);

  useEffect(() => {
    const onFavChanged = (e) => {
      const { libraryId: changedId, fav: isFav } = e.detail || {};
      if (String(changedId) === String(libraryId)) setFav(Boolean(isFav));
    };
    window.addEventListener("favorites:changed", onFavChanged);
    return () => window.removeEventListener("favorites:changed", onFavChanged);
  }, [libraryId]);

  const toggleFavorite = async () => {
    if (busy) return;
    const token = localStorage.getItem("access_token") || "";
    if (!token || !libraryId) return;

    setBusy(true);
    const url = `${BASE_URL}/libraries/${libraryId}/favorites/`;
    try {
      if (!fav) {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ library_id: Number(libraryId) }),
        });
        if (res.ok || res.status === 400) {
          setFav(true);
          window.dispatchEvent(new CustomEvent("favorites:changed", { detail: { libraryId, fav: true } }));
        }
      } else {
        const res = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ library_id: Number(libraryId) }),
        });
        if (res.ok || res.status === 400) {
          setFav(false);
          window.dispatchEvent(new CustomEvent("favorites:changed", { detail: { libraryId, fav: false } }));
        }
      }
    } catch {} finally { setBusy(false); }
  };

  return (
    <Wrap>
      <Bg src={bg || HEADER_BG[String(libraryId)] || defaultBg} alt="hero" />

      <ShadowWrap>
        <ShadowPng src={bottomShadow} alt="" />
        <ShadowGrad />
      </ShadowWrap>

      <IconBar>
        <IconBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img src={backIcon} alt="back" />
        </IconBtn>
        <Logo onClick={() => navigate("/")}>
          <img src={logoIcon} alt="logo" />
        </Logo>
        <IconBtn aria-label="즐겨찾기" onClick={toggleFavorite} disabled={busy}>
          <img src={fav ? starCheckedIcon : starIcon} alt="favorite" />
        </IconBtn>
      </IconBar>

      <TitleBox>
        <h1>{title}</h1>
        <p>{address}</p>
      </TitleBox>
    </Wrap>
  );
};

export default HeaderBackHero;

/* styles */
const Wrap = styled.header`width:393px; position:relative; margin:0 auto;`;
const Bg = styled.img`width:100%; height:auto; display:block;`;
const ShadowWrap = styled.div`position:absolute; inset:0; pointer-events:none; display:grid;`;
const ShadowPng = styled.img`align-self:end; width:100%; height:auto;`;
const ShadowGrad = styled.div`
  align-self:end; height:96px;
  background:linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.96) 58%, #fff 100%);
`;
const IconBar = styled.div`
  position:absolute; top:69px; left:0; right:0; width:100%;
  box-sizing:border-box; display:flex; padding:4px 20px; justify-content:space-between; align-items:center;
`;
const IconBtn = styled.button`
  all:unset; cursor:pointer;
  img{ width:24px; height:24px; display:block; }
  &[disabled]{ opacity:.6; pointer-events:none; }
`;
const Logo = styled.div`img{ height:24px; display:block; cursor:pointer; }`;
const TitleBox = styled.div`
  position:absolute; top:127px; left:0; right:0; text-align:center;
  h1{ margin:0; font-size:20px; font-weight:700; }
  p{ margin:4px 0 0; font-size:12px; color:#7a7a7a; }
`;
