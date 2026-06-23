import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import AxiosApi from "../api/AxiosApi";
import TicketStatus from "../components/detail/TicketStatus";
import MapView from "../components/detail/MapView";
import ReviewSection from "../components/detail/ReviewSection";
import ReservationModal from "../components/modal/ReservationModal";
import PaymentModal from "../components/modal/PaymentModal";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import dayjs from "dayjs";
import "./DetailPage.css";

import { useTicketSocket } from "../hooks/useTicketSocket";

const DetailPage = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { wishedIds, toggle } = useWishlist();

  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);

  const [liveSchedules, setLiveSchedules] = useState([]);
  const { ticketStatus } = useTicketSocket(Number(spotId));

  const [showReservation, setShowReservation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [reservation, setReservation] = useState(null);

  const isWished = spot ? wishedIds.has(spot.spotId) : false;

  useEffect(() => {
    if (!spot?.schedules) return;

    setLiveSchedules(spot.schedules);
  }, [spot]);

  useEffect(() => {
    if (!ticketStatus) return;

    setLiveSchedules((prev) =>
      prev.map((schedule) =>
        schedule.scheduleId === ticketStatus.scheduleId
          ? {
              ...schedule,
              remainedTickets: ticketStatus.remainedTickets,
              totalTickets: ticketStatus.totalTickets,
            }
          : schedule,
      ),
    );
  }, [ticketStatus]);

  useEffect(() => {
    setLoading(true);
    AxiosApi.getSpotDetail(spotId)
      .then(({ data }) => setSpot(data.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [spotId, navigate]);

  const handleWish = (e) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      const goLogin = window.confirm("로그인이 필요한 기능입니다.");
      if (goLogin) navigate("/login");
      return;
    }
    toggle(spot.spotId);
  };

  const handleReservationConfirm = ({ scheduleId, count, eventDate }) => {
    setReservation({ scheduleId, count, eventDate });
    setShowReservation(false);
    setShowPayment(true);
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div className="spinner" />
      </div>
    );

  if (!spot) return null;

  const totalTickets = liveSchedules.reduce(
    (sum, s) => sum + (s.totalTickets ?? 0),
    0,
  );

  const remainedTickets = liveSchedules.reduce(
    (sum, s) => sum + (s.remainedTickets ?? 0),
    0,
  );

  const bookedTickets = totalTickets - remainedTickets;
  const progress =
    totalTickets > 0 ? Math.round((bookedTickets / totalTickets) * 100) : 0;

  return (
    <div className="detail-page">
      <section>
        <div className="detail-image-wrap">
          <img
            className="detail-image"
            src={
              spot.imageUrl ||
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200"
            }
            alt={spot.title}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200";
            }}
          />
          <button
            onClick={handleWish}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.85)",
              border: 0,
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {isWished ? (
              <FaHeart style={{ color: "#ff5ea8" }} />
            ) : (
              <FaRegHeart style={{ color: "#d1d5db" }} />
            )}
          </button>
          <span
            className="status-badge"
            style={{ position: "absolute", bottom: 16, left: 16 }}
          >
            진행중
          </span>
        </div>

        <div className="detail-info">
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              color: spot.spotType === "POPUP" ? "#ff5ea8" : "#6a5cff",
            }}
          >
            {spot.spotType === "POPUP" ? "팝업스토어" : "전시회"}
          </span>
          <h1>{spot.title}</h1>
          <p style={{ color: "#6b7280", marginBottom: 4 }}>
            📍 {spot.address || spot.area}
          </p>
          <p style={{ color: "#6b7280" }}>
            {dayjs(spot.startDate).format("YYYY.MM.DD")} –{" "}
            {dayjs(spot.endDate).format("YYYY.MM.DD")}
          </p>

          {spot.description && (
            <>
              <h2>행사 소개</h2>
              <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
                {spot.description}
              </p>
            </>
          )}

          <h2>예약 현황</h2>
          <TicketStatus schedules={liveSchedules} />

          {spot.latitude && spot.longitude && (
            <>
              <h2>위치</h2>
              <MapView
                latitude={spot.latitude}
                longitude={spot.longitude}
                address={spot.address}
              />
            </>
          )}

          <ReviewSection spotId={Number(spotId)} />
        </div>
      </section>

      <aside className="reservation-panel">
        <h2 style={{ marginTop: 0 }}>예약하기</h2>
        <div style={{ marginBottom: 20 }}>
          <strong style={{ fontSize: 15 }}>예약률 {progress}%</strong>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          {totalTickets > 0 && (
            <>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0" }}>
                전체 티켓: {totalTickets}장
              </p>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0" }}>
                남은 티켓: {remainedTickets}장
              </p>
            </>
          )}
        </div>

        <div className="reservation-form">
          <label style={{ fontWeight: 700, fontSize: 13 }}>티켓 가격</label>
          <strong style={{ fontSize: 20, color: "#1e1e2f" }}>
            {spot.price === 0 ? "무료" : `₩${spot.price?.toLocaleString()}`}
          </strong>
          <button
            className="btn-primary"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: 15,
              borderRadius: 16,
            }}
            onClick={() => {
              if (!isLoggedIn) {
                const goLogin = window.confirm("로그인이 필요한 기능입니다.");
                if (goLogin) navigate("/login");
                return;
              }
              setShowReservation(true);
            }}
          >
            지금 예약하기
          </button>
          <button
            onClick={handleWish}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 700,
              border: `2px solid ${isWished ? "#ff5ea8" : "#e5e7eb"}`,
              background: isWished ? "#fff0f6" : "white",
              color: isWished ? "#ff5ea8" : "#1e1e2f",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {isWished ? (
              <>
                <FaHeart /> 찜 해제
              </>
            ) : (
              <>
                <FaRegHeart /> 찜하기
              </>
            )}
          </button>
        </div>
      </aside>

      <ReservationModal
        isOpen={showReservation}
        onClose={() => setShowReservation(false)}
        spot={spot}
        onConfirm={handleReservationConfirm}
      />
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        spot={spot}
        reservation={reservation}
        onSuccess={() => {
          setShowPayment(false);
          AxiosApi.getSpotDetail(spotId).then(({ data }) => setSpot(data.data));
        }}
      />
    </div>
  );
};

export default DetailPage;
