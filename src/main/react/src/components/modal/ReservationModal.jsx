import { useState } from "react";
import dayjs from "dayjs";

const ReservationModal = ({ isOpen, onClose, spot, onConfirm }) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [count, setCount] = useState(1);

  if (!isOpen) return null;

  const schedules = spot?.schedules ?? [];

  const handleConfirm = () => {
    if (!selectedSchedule) { alert("날짜를 선택해주세요."); return; }
    // 티켓 생성 없이 날짜/인원 정보만 전달
    onConfirm({
      scheduleId: selectedSchedule.scheduleId,
      count,
      eventDate: selectedSchedule.eventDate,
    });
  };

  return (
    // [수정, 06월 12일 14:02] 바탕 영역을 클릭하더라도 모달이 닫히지 않도록 기존 onClick={onClose} 핸들러 제거
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>예약하기</h2>
          {/* [수정, 06월 12일 14:02] X 버튼 마우스 호버 시 가시성 확보를 위한 크기 확대(scale) 및 색상 변환 인터랙션 추가 */}
          <button 
            onClick={onClose} 
            style={{ 
              border: 0, 
              background: "transparent", 
              cursor: "pointer", 
              fontSize: 20, 
              color: "#6b7280",
              transition: "color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#1e1e2f";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#6b7280";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          {/* 가격 */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px",
                        background: "#f7f8fc", borderRadius: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>티켓 가격</span>
            <span style={{ fontSize: 16, fontWeight: 800 }}>
              {spot?.price === 0 ? "무료" : `₩${spot?.price?.toLocaleString()}`}
            </span>
          </div>

          {/* 날짜 선택 */}
          <p style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>방문 날짜</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, maxHeight: 180, overflowY: "auto", marginBottom: 20 }}>
            {schedules.length === 0
              ? <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>예약 가능한 날짜가 없습니다.</p>
              : schedules.map((sc) => {
                  const isFull = sc.remainedTickets === 0;
                  const isSel  = selectedSchedule?.scheduleId === sc.scheduleId;
                  return (
                    <button key={sc.scheduleId} disabled={isFull} onClick={() => setSelectedSchedule(sc)}
                      style={{
                        border: `2px solid ${isSel ? "#6a5cff" : "#e5e7eb"}`,
                        borderRadius: 12, padding: "10px 8px", fontSize: 12, fontWeight: 600,
                        cursor: isFull ? "not-allowed" : "pointer",
                        background: isSel ? "#f0eeff" : "white", color: isFull ? "#c0c0c0" : "#1e1e2f",
                      }}>
                      <div>{dayjs(sc.eventDate).format("MM/DD (ddd)")}</div>
                      <div style={{ fontSize: 11, color: isFull ? "#c0c0c0" : "#6b7280", marginTop: 2 }}>
                        {isFull ? "마감" : `잔여 ${sc.remainedTickets}`}
                      </div>
                    </button>
                  );
                })
            }
          </div>

          {/* 인원 */}
          <p style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>예약 인원</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <button onClick={() => setCount(Math.max(1, count - 1))}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #e5e7eb", background: "white", fontSize: 18 }}>–</button>
            <span style={{ fontSize: 18, fontWeight: 800, minWidth: 24, textAlign: "center" }}>{count}</span>
            <button onClick={() => setCount(Math.min(selectedSchedule?.remainedTickets ?? 10, count + 1))}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #e5e7eb", background: "white", fontSize: 18 }}>+</button>
          </div>

          {spot?.price > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                          paddingTop: 16, borderTop: "1px solid #f1f2f6", marginBottom: 20 }}>
              <span style={{ fontWeight: 700 }}>총 금액</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#6a5cff" }}>₩{(spot.price * count).toLocaleString()}</span>
            </div>
          )}

          <button className="btn-primary"
            style={{ width: "100%", padding: "16px", fontSize: 15, borderRadius: 16 }}
            onClick={handleConfirm}>
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;