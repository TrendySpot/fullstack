import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const PasswordResetPage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// URL에서 ?token=값 추출
	const params = new URLSearchParams(location.search);
	const token = params.get("token");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("비밀번호가 서로 일치하지 않습니다.");
			return;
		}
		if (!token) {
			setError("유효하지 않거나 만료된 토큰인증 링크입니다.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await axios.post("http://localhost:8111/api/auth/password-reset/complete", null, {
				params: {
					token: token,
					newPassword: password
				}
			});
			alert("비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해 주세요.");
			navigate("/login");
		} catch (err) {
			setError(err.response?.data?.message || "비밀번호 변경에 실패했습니다. 링크 만료 시간을 확인하세요.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-page">
			<form className="auth-card" onSubmit={handleSubmit}>
				<Link to="/" style={{ fontSize: 22, fontWeight: 900, color: "#6a5cff", textAlign: "center", display: "block", textDecoration: "none" }}>
					Trendy Spot
				</Link>
				<h1>비밀번호 재설정</h1>
				<p>새롭게 사용할 비밀번호를 입력해 주세요.</p>

				<input
					className="input-field"
					type="password"
					placeholder="새 비밀번호"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				<input
					className="input-field"
					type="password"
					placeholder="새 비밀번호 확인"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>

				{error && <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 500, margin: 0 }}>{error}</p>}

				<button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", padding: "16px", fontSize: 15, borderRadius: 16 }}>
					{loading ? "변경 중..." : "비밀번호 변경 완료"}
				</button>
			</form>
		</div>
	);
};

export default PasswordResetPage;