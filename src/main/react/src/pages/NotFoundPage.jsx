import "./NotFoundPage.css";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <p style={{ fontSize: 64, margin: "0 0 16px" }}>🔍</p>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1e1e2f", margin: "0 0 8px" }}>페이지를 찾을 수 없어요</h1>
      <p style={{ color: "#6b7280", marginBottom: 28 }}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <button className="btn-primary" onClick={() => navigate("/")} style={{ padding: "14px 32px", fontSize: 15 }}>
        메인으로 돌아가기
      </button>
    </div>
  );
};

export default NotFoundPage;
