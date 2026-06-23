import { useEffect, useRef, useState } from "react";

const MapView = ({ latitude, longitude, address }) => {
  const mapRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!address && (!latitude || !longitude)) return;

    if (!window.kakao || !window.kakao.maps) {
      setError(true);
      return;
    }

    window.kakao.maps.load(() => {
      const container = mapRef.current;
      if (!container) return;

      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 초기 중심 (서울)
        level: 4,
      });

      const placeMarker = (position, label) => {
        const marker = new window.kakao.maps.Marker({ position });
        marker.setMap(map);
        map.setCenter(position);

        if (label) {
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:8px 12px;font-size:13px;font-weight:600;font-family:Pretendard,sans-serif">${label}</div>`,
          });
          infowindow.open(map, marker);
          map.panBy(0, -60);
        }
      };

      if (address) {
        // 주소 → 키워드 검색으로 정확한 위치 찾기
        const places = new window.kakao.maps.services.Places();
        places.keywordSearch(address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
            const pos = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            placeMarker(pos, result[0].place_name || address);
          } else {
            // 키워드 검색 실패 시 주소 검색으로 폴백
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (res, st) => {
              if (st === window.kakao.maps.services.Status.OK && res.length > 0) {
                const pos = new window.kakao.maps.LatLng(res[0].y, res[0].x);
                placeMarker(pos, address);
              } else if (latitude && longitude) {
                // 그래도 실패하면 위도/경도 폴백
                placeMarker(new window.kakao.maps.LatLng(latitude, longitude), address);
              }
            });
          }
        });
      } else if (latitude && longitude) {
        placeMarker(new window.kakao.maps.LatLng(latitude, longitude), null);
      }
    });
  }, [address, latitude, longitude]);

  if (!address && (!latitude || !longitude)) return null;

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #e5e7eb" }}>
      {error ? (
        <div
          style={{
            height: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg,#eef0ff,#ffe7f3)",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 32 }}>🗺️</span>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>카카오맵 키를 설정해주세요.</p>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
            .env.local → REACT_APP_KAKAO_MAP_APP_KEY
          </p>
        </div>
      ) : (
        <div ref={mapRef} style={{ width: "100%", height: "280px" }} />
      )}

      {address && (
        <div
          style={{
            padding: "12px 16px",
            background: "#f7f8fc",
            fontSize: 13,
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          📍 {address}
        </div>
      )}
    </div>
  );
};

export default MapView;
