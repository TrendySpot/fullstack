import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OAuth2CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const nickname = searchParams.get("nickname");
    const role = searchParams.get("role");
    const memberId = searchParams.get("memberId");
    const email = searchParams.get("email");

    if (accessToken) {
      login({ accessToken, refreshToken, nickname, role, memberId, email });
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default OAuth2CallbackPage;
