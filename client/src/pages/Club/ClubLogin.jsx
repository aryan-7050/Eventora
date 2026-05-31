import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { clubLogin } from '../../api/auth';
import './ClubAuth.css';

const ClubLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            navigate('/club/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await clubLogin({
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.club));
            localStorage.setItem('userRole', 'club');

            toast.success('Login successful! Welcome to your dashboard.');
            navigate('/club/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials or approval status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container club-auth-bg">
            <div className="auth-card glass-panel club-card animate-fade-in">
                <div className="club-badge-top">
                    <Building2 size={16} /> Club Portal Access
                </div>

                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to manage your club</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Club Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="club@college.edu"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                            <input type="checkbox" /> Remember club
                        </label>
                        <a href="#" className="text-sm club-link">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-club w-full ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>New club? <Link to="/club/register" className="club-link">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ClubLogin;
