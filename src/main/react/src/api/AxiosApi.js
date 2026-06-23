import AxiosInstance from "./AxiosInstance";
import axios from "axios";

const BASE_URL = "/api";

// 인증이 필요 없는 공개 API
const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

const AxiosApi = {
  // ── 인증 (Auth) ──────────────────────────────────────────
  login: (email, password) =>
    publicApi.post("/auth/login", { email, password }),
  signup: (memberData) => publicApi.post("/auth/register", memberData),
  logout: () => AxiosInstance.post("/auth/logout"),
  sendEmailCode: (email) =>
    publicApi.post("/auth/email/send", null, { params: { email } }),
  verifyEmailCode: (email, code) =>
    publicApi.post("/auth/email/verify", null, { params: { email, code } }),
  kakaoLogin: (code) => publicApi.post("/auth/kakao", { code }),
  updateProfile: (data) => AxiosInstance.patch("/auth/me", data),
  findEmail: (nickname) =>
    publicApi.get("/auth/find-email", { params: { nickname } }),
  sendPasswordResetCode: (email) =>
    publicApi.post("/auth/password/send", null, { params: { email } }),
  verifyPasswordResetCode: (email, code) =>
    publicApi.post("/auth/password/verify", null, { params: { email, code } }),
  resetPassword: (data) => publicApi.post("/auth/password/reset", data),
  refresh: (refreshToken) =>
    publicApi.post("/auth/refresh", null, { params: { refreshToken } }),
  checkNickname: (nickname) =>
    publicApi.get(`/auth/check-nickname?nickname=${nickname}`),
  updateNickname: (nickname) =>
    AxiosInstance.patch(
      `/auth/nickname?nickname=${encodeURIComponent(nickname)}`,
    ),

  // ── 스팟 (Spot) ──────────────────────────────────────────
  getSpots: (params) => AxiosInstance.get("/spots", { params }),
  getSpotDetail: (spotId) => AxiosInstance.get(`/spots/${spotId}`),

  // ── 찜 (Wishlist) ────────────────────────────────────────
  getWishlist: () => AxiosInstance.get("/wishlist"),
  getMyWishlist: () => AxiosInstance.get("/wishlist"), // 문서 호환
  toggleWishlist: (spotId) => AxiosInstance.post(`/wishlist/${spotId}`),

  // ── 티켓 (Ticket) ────────────────────────────────────────
  reserve: (body) => AxiosInstance.post("/tickets", body),
  cancelTicket: (ticketId) => AxiosInstance.delete(`/tickets/${ticketId}`),
  getMyTickets: () => AxiosInstance.get("/tickets/me"),
  getSchedules: (spotId) => AxiosInstance.get(`/spots/${spotId}/schedules`),

  // ── 결제 (Payment) ───────────────────────────────────────
  verifyPayment: (body) => AxiosInstance.post("/payments/complete", body),

  // ── 리뷰 (Review) ────────────────────────────────────────
  getReviews: (spotId, params) =>
    AxiosInstance.get(`/spots/${spotId}/reviews`, { params }),
  writeReview: (spotId, content) =>
    AxiosInstance.post(`/spots/${spotId}/reviews`, { content }),
  updateReview: (spotId, reviewId, content) =>
    AxiosInstance.patch(`/spots/${spotId}/reviews/${reviewId}`, { content }),
  deleteReview: (spotId, reviewId) =>
    AxiosInstance.delete(`/spots/${spotId}/reviews/${reviewId}`),

  // ── 관리자 (Admin) ───────────────────────────────────────
  getDashboard: () => AxiosInstance.get("/admin/dashboard"),
  getAdminMembers: (page, size) =>
    AxiosInstance.get("/admin/members", { params: { page, size } }),
  getAdminMember: (memberId) => AxiosInstance.get(`/admin/members/${memberId}`),
  deleteAdminMember: (memberId) =>
    AxiosInstance.delete(`/admin/members/${memberId}`),
  updateMemberRole: (memberId, role) =>
    AxiosInstance.patch(`/admin/members/${memberId}/role`, null, {
      params: { role },
    }),
  getAdminSpots: (page, size) =>
    AxiosInstance.get("/admin/spots", { params: { page, size } }),
  createAdminSpot: (body) => AxiosInstance.post("/admin/spots", body),
  updateAdminSpot: (spotId, body) =>
    AxiosInstance.put(`/admin/spots/${spotId}`, body),
  deleteAdminSpot: (spotId) => AxiosInstance.delete(`/admin/spots/${spotId}`),
  getAdminReviews: (page, size) =>
    AxiosInstance.get("/admin/reviews", { params: { page, size } }),
  deleteAdminReview: (reviewId) =>
    AxiosInstance.delete(`/admin/reviews/${reviewId}`),
};

export default AxiosApi;
