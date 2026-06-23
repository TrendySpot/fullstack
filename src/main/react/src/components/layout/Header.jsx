import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import AxiosApi from "../../api/AxiosApi";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { member, isLoggedIn, logout } = useAuth();
  const { clear } = useWishlist();
  const [searchValue, setSearchValue] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = async () => {
    try {
      await AxiosApi.logout();
    } catch {}
    logout();
    clear();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchValue.trim()) params.set("keyword", searchValue.trim());
    navigate(params.toString() ? `/search?${params}` : "/search");
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        Trendy Spot
      </Link>

      <form className="header-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="팝업스토어·전시회 예매는 Trendy Spot에서"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button type="submit" className="search-btn" aria-label="검색">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </button>
      </form>

      <nav className="nav">
        <button
          type="button"
          className="mobile-search-btn"
          onClick={() => setShowMobileSearch((prev) => !prev)}
          aria-label="모바일 검색 열기"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </button>
        {isLoggedIn ? (
          <>
            <Link to="/mypage" className="nav-icon-item">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>마이</span>
            </Link>
            {member?.role === "ROLE_ADMIN" && (
              <Link to="/admin" className="nav-icon-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>관리자</span>
              </Link>
            )}
            <button onClick={handleLogout} className="nav-icon-item nav-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>로그아웃</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-icon-item">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>로그인</span>
            </Link>
            <Link to="/signup" className="nav-icon-item">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              <span>회원가입</span>
            </Link>
          </>
        )}
      </nav>
      {showMobileSearch && (
        <form className="mobile-search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="팝업스토어·전시회 검색"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit">검색</button>
        </form>
      )}
    </header>
  );
};

export default Header;
