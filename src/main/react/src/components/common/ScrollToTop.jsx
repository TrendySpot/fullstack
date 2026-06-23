import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 페이지 이동 시 스크롤을 항상 맨 위로
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
