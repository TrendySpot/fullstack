import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import "./AdminDashboardPage.css";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalMembers: 0,
    totalSpots: 0,
    totalTickets: 0,
    totalReviews: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await AxiosApi.getDashboard();
        setDashboard(data.data ?? data);
      } catch (e) {
        console.error("관리자 대시보드 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      label: "전체 회원 수",
      value: `${dashboard.totalMembers}명`,
      icon: "👥",
    },
    {
      label: "전체 스팟 수",
      value: `${dashboard.totalSpots}개`,
      icon: "📍",
    },
    {
      label: "전체 예약 수",
      value: `${dashboard.totalTickets}건`,
      icon: "🎟️",
    },
    {
      label: "전체 댓글 수",
      value: `${dashboard.totalReviews}개`,
      icon: "💬",
    },
    {
      label: "총 매출",
      value: `₩${dashboard.totalRevenue.toLocaleString()}`,
      icon: "💰",
    },
  ];

  const menus = [
    {
      title: "회원 관리",
      description: "회원 목록 조회, 권한 변경, 회원 삭제",
      path: "/admin/members",
      icon: "👤",
    },
    {
      title: "스팟 관리",
      description: "팝업스토어/전시회 등록, 수정, 삭제",
      path: "/admin/spots",
      icon: "🏬",
    },
    {
      title: "댓글 관리",
      description: "전체 댓글 조회 및 부적절한 댓글 삭제",
      path: "/admin/reviews",
      icon: "📝",
    },
  ];

  return (
    <main className="admin-dashboard">
      <section className="admin-dashboard-header">
        <div>
          <p>Trendy Spot Admin</p>
          <h1>관리자 대시보드</h1>
        </div>
      </section>

      {loading ? (
        <div className="admin-loading">대시보드 데이터를 불러오는 중...</div>
      ) : (
        <>
          <section className="admin-stats">
            {stats.map((stat) => (
              <article className="admin-stat-card" key={stat.label}>
                <div className="admin-stat-icon">{stat.icon}</div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </section>

          <section className="admin-manage-section">
            <div className="admin-section-title">
              <h2>관리 메뉴</h2>
              <p>
                관리자 권한으로 회원, 스팟, 댓글 데이터를 관리할 수 있습니다.
              </p>
            </div>

            <div className="admin-menu-grid">
              {menus.map((menu) => (
                <button
                  key={menu.title}
                  type="button"
                  className="admin-menu-card"
                  onClick={() => navigate(menu.path)}
                >
                  <div className="admin-menu-icon">{menu.icon}</div>
                  <div>
                    <h3>{menu.title}</h3>
                    <p>{menu.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default AdminDashboardPage;
