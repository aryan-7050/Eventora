import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminLogin } from '../../api/auth';
import './AdminLogin.css';

const AdminLogin = () => {
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
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await adminLogin({
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('userRole', 'admin');

            toast.success('Admin authentication successful! Access granted.');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication failed. Unauthorized access prohibited.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="security-bg">
                <div className="scan-line"></div>
                <div className="grid-overlay"></div>
            </div>

            <div className="admin-login-card glass-panel animate-fade-in">
                <div className="admin-login-header">
                    <div className="shield-icon-wrapper">
                        <Shield className="shield-icon" size={42} />
                        <div className="shield-pulse"></div>
                    </div>
                    <h1>Admin Control</h1>
                    <p>Authorization Required for System Access</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <label>Administrator ID</label>
                        <div className="input-with-icon admin-input">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="admin@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Security Key</label>
                        <div className="input-with-icon admin-input">
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

                    <div className="security-notice">
                        <AlertCircle size={14} />
                        <span>All login attempts are logged and monitored.</span>
                    </div>

                    <button
                        type="submit"
                        className={`btn-admin-login ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Verifying Credentials...' : 'Access Command Center'}
                    </button>

                    <div className="back-link">
                        <button type="button" onClick={() => navigate('/')}>Return to Main Site</button>
                    </div>
                </form>

                <div className="security-footer">
                    <div className="status-indicator">
                        <CheckCircle2 size={12} className="status-icon" />
                        <span>Encrypted Session</span>
                    </div>
                    <span className="version">v2.4.0-pro</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
