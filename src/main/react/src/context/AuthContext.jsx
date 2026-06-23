import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null,
  );
  const [member, setMember] = useState(() => {
    try {
      const saved = localStorage.getItem("member");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 로그인 - LoginResponse: { accessToken, refreshToken, memberId, email, nickname, role }
  const login = ({
    accessToken,
    refreshToken,
    memberId,
    email,
    nickname,
    role,
    provider,
  }) => {
    const memberData = { memberId, email, nickname, role, provider };
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken || "");
    localStorage.setItem("member", JSON.stringify(memberData));
    setAccessToken(accessToken);
    setMember(memberData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("member");
    setAccessToken(null);
    setMember(null);
  };

  const updateMember = (partial) => {
    const updated = { ...member, ...partial };
    localStorage.setItem("member", JSON.stringify(updated));
    setMember(updated);
  };

  const isLoggedIn = !!accessToken;
  const isAdmin = member?.role === "ROLE_ADMIN";

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        member,
        isLoggedIn,
        isAdmin,
        login,
        logout,
        updateMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
