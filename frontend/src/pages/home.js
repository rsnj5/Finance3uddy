import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const backgroundImage = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/dashs.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    return (
        <div className="landing-container" style={backgroundImage}>

            <div className="hero-section">
                <div className="content">
                    <h1>Finance3uddy</h1>
                    <p>Your Ultimate Personal Finance Companion</p>
                    <p className="subtext">
                        Track your income and expenses, manage budgets, set financial goals, and gain insights into your spending habits. Take control of your financial future today!
                    </p>
                    <div className="buttons">
                        <button onClick={() => navigate('/login')} className="login-btn">Get Started</button>
                        <button onClick={() => navigate('/signup')} className="signup-btn">Create Account</button>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <h2>Why Choose Finance3uddy?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>📊 Expense Splitting</h3>
                        <p>"Split expenses effortlessly—track, share, and settle in seconds!"</p>
                    </div>
                    <div className="feature-card">
                        <h3>💰 Transactions</h3>
                        <p>Record, track, and manage all your transactions effortlessly.</p>
                    </div>
                    <div className="feature-card">
                        <h3>📈 Financial Reports</h3>
                        <p>Generate detailed reports to analyze your financial health.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🎯 Goal Setting</h3>
                        <p>Set and achieve your financial goals with personalized plans.</p>
                    </div>
                </div>
            </div>

            <div className="footer">
                <p>© 2025 Finance3uddy. All rights reserved.</p>
                <p>Made with ❤️ by Your Team</p>
            </div>
        </div>
    );
};

export default LandingPage;