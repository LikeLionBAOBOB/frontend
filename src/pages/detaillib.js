// src/pages/detaillib.js
import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderBackHero from "../components/header_ad";
import { seatMapById } from "../components/seatmaps";
import { GALLERY } from "../assets/libraryimages";
import clockIcon from "../assets/icons/clock.png";  
import pinIcon from "../assets/icons/location.png";      
import linkIcon from "../assets/icons/link.png";  


// 배포 시 절대경로, 개발 중 프록시 쓰면 ""로도 가능
const BASE_URL = "https://baobob.pythonanywhere.com";

const MOCK_BY_ID = {
  "111179": { // 남가좌새롬
    total_seats: 12, current_seats: 6, congestion: "보통",
    is_open: "운영 중", operating_time: "09:00-18:00",
    detail_time: {
      "월": ["정기휴무(매주 월요일)"],
      "화": ["09:00-18:00"],
      "수": ["09:00-18:00"],
      "목": ["09:00-18:00"],
      "금": ["09:00-18:00"],
      "토": ["09:00-17:00"],
      "일": ["09:00-17:00"],
    },
    naver_map: "https://www.naver.com/?lib=111179",
    site: "https://www.naver.com/?site=111179",
  },

  "111086": { // 마포구립 서강
    total_seats: 30, current_seats: 24, congestion: "혼잡",
    is_open: "운영 중", operating_time: "09:00-22:00",
    detail_time: {
      "월": ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-22:00"],
      "화": ["어린이자료실 정기휴무(매주 화요일)", "종합/디지털자료실 정기휴무(매주 화요일)"],
      "수": ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-22:00"],
      "목": ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-22:00"],
      "금": ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-22:00"],
      "토": ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-20:00"],
      "일": ["어린이자료실 09:00-18:00", "종합/디지털자료실 09:00-20:00"],
    },
    naver_map: "https://www.naver.com/?lib=111086",
    site: "https://www.naver.com/?site=111086",
  },

  "711596": { // 마포나루 스페이스
    total_seats: 36, current_seats: 31, congestion: "혼잡",
    is_open: "운영 중", operating_time: "09:00-22:00",
    detail_time: {
      "월": ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      "화": ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      "수": ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      "목": ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      "금": ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      "토": ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
      "일": ["자율학습공간/북카페 09:00-22:00", "메타버스도서관자료실 09:00-18:00"],
    },
    naver_map: "https://www.naver.com/?lib=711596",
    site: "https://www.naver.com/?site=711596",
  },

  "111514": { // 마포소금나루
    total_seats: 20, current_seats: 6, congestion: "여유",
    is_open: "운영 중", operating_time: "09:00-22:00",
    detail_time: {
      "월": ["종합자료실/디지털실 09:00-22:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      "화": ["종합자료실/디지털실 09:00-22:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      "수": ["종합자료실/디지털실 09:00-22:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      "목": ["종합자료실/디지털실 09:00-22:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      "금": ["종합자료실 정기휴무(매주 금요일)", "어린이자료실 정기휴무(매주 금요일)", "상상나루 정기휴무(매주 금요일)"],
      "토": ["종합자료실/디지털실 09:00-20:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      "일": ["종합자료실/디지털실 09:00-20:00", "어린이자료실 09:00-18:00", "상상나루 정기휴무(매주 일요일)"],
    },
    naver_map: "https://www.naver.com/?lib=111514",
    site: "https://www.naver.com/?site=111514",
  },

  "111467": { // 마포중앙
    total_seats: 30, current_seats: 21, congestion: "보통",
    is_open: "운영 중", operating_time: "09:00-22:00",
    detail_time: {
      "월": ["자료열람실 정기휴무(매주 월요일)", "어린이/유아자료실 정기휴무(매주 월요일)"],
      "화": ["자료열람실 09:00-22:00", "어린이/유아자료실 09:00-18:00"],
      "수": ["자료열람실 09:00-22:00", "어린이/유아자료실 09:00-18:00"],
      "목": ["자료열람실 09:00-22:00", "어린이/유아자료실 09:00-18:00"],
      "금": ["자료열람실 09:00-22:00", "어린이/유아자료실 09:00-18:00"],
      "토": ["자료열람실 09:00-20:00", "어린이/유아자료실 09:00-18:00"],
      "일": ["자료열람실 09:00-20:00", "어린이/유아자료실 09:00-18:00"],
      "_비고": ["자료열람실·어린이/유아자료실 — 법정 공휴일 휴관"],
    },
    naver_map: "https://www.naver.com/?lib=111467",
    site: "https://www.naver.com/?site=111467",
  },

  "111051": { // 이진아기념
    total_seats: 24, current_seats: 7, congestion: "여유",
    is_open: "운영 중", operating_time: "09:00-18:00",
    detail_time: {
      "월": ["정기휴무(매주 월요일)"],
      "화": ["09:00-18:00"],
      "수": ["09:00-18:00"],
      "목": ["09:00-18:00"],
      "금": ["09:00-18:00"],
      "토": ["09:00-17:00"],
      "일": ["09:00-17:00"],
      "_비고": ["평일 종합자료실 20시까지"],
    },
    naver_map: "https://www.naver.com/?lib=111051",
    site: "https://www.naver.com/?site=111051",
  },

  "111252": { // 홍은도담
    total_seats: 15, current_seats: 7, congestion: "보통",
    is_open: "운영 중", operating_time: "09:00-20:00",
    detail_time: {
      "월": ["09:00-20:00"],
      "화": ["09:00-20:00"],
      "수": ["09:00-20:00"],
      "목": ["09:00-20:00"],
      "금": ["정기휴무(매주 금요일)"],
      "토": ["09:00-17:00"],
      "일": ["09:00-17:00"],
    },
    naver_map: "https://www.naver.com/?lib=111252",
    site: "https://www.naver.com/?site=111252",
  },

  "111257": { // 해오름 작은도서관
    total_seats: 10, current_seats: 3, congestion: "여유",
    is_open: "운영 중", operating_time: "09:00-22:00",
    detail_time: {
      "월": ["09:00-18:00", "휴게시간 13:00-14:00"],
      "화": ["09:00-18:00", "휴게시간 13:00-14:00"],
      "수": ["09:00-18:00", "휴게시간 13:00-14:00"],
      "목": ["09:00-18:00", "휴게시간 13:00-14:00"],
      "금": ["09:00-18:00", "휴게시간 13:00-14:00"],
      "토": ["정기휴무(매주 토요일)"],
      "일": ["정기휴무(매주 일요일)"],
    },
    naver_map: "https://www.naver.com/?lib=111257",
    site: "https://www.naver.com/?site=111257",
  },
};

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

      // 모킹과 API를 합성한다.
      // ▶ 총 좌석(total_seats)은 항상 하드코딩(MOCK_BY_ID) 우선
      const mock = MOCK_BY_ID[String(libraryId)] || {};
      const merged = {
        ...json,
        total_seats: mock.total_seats ?? json.total_seats ?? 0,
        current_seats: json.current_seats ?? mock.current_seats ?? 0,
        congestion: json.congestion ?? mock.congestion ?? "-",
        is_open: json.is_open ?? mock.is_open ?? "",
        operating_time: json.operating_time ?? mock.operating_time ?? "",
        detail_time: json.detail_time ?? null, // 필요 시 mock.detail_time으로 보강 가능
        naver_map: json.naver_map ?? mock.naver_map ?? "",
        site: json.site ?? mock.site ?? "",
      };
      setData(merged);
      setLoading(false);
    })
    .catch(() => {
      if (!alive) return;

      // API 실패 시에도 화면이 꽉 차도록 모킹만으로 구성
      const meta = LIB_META[libraryId] || {};
      const mock = MOCK_BY_ID[String(libraryId)] || {};
      setData({
        name: meta.name || "도서관",
        address: meta.address || "",
        images: [],
        total_seats: mock.total_seats ?? 0,
        current_seats: mock.current_seats ?? 0,
        congestion: mock.congestion ?? "-",
        is_open: mock.is_open ?? "",
        operating_time: mock.operating_time ?? "",
        detail_time: mock.detail_time ?? null,
        naver_map: mock.naver_map ?? "",
        site: mock.site ?? "",
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
                      <img className="icon" src={clockIcon} alt="운영시간" /> {/* >>> 변경 */}
                      <div className="texts">                                {/* >>> 변경 */}
                        {data.is_open && <strong>{data.is_open}</strong>}
                        {data.operating_time && <span>{data.operating_time}</span>}
                      </div>
                    </Opener>
                  </Card>
                )}


                {/* (선택) 요일별 시간표 */}
                {data.detail_time && (
                  <Card>
                    <SectionTitle>시설 정보</SectionTitle>
                    <TimeTable>
                      {["월","화","수","목","금","토","일"].map((d) => {
                        const v = data.detail_time[d];
                        if (!v) return null;
                        const lines = Array.isArray(v) ? v : [String(v)];
                        return (
                          <li key={d}>
                            <span>{d}</span>
                            <div className="lines">
                              {lines.map((t, i) => (
                                <em key={i}>• {t}</em>
                              ))}
                            </div>
                          </li>
                        );
                      })}
                    </TimeTable>
                    {data.detail_time._비고 && (
                      <Note>
                        {(Array.isArray(data.detail_time._비고) ? data.detail_time._비고 : [data.detail_time._비고])
                          .map((t, i) => <div key={i}>※ {t}</div>)}
                      </Note>
                    )}
                  </Card>
                )}

                {/* +) 운영 시간 아래 링크 2개 (네이버 지도 / 도서관 사이트) */}
                {(data.naver_map || data.site) && (
                  <LinkList>
                    {data.naver_map && (
                      <li>
                        <img className="icon" src={pinIcon} alt="지도" />   {/* >>> 변경 */}
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
                        <img className="icon" src={linkIcon} alt="링크" />  {/* >>> 변경 */}
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

const Photo = styled.div`
  flex: 0 0 auto;
  width: 184px;               
  height: 112px;
  border-radius: 0px;
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

/* 혼잡도 배지 (요청 스펙) */
const Badge = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 48px;                 /* >>> 변경 */
  padding: 3px 16px;           /* >>> 변경 */
  border-radius: 20px;         /* >>> 변경 */
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: ${({ $level }) => {
    if ($level === "여유") return "#33A14B";  // >>> 변경
    if ($level === "보통") return "#FFB724";  // >>> 변경
    if ($level === "혼잡") return "#FF474D";  // >>> 변경
    return "#bbb";
  }};
`;


/* 4) 운영중 + 운영시간 한 줄 */
const Card = styled.div`
  border: 1px solid #eee; border-radius: 16px; padding: 12px 14px; margin-bottom: 12px; background:#fff;
`;

const TimeTable = styled.ul`
  list-style: none; margin:0; padding:0;
  li{
    display:flex; gap:12px; padding:8px 0;
    align-items: flex-start;                  /* >>> 변경 */
  }
  li + li { border-top: 1px dashed #eee; }    /* >>> 변경 */
  span{ font-weight:700; width:32px; line-height: 20px; }
  .lines{ display:flex; flex-direction:column; gap:4px; } /* >>> 변경 */
  em{ font-style: normal; color:#333; line-height: 20px; }
`;

const Note = styled.div`
  margin-top: 8px; font-size: 12px; color: #666; /* >>> 추가 */
  div + div { margin-top: 2px; }
`;


const SectionTitle = styled.div` font-size: 14px; font-weight: 800; margin-bottom: 8px; `;


/* +) 운영 시간 아래 링크 2개 스타일 */
const Opener = styled.div`
  display:flex; align-items:center; gap:10px; font-size:13px;    /* >>> 변경 */
  .icon{ width:18px; height:18px; object-fit:contain; }          /* >>> 추가 */
  .texts{ display:flex; align-items:center; gap:8px; }           /* >>> 추가 */
  strong{ font-weight:800; }
  span{ color:#333; }
`;

const LinkList = styled.ul`
  list-style: none; margin: 8px 0 0; padding: 0;
  li{ display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; }
  .icon{ width:18px; height:18px; object-fit:contain; margin-top:2px; } /* >>> 변경 */
  .texts a{ font-size: 13px; color: #1f6feb; text-decoration: none; }
  .texts small{ display:block; margin-top: 2px; font-size: 10px; color: #9a9a9a; word-break: break-all; }
`;

/* 갤러리: 좌우 풀블리드 + 간격 7px */
const PhotoStrip = styled.div`
  margin: 6px -16px 16px;     /* >>> 변경: Inner 패딩 상쇄로 좌우 딱 붙게 */
  padding: 0 16px 4px;        /* >>> 변경: 스크롤 여유/시각적 패딩 */
  display: flex;
  gap: 7px;                   /* >>> 변경: 요구 간격 고정 */
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;




const Empty = styled.div` padding: 24px 0; color:#888; text-align:center; `;
