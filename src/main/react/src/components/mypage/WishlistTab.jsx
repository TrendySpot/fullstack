import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import dayjs from "dayjs";

const WishlistTab = () => {
  const navigate = useNavigate();
  const { wishlist, loading, fetchWishlist, toggle } = useWishlist();

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  if (loading) return <div style={{ textAlign: "center", padding: "40px 0" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;

  if (wishlist.length === 0) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>♡</div>
      <p style={{ fontSize: 14 }}>찜한 스팟이 없습니다.</p>
    </div>
  );

  return (
    <div className="spot-grid">
      {wishlist.map((w) => (
        <div key={w.wishId} className="spot-card" onClick={() => navigate(`/spots/${w.spotId}`)}>
          <div className="spot-img-wrap">
            <img src={w.imageUrl || "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800"} alt={w.title} loading="lazy" />
            <button type="button" className="wish-btn"
              onClick={(e) => { e.stopPropagation(); toggle(w.spotId); }}>
              <span style={{ fontSize: 20, color: "#ff5ea8" }}>♥</span>
            </button>
            <span className="status-badge">진행중</span>
          </div>
          <div className="spot-info">
            <h3>{w.title}</h3>
            <p>📍 {w.area}</p>
            <p>{dayjs(w.startDate).format("YYYY.MM.DD")} - {dayjs(w.endDate).format("YYYY.MM.DD")}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishlistTab;
