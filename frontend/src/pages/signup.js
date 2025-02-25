import { useState } from 'react';
import { signup } from '../api/auth'; 
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
const Signup = () => {
    const [user, setUser] = useState({ username: '', password: '', email: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(user);
            alert("Signup Successful! Please login.");
            navigate('/login');
        } catch (error) {
            alert("Signup Failed. Try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" onChange={(e) => setUser({ ...user, username: e.target.value })} required />
                <input type="email" placeholder="Email" onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                <input type="password" placeholder="Password" onChange={(e) => setUser({ ...user, password: e.target.value })} required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
