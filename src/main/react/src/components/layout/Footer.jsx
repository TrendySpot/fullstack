import { Link } from "react-router-dom";
// [수정, 06월 12일 13:54] 전역 상태를 구독하기 위해 AuthContext의 useAuth 훅 임포트
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  // [수정, 06월 12일 13:54] AuthContext로부터 실시간 로그인 상태(isLoggedIn)를 직접 분해 할당
  const { isLoggedIn } = useAuth();

  return (
    <footer style={{
      background: "#1e1e2f", color: "#9ca3af",
      padding: "48px 48px 28px", marginTop: "80px",
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#6a5cff", marginBottom: 10 }}>
              Trendy Spot
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 220, margin: 0 }}>
              지금 가장 인기 있는 팝업과 전시를 한눈에.<br />
              트렌디한 문화 공간을 발견하세요.
            </p>
          </div>
          <div style={{ display: "flex", gap: 48 }}>
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>서비스</p>
              <Link to="/search" style={{ display: "block", fontSize: 13, marginBottom: 8, color: "#9ca3af" }}>팝업스토어</Link>
              <Link to="/search?spotType=EXHIBIT" style={{ display: "block", fontSize: 13, color: "#9ca3af" }}>전시회</Link>
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>계정</p>
              {/* [수정, 06월 12일 13:54] AuthContext의 isLoggedIn 상태에 따라 메뉴 분기 처리 */}
              {isLoggedIn ? (
                <Link to="/mypage" style={{ display: "block", fontSize: 13, color: "#9ca3af" }}>마이페이지</Link>
              ) : (
                <>
                  <Link to="/login"  style={{ display: "block", fontSize: 13, marginBottom: 8, color: "#9ca3af" }}>로그인</Link>
                  <Link to="/signup" style={{ display: "block", fontSize: 13, color: "#9ca3af" }}>회원가입</Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20,
                      display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12 }}>© 2026 TrendySpot. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <span style={{ fontSize: 12, cursor: "pointer" }}>이용약관</span>
            <span style={{ fontSize: 12, cursor: "pointer" }}>개인정보처리방침</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;