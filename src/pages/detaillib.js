// src/pages/detaillib.js
import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderBackHero from "../components/header_detail";
import { seatMapById } from "../components/seatmaps";
import { GALLERY } from "../assets/libraryimages";
import clockIcon from "../assets/icons/clock.png";
import pinIcon from "../assets/icons/location.png";
import linkIcon from "../assets/icons/link.png";

const BASE_URL = "https://baobob.pythonanywhere.com";

// 객체/배열/문자열 모두를 "표시 가능한 문자열 배열"로 정규화
const toLines = (val) => {
  if (val == null) return [];
  if (Array.isArray(val)) return val.map((v) => String(v));
  if (typeof val === "object") {
    // 예: { "어린이자료실":"09:00-18:00", "종합/디지털자료실":"09:00-22:00" }
    return Object.entries(val).map(([k, v]) => `${k} ${String(v)}`);
  }
  return [String(val)];
};


/* 어떤 타입이 와도 문자열로 */
const toText = (v) => {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(" ");
  if (typeof v === "object") return Object.values(v).map(toText).filter(Boolean).join(" ");
  return String(v);
};

/* "09:00-18:00" → "09:00 - 18:00", "정기휴무(" → "정기휴무 (" */
const formatDetail = (s) =>
  toText(s)
    .replace(/정기휴무\(/g, "정기휴무 (")
    .replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/g, "$1 - $2");

