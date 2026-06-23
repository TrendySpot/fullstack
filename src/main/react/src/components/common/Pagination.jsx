const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left  = Math.max(0, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    if (left > 0) { pages.push(0); if (left > 1) pages.push("..."); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) {
      if (right < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>‹</button>
      {getPageNumbers().map((page, i) =>
        page === "..."
          ? <span key={`e${i}`} style={{ padding: "0 4px", color: "#6b7280" }}>…</span>
          : <button key={page}
              className={page === currentPage ? "active" : ""}
              onClick={() => onPageChange(page)}>
              {page + 1}
            </button>
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>›</button>
    </div>
  );
};

export default Pagination;
