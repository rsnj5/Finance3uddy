import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as loginUser } from '../redux/authSlice';
import { login } from '../api/auth';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(credentials);
      const token = response.data.access;
      localStorage.setItem('access', token);
      dispatch(loginUser(token));
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || "Invalid Credentials");
    }
  };


  const handleGoogleLogin = async (credentialResponse) => {
    try {
        
   
      
      const csrfResponse = await fetch("http://localhost:8000/api/auth/csrf/", {
        credentials: "include",
      });
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrfToken;
      
      const token = credentialResponse.credential;
      console.log("Received Google token:", token);
      const res = await fetch("http://localhost:8000/api/auth/google/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ access_token: token }),
      });
      const data = await res.json();
  
      if (data.access) {
        localStorage.setItem("access", data.access);
        dispatch(loginUser(data.access));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google Login Failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
        <button type="submit">Login</button>
      </form>

      <div className="google-login-container">
     <GoogleLogin
    onSuccess={handleGoogleLogin}
    onError={() => console.error("Google Login Error")}
    />
</div>
    </div>
  );
};

export default Login;