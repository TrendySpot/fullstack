import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "./PopularSpotSwiper.css";

const calcReservationRate = (spot) => {
  return spot.reservationRate ?? 0;
};

const PopularSpotSwiper = ({ spots = [] }) => {
  const navigate = useNavigate();

  const popularSpots = [...spots]
    .sort((a, b) => calcReservationRate(b) - calcReservationRate(a))
    .slice(0, 8);

  if (popularSpots.length === 0) return null;

  return (
    <section className="popular-swiper-section">
      <div className="popular-swiper-title">
        <p>Hot Trend</p>
        <h2>지금 인기 있는 스팟 🔥</h2>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        loop={popularSpots.length > 3}
        slidesPerView="auto"
        spaceBetween={24}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 120,
          modifier: 1.8,
          slideShadows: false,
        }}
        className="popular-swiper"
      >
        {popularSpots.map((spot) => (
          <SwiperSlide key={spot.spotId} className="popular-slide">
            <button
              className="popular-card"
              onClick={() => navigate(`/spots/${spot.spotId}`)}
            >
              <img
                src={
                  spot.imageUrl ||
                  "https://images.unsplash.com/photo-1545987796-200677ee1011?w=900"
                }
                alt={spot.title}
              />

              <div className="popular-card-gradient" />

              <div className="popular-card-content">
                <span className="popular-badge">
                  예약률 {calcReservationRate(spot)}%
                </span>

                <h3>{spot.title}</h3>

                <p>
                  {dayjs(spot.startDate).format("YY.MM.DD")} -{" "}
                  {dayjs(spot.endDate).format("YY.MM.DD")}
                </p>

                <p>📍 {spot.area}</p>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PopularSpotSwiper;
