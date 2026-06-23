import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AxiosApi from "../api/AxiosApi";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [wishedIds, setWishedIds] = useState(new Set());
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await AxiosApi.getWishlist();
      const list = data.data ?? [];
      setWishlist(list);
      setWishedIds(new Set(list.map((w) => w.spotId)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 로그인 상태 변경 시 자동으로 찜 목록 로드
  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
    } else {
      setWishedIds(new Set());
      setWishlist([]);
    }
  }, [isLoggedIn, fetchWishlist]);

  const toggle = async (spotId) => {
    const isWished = wishedIds.has(spotId);
    const prevIds = new Set(wishedIds);
    const prevList = [...wishlist];

    setWishedIds((prev) => {
      const next = new Set(prev);
      isWished ? next.delete(spotId) : next.add(spotId);
      return next;
    });
    if (isWished) {
      setWishlist((prev) => prev.filter((w) => w.spotId !== spotId));
    }

    try {
      await AxiosApi.toggleWishlist(spotId);
      fetchWishlist();
    } catch {
      setWishedIds(prevIds);
      setWishlist(prevList);
    }
  };

  const clear = () => {
    setWishedIds(new Set());
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{ wishedIds, wishlist, loading, fetchWishlist, toggle, clear }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;
