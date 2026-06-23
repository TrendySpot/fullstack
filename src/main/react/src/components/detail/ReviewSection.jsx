import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import AxiosApi from "../../api/AxiosApi";
import dayjs from "dayjs";

const ReviewSection = ({ spotId }) => {
  const { member, isLoggedIn } = useAuth();
  const [reviews, setReviews]       = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [content, setContent]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const { data } = await AxiosApi.getReviews(spotId, { page: p, size: 10 });
      const pd = data.data;
      setReviews(pd.content);
      setTotalPages(pd.totalPages);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [spotId]);

  useEffect(() => { fetchReviews(0); }, [fetchReviews]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await AxiosApi.writeReview(spotId, content.trim());
      setContent("");
      fetchReviews(0);
    } catch { alert("댓글 등록에 실패했습니다."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await AxiosApi.deleteReview(spotId, reviewId);
      fetchReviews(page);
    } catch { alert("삭제에 실패했습니다."); }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e1e2f", marginBottom: 20 }}>
        댓글 <span style={{ color: "#6a5cff" }}>{reviews.length}</span>
      </h2>

      {/* ── 댓글 작성 폼 ── */}
      <div style={{ marginBottom: 28 }}>
        <textarea
          rows={3}
          maxLength={1000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isLoggedIn ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
          disabled={!isLoggedIn}
          style={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: "14px 16px",
            fontSize: 14,
            fontFamily: "inherit",
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
            display: "block",
            transition: "border 0.2s",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#6a5cff"; }}
          onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
            style={{
              border: 0,
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 13,
              fontWeight: 800,
              fontFamily: "inherit",
              color: "white",
              background: "linear-gradient(135deg,#ff5ea8,#8b5cf6)",
              cursor: !content.trim() || submitting ? "not-allowed" : "pointer",
              opacity: !content.trim() || submitting ? 0.6 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {submitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>

      {/* ── 로딩 ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div className="spinner" style={{ margin: "0 auto" }} />
        </div>
      )}

      {/* ── 댓글 없음 ── */}
      {!loading && reviews.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "20px 0" }}>
          첫 번째 댓글을 남겨보세요!
        </p>
      )}

      {/* ── 댓글 목록 ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {reviews.map((r) => (
          <div key={r.reviewId} style={{ display: "flex", gap: 12 }}>
            {/* 아바타 */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg,#ffd84d,#ff5ea8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, flexShrink: 0, color: "white",
            }}>
              {r.nickname?.[0]?.toUpperCase() ?? "?"}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{r.nickname}</span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>
                  {dayjs(r.createdAt).format("YYYY.MM.DD HH:mm")}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6, wordBreak: "break-word" }}>
                {r.content}
              </p>
            </div>

            {/* 삭제 버튼 - 본인 댓글만 */}
            {member?.memberId === r.memberId && (
              <button onClick={() => handleDelete(r.reviewId)}
                style={{ border: 0, background: "transparent", fontSize: 12,
                         color: "#9ca3af", cursor: "pointer", flexShrink: 0,
                         fontFamily: "inherit", padding: "0 4px" }}>
                삭제
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── 더 보기 ── */}
      {page < totalPages - 1 && (
        <button onClick={() => fetchReviews(page + 1)}
          style={{ width: "100%", marginTop: 16, padding: "12px",
                   border: "1px solid #e5e7eb", borderRadius: 14,
                   background: "white", color: "#6b7280", fontSize: 14,
                   fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
          더 보기
        </button>
      )}
    </div>
  );
};

export default ReviewSection;
