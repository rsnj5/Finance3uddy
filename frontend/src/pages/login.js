import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(credentials);
            localStorage.setItem('access', response.data.access);
            navigate('/dashboard');
        } catch (error) {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} required />
                <input type="password" placeholder="Password" onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
