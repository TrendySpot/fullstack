import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useFilter } from "../context/FilterContext";
import AxiosApi from "../api/AxiosApi";
import SpotCard from "../components/spot/SpotCard";
import Pagination from "../components/common/Pagination";
import "./SearchPage.css";

const AREAS = [
  "전체",
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "제주",
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const {
    area,
    setArea,
    date,
    setDate,
    spotType,
    setSpotType,
    free,
    setFree,
    sort,
    setSort,
    keyword,
    setKeyword,
    toQueryParams,
  } = useFilter();
  const [localArea, setLocalArea] = useState(area || "전체");
  const [localDate, setLocalDate] = useState(date || "");
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const st = searchParams.get("spotType");
    const areaParam = searchParams.get("area");
    const dateParam = searchParams.get("date");
    const kwParam = searchParams.get("keyword");

    if (st) setSpotType(st);
    if (kwParam) setKeyword(kwParam);
    else setKeyword("");

    if (areaParam) {
      setLocalArea(areaParam);
      setArea(areaParam);
    } else {
      setLocalArea("전체");
      setArea("");
    }

    if (dateParam) {
      setLocalDate(dateParam);
      setDate(dateParam);
    } else {
      setLocalDate("");
      setDate("");
    }

    setReady(true);
  }, [searchParams, setArea, setSpotType, setDate, setKeyword]);

  const fetchSpots = useCallback(
    async (p = 0) => {
      setLoading(true);
      try {
        const { data } = await AxiosApi.getSpots({
          ...toQueryParams(),
          page: p,
          size: 12,
        });
        const pd = data.data;
        setSpots(pd.content);
        setTotalPages(pd.totalPages);
        setTotal(pd.totalElements);
        setPage(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [area, spotType, free, sort, date, keyword, toQueryParams],
  );

  useEffect(() => {
    if (!ready) return;
    fetchSpots(0);
  }, [ready, fetchSpots]);

  return (
    <div className="search-page">
      <aside className="filter-sidebar">
        <h2>필터</h2>

        {/* 키워드 표시 */}
        {keyword && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              background: "#f0eeff",
              borderRadius: 12,
              fontSize: 14,
              color: "#534AB7",
              fontWeight: 600,
            }}
          >
            🔍 "{keyword}" 검색 결과
          </div>
        )}

        <div className="filter-group">
          <label>지역</label>
          <select
            value={localArea}
            onChange={(e) => {
              setLocalArea(e.target.value);
              setArea(e.target.value === "전체" ? "" : e.target.value);
            }}
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>카테고리</label>
          {[
            ["전체", ""],
            ["팝업스토어", "POPUP"],
            ["전시회", "EXHIBIT"],
          ].map(([label, val]) => (
            <button
              key={label}
              className={spotType === val ? "active" : ""}
              onClick={() => setSpotType(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <label>가격</label>
          {[
            ["전체", null],
            ["무료", true],
            ["유료", false],
          ].map(([label, val]) => (
            <button
              key={label}
              className={free === val ? "active" : ""}
              onClick={() => setFree(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <label>날짜</label>
          <input
            type="date"
            value={localDate}
            onChange={(e) => {
              setLocalDate(e.target.value);
              setDate(e.target.value);
            }}
          />
        </div>
      </aside>

      <section className="search-result">
        <div className="result-header">
          <h1>
            <span style={{ color: "#6a5cff" }}>{total}</span>개의 스팟 발견
          </h1>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="createdAt,DESC">최신순</option>
            <option value="likeCount,DESC">인기순</option>
          </select>
        </div>

        {loading ? (
          <div className="spot-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 28,
                  overflow: "hidden",
                  boxShadow: "0 18px 38px rgba(29,29,47,0.08)",
                }}
              >
                <div
                  style={{
                    height: 220,
                    background: "#f1f2f6",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                <div style={{ padding: 22 }}>
                  <div
                    style={{
                      height: 12,
                      background: "#f1f2f6",
                      borderRadius: 8,
                      width: "40%",
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      height: 16,
                      background: "#f1f2f6",
                      borderRadius: 8,
                      width: "80%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="spot-grid">
            {spots.map((spot) => (
              <SpotCard key={spot.spotId} spot={spot} />
            ))}
          </div>
        )}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={fetchSpots}
        />
      </section>
    </div>
  );
};

export default SearchPage;
