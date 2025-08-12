// src/pages/detaillib.js
import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderBackHero from "../components/header_ad";
import { seatMapById } from "../components/seatmaps";
import { GALLERY } from "../assets/libraryimages"; // ← 대소문자 주의

// 배포 시 절대경로, 개발 중 프록시 쓰면 ""로도 가능
const BASE_URL = "https://baobob.pythonanywhere.com";

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
      .catch(() => {
        if (!alive) return;
        // 개발 중 CORS 대비: 최소 폴백
        const meta = LIB_META[libraryId] || {};
        setData({
          name: meta.name || "도서관",
          address: meta.address || "",
          images: [],
          current_seats: 0,
          total_seats: 0,
          congestion: "-",
          is_open: "",
          operating_time: "",
          detail_time: null,
          naver_map: "",
          site: "",
        });
        setErr("");
        setLoading(false);
      });

    return () => { alive = false; };
  }, [libraryId]);

  // 갤러리: 로컬 매핑 우선 → 없으면 API images
  const gallery = useMemo(() => {
    const local = GALLERY[String(libraryId)] || [];
    const apiList = (data?.images || []).map((p) =>
      p.startsWith("http") ? p : `${BASE_URL}${p}`
    );
    return local.length ? local : apiList;
  }, [libraryId, data]);

  // 좌석 수 (가정: current_seats = 이용 가능 좌석 수)
  const total = data?.total_seats ?? 0;
  const available = data?.current_seats ?? 0;

  // 링크 표시용(아래 작은 회색 URL 텍스트)
  const shortUrl = (url) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      return u.href;
    } catch {
      return url;
    }
  };

  return (
    <PageWrap>
      {/* 헤더: 이름 + 주소(API) */}
      <HeaderBackHero
        title={data?.name || "도서관"}
        address={data?.address || ""}
        libraryId={libraryId}
      />

      <Inner>
        {/* 탭: 정확히 좌/우 1/2 위치 */}
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
                {/* 1) 갤러리: 사각형, 간격 0, 스크롤바 숨김 */}
                {gallery.length > 0 && (
                  <PhotoStrip>
                    {gallery.map((src, i) => (
                      <Photo key={i}>
                        <img src={src} alt={`library-${i + 1}`} />
                      </Photo>
                    ))}
                  </PhotoStrip>
                )}

                {/* 5) 좌측: 좌석 지표 / 우측: 혼잡도 배지 */}
                <KPIRow>
                  <Left>
                    <Big>{available} / {total}</Big>
                    <Small>현재 좌석 수 / 전체 좌석 수</Small>
                  </Left>
                  <Right>
                    <Badge $level={data.congestion}>{data.congestion || "-"}</Badge>
                  </Right>
                </KPIRow>

                {/* 4) 좌석지표 바로 아래 '운영중 + 운영시간' */}
                {(data.is_open || data.operating_time) && (
                  <Card>
                    <Opener>
                      {data.is_open && <strong>{data.is_open}</strong>}
                      {data.operating_time && <span>{data.operating_time}</span>}
                    </Opener>
                  </Card>
                )}

                {/* (선택) 요일별 시간표 */}
                {data.detail_time && (
                  <Card>
                    <SectionTitle>시설 정보</SectionTitle>
                    <TimeTable>
                      {["월","화","수","목","금","토","일"].map((d) => (
                        <li key={d}>
                          <span>{d}</span>
                          <em>{data.detail_time[d] || "-"}</em>
                        </li>
                      ))}
                    </TimeTable>
                  </Card>
                )}

                {/* +) 운영 시간 아래 링크 2개 (네이버 지도 / 도서관 사이트) */}
                {(data.naver_map || data.site) && (
                  <LinkList>
                    {data.naver_map && (
                      <li>
                        <div className="icon">📍</div>
                        <div className="texts">
                          <a href={data.naver_map} target="_blank" rel="noreferrer">
                            네이버 지도 — {data.name || ""}
                          </a>
                          <small>{shortUrl(data.naver_map)}</small>
                        </div>
                      </li>
                    )}
                    {data.site && (
                      <li>
                        <div className="icon">🔗</div>
                        <div className="texts">
                          <a href={data.site} target="_blank" rel="noreferrer">
                            도서관 사이트 — {data.name || ""}
                          </a>
                          <small>{shortUrl(data.site)}</small>
                        </div>
                      </li>
                    )}
                  </LinkList>
                )}
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
                    const Comp = seatMapById[String(libraryId)];
                    return Comp ? <Comp available={available} total={total} /> : <Empty>좌석 맵이 없습니다.</Empty>;
                  })()}
                </Suspense>
              </SeatView>
            )}
          </>
        )}
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

