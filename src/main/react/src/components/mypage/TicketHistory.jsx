import { useState, useEffect } from "react";
import AxiosApi from "../../api/AxiosApi";
import dayjs from "dayjs";

const STATUS = {
  RESERVED: { label: "예약 완료", cls: "badge badge-ongoing" },
  CANCELED: { label: "취소됨", cls: "badge badge-ended" },
  FREE: { label: "무료 예약", cls: "badge badge-upcoming" },
};

// ── 티켓 상세 모달 ──────────────────────────────────────
const TicketDetailModal = ({ ticket, onClose, onCancel }) => {
  if (!ticket) return null;
  const st = STATUS[ticket.status] ?? { label: ticket.status, cls: "badge" };
  const isCancelable = ticket.status === "RESERVED" || ticket.status === "FREE";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 24,
          width: "100%",
          maxWidth: 420,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* 이미지 */}
        <div style={{ position: "relative" }}>
          <img
            src={
              ticket.imageUrl ||
              "https://images.unsplash.com/photo-1545987796-200677ee1011?w=420"
            }
            alt={ticket.spotTitle}
            style={{ width: "100%", height: 180, objectFit: "cover" }}
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
              background: "rgba(0,0,0,0.5)",
              border: 0,
              color: "white",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
          <span
            className={st.cls}
            style={{ position: "absolute", bottom: 12, left: 12 }}
          >
            {st.label}
          </span>
        </div>

        {/* 내용 */}
        <div style={{ padding: "20px 24px 24px" }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 900,
              margin: "0 0 16px",
              color: "#1e1e2f",
            }}
          >
            {ticket.spotTitle}
          </h2>

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
              ticket.price === 0
                ? "무료"
                : ticket.price
                  ? `₩${ticket.price.toLocaleString()}`
                  : "-",
            ],
            [
              "🕐 예약일",
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
                padding: "10px 0",
                borderBottom: "1px solid #f1f2f6",
                fontSize: 14,
              }}
            >
              <span style={{ color: "#6b7280" }}>{label}</span>
              <span style={{ fontWeight: 700, color: "#1e1e2f" }}>{value}</span>
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              닫기
            </button>
            {isCancelable && (
              <button
                onClick={() => onCancel(ticket.ticketId)}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 14,
                  fontSize: 14,
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

// ── 메인 컴포넌트 ────────────────────────────────────────
const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchTickets = () => {
    AxiosApi.getMyTickets()
      .then(({ data }) => setTickets(data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCancel = async (ticketId) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      await AxiosApi.cancelTicket(ticketId);
      alert("예약이 취소되었습니다.");
      setSelected(null);
      fetchTickets();
    } catch (e) {
      alert(e.response?.data?.message ?? "취소에 실패했습니다.");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div className="spinner" style={{ margin: "0 auto" }} />
      </div>
    );

  if (tickets.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎟</div>
        <p style={{ fontSize: 14 }}>예약 내역이 없습니다.</p>
      </div>
    );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {tickets.map((t) => {
          const st = STATUS[t.status] ?? { label: t.status, cls: "badge" };
          return (
            <div
              key={t.ticketId}
              onClick={() => setSelected(t)}
              style={{
                display: "flex",
                gap: 16,
                padding: 18,
                background: "#f7f8fc",
                borderRadius: 20,
                cursor: "pointer",
                transition: "0.15s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#f1f0ff")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#f7f8fc")}
            >
              <img
                src={
                  t.imageUrl ||
                  "https://images.unsplash.com/photo-1545987796-200677ee1011?w=80"
                }
                alt={t.spotTitle}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 6,
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                    {t.spotTitle}
                  </p>
                  <span className={st.cls}>{st.label}</span>
                </div>
                <p
                  style={{ fontSize: 12, color: "#6b7280", margin: "0 0 2px" }}
                >
                  방문일:{" "}
                  {t.eventDate
                    ? dayjs(t.eventDate).format("YYYY년 MM월 DD일")
                    : "-"}
                </p>
                <p
                  style={{ fontSize: 12, color: "#6b7280", margin: "0 0 2px" }}
                >
                  인원: {t.ticketCount}명
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
                  {t.price === 0
                    ? "무료"
                    : t.price
                      ? `₩${t.price.toLocaleString()}`
                      : "-"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <TicketDetailModal
        ticket={selected}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
      />
    </>
  );
};

export default TicketHistory;
