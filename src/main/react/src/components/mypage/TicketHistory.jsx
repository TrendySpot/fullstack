import { useState, useEffect } from "react";
import AxiosApi from "../../api/AxiosApi";
import dayjs from "dayjs";

/* ── 상태 맵 ────────────────────────────────────────────── */
const STATUS = {
  RESERVED: {
    label: "예약 완료",
    color: "#6a5cff",
    bg: "rgba(106,92,255,0.1)",
  },
  FREE: { label: "무료 예약", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  CANCELED: { label: "취소됨", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

/* ── 티켓 상세 모달 ─────────────────────────────────────── */
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
        zIndex: 1000,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 28,
          width: "100%",
          maxWidth: 420,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* 이미지 + 헤더 */}
        <div style={{ position: "relative" }}>
          <img
            src={
              ticket.imageUrl ||
              "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=420"
            }
            alt={ticket.spotTitle}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* 그라디언트 오버레이 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
            }}
          />
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.45)",
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
          {/* 상태 뱃지 */}
          <span
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: 20,
              color: st.color,
              background: "rgba(255,255,255,0.92)",
            }}
          >
            {st.label}
          </span>
          {/* 제목 */}
          <p
            style={{
              position: "absolute",
              bottom: 14,
              right: 14,
              fontSize: 16,
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

        {/* 티켓 구분선 (노치 포함) */}
        <div style={{ position: "relative", height: 20, background: "white" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              borderTop: "2px dashed #e5e7eb",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#f3f4f6",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#f3f4f6",
            }}
          />
        </div>

        {/* 상세 정보 */}
        <div style={{ padding: "4px 24px 24px" }}>
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
                padding: "11px 0",
                borderBottom: "1px solid #f1f2f6",
                fontSize: 14,
              }}
            >
              <span style={{ color: "#9ca3af", fontWeight: 500 }}>{label}</span>
              <span style={{ fontWeight: 800, color: "#1e1e2f" }}>{value}</span>
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

/* ── 티켓 리스트 카드 ───────────────────────────────────── */
const TicketCard = ({ t, onClick }) => {
  const st = STATUS[t.status] ?? {
    label: t.status,
    color: "#6b7280",
    bg: "#f3f4f6",
  };
  const isPaid = t.price > 0;
  const isCanceled = t.status === "CANCELED";

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: "0 4px 16px rgba(106,92,255,0.08)",
        border: "1px solid rgba(106,92,255,0.08)",
        background: "white",
        opacity: isCanceled ? 0.6 : 1,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(106,92,255,0.16)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(106,92,255,0.08)";
      }}
    >
      {/* 왼쪽 컬러 사이드바 */}
      <div
        style={{
          width: 5,
          flexShrink: 0,
          background: isCanceled
            ? "linear-gradient(180deg,#d1d5db,#9ca3af)"
            : "linear-gradient(180deg,#6a5cff,#ff5ea8)",
        }}
      />

      {/* 썸네일 */}
      <div style={{ width: 84, height: 84, flexShrink: 0, overflow: "hidden" }}>
        <img
          src={
            t.imageUrl ||
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=168"
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

      {/* 점선 구분선 */}
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
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <p
            style={{
              fontWeight: 800,
              fontSize: 14,
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
              padding: "3px 8px",
              borderRadius: 20,
              color: st.color,
              background: st.bg,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {st.label}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            fontSize: 12,
            color: "#9ca3af",
            margin: "4px 0",
          }}
        >
          <span>
            📅 {t.eventDate ? dayjs(t.eventDate).format("YYYY.MM.DD") : "-"}
          </span>
          <span>👥 {t.ticketCount}명</span>
        </div>

        <p
          style={{
            fontSize: 14,
            fontWeight: 800,
            margin: 0,
            color: isPaid ? "#1e1e2f" : "#10b981",
          }}
        >
          {isPaid ? `₩${t.price.toLocaleString()}` : "무료"}
        </p>
      </div>

      {/* 오른쪽 노치 */}
      <div
        style={{
          position: "absolute",
          right: -8,
          top: "50%",
          transform: "translateY(-50%)",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#f0f1f5",
          border: "1px solid #e5e7eb",
        }}
      />
    </div>
  );
};

/* ── 메인 컴포넌트 ─────────────────────────────────────── */
const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("ALL");

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

  const filters = [
    { key: "ALL", label: "전체" },
    { key: "RESERVED", label: "예약 완료" },
    { key: "FREE", label: "무료 예약" },
    { key: "CANCELED", label: "취소됨" },
  ];

  const filtered =
    filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div className="spinner" style={{ margin: "0 auto" }} />
      </div>
    );

  if (tickets.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "56px 0", color: "#9ca3af" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎟</div>
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: "0 0 4px",
            color: "#374151",
          }}
        >
          예약 내역이 없어요
        </p>
        <p style={{ fontSize: 13, margin: 0 }}>
          마음에 드는 스팟을 예약해 보세요!
        </p>
      </div>
    );

  return (
    <>
      {/* 필터 탭 */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}
      >
        {filters.map((f) => {
          const count =
            f.key === "ALL"
              ? tickets.length
              : tickets.filter((t) => t.status === f.key).length;
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                border: "1.5px solid",
                borderColor: isActive ? "#6a5cff" : "#e5e7eb",
                background: isActive
                  ? "linear-gradient(135deg,#6a5cff,#ff5ea8)"
                  : "white",
                color: isActive ? "white" : "#6b7280",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "0.15s",
              }}
            >
              {f.label}{" "}
              {count > 0 && <span style={{ opacity: 0.8 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      {/* 티켓 목록 */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            background: "#f9fafb",
            borderRadius: 16,
            color: "#9ca3af",
          }}
        >
          <p style={{ fontSize: 13, margin: 0 }}>해당하는 예약이 없습니다.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((t) => (
            <TicketCard key={t.ticketId} t={t} onClick={() => setSelected(t)} />
          ))}
        </div>
      )}

      <TicketDetailModal
        ticket={selected}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
      />
    </>
  );
};

export default TicketHistory;