/* 2) 탭을 화면 폭 기준 정확히 반반 */
const Tabs = styled.div`
  display: flex;
  width: calc(100% + 32px);   /* 좌우 패딩을 무시하고 화면 전체 폭 사용 */
  margin: 8px -16px 16px;     /* 패딩 상쇄 → 시각적 중앙선(196.5px) 일치 */
  border-bottom: 1px solid #eee;
`;
const TabBtn = styled.button`
  all: unset;
  flex: 1;                    /* 반반 */
  text-align: center;
  cursor: pointer;
  padding: 12px 0;
  position: relative;
  color: ${(p) => (p.$active ? "#000" : "#8a8a8a")};
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  &:after{
    content:"";
    position:absolute; left:0; right:0; bottom:-1px; height:2px;
    background: ${(p) => (p.$active ? "#000" : "transparent")};
  }
`;

const Loading = styled.div` padding: 24px 0; color: #666; `;
const ErrorBox = styled.div` padding: 16px; background:#fff3f3; color:#c00; border-radius:12px; `;
const InfoView = styled.section``;
const SeatView = styled.section``;

/* 1) 갤러리: 사각형, 간격 0, 스크롤바 숨김 */
const PhotoStrip = styled.div`
  margin: 6px 0 16px;
  display: flex;
  gap: 0;                     /* 간격 제거 */
  overflow-x: auto;
  padding-bottom: 4px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;
const Photo = styled.div`
  flex: 0 0 auto;
  width: 184px;               /* 딱 붙었을 때 보기 좋은 폭(필요시 조정) */
  height: 112px;
  border-radius: 12px;
  overflow: hidden;
  background:#f2f2f2;
  img { width:100%; height:100%; object-fit: cover; display:block; }
`;

const KPIRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin: 8px 0 12px;
`;
const Left = styled.div``;
const Right = styled.div``;
const Big = styled.div` font-size: 20px; font-weight: 800; `;
const Small = styled.div` font-size: 11px; color: #8a8a8a; margin-top: 2px; `;

/* 5) 혼잡도 배지 */
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

/* 4) 운영중 + 운영시간 한 줄 */
const Card = styled.div`
  border: 1px solid #eee; border-radius: 16px; padding: 12px 14px; margin-bottom: 12px; background:#fff;
`;
const Opener = styled.div`
  display:flex; align-items:center; gap:8px; font-size:13px;
  strong{ font-weight:800; }
  span{ color:#333; }
`;

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

/* +) 운영 시간 아래 링크 2개 스타일 */
const LinkList = styled.ul`
  list-style: none; margin: 8px 0 0; padding: 0;
  li{
    display: flex; align-items: flex-start; gap: 10px; padding: 8px 0;
  }
  .icon{
    width: 20px; height: 20px; border-radius: 50%;
    background: #f1f1f1; display: grid; place-items: center; font-size: 12px;
    flex: 0 0 20px;
  }
  .texts a{
    font-size: 13px; color: #1f6feb; text-decoration: none;
  }
  .texts small{
    display:block; margin-top: 2px; font-size: 10px; color: #9a9a9a; word-break: break-all;
  }
`;

const Empty = styled.div` padding: 24px 0; color:#888; text-align:center; `;
