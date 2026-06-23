import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { RiMapPinLine } from "react-icons/ri";
import { FiCalendar } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import dayjs from "dayjs";
import "./SpotCard.css";

const getStatus = (startDate, endDate) => {
  const today = dayjs();
  const start = dayjs(startDate);
  if (today.isBefore(start)) return "오픈예정";
  return "진행중";
};

const SpotCard = ({ spot }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { wishedIds, toggle } = useWishlist();
  const isWished = wishedIds.has(spot.spotId);

  const handleWish = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      const goLogin = window.confirm("로그인이 필요한 기능입니다.");
      if (goLogin) navigate("/login");
      return;
    }

    toggle(spot.spotId);
  };

  return (
    <Link to={`/spots/${spot.spotId}`} className="spot-card">
      <div className="spot-img-wrap">
        <img
          src={spot.imageUrl || "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800"}
          alt={spot.title}
          loading="lazy"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800"; }}
        />
        <button type="button" className="wish-btn" onClick={handleWish}>
          {isWished
            ? <FaHeart style={{ color: "#ff5ea8", fontSize: 18 }} />
            : <FaRegHeart style={{ color: "#d1d5db", fontSize: 18 }} />
          }
        </button>
        <span className="status-badge">{getStatus(spot.startDate, spot.endDate)}</span>
      </div>

      <div className="spot-info">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span className="spot-type" style={{ color: spot.spotType === "POPUP" ? "#ff5ea8" : "#6a5cff" }}>
            {spot.spotType === "POPUP" ? "팝업스토어" : "전시회"}
          </span>
          <strong className="price">
            {spot.price === 0 ? "무료" : `₩${spot.price?.toLocaleString()}`}
          </strong>
        </div>
        <h3>{spot.title}</h3>
        <p><RiMapPinLine style={{ marginRight: 4 }} />{spot.area}</p>
        <p>
          <FiCalendar style={{ marginRight: 4 }} />
          {dayjs(spot.startDate).format("YYYY.MM.DD")} - {dayjs(spot.endDate).format("YYYY.MM.DD")}
        </p>
      </div>
    </Link>
  );
};

export default SpotCard;
