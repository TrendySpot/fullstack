import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AxiosApi from "../../api/AxiosApi";

const ProfileForm = () => {
  const { member, updateMember } = useAuth();

  const [nickname, setNickname] = useState(member?.nickname ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setNicknameChecked(false);
    setNicknameAvailable(false);
    setNicknameMessage("");
  };

  const handleCheckNickname = async () => {
    if (!nickname || nickname.length < 2 || nickname.length > 20) {
      setNicknameMessage("닉네임은 2자 이상 20자 이하로 입력해주세요.");
      setNicknameAvailable(false);
      return;
    }

    if (nickname === member?.nickname) {
      setNicknameChecked(true);
      setNicknameAvailable(true);
      setNicknameMessage("현재 사용 중인 닉네임입니다.");
      return;
    }

    try {
      const { data } = await AxiosApi.checkNickname(nickname);
      setNicknameChecked(true);
      setNicknameAvailable(data.data);
      setNicknameMessage(
        data.data
          ? "사용 가능한 닉네임입니다."
          : "이미 사용 중인 닉네임입니다.",
      );
    } catch {
      setNicknameMessage("닉네임 중복 확인에 실패했습니다.");
    }
  };

  const handleUpdateNickname = async () => {
    if (!nicknameChecked || !nicknameAvailable) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    setLoading(true);
    try {
      await AxiosApi.updateNickname(nickname);
      updateMember({ nickname });
      alert("닉네임이 변경되었습니다.");
    } catch (e) {
      alert(e.response?.data?.message || "닉네임 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      alert("새 비밀번호는 8자 이상 입력해주세요.");
      return;
    }

    if (newPassword !== passwordConfirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      await AxiosApi.updateProfile({
        currentPassword,
        newPassword,
      });

      alert("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirm("");
    } catch (e) {
      alert(e.response?.data?.message || "비밀번호 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 460,
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <div>
        <label className="input-label">이메일</label>
        <input className="input-field" value={member?.email ?? ""} disabled />
      </div>

      <section>
        <h3 style={{ marginBottom: 14 }}>닉네임 변경</h3>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input-field"
            value={nickname}
            onChange={handleNicknameChange}
            maxLength={20}
            placeholder="2자 이상 20자 이하"
          />

          <button
            type="button"
            className="btn-secondary"
            onClick={handleCheckNickname}
            style={{
              minWidth: "100px",
              height: "52px",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            중복확인
          </button>
        </div>

        {nicknameMessage && (
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginTop: 6,
              color: nicknameAvailable ? "#059669" : "#ef4444",
            }}
          >
            {nicknameAvailable ? "✓ " : "✗ "}
            {nicknameMessage}
          </p>
        )}

        <button
          type="button"
          className="btn-primary"
          onClick={handleUpdateNickname}
          disabled={loading}
          style={{ marginTop: 12 }}
        >
          닉네임 수정
        </button>
      </section>

      {member?.provider === "LOCAL" && (
        <section>
          <h3 style={{ marginBottom: 14 }}>비밀번호 변경</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              className="input-field"
              type="password"
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              className="input-field"
              type="password"
              placeholder="새 비밀번호 8자 이상"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              className="input-field"
              type="password"
              placeholder="새 비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <button
              type="button"
              className="btn-primary"
              onClick={handleUpdatePassword}
              disabled={loading}
            >
              비밀번호 변경
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfileForm;
