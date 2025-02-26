import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as loginUser } from '../redux/authSlice';
import { login } from '../api/auth';
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

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;

