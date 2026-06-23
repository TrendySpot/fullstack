  import "./MyPage.css";
  import { useState } from "react";
  import { useAuth } from "../context/AuthContext";
  import ProfileForm   from "../components/mypage/ProfileForm";
  import MyCalendar    from "../components/mypage/MyCalendar";
  import WishlistTab   from "../components/mypage/WishlistTab";
  import TicketHistory from "../components/mypage/TicketHistory";

  const TABS = [
    { id: "profile",  label: "프로필",      emoji: "👤" },
    { id: "calendar", label: "예약 캘린더", emoji: "📅" },
    { id: "wishlist", label: "찜한 스팟",   emoji: "♥" },
    { id: "tickets",  label: "예약 내역",   emoji: "🎟" },
  ];

  const MyPage = () => {
    const { member } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    const renderContent = () => {
      switch (activeTab) {
        case "profile":  return <ProfileForm />;
        case "calendar": return <MyCalendar />;
        case "wishlist": return <WishlistTab />;
        case "tickets":  return <TicketHistory />;
        default: return null;
      }
    };

    return (
      <div className="mypage">
        {/* 사이드바 */}
        <aside>
          <div className="profile-card">
            <div className="profile-image">
              {member?.nickname?.[0]?.toUpperCase() ?? "🙂"}
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 16, margin: "0 0 4px" }}>{member?.nickname ?? "회원"}</p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{member?.email}</p>
            </div>
          </div>

          <div className="mypage-sidebar">
            {TABS.map((tab) => (
              <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
                <span>{tab.emoji}</span>{tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* 콘텐츠 */}
        <main>
          <div className="panel">
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f1f2f6" }}>
              {TABS.find((t) => t.id === activeTab)?.emoji} {TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            {renderContent()}
          </div>
        </main>
      </div>
    );
  };

  export default MyPage;
