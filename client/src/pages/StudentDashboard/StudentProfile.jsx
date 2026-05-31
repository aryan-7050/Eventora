import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Mail, School, 
    Edit2, Save, X, 
    TrendingUp, Award, Calendar,
    ChevronRight, Loader2, Lock
} from 'lucide-react';
import { getStudentProfile, updateStudentProfile, changePassword } from '../../api/student';
import { toast } from 'react-toastify';
import './StudentProfile.css';

const StudentProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        collegeCode: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;
            const res = await getStudentProfile(user.id || user._id);
            setProfile(res.data);
            setFormData({
                name: res.data.name,
                collegeCode: res.data.collegeCode || ''
            });
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await updateStudentProfile(user.id || user._id, formData);
            setProfile({ ...profile, ...res.data });
            
            const updatedUser = { ...user, name: res.data.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            toast.success('Profile updated successfully');
            setEditing(false);
            window.dispatchEvent(new Event('storage'));
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('New passwords do not match');
        }
        setChangingPassword(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await changePassword(user.id || user._id, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) return (
        <div className="loader-container">
            <Loader2 className="animate-spin" size={48} />
            <p>Loading your profile...</p>
        </div>
    );

    return (
        <div className="student-profile-wrapper">
            <div className="student-profile-container animate-fade-in">
                <div className="profile-header-card glass-panel">
                    <div className="profile-avatar-large">
                        <User size={64} />
                        <button className="edit-avatar-btn" title="Change Avatar">
                            <Edit2 size={16} />
                        </button>
                    </div>
                    <div className="profile-header-info">
                        <h1>{profile.name}</h1>
                        <p><Mail size={16} /> {profile.email}</p>
                        <div className="profile-badges">
                            <span className="badge-verified">Verified Student</span>
                            <span className="badge-role">Participant</span>
                        </div>
                    </div>
                </div>

                <div className="profile-content-grid">
                    <div className="profile-main-section">
                        <div className="profile-stats-row">
                            <div className="stat-box glass-panel">
                                <div className="stat-icon registrations">
                                    <Calendar size={24} />
                                </div>
                                <div className="stat-data">
                                    <h3>{profile.stats?.registrations || 0}</h3>
                                    <span>Events Registered</span>
                                </div>
                            </div>
                            <div className="stat-box glass-panel">
                                <div className="stat-icon attended">
                                    <Award size={24} />
                                </div>
                                <div className="stat-data">
                                    <h3>{profile.stats?.attended || 0}</h3>
                                    <span>Events Attended</span>
                                </div>
                            </div>
                            <div className="stat-box glass-panel">
                                <div className="stat-icon impact">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="stat-data">
                                    <h3>Level 1</h3>
                                    <span>Community Impact</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-details-card glass-panel">
                            <div className="pd-header">
                                <h3><User size={20} /> Personal Information</h3>
                                {!editing ? (
                                    <button className="btn-edit-profile" onClick={() => setEditing(true)}>
                                        <Edit2 size={16} /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="edit-actions">
                                        <button className="btn-cancel" onClick={() => setEditing(false)}><X size={16} /> Cancel</button>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleUpdate} className="profile-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <div className="input-with-icon">
                                            <User size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.name} 
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                disabled={!editing}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <div className="input-with-icon disabled">
                                            <Mail size={18} />
                                            <input type="email" value={profile.email} disabled />
                                        </div>
                                        <small>Email cannot be changed.</small>
                                    </div>
                                    <div className="form-group">
                                        <label>College Code</label>
                                        <div className="input-with-icon">
                                            <School size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.collegeCode} 
                                                onChange={(e) => setFormData({...formData, collegeCode: e.target.value})}
                                                disabled={!editing}
                                                placeholder="e.g. KJSIEIT"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Account Type</label>
                                        <div className="input-with-icon disabled">
                                            <Award size={18} />
                                            <input type="text" value="Student Participant" disabled />
                                        </div>
                                    </div>
                                </div>
                                {editing && (
                                    <button type="submit" className="btn-save-profile" disabled={saving}>
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="profile-sidebar-section">
                        <div className="profile-side-card glass-panel">
                            <h3>Security & Privacy</h3>
                            <div className="profile-side-links">
                                <button className="profile-side-link" onClick={() => setShowPasswordModal(true)}>
                                    <span>Change Password</span>
                                    <ChevronRight size={16} />
                                </button>
                                <button className="profile-side-link">
                                    <span>Two-Factor Auth</span>
                                    <span className="link-tag-new">Soon</span>
                                </button>
                            </div>
                        </div>

                        <div className="profile-side-card glass-panel promo-card">
                            <TrendingUp size={32} className="promo-icon" />
                            <h3>Unlock Certificates</h3>
                            <p>Attend more events to earn official participation certificates automatically!</p>
                            <button className="btn-action-promo" onClick={() => navigate('/student/browse')}>
                                View Upcoming Events
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="feedback-modal glass-panel animate-scale-up">
                        <div className="modal-header">
                            <h3><Lock size={20} /> Change Password</h3>
                            <button className="btn-close" onClick={() => setShowPasswordModal(false)}>×</button>
                        </div>
                        <form onSubmit={handlePasswordChange} className="password-form">
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn-submit-feedback" disabled={changingPassword}>
                                    {changingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfile;