const LibraryDetail = () => {
  const { libraryId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [tab, setTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const displayOperatingTime = useMemo(() => {
    const src = data?.operating_time || "";
    return formatDetail(src);
  }, [data]);

  useEffect(() => {
    if (!libraryId) navigate("/detaillib/111179", { replace: true });
  }, [libraryId, navigate]);

  useEffect(() => {
    if (!libraryId) return;
    let alive = true;
    setLoading(true);
    setErr("");

    const token = localStorage.getItem("access_token") || "";

    fetch(`${BASE_URL}/libraries/${libraryId}/detail/`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (r) => {
        const raw = await r.text().catch(() => "");
        let api = {};
        try {
          api = raw ? JSON.parse(raw) : {};
        } catch {}
        if (!r.ok) {
          const m = api?.message || `HTTP ${r.status}`;
          throw new Error(m);
        }
        return api;
      })
      .then((api) => {
        if (!alive) return;
        setData({
          name: toText(api.name) || "도서관",
          address: toText(api.address),
          congestion: toText(api.congestion) || "-",
          is_open: toText(api.is_open),
          operating_time: toText(api.operating_time),
          detail_time: api.detail_time ?? null,
          naver_map: toText(api.naver_map),
          site: toText(api.site),
          total_seats: Number(api.total_seats ?? 0),
          current_seats: Number(api.current_seats ?? 0),
          images: Array.isArray(api.images) ? api.images : [], // gallery 계산에서 사용
        });
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(String(e?.message || ""));
        setLoading(false);
        setData(null);
      });

    return () => {
      alive = false;
    };
  }, [libraryId]);

  // 이미지: 프론트(GALLERY) 우선, 없으면 API 이미지(상대경로에는 BASE_URL 붙임)
  const gallery = useMemo(() => {
    const local = GALLERY[String(libraryId)] || [];
    const apiList = (data?.images || []).map((p) =>
      /^https?:\/\//i.test(p) ? p : `${BASE_URL}${p}`
    );
    return local.length ? local : apiList;
  }, [libraryId, data]);

  // 좌석 계산 — UI(자리 그림)는 available=이용 가능 좌석 수를 기대
  const total = Number(data?.total_seats ?? 0);
  const occupied = Number(data?.current_seats ?? 0);     // 현재 좌석 수 = 이용 중
  const free = Math.max(total - occupied, 0);            // 이용 가능

  return (
    <PageWrap>
      <HeaderBackHero
        title={data?.name || "도서관"}
        address={data?.address || ""}
        libraryId={libraryId}
      />

      <Inner>
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
                {gallery.length > 0 && (
                  <PhotoStrip>
                    {gallery.map((src, i) => (
                      <Photo key={i}>
                        <img src={src} alt={`library-${i + 1}`} />
                      </Photo>
                    ))}
                  </PhotoStrip>
                )}

                <KPIBlock>
                  <KPIHeading>실시간 혼잡도</KPIHeading>
                  <KPIInline>
                    {/* 현재 / 전체 */}
                    <Big>{occupied} / {total}</Big>
                    <Badge $level={data.congestion}>
                      {data.congestion || "-"}
                    </Badge>
                  </KPIInline>
                  <Small>(현재 좌석 수 / 전체 좌석 수)</Small>
                </KPIBlock>

                <Card>
                  <SectionTitle>시설 정보</SectionTitle>

                  <Opener style={{ marginTop: 10 }}>
                    <img className="icon" src={clockIcon} alt="운영시간" />
                    <div className="texts">
                      <strong>{data.is_open || ""}</strong>
                      {displayOperatingTime && <span>{displayOperatingTime}</span>}
                    </div>
                  </Opener>

                  {data.detail_time && (
                    <TimeTable style={{ marginTop: 8 }}>
                      {["월", "화", "수", "목", "금", "토", "일"].map((d) => {
                        const v = data.detail_time[d];
                        if (v == null) return null;
                        const lines = toLines(v);
                        return (
                          <li key={d}>
                            <span>{d}</span>
                            <div className="lines">
                              {lines.map((t, i) => (
                                <em key={i}>
                                  {"\u00A0\u00A0\u00A0"}
                                  {formatDetail(t)}
                                </em>
                              ))}
                            </div>
                          </li>
                        );
                      })}
                    </TimeTable>
                  )}
                </Card>

                {(data.naver_map || data.site) && (
                  <LinkList>
                    {data.naver_map && (
                      <li>
                        <img className="icon" src={pinIcon} alt="지도" />
                        <div className="texts">
                          <a href={data.naver_map} target="_blank" rel="noreferrer">
                            네이버 지도 — {data.name || ""}
                          </a>
                        </div>
                      </li>
                    )}
                    {data.site && (
                      <li>
                        <img className="icon" src={linkIcon} alt="링크" />
                        <div className="texts">
                          <a href={data.site} target="_blank" rel="noreferrer">
                            도서관 사이트 — {data.name || ""}
                          </a>
                        </div>
                      </li>
                    )}
                  </LinkList>
                )}
              </InfoView>
            ) : (
              <SeatView>
                <KPIBlock>
                  <KPIRow>
                    <KPIInline>
                      {/* 현재 / 전체 */}
                      <Big>{occupied} / {total}</Big>
                      <Badge $level={data.congestion}>
                        {data.congestion || "-"}
                      </Badge>
                    </KPIInline>

                    <LegendBar role="group" aria-label="좌석 범례">
                      <LegendItem>
                        <span>이용 가능한 좌석</span>
                        <LegendDot aria-hidden="true" />
                      </LegendItem>
                      <LegendItem>
                        <span>이용 중인 좌석</span>
                        <LegendDot $filled aria-hidden="true" />
                      </LegendItem>
                    </LegendBar>
                  </KPIRow>
                  <Small>(현재 좌석 수 / 전체 좌석 수)</Small>
                </KPIBlock>

                <Suspense fallback={<Loading>좌석 불러오는 중…</Loading>}>
                  {(() => {
                    const Comp = seatMapById[String(libraryId)];
                    return Comp ? (
                      // 자리 그림은 available=이용 가능 좌석 수를 기대
                      <Comp total={total} available={free} occupied={occupied} />
                    ) : (
                      <Empty>좌석 맵이 없습니다.</Empty>
                    );
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

/* styles (변경 없음) */
const PageWrap = styled.div`
  width: 393px;
  margin: 0 auto;
`;
const Inner = styled.main`
  padding: 0 16px 40px;
`;

const Tabs = styled.div`
  display: flex;
  width: calc(100% + 32px);
  margin: 8px -16px 16px;
  border-bottom: 1px solid #eee;
`;
const TabBtn = styled.button`
  all: unset;
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 12px 0;
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

const Loading = styled.div`
  padding: 24px 0;
  color: #666;
`;
const ErrorBox = styled.div`
  padding: 16px;
  background: #fff3f3;
  color: #c00;
  border-radius: 12px;
`;
const InfoView = styled.section``;
const SeatView = styled.section``;

const Photo = styled.div`
  flex: 0 0 auto;
  width: 184px;
  height: 112px;
  overflow: hidden;
  background: #f2f2f2;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const KPIBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0 12px;
`;
const KPIHeading = styled.div`
  color: #1d1d1d;
  font-size: 20px;
  font-weight: 600;
  line-height: 150%;
  margin-bottom: 4px;
`;
const KPIInline = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Big = styled.div`
  color: #555;
  font-size: 20px;
  font-weight: 400;
  line-height: normal;
`;

const Small = styled.div`
  color: #8e8e8e;
  font-size: 10px;
  font-weight: 300;
  line-height: normal;
  margin-top: 2px;
  margin-bottom: 12px;
`;

const Badge = styled.span`
  font-size: 14px;
  font-weight: 400;
  display: flex;
  width: 30px;
  padding: 3px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  color: #fff;
  background: ${p =>
    p.$level === "여유" ? "#33A14B" :
    p.$level === "보통" ? "#FFB724" :
    p.$level === "혼잡" ? "#FF474D" :
    "#bbb"};
`;

const Card = styled.div`
  border: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 12px;
  background: transparent;
`;

const TimeTable = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 30px;
  li {
    display: flex;
    gap: 0px;
    padding: 6px 0;
    align-items: flex-start;
  }
  span {
    width: 28px;
    color: #444444;
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;
  }
  .lines {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  em {
    font-style: normal;
    color: #444444;
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;
    white-space: pre-wrap;
  }
`;

const SectionTitle = styled.div`
  color: #1d1d1d;
  font-size: 20px;
  font-weight: 600;
  line-height: 150%;
  margin-bottom: 10px;
`;

const Opener = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
  .texts {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .texts strong,
  .texts span {
    color: #444;
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;
  }
`;

const LinkList = styled.ul`
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 0;
  }
  .icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    margin-top: 2px;
  }
  .texts a {
    color: #8e8e8e;
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;
    text-decoration-line: underline;
  }
`;

const PhotoStrip = styled.div`
  margin: 6px -16px 16px;
  padding: 0 16px 4px;
  display: flex;
  gap: 7px;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Empty = styled.div`
  padding: 24px 0;
  color: #888;
  text-align: center;
`;

const LegendBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  margin-top: 20px;
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8e8e8e;
  font-size: 12px;
  line-height: 150%;
`;

const LegendDot = styled.i`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.2px solid #bdbdbd;
  background: ${(p) => (p.$filled ? "#bdbdbd" : "transparent")};
`;

const KPIRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
