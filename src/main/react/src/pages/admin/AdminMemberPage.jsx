import { useEffect, useState } from "react";
import AxiosApi from "../../api/AxiosApi";
import "./AdminMemberPage.css";

const AdminMemberPage = () => {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async (p = 0) => {
    setLoading(true);

    try {
      const { data } = await AxiosApi.getAdminMembers(p, 10);
      const result = data.data ?? data;

      setMembers(result.content ?? []);
      setTotalPages(result.totalPages ?? 1);
      setPage(p);
    } catch (e) {
      console.error("회원 목록 조회 실패", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(0);
  }, []);

  const handleRoleChange = async (memberId, role) => {
    if (!window.confirm("회원 권한을 변경하시겠습니까?")) return;

    try {
      await AxiosApi.updateMemberRole(memberId, role);
      fetchMembers(page);
    } catch (e) {
      console.error("권한 변경 실패", e);
      alert("권한 변경에 실패했습니다.");
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("정말 회원을 삭제하시겠습니까?")) return;

    try {
      await AxiosApi.deleteAdminMember(memberId);
      fetchMembers(page);
    } catch (e) {
      console.error("회원 삭제 실패", e);
      alert("회원 삭제에 실패했습니다.");
    }
  };

  return (
    <main className="admin-member-page">
      <div className="admin-member-header">
        <div>
          <p>Trendy Spot Admin</p>
          <h1>회원 관리</h1>
        </div>
      </div>

      <section className="admin-member-panel">
        {loading ? (
          <div className="admin-member-loading">회원 목록을 불러오는 중...</div>
        ) : (
          <table className="admin-member-table">
            <thead>
              <tr>
                <th>회원 ID</th>
                <th>이메일</th>
                <th>닉네임</th>
                <th>권한</th>
                <th>가입 유형</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    회원 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.memberId}>
                    <td>{member.memberId}</td>
                    <td>{member.email}</td>
                    <td>{member.nickname}</td>
                    <td>
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member.memberId, e.target.value)
                        }
                      >
                        <option value="ROLE_USER">일반회원</option>
                        <option value="ROLE_ADMIN">관리자</option>
                      </select>
                    </td>
                    <td>{member.provider || "LOCAL"}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(member.memberId)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="admin-pagination">
          <button
            disabled={page === 0}
            onClick={() => fetchMembers(page - 1)}
          >
            이전
          </button>

          <span>
            {page + 1} / {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => fetchMembers(page + 1)}
          >
            다음
          </button>
        </div>
      </section>
    </main>
  );
};

export default AdminMemberPage;