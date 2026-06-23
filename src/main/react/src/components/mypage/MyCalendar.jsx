import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AxiosApi from "../../api/AxiosApi";
import dayjs from "dayjs";

/* ── 상태 맵 ─────────────────────────────────────────── */
const STATUS = {
  RESERVED: {
    label: "예약 완료",
    color: "#6a5cff",
    bg: "rgba(106,92,255,0.1)",
  },
  FREE: { label: "무료 예약", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  CANCELED: { label: "취소됨", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

/* ── 티켓 상세 모달 ──────────────────────────────────── */
const TicketDetailModal = ({ ticket, onClose, onCancel }) => {
  if (!ticket) return null;
  const st = STATUS[ticket.status] ?? {
    label: ticket.status,
    color: "#6b7280",
    bg: "#f3f4f6",
  };
  const isCancelable = ticket.status === "RESERVED" || ticket.status === "FREE";
  const isPaid = ticket.price > 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 28,
          width: "100%",
          maxWidth: 400,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* 이미지 헤더 */}
        <div style={{ position: "relative" }}>
          <img
            src={
              ticket.imageUrl ||
              "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=420"
            }
            alt={ticket.spotTitle}
            style={{
              width: "100%",
              height: 190,
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.4)",
              border: 0,
              color: "white",
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 14,
              right: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 20,
                color: st.color,
                background: "rgba(255,255,255,0.93)",
              }}
            >
              {st.label}
            </span>
            <p
              style={{
                fontSize: 15,
                fontWeight: 900,
                margin: 0,
                color: "white",
                maxWidth: "60%",
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {ticket.spotTitle}
            </p>
          </div>
        </div>

        {/* 티켓 구분 점선 (노치) */}
        <div
          style={{
            position: "relative",
            height: 22,
            background: "white",
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: "50%",
              borderTop: "2px dashed #e5e7eb",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -11,
              top: "50%",
              transform: "translateY(-50%)",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -11,
              top: "50%",
              transform: "translateY(-50%)",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
            }}
          />
        </div>

        {/* 상세 정보 */}
        <div style={{ padding: "2px 22px 22px" }}>
          {[
            ["🎟 티켓 번호", `#${ticket.ticketId}`],
            [
              "📅 방문일",
              ticket.eventDate
                ? dayjs(ticket.eventDate).format("YYYY년 MM월 DD일 (ddd)")
                : "-",
            ],
            ["👥 인원", `${ticket.ticketCount}명`],
            [
              "💳 결제 금액",
              isPaid ? `₩${ticket.price.toLocaleString()}` : "무료",
            ],
            [
              "🕐 예약일시",
              ticket.createdAt
                ? dayjs(ticket.createdAt).format("YYYY.MM.DD HH:mm")
                : "-",
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #f1f2f6",
                fontSize: 13,
              }}
            >
              <span style={{ color: "#9ca3af", fontWeight: 500 }}>{label}</span>
              <span style={{ fontWeight: 800, color: "#1e1e2f" }}>{value}</span>
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: 14,
                fontSize: 13,
                fontWeight: 700,
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "#374151",
              }}
            >
              닫기
            </button>
            {isCancelable && (
              <button
                onClick={() => onCancel(ticket.ticketId)}
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: 14,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 0,
                  background: "linear-gradient(135deg,#ff5ea8,#ef4444)",
                  color: "white",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                예약 취소
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── 날짜별 미니 티켓 카드 ───────────────────────────── */
const MiniTicketCard = ({ t, onClick }) => {
  const st = STATUS[t.status] ?? {
    label: t.status,
    color: "#6b7280",
    bg: "#f3f4f6",
  };
  const isPaid = t.price > 0;

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: "0 3px 14px rgba(106,92,255,0.1)",
        border: "1px solid rgba(106,92,255,0.08)",
        background: "white",
        marginBottom: 10,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(106,92,255,0.18)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 3px 14px rgba(106,92,255,0.1)";
      }}
    >
      {/* 컬러 사이드바 */}
      <div
        style={{
          width: 5,
          flexShrink: 0,
          background:
            t.status === "CANCELED"
              ? "linear-gradient(180deg,#d1d5db,#9ca3af)"
              : "linear-gradient(180deg,#6a5cff,#ff5ea8)",
        }}
      />

      {/* 썸네일 */}
      <div style={{ width: 68, height: 68, flexShrink: 0, overflow: "hidden" }}>
        <img
          src={
            t.imageUrl ||
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=136"
          }
          alt={t.spotTitle}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* 점선 */}
      <div
        style={{
          width: 1,
          flexShrink: 0,
          margin: "10px 0",
          background:
            "repeating-linear-gradient(to bottom,#e5e7eb 0,#e5e7eb 5px,transparent 5px,transparent 10px)",
        }}
      />

      {/* 내용 */}
      <div
        style={{
          flex: 1,
          padding: "10px 12px",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 6,
          }}
        >
          <p
            style={{
              fontWeight: 800,
              fontSize: 13,
              margin: 0,
              color: "#1e1e2f",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {t.spotTitle}
          </p>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              padding: "2px 7px",
              borderRadius: 20,
              flexShrink: 0,
              color: st.color,
              background: st.bg,
            }}
          >
            {st.label}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            fontSize: 11,
            color: "#9ca3af",
            alignItems: "center",
          }}
        >
          <span>👥 {t.ticketCount}명</span>
          <span
            style={{ fontWeight: 700, color: isPaid ? "#374151" : "#10b981" }}
          >
            {isPaid ? `₩${t.price.toLocaleString()}` : "무료"}
          </span>
          <span style={{ marginLeft: "auto", color: "#c4b5fd", fontSize: 10 }}>
            클릭하여 상세보기 →
          </span>
        </div>
      </div>

      {/* 노치 */}
      <div
        style={{
          position: "absolute",
          right: -7,
          top: "50%",
          transform: "translateY(-50%)",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#f0f1f5",
          border: "1px solid #e5e7eb",
        }}
      />
    </div>
  );
};

