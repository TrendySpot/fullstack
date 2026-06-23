import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AxiosApi from "../../api/AxiosApi";
import dayjs from "dayjs";

const PaymentModal = ({ isOpen, onClose, spot, reservation, onSuccess }) => {
  const { member } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const totalAmount = (spot?.price ?? 0) * (reservation?.count ?? 1);
  const paymentId = `trendy_spot_${Date.now()}`;

  const handlePay = async () => {
    setLoading(true);
    try {
      // 무료 예약 - 결제 없이 바로 티켓 생성 + 검증
      if (totalAmount === 0) {
        await AxiosApi.verifyPayment({
          scheduleId: reservation.scheduleId,
          ticketCount: reservation.count,
          portonePaymentId: "FREE",
          merchantUid: paymentId,
          amount: 0,
        });
        onSuccess?.();
        onClose();
        alert("무료 예약이 완료되었습니다!");
        return;
      }

      // 포트원 V2 SDK 확인
      const PortOne = window.PortOne;
      if (!PortOne) {
        throw new Error(
          "포트원 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.",
        );
      }

      // 포트원 V2 결제 요청
      const customer = { fullName: member?.nickname ?? "" };
      if (member?.email) customer.email = member.email;

      const response = await PortOne.requestPayment({
        storeId: process.env.REACT_APP_PORTONE_STORE_ID,
        channelKey: process.env.REACT_APP_PORTONE_CHANNEL_KEY,
        paymentId,
        orderName: spot.title,
        totalAmount,
        currency: "KRW",
        payMethod: "CARD",
        customer,
      });

      // 결제 실패 또는 취소
      if (response.code) {
        throw new Error(response.message ?? "결제에 실패했습니다.");
      }

      // 결제 완료 후 티켓 생성 + 검증
      await AxiosApi.verifyPayment({
        scheduleId: reservation.scheduleId,
        ticketCount: reservation.count,
        portonePaymentId: response.paymentId,
        merchantUid: response.paymentId,
        amount: totalAmount,
      });

      onSuccess?.();
      onClose();
      alert("예약이 완료되었습니다!");
    } catch (e) {
      alert(e.message ?? "결제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // [수정, 06월 12일 14:04] 바탕 영역을 클릭하더라도 결제 모달이 닫히지 않도록 기존 onClick={onClose} 핸들러 제거
    <div className="modal-overlay">
      <div
        className="modal-box"
        style={{ maxWidth: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>결제하기</h2>
          {/* [수정, 06월 12일 14:04] X 버튼 마우스 호버 시 가시성 확보를 위한 크기 확대(scale) 및 색상 변환 인터랙션 추가 */}
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
        <div
          className="modal-body"
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div
            style={{
              background: "#f7f8fc",
              borderRadius: 16,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              ["공연명", spot?.title],
              [
                "방문 날짜",
                reservation?.eventDate
                  ? dayjs(reservation.eventDate).format("YYYY년 MM월 DD일")
                  : "-",
              ],
              ["인원", `${reservation?.count}명`],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "#6b7280" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 12,
              borderTop: "1px solid #f1f2f6",
            }}
          >
            <span style={{ fontWeight: 700 }}>결제 금액</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#6a5cff" }}>
              {totalAmount === 0 ? "무료" : `₩${totalAmount.toLocaleString()}`}
            </span>
          </div>
          <button
            className="btn-primary"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: 15,
              borderRadius: 16,
            }}
            onClick={handlePay}
            disabled={loading}
          >
            {loading
              ? "처리 중..."
              : totalAmount === 0
                ? "무료 예약 완료"
                : "결제하기"}
          </button>
          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#9ca3af",
              margin: 0,
            }}
          >
            결제는 포트원(PortOne)을 통해 안전하게 처리됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;