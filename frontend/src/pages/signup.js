import { useState } from 'react';
import { signup } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Signup = () => {
    const [user, setUser] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(user);
            alert("Signup Successful! Please login.");
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.detail || "Signup Failed. Try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} required />
                <input type="email" placeholder="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                <input type="password" placeholder="Password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;

