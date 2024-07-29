import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/login.css';

const Login = ({ handleLoginStatus, getid, gettoken }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password,
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Login successful');
            gettoken(token);
            getid(user.id);
            handleLoginStatus(true, user.role);
            navigate('/list');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || 'Login failed');
            } else if (error.request) {
                setError('No response received from server');
            } else {
                setError('Error in setting up request');
            }
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="custom-login-form">
                <div className="custom-form-group">
                    <label htmlFor="email" className="custom-form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className="custom-form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="custom-form-group">
                    <label htmlFor="password" className="custom-form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="custom-form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="custom-btn custom-btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
