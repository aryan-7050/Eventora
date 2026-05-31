import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Lock, Hash, AlignLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { clubRegister } from '../../api/auth';
import './ClubAuth.css';

const ClubRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        headName: '',
        email: '',
        password: '',
        confirmPassword: '',
        collegeCode: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords don't match!");
        }

        setLoading(true);
        try {
            const { name, headName, email, password, collegeCode, description } = formData;
            const res = await clubRegister({ name, headName, email, password, collegeCode, description });

            toast.success(res.data.message || 'Registration submitted! Waiting for admin approval.');
            navigate('/club/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container club-auth-bg">
            <div className="auth-card glass-panel club-card animate-fade-in">
                <div className="club-badge-top">
                    <Building2 size={16} /> Club Portal Registration
                </div>

                <div className="auth-header">
                    <h2>Register Your Club</h2>
                    <p>Tell us about your organization to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="grid-2-col">
                        <div className="form-group">
                            <label>Club Name <span className="required-star">*</span></label>
                            <div className="input-with-icon">
                                <Building2 size={18} className="input-icon" />
                                <input type="text" name="name" placeholder="Coding Club" value={formData.name} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Club Head Name <span className="required-star">*</span></label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input type="text" name="headName" placeholder="Siddharth Jain" value={formData.headName} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="grid-2-col">
                        <div className="form-group">
                            <label>Club Email <span className="required-star">*</span></label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input type="email" name="email" placeholder="club@college.edu" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Admin College Code <span className="required-star">*</span></label>
                            <div className="input-with-icon">
                                <Hash size={18} className="input-icon" />
                                <input type="text" name="collegeCode" placeholder="Enter 6-char code" value={formData.collegeCode} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Club Description <span className="required-star">*</span></label>
                        <textarea
                            name="description"
                            className="club-textarea"
                            placeholder="Briefly describe your club's mission and regular activities..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div className="grid-2-col">
                        <div className="form-group">
                            <label>Password <span className="required-star">*</span></label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password <span className="required-star">*</span></label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-club w-full mt-4 ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting Registration...' : 'Register Club'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already registered? <Link to="/club/login" className="club-link">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ClubRegister;

