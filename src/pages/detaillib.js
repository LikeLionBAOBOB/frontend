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

const MOCK_BY_ID = {
  "111179": {
    total_seats: 12,
    current_seats: 6,
    congestion: "보통",
    is_open: "운영 중",
    operating_time: "09:00-18:00",
    detail_time: {
      월: ["정기휴무(매주 월요일)"],
      화: ["09:00-18:00"],
      수: ["09:00-18:00"],
      목: ["09:00-18:00"],
      금: ["09:00-18:00"],
      토: ["09:00-17:00"],
      일: ["09:00-17:00"],
    },
    naver_map: "https://naver.me/5CWgTj5D",
    site: "https://lib.sdm.or.kr/sdmlib/menu/10053/contents/40018/contents.do",
  },
  "111086": {
    total_seats: 30,
    current_seats: 24,
    congestion: "혼잡",
    is_open: "운영 중",
    operating_time: "09:00-22:00",
    detail_time: {
      월: ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-22:00"],
      화: ["어린이자료실 정기휴무(매주 화요일)", "종합/디지털자료실 정기휴무(매주 화요일)"],
      수: ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-22:00"],
      목: ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-22:00"],
      금: ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-22:00"],
      토: ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-20:00"],
      일: ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-20:00"],
    },
    naver_map: "https://naver.me/xTTAm2hs",
    site: "https://mplib.mapo.go.kr/sglib/index.do",
  },
  "711596": {
    total_seats: 36,
    current_seats: 31,
    congestion: "혼잡",
    is_open: "운영 중",
    operating_time: "09:00-22:00",
    detail_time: {
      월: ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      화: ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      수: ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      목: ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      금: ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      토: ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      일: ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
    },
    naver_map: "https://naver.me/GEXPVxHK",
    site: "https://mplib.mapo.go.kr/metalib/index.do",
  },
  "111514": {
    total_seats: 20,
    current_seats: 6,
    congestion: "여유",
    is_open: "운영 중",
    operating_time: "09:00-22:00",
    detail_time: {
      월: ["종합자료실/디지털실 09:00-22:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      화: ["종합자료실/디지털실 09:00-22:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      수: ["종합자료실/디지털실 09:00-22:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      목: ["종합자료실/디지털실 09:00-22:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      금: ["종합자료실 정기휴무(매주 금요일)", "어린이자료실 정기휴무(매주 금요일)", "상상나루 정기휴무(매주 금요일)"],
      토: ["종합자료실/디지털실 09:00-20:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      일: ["종합자료실/디지털실 09:00-20:00", "어린이자료실 09:00-18:00", "상상나루 정기휴무(매주 일요일)"],
    },
    naver_map: "https://naver.me/GEXPVxHK",
    site: "https://mplib.mapo.go.kr/naru/index.do",
  },
  "111467": {
    total_seats: 30,
    current_seats: 21,
    congestion: "보통",
    is_open: "운영 중",
    operating_time: "09:00-22:00",
    detail_time: {
      월: ["자료열람실 정기휴무(매주 월요일)", "어린이/유아자료실 정기휴무(매주 월요일)"],
      화: ["자료열람실 09:00-22:00", "어린이/유아자료실 09:00-18:00"],
      수: ["자료열람실 09:00-22:00", "어린이/유아자료실 09:00-18:00"],
      목: ["자료열람실 09:00-22:00", "어린이/유아자료실 09:00-18:00"],
      금: ["자료열람실 09:00-22:00", "어린이/유아자료실 09:00-18:00"],
      토: ["자료열람실 09:00-20:00", "어린이/유아자료실 09:00-18:00"],
      일: ["자료열람실 09:00-20:00", "어린이/유아자료실 09:00-18:00"],
      _비고: ["자료열람실·어린이/유아자료실 — 법정 공휴일 휴관"],
    },
    naver_map: "https://naver.me/xrSQ9Ydk",
    site: "https://mplib.mapo.go.kr/mcl/index.do",
  },
  "111051": {
    total_seats: 24,
    current_seats: 7,
    congestion: "여유",
    is_open: "운영 중",
    operating_time: "09:00-18:00",
    detail_time: {
      월: ["정기휴무(매주 월요일)"],
      화: ["09:00-18:00"],
      수: ["09:00-18:00"],
      목: ["09:00-18:00"],
      금: ["09:00-18:00"],
      토: ["09:00-17:00"],
      일: ["09:00-17:00"],
      _비고: ["평일 종합자료실 20시까지"],
    },
    naver_map: "https://naver.me/xDJfgkMs",
    site: "https://lib.sdm.or.kr/sdmlib/contents/40016/contents.do",
  },
  "111252": {
    total_seats: 15,
    current_seats: 7,
    congestion: "보통",
    is_open: "운영 중",
    operating_time: "09:00-20:00",
    detail_time: {
      월: ["09:00-20:00"],
      화: ["09:00-20:00"],
      수: ["09:00-20:00"],
      목: ["09:00-20:00"],
      금: ["정기휴무(매주 금요일)"],
      토: ["09:00-17:00"],
      일: ["09:00-17:00"],
    },
    naver_map: "https://naver.me/GRoQAres",
    site: "https://lib.sdm.or.kr/sdmlib/menu/10057/contents/40020/contents.do",
  },
  "111257": {
    total_seats: 10,
    current_seats: 3,
    congestion: "여유",
    is_open: "운영 중",
    operating_time: "09:00-22:00",
    detail_time: {
      월: ["09:00-18:00", "휴게시간 13:00-14:00"],
      화: ["09:00-18:00", "휴게시간 13:00-14:00"],
      수: ["09:00-18:00", "휴게시간 13:00-14:00"],
      목: ["09:00-18:00", "휴게시간 13:00-14:00"],
      금: ["09:00-18:00", "휴게시간 13:00-14:00"],
      토: ["정기휴무(매주 토요일)"],
      일: ["정기휴무(매주 일요일)"],
    },
    naver_map: "https://naver.me/G0DAtKWJ",
    site: "https://www.smalllibrary.org/library/detail/1102271",
  },
};

const LIB_META = {
  "111179": { name: "남가좌새롬도서관", address: "서울 서대문구 증가로10길 16-15" },
  "111051": { name: "이진아기념도서관", address: "서울 서대문구 독립문공원길 80" },
  "111252": { name: "홍은도담도서관", address: "서울 서대문구 홍은중앙로 129" },
  "111086": { name: "마포구립 서강도서관", address: "서울 마포구 독막로 165 서강동주민센터" },
  "711596": { name: "마포나루 스페이스", address: "서울 마포구 마포대로 8 나루" },
  "111514": { name: "마포소금나루도서관", address: "서울 마포구 숭문길 72" },
  "111467": { name: "마포중앙도서관", address: "서울 마포구 성산로 128" },
  "111257": { name: "해오름 작은도서관", address: "서울 마포구 신촌로26길 10 우리마포복지관 2층" },
};

const LibraryDetail = () => {
  const { libraryId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [tab, setTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const displayOperatingTime = useMemo(() => {
    const src = data?.operating_time || "";
    return src.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/g, "$1 - $2");
  }, [data]);

  const formatDetail = (s) => {
    if (!s) return "";
    let out = String(s);
    out = out.replace(/정기휴무\(/g, "정기휴무 (");
    out = out.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/g, "$1 - $2");
    return out;
  };

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
        try { api = raw ? JSON.parse(raw) : {}; } catch {}
        if (!r.ok) {
          const m = api?.message || `HTTP ${r.status}`;
          throw new Error(m);
        }
        return api;
      })
      .then((api) => {
        if (!alive) return;

        const mock = MOCK_BY_ID[String(libraryId)] || {};
        const meta = LIB_META[String(libraryId)] || {};

        const apiOnly = {
          name: api.name ?? meta.name ?? "도서관",
          address: api.address ?? "",
          congestion: api.congestion ?? "-",
          is_open: api.is_open ?? "",
          operating_time: api.operating_time ?? "",
          detail_time: api.detail_time ?? null,
        };

        setData({
          ...apiOnly,
          total_seats: mock.total_seats ?? 0,
          current_seats: mock.current_seats ?? 0,
          naver_map: mock.naver_map ?? "",
          site: mock.site ?? "",
          images: Array.isArray(api.images) ? api.images : [],
        });
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;

        const mock = MOCK_BY_ID[String(libraryId)] || {};
        const meta = LIB_META[String(libraryId)] || {};
        setData({
          name: meta.name ?? "도서관",
          address: "",
          congestion: "-",
          is_open: "",
          operating_time: "",
          detail_time: null,
          total_seats: mock.total_seats ?? 0,
          current_seats: mock.current_seats ?? 0,
          naver_map: mock.naver_map ?? "",
          site: mock.site ?? "",
          images: [],
        });
        setErr("");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [libraryId]);

  const gallery = useMemo(() => {
    const local = GALLERY[String(libraryId)] || [];
    const apiList = (data?.images || []).map((p) => (p.startsWith("http") ? p : `${BASE_URL}${p}`));
    return local.length ? local : apiList;
  }, [libraryId, data]);

  const total = data?.total_seats ?? 0;
  const available = data?.current_seats ?? 0;

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
      <HeaderBackHero title={data?.name || "도서관"} address={data?.address || ""} libraryId={libraryId} />

      <Inner>
        <Tabs>
          <TabBtn $active={tab === "info"} onClick={() => setTab("info")}>도서관 정보</TabBtn>
          <TabBtn $active={tab === "seats"} onClick={() => setTab("seats")}>좌석 정보</TabBtn>
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
                    <Big>{available} / {total}</Big>
                    <Badge $level={data.congestion}>{data.congestion || "-"}</Badge>
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
                        if (!v) return null;
                        const lines = Array.isArray(v) ? v : [String(v)];
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
                      <Big>{available} / {total}</Big>
                      <Badge $level={data.congestion}>{data.congestion || "-"}</Badge>
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
  border-radius: 0px;
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
  font-family: "Pretendard GOV Variable";
  font-size: 20px;
  font-style: normal;
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
  font-family: "Pretendard GOV Variable";
  font-size: 20px;
  font-weight: 400;
  line-height: normal;
`;

const Small = styled.div`
  color: #8e8e8e;
  font-family: "Pretendard GOV Variable";
  font-size: 10px;
  font-weight: 300;
  line-height: normal;
  margin-top: 2px;
  margin-bottom: 12px;
`;

const Badge = styled.span`
  font-family: "Pretendard GOV Variable";
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  display: flex;
  width: 30px;
  padding: 3px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  color: #fff;
  background: ${({ $level }) => {
    if ($level === "여유") return "#33A14B";
    if ($level === "보통") return "#FFB724";
    if ($level === "혼잡") return "#FF474D";
    return "#bbb";
  }};
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
  li + li {
    border-top: none;
  }
  span {
    width: 28px;
    color: #444444;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-style: normal;
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
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;
    white-space: pre-wrap;
  }
`;

const SectionTitle = styled.div`
  color: var(--Text-Basic, #1d1d1d);
  font-family: "Pretendard GOV Variable";
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
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-style: normal;
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
    color: var(--Text-Disabled, #8e8e8e);
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    text-decoration-line: underline;
  }
  .texts small {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: #9a9a9a;
    word-break: break-all;
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
  font-family: "Pretendard GOV Variable";
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
