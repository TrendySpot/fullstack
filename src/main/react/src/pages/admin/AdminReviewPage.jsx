import { useEffect, useState } from "react";
import AxiosApi from "../../api/AxiosApi";
import "./AdminReviewPage.css";

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (p = 0) => {
    setLoading(true);

    try {
      const { data } = await AxiosApi.getAdminReviews(p, 10);
      const result = data.data ?? data;

      setReviews(result.content ?? []);
      setTotalPages(result.totalPages ?? 1);
      setPage(p);
    } catch (e) {
      console.error("리뷰 목록 조회 실패", e);
      alert("리뷰 목록 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(0);
  }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;

    try {
      await AxiosApi.deleteAdminReview(reviewId);
      alert("리뷰가 삭제되었습니다.");
      fetchReviews(page);
    } catch (e) {
      console.error("리뷰 삭제 실패", e);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  return (
    <main className="admin-review-page">
      <div className="admin-review-header">
        <p>Trendy Spot Admin</p>
        <h1>리뷰 관리</h1>
      </div>

      <section className="admin-review-panel">
        {loading ? (
          <div className="admin-review-loading">리뷰 목록을 불러오는 중...</div>
        ) : (
          <table className="admin-review-table">
            <thead>
              <tr>
                <th>리뷰 ID</th>
                <th>작성자</th>
                <th>스팟명</th>
                <th>내용</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    리뷰 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.reviewId}>
                    <td>{review.reviewId}</td>
                    <td>{review.nickname || review.memberNickname || "-"}</td>
                    <td>{review.spotTitle || review.title || "-"}</td>
                    <td className="review-content">{review.content}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(review.reviewId)}
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
          <button disabled={page === 0} onClick={() => fetchReviews(page - 1)}>
            이전
          </button>

          <span>
            {page + 1} / {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => fetchReviews(page + 1)}
          >
            다음
          </button>
        </div>
      </section>
    </main>
  );
};

export default AdminReviewPage;