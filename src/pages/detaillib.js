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

// 배포 시 절대경로, 개발 중 프록시 쓰면 ""로도 가능
const BASE_URL = "https://baobob.pythonanywhere.com";

const MOCK_BY_ID = {
  "111179": {
    // 남가좌새롬
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
    // 마포구립 서강
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
    // 마포나루 스페이스
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
    // 마포소금나루
    total_seats: 20,
    current_seats: 6,
    congestion: "여유",
    is_open: "운영 중",
    operating_time: "09:00-22:00",
    detail_time: {
      월: [
        "종합자료실/디지털실 09:00-22:00",
        "어린이자료실 09:00-18:00",
        "상상나루 09:00-17:00",
        "휴게시간 12:00-14:00",
      ],
      화: [
        "종합자료실/디지털실 09:00-22:00",
        "어린이자료실 09:00-18:00",
        "상상나루 09:00-17:00",
        "휴게시간 12:00-14:00",
      ],
      수: [
        "종합자료실/디지털실 09:00-22:00",
        "어린이자료실 09:00-18:00",
        "상상나루 09:00-17:00",
        "휴게시간 12:00-14:00",
      ],
      목: [
        "종합자료실/디지털실 09:00-22:00",
        "어린이자료실 09:00-18:00",
        "상상나루 09:00-17:00",
        "휴게시간 12:00-14:00",
      ],
      금: ["종합자료실 정기휴무(매주 금요일)", "어린이자료실 정기휴무(매주 금요일)", "상상나루 정기휴무(매주 금요일)"],
      토: ["종합자료실/디지털실 09:00-20:00", "어린이자료실 09:00-18:00", "상상나루 09:00-17:00", "휴게시간 12:00-14:00"],
      일: ["종합자료실/디지털실 09:00-20:00", "어린이자료실 09:00-18:00", "상상나루 정기휴무(매주 일요일)"],
    },
    naver_map: "https://naver.me/GEXPVxHK",
    site: "https://mplib.mapo.go.kr/naru/index.do",
  },

  "111467": {
    // 마포중앙
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
    // 이진아기념
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
    // 홍은도담
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
    // 해오름 작은도서관
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
  const [tab, setTab] = useState("info"); // "info" | "seats"
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const displayOperatingTime = useMemo(() => {
    const src = data?.operating_time || "";
    return src.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/g, "$1 - $2"); // - 양옆 공백
  }, [data]);

  // 요일 상세 문자열 포맷터
  const formatDetail = (s) => {
    if (!s) return "";
    let out = String(s);
    // '정기휴무(매주 금요일)' → '정기휴무 (매주 금요일)'
    out = out.replace(/정기휴무\(/g, "정기휴무 (");
    // '09:00-18:00' → '09:00 - 18:00'
    out = out.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/g, "$1 - $2");
    return out;
  };

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

    return () => {
      alive = false;
    };
  }, [libraryId]);

  // 갤러리: 로컬 매핑 우선 → 없으면 API images
  const gallery = useMemo(() => {
    const local = GALLERY[String(libraryId)] || [];
    const apiList = (data?.images || []).map((p) => (p.startsWith("http") ? p : `${BASE_URL}${p}`));
    return local.length ? local : apiList;
  }, [libraryId, data]);

  // 좌석 수
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
      <HeaderBackHero title={data?.name || "도서관"} address={data?.address || ""} libraryId={libraryId} />

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
                    <Big>
                      {available} / {total}
                    </Big>
                    <Badge $level={data.congestion}>{data.congestion || "-"}</Badge>
                  </KPIInline>
                  <Small>(현재 좌석 수 / 전체 좌석 수)</Small>
                </KPIBlock>

                <Card>
                  <SectionTitle>시설 정보</SectionTitle>

                  <Opener style={{ marginTop: 10 }}>
                    <img className="icon" src={clockIcon} alt="운영시간" />
                    <div className="texts">
                      <strong>운영 중</strong>
                      {displayOperatingTime && <span>{displayOperatingTime}</span>}
                    </div>
                  </Opener>

                  {/* '운영 중' 8px 아래: 요일표 (운영중 텍스트와 왼쪽 정렬 맞춤) */}
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

                {/* 링크들 */}
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
                  {/* 혼잡도 수치/배지와 범례를 같은 가로줄로 배치 */}
                  <KPIRow>
                    <KPIInline>
                      <Big>{available} / {total}</Big>
                      <Badge $level={data.congestion}>{data.congestion || "-"}</Badge>
                    </KPIInline>

                    {/* 범례 (위, 같은 줄) */}
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

