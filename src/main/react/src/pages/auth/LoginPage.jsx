import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import AxiosApi from "../../api/AxiosApi";
import "./Auth.css";

const KAKAO_AUTH_URL = `/oauth2/authorization/kakao`;
const GOOGLE_AUTH_URL = `/oauth2/authorization/google`;
const NAVER_AUTH_URL = `/oauth2/authorization/naver`;

const EyeIcon = ({ visible }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={visible ? "#6a5cff" : "#9ca3af"}
    strokeWidth="2"
  >
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { fetchWishlist } = useWishlist();
  const from = location.state?.from?.pathname ?? "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await AxiosApi.login(form.email, form.password);
      const {
        accessToken,
        refreshToken,
        memberId,
        email,
        nickname,
        role,
        provider,
      } = data.data;

      login({
        accessToken,
        refreshToken,
        memberId,
        email,
        nickname,
        role,
        provider,
      });
      await fetchWishlist();
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "이메일 또는 비밀번호가 올바르지 않습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <Link
          to="/"
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#6a5cff",
            textAlign: "center",
            display: "block",
          }}
        >
          Trendy Spot
        </Link>
        <h1>로그인</h1>
        <p>Trendy Spot에서 새로운 경험을 찾아보세요.</p>

        <input
          className="input-field"
          name="email"
          type="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            className="input-field"
            name="password"
            type={showPw ? "text" : "password"}
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            style={{ paddingRight: 44 }}
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            style={{
              position: "absolute",
              right: 12,
              border: 0,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <EyeIcon visible={showPw} />
          </button>
        </div>

        {error && (
          <p
            style={{
              fontSize: 13,
              color: "#ef4444",
              fontWeight: 500,
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        <button
          className="btn-primary"
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: 15,
            borderRadius: 16,
          }}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 12, color: "#9ca3af" }}>또는</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        {/* 카카오 로그인 */}
        <a href={KAKAO_AUTH_URL} className="btn-kakao" style={{ gap: "8px" }}>
          {/* 카카오 말풍선 로고 */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.933 1.954 5.494 4.908 6.845l-1.241 4.545c-.137.502.408.924.845.633l5.352-3.565c.045.002.09.007.136.007 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
          </svg>
          카카오 로그인
        </a>

        {/* 네이버 로그인 */}
        <a href={NAVER_AUTH_URL} className="btn-naver">
          {/* 네이버 N 로고 */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.2 0H24v24h-9.8L9.8 12.4V24H0V0h9.8L14.2 11.6V0z"/>
          </svg>
          네이버 로그인
        </a>

        {/* 구글 로그인 */}
        <a href={GOOGLE_AUTH_URL} className="btn-google">
          {/* 구글 G 로고 */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.65-5.17 3.65-8.58z" fill="#4285F4"/>
            <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z" fill="#34A853"/>
            <path d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.46l4.11-3.22z" fill="#FBBC05"/>
            <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.46l4.11 3.22c.94-2.85 3.57-4.93 6.68-4.93z" fill="#EA4335"/>
          </svg>
          구글 로그인
        </a>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
          }}
        >
          <Link
            to="/signup"
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            회원가입
          </Link>
          <span style={{ fontSize: 12, color: "#e5e7eb" }}>|</span>
          <Link
            to="/password-reset/request"
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            비밀번호 찾기
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