/* ── 메인 캘린더 컴포넌트 ─────────────────────────────── */
const MyCalendar = () => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(new Date());
  const [modalTicket, setModalTicket] = useState(null);

  useEffect(() => {
    AxiosApi.getMyTickets()
      .then(({ data }) => setTickets(data.data ?? []))
      .catch(console.error);
  }, []);

  const handleCancel = async (ticketId) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      await AxiosApi.cancelTicket(ticketId);
      alert("예약이 취소되었습니다.");
      setModalTicket(null);
      AxiosApi.getMyTickets()
        .then(({ data }) => setTickets(data.data ?? []))
        .catch(console.error);
    } catch (e) {
      alert(e.response?.data?.message ?? "취소에 실패했습니다.");
    }
  };

  const selectedStr = dayjs(selected).format("YYYY-MM-DD");
  const todayTickets = tickets.filter(
    (t) => dayjs(t.eventDate).format("YYYY-MM-DD") === selectedStr,
  );

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    const active = tickets.filter(
      (t) =>
        t.status !== "CANCELED" &&
        dayjs(t.eventDate).format("YYYY-MM-DD") === dateStr,
    ).length;
    if (!active) return null;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 2,
          gap: 2,
        }}
      >
        {Array.from({ length: Math.min(active, 3) }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              display: "inline-block",
              background: i === 0 ? "#6a5cff" : i === 1 ? "#ff5ea8" : "#ffd84d",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 28,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* ── 왼쪽: 캘린더 (고정 너비) ── */}
        <div style={{ flexShrink: 0, width: 320 }}>
          <div
            style={{
              background: "white",
              borderRadius: 20,
              border: "1px solid #ede9fe",
              padding: "16px 14px",
              boxShadow: "0 4px 20px rgba(106,92,255,0.08)",
            }}
          >
            <style>{`
              .my-cal.react-calendar {
                border: none;
                font-family: "Pretendard", sans-serif;
                width: 100%;
                font-size: 13px;
              }
              .my-cal .react-calendar__navigation {
                margin-bottom: 12px;
                height: 36px;
              }
              .my-cal .react-calendar__navigation button {
                font-size: 13px;
                font-weight: 700;
                color: #1e1e2f;
                border-radius: 8px;
                min-width: 30px;
                padding: 0 4px;
              }
              .my-cal .react-calendar__navigation button:enabled:hover,
              .my-cal .react-calendar__navigation button:enabled:focus {
                background: #f1f0ff !important;
                color: #6a5cff;
              }
              .my-cal .react-calendar__navigation__label {
                font-size: 14px !important;
                font-weight: 800 !important;
              }
              .my-cal .react-calendar__month-view__weekdays__weekday abbr {
                text-decoration: none;
                font-size: 11px;
                font-weight: 700;
                color: #9ca3af;
              }
              .my-cal .react-calendar__tile {
                border-radius: 8px;
                padding: 8px 2px 5px;
                font-size: 12px;
                font-weight: 600;
                color: #374151;
                line-height: 1.4;
              }
              .my-cal .react-calendar__tile:enabled:hover {
                background: #f1f0ff !important;
                color: #6a5cff !important;
              }
              .my-cal .react-calendar__tile--active {
                background: linear-gradient(135deg, #6a5cff, #ff5ea8) !important;
                color: white !important;
                border-radius: 8px;
                font-weight: 800;
              }
              .my-cal .react-calendar__tile--now {
                background: #fef9c3 !important;
                color: #ca8a04 !important;
              }
              .my-cal .react-calendar__tile--now.react-calendar__tile--active {
                background: linear-gradient(135deg, #6a5cff, #ff5ea8) !important;
                color: white !important;
              }
              .my-cal .react-calendar__month-view__days__day--weekend {
                color: #ef4444;
              }
              .my-cal .react-calendar__month-view__days__day--neighboringMonth {
                color: #d1d5db !important;
              }
              .my-cal .react-calendar__month-view__days__day--neighboringMonth:enabled:hover {
                color: #6a5cff !important;
              }
            `}</style>
            <Calendar
              className="my-cal"
              onChange={setSelected}
              value={selected}
              tileContent={tileContent}
              locale="ko-KR"
              calendarType="gregory"
            />
          </div>

          {/* 범례 */}
          <div
            style={{
              display: "flex",
              gap: 14,
              padding: "12px 4px 0",
              fontSize: 11,
              color: "#9ca3af",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#6a5cff",
                  display: "inline-block",
                }}
              />
              예약
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: "#fef9c3",
                  border: "1px solid #ca8a04",
                  display: "inline-block",
                }}
              />
              오늘
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: "linear-gradient(135deg,#6a5cff,#ff5ea8)",
                  display: "inline-block",
                }}
              />
              선택일
            </span>
          </div>
        </div>

        {/* ── 오른쪽: 날짜별 예약 목록 ── */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  margin: "0 0 2px",
                  fontWeight: 600,
                }}
              >
                선택한 날짜
              </p>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  margin: 0,
                  color: "#1e1e2f",
                }}
              >
                {dayjs(selected).format("MM월 DD일 (ddd)")}
              </h3>
            </div>
            {todayTickets.length > 0 && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  padding: "5px 12px",
                  borderRadius: 20,
                  background: "linear-gradient(135deg,#6a5cff,#ff5ea8)",
                  color: "white",
                }}
              >
                {todayTickets.length}건
              </span>
            )}
          </div>

          {todayTickets.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "36px 20px",
                background: "#f9fafb",
                borderRadius: 16,
                color: "#9ca3af",
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 8 }}>📭</div>
              <p style={{ fontSize: 13, margin: 0, fontWeight: 600 }}>
                이 날에는 예약이 없어요.
              </p>
              <p style={{ fontSize: 11, margin: "4px 0 0", color: "#d1d5db" }}>
                예약이 있는 날짜를 선택해 보세요
              </p>
            </div>
          ) : (
            todayTickets.map((t) => (
              <MiniTicketCard
                key={t.ticketId}
                t={t}
                onClick={() => setModalTicket(t)}
              />
            ))
          )}
        </div>
      </div>

      {/* 티켓 상세 모달 */}
      <TicketDetailModal
        ticket={modalTicket}
        onClose={() => setModalTicket(null)}
        onCancel={handleCancel}
      />
    </>
  );
};

export default MyCalendar;
