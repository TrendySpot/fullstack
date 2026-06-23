import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import ROUTES from "../../constants/routes";
import "./AdminSpotPage.css";

const EMPTY_FORM = {
  title: "",
  spotType: "POPUP",
  area: "",
  address: "",
  latitude: null,
  longitude: null,
  startDate: "",
  endDate: "",
  price: 0,
  totalTickets: 100,
  imageUrl: "",
  description: "",
};

const AREAS = [
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

const extractArea = (address) => {
  return AREAS.find((area) => address.includes(area)) ?? "기타";
};

/* ── 주소 검색 + 지도 미리보기 ─────────────────────────────
   SpotForm 밖, 모듈 최상단에 선언 → 리렌더 시 재생성 없음
──────────────────────────────────────────────────────────── */
const AddressSearchMap = ({ address, onSelect }) => {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markerRef = useRef(null);
  const [query, setQuery] = useState(address || "");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  // mapRef 콜백: DOM이 실제로 붙는 순간 한 번만 지도 초기화
  const initMap = useCallback((node) => {
    mapRef.current = node;
    if (!node || mapObjRef.current) return;
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      if (mapObjRef.current) return; // 중복 방지
      mapObjRef.current = new window.kakao.maps.Map(node, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 5,
      });
      markerRef.current = new window.kakao.maps.Marker();
    });
  }, []); // 빈 deps → 컴포넌트 수명 동안 동일 함수 유지

  // 수정 모달용: address prop이 바뀌면 query 동기화
  useEffect(() => {
    if (address && address !== query) setQuery(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const handleSearch = () => {
    if (!query.trim() || !window.kakao?.maps?.services) return;
    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(query, (result, status) => {
      setSearched(true);
      setResults(
        status === window.kakao.maps.services.Status.OK
          ? result.slice(0, 5)
          : [],
      );
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handlePick = (place) => {
    const lat = parseFloat(place.y);
    const lng = parseFloat(place.x);

    if (mapObjRef.current && markerRef.current) {
      const pos = new window.kakao.maps.LatLng(lat, lng);
      mapObjRef.current.setCenter(pos);
      mapObjRef.current.setLevel(3);
      markerRef.current.setPosition(pos);
      markerRef.current.setMap(mapObjRef.current);
    }

    setResults([]);
    setQuery(place.address_name);
    onSelect({
      address: place.address_name,
      latitude: lat,
      longitude: lng,
      area: extractArea(place.address_name),
    });
  };

  return (
    <div className="address-search-wrap">
      <div className="address-search-input-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="건물명 또는 주소 검색 (예: 성수 카페, 코엑스)"
        />
        <button
          type="button"
          className="address-search-btn"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>

      {results.length > 0 && (
        <ul className="address-search-results">
          {results.map((place) => (
            <li key={place.id} onClick={() => handlePick(place)}>
              <span className="place-name">{place.place_name}</span>
              <span className="place-addr">{place.address_name}</span>
            </li>
          ))}
        </ul>
      )}
      {searched && results.length === 0 && (
        <p className="address-no-result">검색 결과가 없습니다.</p>
      )}

      <div ref={initMap} className="address-mini-map" />
    </div>
  );
};

/* ── 공용 폼 ────────────────────────────────────────────────
   마찬가지로 모듈 최상단에 선언
──────────────────────────────────────────────────────────── */
const SpotForm = ({
  form,
  onChange,
  onSubmit,
  submitLabel,
  onAddressSelect,
}) => (
  <form className="admin-spot-form" onSubmit={onSubmit}>
    <div className="form-row">
      <label>스팟명</label>
      <input
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="스팟명을 입력하세요"
        required
      />
    </div>

    <div className="form-row">
      <label>카테고리</label>
      <select name="spotType" value={form.spotType} onChange={onChange}>
        <option value="POPUP">팝업스토어</option>
        <option value="EXHIBIT">전시회</option>
      </select>
    </div>

    <div className="form-row">
      <label>
        지역 <span className="auto-label">위치 검색 시 자동 입력</span>
      </label>
      <select name="area" value={form.area} onChange={onChange} required>
        <option value="">지역 선택</option>
        {AREAS.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
        <option value="기타">기타</option>
      </select>
    </div>

    <div className="form-row">
      <label>시작일</label>
      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={onChange}
        required
      />
    </div>

    <div className="form-row">
      <label>종료일</label>
      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={onChange}
        required
      />
    </div>

    <div className="form-row">
      <label>가격</label>
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={onChange}
        min="0"
      />
    </div>

    <div className="form-row">
      <label>총 티켓 수량</label>
      <input
        type="number"
        name="totalTickets"
        value={form.totalTickets}
        onChange={onChange}
        min="1"
        required
      />
    </div>

    <div className="form-row full">
      <label>이미지 URL</label>
      <input
        name="imageUrl"
        value={form.imageUrl}
        onChange={onChange}
        placeholder="대표 이미지 URL"
      />
    </div>

    <div className="form-row full">
      <label>위치 검색</label>
      <AddressSearchMap address={form.address} onSelect={onAddressSelect} />
      {form.address && (
        <p className="selected-address">✅ 선택된 주소: {form.address}</p>
      )}
    </div>

    <div className="form-row full">
      <label>설명</label>
      <textarea
        name="description"
        value={form.description}
        onChange={onChange}
        placeholder="스팟 설명을 입력하세요"
        rows="5"
      />
    </div>

    <div className="form-actions">
      <button type="submit">{submitLabel}</button>
    </div>
  </form>
);

/* ── 메인 페이지 ─────────────────────────────────────────── */
const AdminSpotPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("list");
  const [spots, setSpots] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);

  const fetchSpots = async (p = 0) => {
    setLoading(true);
    try {
      const { data } = await AxiosApi.getAdminSpots(p, 10);
      const result = data.data ?? data;
      setSpots(result.content ?? []);
      setTotalPages(result.totalPages ?? 1);
      setPage(p);
    } catch (e) {
      console.error("스팟 목록 조회 실패", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "list") fetchSpots(0);
  }, [tab]);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "totalTickets" ? Number(value) : value,
    }));
  };

  const handleCreateAddressSelect = ({
    address,
    latitude,
    longitude,
    area,
  }) => {
    setCreateForm((prev) => ({ ...prev, address, latitude, longitude, area }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosApi.createAdminSpot(createForm);
      alert("스팟이 등록되었습니다.");
      setCreateForm(EMPTY_FORM);
      setTab("list");
    } catch (e) {
      console.error("스팟 등록 실패", e);
      alert(e.response?.data?.message || "스팟 등록에 실패했습니다.");
    }
  };

  const openEdit = (spot) => {
    setEditTarget(spot);
    setEditForm({
      title: spot.title,
      spotType: spot.spotType,
      area: spot.area,
      address: spot.address,
      latitude: spot.latitude,
      longitude: spot.longitude,
      startDate: spot.startDate,
      endDate: spot.endDate,
      price: spot.price,
      totalTickets: 100,
      imageUrl: spot.imageUrl ?? "",
      description: spot.description ?? "",
    });
  };

  const closeEdit = () => setEditTarget(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "totalTickets" ? Number(value) : value,
    }));
  };

  const handleEditAddressSelect = ({ address, latitude, longitude, area }) => {
    setEditForm((prev) => ({ ...prev, address, latitude, longitude, area }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosApi.updateAdminSpot(editTarget.spotId, editForm);
      alert("스팟이 수정되었습니다.");
      closeEdit();
      fetchSpots(page);
    } catch (e) {
      console.error("스팟 수정 실패", e);
      alert(e.response?.data?.message || "스팟 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (spotId) => {
    if (!window.confirm("정말 이 스팟을 삭제하시겠습니까?")) return;
    try {
      await AxiosApi.deleteAdminSpot(spotId);
      fetchSpots(page);
    } catch (e) {
      console.error("스팟 삭제 실패", e);
      alert("스팟 삭제에 실패했습니다.");
    }
  };

  return (
    <main className="admin-spot-page">
      <div className="admin-spot-header">
        <div>
          <p>Trendy Spot Admin</p>
          <h1>스팟 관리</h1>
        </div>
        <button
          className="back-to-main-btn"
          onClick={() => navigate(ROUTES.MAIN)}
        >
          ← 메인으로
        </button>
      </div>

      <div className="admin-spot-tabs">
        <button
          className={tab === "list" ? "tab active" : "tab"}
          onClick={() => setTab("list")}
        >
          스팟 목록
        </button>
        <button
          className={tab === "create" ? "tab active" : "tab"}
          onClick={() => setTab("create")}
        >
          스팟 등록
        </button>
      </div>

      {tab === "list" && (
        <section className="admin-spot-panel">
          <h2>스팟 목록</h2>
          {loading ? (
            <div className="admin-spot-loading">스팟 목록을 불러오는 중...</div>
          ) : (
            <table className="admin-spot-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>스팟명</th>
                  <th>유형</th>
                  <th>지역</th>
                  <th>기간</th>
                  <th>가격</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {spots.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">
                      등록된 스팟이 없습니다.
                    </td>
                  </tr>
                ) : (
                  spots.map((spot) => (
                    <tr key={spot.spotId}>
                      <td>{spot.spotId}</td>
                      <td className="spot-title-cell">{spot.title}</td>
                      <td>
                        <span
                          className={`spot-type-badge ${spot.spotType === "POPUP" ? "popup" : "exhibit"}`}
                        >
                          {spot.spotType === "POPUP" ? "팝업" : "전시"}
                        </span>
                      </td>
                      <td>{spot.area}</td>
                      <td className="spot-date-cell">
                        {spot.startDate} ~ {spot.endDate}
                      </td>
                      <td>{spot.price?.toLocaleString()}원</td>
                      <td className="spot-action-cell">
                        <button
                          className="edit-btn"
                          onClick={() => openEdit(spot)}
                        >
                          수정
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(spot.spotId)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
          <div className="admin-pagination">
            <button disabled={page === 0} onClick={() => fetchSpots(page - 1)}>
              이전
            </button>
            <span>
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => fetchSpots(page + 1)}
            >
              다음
            </button>
          </div>
        </section>
      )}

      {tab === "create" && (
        <section className="admin-spot-panel">
          <h2>스팟 등록</h2>
          <SpotForm
            form={createForm}
            onChange={handleCreateChange}
            onSubmit={handleCreateSubmit}
            submitLabel="스팟 등록"
            onAddressSelect={handleCreateAddressSelect}
          />
        </section>
      )}

      {editTarget && (
        <div className="admin-spot-modal-overlay" onClick={closeEdit}>
          <div
            className="admin-spot-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>스팟 수정</h2>
              <button className="modal-close" onClick={closeEdit}>
                ✕
              </button>
            </div>
            <SpotForm
              form={editForm}
              onChange={handleEditChange}
              onSubmit={handleEditSubmit}
              submitLabel="수정 완료"
              onAddressSelect={handleEditAddressSelect}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminSpotPage;
