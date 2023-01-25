import { useState } from "react";
import { useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth.context";

const Login = () => {
  const [error, setError] = useState("");
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      setError("Failed to sign in");
    }
  };

  if (currentUser !== null) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="login-page">
      <div className="login">
        <h1 className="login-heading">Tickeing System</h1>
        <div className="login-box">
          <h1 className="login-title">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                placeholder="Enter your email"
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                ref={passwordRef}
                placeholder="Enter password"
              />
            </div>
            {error && <p>{error}</p>}
            <div className="submit-btn">
              <button className="btn-login" type="submit">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
export default Login;
