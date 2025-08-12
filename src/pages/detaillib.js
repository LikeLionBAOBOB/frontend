// src/pages/detaillib.js
import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderBackHero from "../components/header_ad";
import { seatMapById } from "../components/seatmaps";

// 배포 시 절대경로, 개발 중 프록시 쓸 거면 ""로 바꿔도 됨
const BASE_URL = "https://baobob.pythonanywhere.com";

// 🔧 개발 편의를 위한 도서관 메타(이름/주소) & 배경 PNG 매핑
// 1) PNG 파일을 프로젝트에 추가 (예: src/assets/images/libbg/*)
// 2) import 후 아래 LIB_BG에 id별로 매핑
import bg111179 from "../assets/images/libbg/bg_111179.png";
import bg111051 from "../assets/images/libbg/bg_111051.png";
import bg111252 from "../assets/images/libbg/bg_111252.png";
import bg111086 from "../assets/images/libbg/bg_111086.png";
import bg711596 from "../assets/images/libbg/bg_711596.png";
import bg111514 from "../assets/images/libbg/bg_111514.png";
import bg111467 from "../assets/images/libbg/bg_111467.png";
import bg111257 from "../assets/images/libbg/bg_111257.png";

const LIB_META = {
  "111179": { name: "남가좌새롬도서관", address: "서울 서대문구 증가로10길 16-15" },
  "111051": { name: "이진아기념도서관", address: "" },
  "111252": { name: "홍은도담도서관", address: "" },
  "111086": { name: "마포구립 서강도서관", address: "" },
  "711596": { name: "마포나루 스페이스", address: "" },
  "111514": { name: "마포소금나루도서관", address: "" },
  "111467": { name: "마포중앙도서관", address: "" },
  "111257": { name: "해오름 작은도서관", address: "" },
};

const LIB_BG = {
  "111179": bg111179,
  "111051": bg111051,
  "111252": bg111252,
  "111086": bg111086,
  "711596": bg711596,
  "111514": bg111514,
  "111467": bg111467,
  "111257": bg111257,
};