/* 갤러리 */
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

/* 좌석 KPI 레이아웃 */
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
  line-height: 150%; /* 21px */
  margin-bottom: 4px;
`;
const KPIInline = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* 숫자-배지 간 12px */
`;

/* 좌석 수 숫자 타이포 */
const Big = styled.div`
  color: #555;
  font-family: "Pretendard GOV Variable";
  font-size: 20px;
  font-weight: 400;
  line-height: normal;
`;

/* (현재 좌석 수 / 전체 좌석 수) 가이드 텍스트 */
const Small = styled.div`
  color: #8e8e8e;
  font-family: "Pretendard GOV Variable";
  font-size: 10px;
  font-weight: 300;
  line-height: normal;
  margin-top: 2px;
  margin-bottom: 12px;
`;

/* 혼잡도 배지 */
const Badge = styled.span`
  /* 텍스트 타이포 */
  font-family: "Pretendard GOV Variable";
  font-size: 14px; /* ↓ 요구대로 14 */
  font-weight: 400;
  line-height: normal;

  /* 배지 박스 */
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

/* 시설 정보 카드(외곽선 제거) */
const Card = styled.div`
  border: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 12px;
  background: transparent;
`;

/* 요일표 (운영중 텍스트와 좌측 정렬 맞춤) */
const TimeTable = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 30px; /* 아이콘(18) + 간격(12) = 30px 만큼 들여쓰기해 '운영 중'과 정렬 */

  li {
    display: flex;
    gap: 0px; /* 요일-내용 간격 좁힘 */
    padding: 6px 0; /* 행 높이 축소 */
    align-items: flex-start;
  }

  /* 점선(밑줄) 제거 */
  li + li {
    border-top: none;
  }

  /* 요일 칼럼 */
  span {
    width: 28px; /* 32 → 28로 */
    color: #444444;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-style: normal;
    font-weight: 400; /* 볼드 제거 */
    line-height: 150%; /* 24px */
  }

  /* 오른쪽 줄 컨테이너 */
  .lines {
    display: flex;
    flex-direction: column;
    gap: 2px; /* 행간 축소 */
  }

  /* 실제 시간/문구 라인 */
  em {
    font-style: normal;
    color: #444444;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-weight: 400;
    line-height: 150%; /* 24px */
    white-space: pre-wrap; /* 공백(3칸) 유지 */
  }
`;

const Note = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  div + div {
    margin-top: 2px;
  }
`;

const SectionTitle = styled.div`
  color: var(--Text-Basic, #1d1d1d);
  font-family: "Pretendard GOV Variable";
  font-size: 20px;
  font-weight: 600;
  line-height: 150%; /* 30px */
  margin-bottom: 10px;
`;

/* 시계 + '운영 중' + 시간 */
const Opener = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* 아이콘-텍스트 12px 로 넓힘 */

  .icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }

  .texts {
    display: flex;
    align-items: center;
    gap: 8px; /* '운영 중'과 시간 간 4px */
  }

  .texts strong,
  .texts span {
    color: #444;
    font-family: "Pretendard GOV Variable";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 24px */
  }
`;

/* 링크(회색 + 밑줄) */
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
    line-height: 150%; /* 24px */
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
  }
  .texts small {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: #9a9a9a;
    word-break: break-all;
  }
`;

/* 갤러리: 좌우 풀블리드 + 간격 7px */
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

/* ===== 좌석 범례 ===== */
const LegendBar = styled.div`
  display: flex;
  flex-direction: column;   /* 세로 배치 (가능/중인 두 줄) */
  align-items: flex-end;    /* 우측 정렬 */
  gap: 6px;
  margin-top: 20px;                /* KPI와 같은 가로줄에 붙게 여백 제거 */
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;                 /* 텍스트 ↔ 동그라미 간격 */
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
  border: 1.2px solid #bdbdbd;                       /* 빈 원 = 이용 가능 */
  background: ${(p) => (p.$filled ? "#bdbdbd" : "transparent")}; /* 채운 원 = 이용 중 */
`;

/* KPI 왼쪽(수치/배지) ↔ 오른쪽(범례) 같은 줄 */
const KPIRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
