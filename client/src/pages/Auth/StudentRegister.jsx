import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, Hash } from 'lucide-react';
import { toast } from 'react-toastify';
import { studentRegister } from '../../api/auth';
import './Auth.css';

const StudentRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        studentId: '',
        collegeCode: ''
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
            const { name, email, password, studentId, collegeCode } = formData;
            const res = await studentRegister({ name, email, password, studentId, collegeCode });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.student));

            toast.success('Registration successful! Welcome to Eventora.');
            navigate('/student/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel animate-fade-in">
                <div className="auth-header">
                    <Link to="/" className="brand justify-center mb-4">
                        <Calendar className="brand-icon" />
                        <span className="brand-text">Eventora</span>
                    </Link>
                    <h2>Student Registration</h2>
                    <p>Join to discover and manage college events</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input type="text" name="name" placeholder="Aryan Patil" value={formData.name} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input type="email" name="email" placeholder="Aryan@example.com" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Student ID (Roll No / UID)</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input type="text" name="studentId" placeholder="2021001" value={formData.studentId} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>College Code</label>
                        <div className="input-with-icon">
                            <Hash size={18} className="input-icon" />
                            <input type="text" name="collegeCode" placeholder="XYZ123" value={formData.collegeCode} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary w-full mt-4 ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/student/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;