const LibraryDetail = () => {
  const { libraryId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [tab, setTab] = useState("info"); // "info" | "seats"
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // /detaillib 로 들어올 때 기본 id로 리다이렉트
  useEffect(() => {
    if (!libraryId) navigate("/detaillib/111179", { replace: true });
  }, [libraryId, navigate]);

  // API fetch
  useEffect(() => {
    if (!libraryId) return;
    let alive = true;
    setLoading(true);
    setErr("");

    fetch(`${BASE_URL}/libraries/${libraryId}/detail/`)
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status} ${r.statusText} :: ${text?.slice(0, 200)}`);
        }
        return r.json();
      })
      .then((json) => {
        if (!alive) return;
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        // 🔁 개발 중 CORS/네트워크로 실패하더라도 UI는 보이게 최소 정보 주입
        const meta = LIB_META[libraryId] || {};
        const mock = {
          name: meta.name || "도서관",
          address: meta.address || "",
          images: [], // 헤더 배경은 아래 bgFallback으로 처리
          current_seats: 0,
          total_seats: 0,
          congestion: "-",
          is_open: "",
          operating_time: "",
          detail_time: null,
          naver_map: "",
          site: "",
        };
        setData(mock);
        // 에러 박스는 숨김 (개발 중 화면 확인 목적)
        setErr("");
        setLoading(false);
      });

    return () => { alive = false; };
  }, [libraryId]);

  const images = useMemo(() => {
    if (!data?.images) return [];
    return data.images.map((p) => (p.startsWith("http") ? p : `${BASE_URL}${p}`));
  }, [data]);

  // 헤더 배경: 1) 로컬 PNG 매핑 우선 → 2) API images[0] → 3) 컴포넌트의 기본 PNG
  const bgFallback = LIB_BG[libraryId] || images[0] || undefined;

  // 좌석 수 (가정: current_seats = 이용 가능 좌석 수)
  const total = data?.total_seats ?? 0;
  const available = data?.current_seats ?? 0;

  return (
    <PageWrap>
      {/* 🔁 라이브러리별 배경 적용 */}
      <HeaderBackHero title={data?.name || "도서관"} address={data?.address || ""} bg={bgFallback} />

      <Inner>
        {/* 탭 중앙 정렬 */}
        <Tabs>
          <TabBtn $active={tab === "info"} onClick={() => setTab("info")}>
            도서관 정보
          </TabBtn>
          <TabBtn $active={tab === "seats"} onClick={() => setTab("seats")}>
            좌석 정보
          </TabBtn>
        </Tabs>

        {loading && <Loading>불러오는 중…</Loading>}

        {err && (
          <ErrorBox>
            <div>정보를 불러오지 못했습니다.</div>
            <pre style={{ whiteSpace: "pre-wrap" }}>{err}</pre>
          </ErrorBox>
        )}

        {!loading && !err && data && (
          <>
            {tab === "info" ? (
              <InfoView>
                {/* 사진 가로 스크롤 */}
                {images.length > 0 && (
                  <PhotoStrip>
                    {images.map((src, i) => (
                      <Photo key={i}>
                        <img src={src} alt={`library-${i + 1}`} />
                      </Photo>
                    ))}
                  </PhotoStrip>
                )}

                {/* 지표 */}
                <KPIRow>
                  <Left>
                    <Big>{available} / {total}</Big>
                    <Small>현재 좌석 수 / 전체 좌석 수</Small>
                  </Left>
                  <Right>
                    <Badge $level={data.congestion}>{data.congestion || "-"}</Badge>
                  </Right>
                </KPIRow>

                {/* 운영 정보 */}
                {(data.is_open || data.operating_time) && (
                  <Card>
                    {data.is_open && (
                      <Line>
                        <Label>운영 상태</Label>
                        <Value>{data.is_open}</Value>
                      </Line>
                    )}
                    {data.operating_time && (
                      <Line>
                        <Label>운영 시간</Label>
                        <Value>{data.operating_time}</Value>
                      </Line>
                    )}
                  </Card>
                )}

                {/* 요일별 시간표 */}
                {data.detail_time && (
                  <Card>
                    <SectionTitle>시설 정보</SectionTitle>
                    <TimeTable>
                      {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
                        <li key={d}>
                          <span>{d}</span>
                          <em>{data.detail_time[d] || "-"}</em>
                        </li>
                      ))}
                    </TimeTable>
                  </Card>
                )}

                {/* 외부 링크 */}
                <Links>
                  {data.naver_map && (
                    <a href={data.naver_map} target="_blank" rel="noreferrer">네이버 지도 →</a>
                  )}
                  {data.site && (
                    <a href={data.site} target="_blank" rel="noreferrer">도서관 사이트 →</a>
                  )}
                </Links>
              </InfoView>
            ) : (
              <SeatView>
                <KPIRow>
                  <Left>
                    <Big>{available} / {total}</Big>
                    <Small>이용 가능 좌석 / 전체 좌석 수</Small>
                  </Left>
                  <Right>
                    <Badge $level={data.congestion}>{data.congestion || "-"}</Badge>
                  </Right>
                </KPIRow>

                {/* 좌석 전용 컴포넌트 스왑 */}
                <Suspense fallback={<Loading>좌석 불러오는 중…</Loading>}>
                  {(() => {
                    const Comp = seatMapById[libraryId];
                    return Comp ? <Comp available={available} total={total} /> : <Empty>좌석 맵이 없습니다.</Empty>;
                  })()}
                </Suspense>
              </SeatView>
            )}
          </>
        )}

        {/* 참고용 링크 */}
        <FooterLinks>
          <Link to="/detaillib/111179">남가좌새롬도서관</Link>
          <Link to="/detaillib/111051">이진아기념도서관</Link>
          <Link to="/detaillib/111252">홍은도담도서관</Link>
          <Link to="/detaillib/111086">서강도서관</Link>
          <Link to="/detaillib/711596">마포나루 스페이스</Link>
          <Link to="/detaillib/111514">마포소금나루도서관</Link>
          <Link to="/detaillib/111467">마포중앙도서관</Link>
          <Link to="/detaillib/111257">해오름 작은도서관</Link>
        </FooterLinks>
      </Inner>
    </PageWrap>
  );
};

export default LibraryDetail;

/* ================= styles ================= */
const PageWrap = styled.div`
  width: 393px;
  margin: 0 auto;
`;
const Inner = styled.main`
  padding: 0 16px 40px;
`;
const Tabs = styled.div`
  display: flex;
  justify-content: center;   /* ✅ 중앙 정렬 */
  gap: 24px;
  margin: 8px 0 16px;
  border-bottom: 1px solid #eee;
`;
const TabBtn = styled.button`
  all: unset;
  cursor: pointer;
  padding: 12px 4px;
  position: relative;
  color: ${(p) => (p.$active ? "#000" : "#8a8a8a")};
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: ${(p) => (p.$active ? "#000" : "transparent")};
  }
`;
const Loading = styled.div` padding: 24px 0; color: #666; `;
const ErrorBox = styled.div` padding: 16px; background:#fff3f3; color:#c00; border-radius:12px; `;
const InfoView = styled.section``;
const SeatView = styled.section``;

/* 사진 가로 스크롤 */
const PhotoStrip = styled.div`
  margin: 6px 0 16px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;
const Photo = styled.div`
  flex: 0 0 auto;
  width: 180px; height: 112px;
  border-radius: 12px; overflow: hidden; background:#f2f2f2;
  img { width:100%; height:100%; object-fit: cover; display:block; }
`;
const KPIRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin: 8px 0 16px;
`;
const Left = styled.div``;
const Right = styled.div``;
const Big = styled.div` font-size: 20px; font-weight: 800; `;
const Small = styled.div` font-size: 11px; color: #8a8a8a; margin-top: 2px; `;
const Badge = styled.span`
  display: inline-block; padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;
  background: ${({ $level }) => {
    if ($level === "여유") return "#e7f6ed";
    if ($level === "보통") return "#fff3d6";
    if ($level === "혼잡") return "#ffe6e6";
    return "#eee";
  }};
  color: ${({ $level }) => {
    if ($level === "여유") return "#1e7f4c";
    if ($level === "보통") return "#a66a00";
    if ($level === "혼잡") return "#b71c1c";
    return "#555";
  }};
`;
const Card = styled.div`
  border: 1px solid #eee; border-radius: 16px; padding: 12px 14px; margin-bottom: 12px; background:#fff;
`;
const Line = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 8px 0;
  &:not(:last-child){ border-bottom: 1px dashed #eee; }
`;
const Label = styled.div` font-size: 13px; color:#666; `;
const Value = styled.div` font-size: 13px; font-weight: 700; `;
const SectionTitle = styled.div` font-size: 14px; font-weight: 800; margin-bottom: 8px; `;
const TimeTable = styled.ul`
  list-style: none; margin:0; padding:0;
  li{
    display:flex; justify-content: space-between; align-items:center; padding:8px 0;
    span{ font-weight:700; width:32px; }
    em{ font-style: normal; color:#333; }
    &:not(:last-child){ border-bottom: 1px dashed #eee; }
  }
`;
const Links = styled.div`
  display:flex; gap:12px; margin-top: 8px; flex-wrap: wrap;
  a{ font-size:13px; text-decoration:none; color:#1f6feb; }
`;
const Empty = styled.div` padding: 24px 0; color:#888; text-align:center; `;
const FooterLinks = styled.div`
  display:flex; flex-wrap:wrap; gap:8px; margin-top: 24px;
  a{ font-size:12px; color:#6b6b6b; text-decoration: none; border:1px solid #eee; padding:6px 8px; border-radius:999px; }
`;
