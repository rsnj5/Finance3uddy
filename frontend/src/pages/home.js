import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="content">
                <h1>Welcome to FinanceBuddy</h1>
                <p>Manage your expenses, track income, and take control of your finances.</p>
                <div className="buttons">
                    <button onClick={() => navigate('/login')} className="login-btn">Login</button>
                    <button onClick={() => navigate('/signup')} className="signup-btn">Sign Up</button>
   
                </div>

            </div>
            <div className="footer">
               <h2>i am foot</h2>
               <p>foot u </p>
            </div>
        </div>
    );
};

export default LandingPage;
