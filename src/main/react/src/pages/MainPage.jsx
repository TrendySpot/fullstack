import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../context/FilterContext";
import AxiosApi from "../api/AxiosApi";
import SpotCard from "../components/spot/SpotCard";
import { FaArrowRight } from "react-icons/fa";
import "./MainPage.css";
import PopularSpotSwiper from "../components/swiper/PopularSpotSwiper";
import dayjs from "dayjs";

const TAGS = [
  "전체",
  "팝업스토어",
  "전시회",
  "무료",
  "유료",
  "진행중",
  "오픈예정",
];

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

const MainPage = () => {
  const navigate = useNavigate();
  const { resetFilters } = useFilter();
  const [loading, setLoading] = useState(false);
  const [searchArea, setSearchArea] = useState("");
  const [activeTag, setActiveTag] = useState("전체");
  const [searchDate, setSearchDate] = useState("");
  const [allSpots, setAllSpots] = useState([]);

  const fetchAllSpots = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await AxiosApi.getSpots({
        page: 0,
        size: 100,
        sort: "createdAt,DESC",
      });
      setAllSpots(data.data.content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    resetFilters();
    setActiveTag("전체");
    fetchAllSpots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAllSpots]);

  const handleTag = (tag) => {
    setActiveTag(tag);
  };

  const today = dayjs().format("YYYY-MM-DD");

  const todaySpots = allSpots
    .filter((spot) => {
      const start = dayjs(spot.startDate);
      const end = dayjs(spot.endDate);
      const now = dayjs(today);
      return (
        now.isSame(start, "day") ||
        now.isSame(end, "day") ||
        (now.isAfter(start) && now.isBefore(end))
      );
    })
    .slice(0, 6);

  const filteredSpots = useMemo(() => {
    const now = dayjs();
    let result = [...allSpots];

    if (activeTag === "팝업스토어") result = result.filter((s) => s.spotType === "POPUP");
    if (activeTag === "전시회")     result = result.filter((s) => s.spotType === "EXHIBIT");
    if (activeTag === "무료")       result = result.filter((s) => s.price === 0);
    if (activeTag === "유료")       result = result.filter((s) => s.price > 0);
    if (activeTag === "진행중") {
      result = result.filter((s) => {
        const start = dayjs(s.startDate);
        const end   = dayjs(s.endDate);
        return now.isSame(start, "day") || now.isSame(end, "day") ||
               (now.isAfter(start, "day") && now.isBefore(end, "day"));
      });
    }
    if (activeTag === "오픈예정") {
      result = result.filter((s) => now.isBefore(dayjs(s.startDate), "day"));
    }

    return result.slice(0, 9);
  }, [allSpots, activeTag]);

  return (
    <div>
      <PopularSpotSwiper spots={allSpots} />

      <section className="hero-section">
        <div className="hero-text">
          <p className="hero-label">✨ Premium Event Discovery</p>
          <h1>
            지금 가장 인기 있는
            <br />
            <span style={{ opacity: 0.9 }}>팝업과 전시</span>를 만나보세요
          </h1>
          <p>전국의 인기 팝업스토어와 전시회를 한눈에 발견하고 예약해보세요.</p>
        </div>
        <div className="search-panel">
          <select value={searchArea} onChange={(e) => setSearchArea(e.target.value)}>
            <option value="">지역 선택</option>
            {AREAS.slice(1).map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <button
            onClick={() => {
              resetFilters();
              const params = new URLSearchParams();
              if (searchArea) params.set("area", searchArea);
              if (searchDate) params.set("date", searchDate);
              const query = params.toString();
              navigate(query ? `/search?${query}` : "/search");
            }}
          >
            검색
          </button>
        </div>
      </section>

      <section className="today-section">
        <div className="section-title">
          <h2>오늘 방문 가능한 스팟</h2>
          <button className="view-all-btn" onClick={() => { resetFilters(); navigate(`/search?date=${today}`); }}>
            더보기 <FaArrowRight />
          </button>
        </div>
        {todaySpots.length === 0 ? (
          <div className="empty-today">오늘 방문 가능한 스팟이 없습니다.</div>
        ) : (
          <div className="spot-grid">
            {todaySpots.map((spot) => <SpotCard key={spot.spotId} spot={spot} />)}
          </div>
        )}
      </section>

      <div className="section-title">
        <section className="category-section">
          {TAGS.map((tag) => (
            <button key={tag} className={`category-chip ${activeTag === tag ? "active" : ""}`} onClick={() => handleTag(tag)}>
              {tag}
            </button>
          ))}
        </section>
        <button className="view-all-btn" onClick={() => { resetFilters(); navigate("/search"); }}>
          전체보기 <FaArrowRight />
        </button>
      </div>

      <section className="spot-section">
        {loading ? (
          <div className="spot-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: "white", borderRadius: 28, overflow: "hidden", boxShadow: "0 18px 38px rgba(29,29,47,0.08)" }}>
                <div style={{ height: 220, background: "#f1f2f6", animation: "pulse 1.5s infinite" }} />
                <div style={{ padding: 22 }}>
                  <div style={{ height: 12, background: "#f1f2f6", borderRadius: 8, width: "40%", marginBottom: 10 }} />
                  <div style={{ height: 16, background: "#f1f2f6", borderRadius: 8, width: "80%", marginBottom: 8 }} />
                  <div style={{ height: 12, background: "#f1f2f6", borderRadius: 8, width: "55%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSpots.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#6b7280" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
            <p style={{ fontWeight: 700 }}>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="spot-grid">
            {filteredSpots.map((spot) => <SpotCard key={spot.spotId} spot={spot} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default MainPage;