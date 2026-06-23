import AxiosInstance from "./AxiosInstance";

const AxiosApi = {
  // ── 인증 (Auth) ──────────────────────────────────────────
  login: (email, password) =>
    AxiosInstance.post("/auth/login", { email, password }),
  signup: (memberData) => AxiosInstance.post("/auth/register", memberData),
  logout: () => AxiosInstance.post("/auth/logout"),
  sendEmailCode: (email) =>
    AxiosInstance.post("/auth/email/send", null, { params: { email } }),
  verifyEmailCode: (email, code) =>
    AxiosInstance.post("/auth/email/verify", null, { params: { email, code } }),
  kakaoLogin: (code) => AxiosInstance.post("/auth/kakao", { code }),
  updateProfile: (data) => AxiosInstance.patch("/auth/me", data),
  findEmail: (nickname) =>
    AxiosInstance.get("/auth/find-email", { params: { nickname } }),
  sendPasswordResetCode: (email) =>
    AxiosInstance.post("/auth/password/send", null, { params: { email } }),
  verifyPasswordResetCode: (email, code) =>
    AxiosInstance.post("/auth/password/verify", null, { params: { email, code } }),
  resetPassword: (data) => AxiosInstance.post("/auth/password/reset", data),
  refresh: (refreshToken) =>
    AxiosInstance.post("/auth/refresh", null, { params: { refreshToken } }),
  checkNickname: (nickname) =>
    AxiosInstance.get(`/auth/check-nickname?nickname=${nickname}`),
  updateNickname: (nickname) =>
    AxiosInstance.patch(
      `/auth/nickname?nickname=${encodeURIComponent(nickname)}`,
    ),

  // ── 스팟 (Spot) ──────────────────────────────────────────
  getSpots: (params) => AxiosInstance.get("/spots", { params }),
  getSpotDetail: (spotId) => AxiosInstance.get(`/spots/${spotId}`),

  // ── 찜 (Wishlist) ────────────────────────────────────────
  getWishlist: () => AxiosInstance.get("/wishlist"),
  getMyWishlist: () => AxiosInstance.get("/wishlist"),
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