import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const PasswordRequestPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // 백엔드 @RequestParam 구조에 맞게 query parameter로 전송
      await axios.post("http://localhost:8111/api/auth/password-reset/request", null, {
        params: { email: email }
      });
      setMessage("비밀번호 재설정 링크가 이메일로 발송되었습니다. (5분간 유효)");
    } catch (err) {
      setError(err.response?.data?.message || "존재하지 않는 이메일이거나 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <Link to="/" style={{ fontSize: 22, fontWeight: 900, color: "#6a5cff", textAlign: "center", display: "block", textDecoration: "none" }}>
          Trendy Spot
        </Link>
        <h1>비밀번호 찾기</h1>
        <p>가입하신 이메일 주소를 입력하시면 인증 링크를 보내드립니다.</p>

        <input
          className="input-field"
          type="email"
          placeholder="이메일 주소 입력"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          required
        />

        {error && <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 500, margin: 0 }}>{error}</p>}
        {message && <p style={{ fontSize: 13, color: "#10b981", fontWeight: 500, margin: 0 }}>{message}</p>}

        <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", padding: "16px", fontSize: 15, borderRadius: 16 }}>
          {loading ? "발송 중..." : "인증 이메일 발송"}
        </button>

        <Link to="/login" style={{ textAlign: "center", fontSize: 14, color: "#6b7280", textDecoration: "none", marginTop: 8 }}>
          로그인 페이지로 돌아가기
        </Link>
      </form>
    </div>
  );
};

export default PasswordRequestPage;