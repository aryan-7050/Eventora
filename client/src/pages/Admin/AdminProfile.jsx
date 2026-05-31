import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, Mail, School, 
    Edit2, Save, X, 
    TrendingUp, Users, User, Calendar,
    ChevronRight, Loader2, Lock, Award,
    Building2, Plus, Image as ImageIcon
} from 'lucide-react';
import { getAdminProfile, updateAdminProfile, changeAdminPassword, uploadOfficialSeal } from '../../api/admin';
import { toast } from 'react-toastify';
import './AdminProfile.css';

const AdminProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showSealModal, setShowSealModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        collegeCode: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [uploadingSeal, setUploadingSeal] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const userString = localStorage.getItem('user');
            if (!userString) {
                setLoading(false);
                return;
            }
            const user = JSON.parse(userString);
            const res = await getAdminProfile(user.id || user._id);
            if (res.data) {
                setProfile(res.data);
                setFormData({
                    name: res.data.name || 'System Administrator',
                    email: res.data.email || '',
                    collegeCode: res.data.collegeCode || ''
                });
            }
        } catch (err) {
            toast.error('Failed to load admin profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await updateAdminProfile(user.id || user._id, formData);
            setProfile({ ...profile, ...res.data });
            
            // Update local storage too
            const updatedUser = { ...user, name: res.data.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            toast.success('Admin profile updated successfully');
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
            await changeAdminPassword(user.id || user._id, {
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

    const handleSealUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            return toast.error('File size should be less than 2MB');
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            setUploadingSeal(true);
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                await uploadOfficialSeal(user.id || user._id, { sealUrl: reader.result });
                setProfile({ ...profile, sealUrl: reader.result });
                toast.success('Official seal updated successfully');
                setShowSealModal(false);
            } catch (err) {
                toast.error('Failed to upload official seal');
            } finally {
                setUploadingSeal(false);
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading || !profile) return (
        <div className="loader-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#64748b' }}>
            <Loader2 className="animate-spin" size={48} />
            <p style={{ marginTop: '1rem' }}>Loading admin profile...</p>
        </div>
    );

    return (
        <div className="admin-profile-wrapper">
            <div className="admin-profile-container animate-fade-in">
                <div className="profile-header-card admin-glass-panel">
                    <div className="profile-avatar-large admin-avatar">
                        <ShieldCheck size={64} />
                    </div>
                    <div className="profile-header-info">
                        <h1>{profile.name}</h1>
                        <p><Mail size={16} /> {profile.email}</p>
                        <div className="profile-badges">
                            <span className="badge-verified">Official Administrator</span>
                            <span className="badge-role">Super Admin</span>
                        </div>
                    </div>
                </div>

                <div className="profile-content-grid">
                    <div className="profile-main-section">
                        <div className="profile-stats-row">
                            <div className="stat-box admin-glass-panel">
                                <div className="stat-icon clubs">
                                    <Building2 size={24} />
                                </div>
                                <div className="stat-data">
                                    <h3>{profile.stats?.totalClubs || 0}</h3>
                                    <span>Total Clubs</span>
                                </div>
                            </div>
                            <div className="stat-box admin-glass-panel">
                                <div className="stat-icon events">
                                    <Calendar size={24} />
                                </div>
                                <div className="stat-data">
                                    <h3>{profile.stats?.totalEvents || 0}</h3>
                                    <span>Total Events</span>
                                </div>
                            </div>
                            <div className="stat-box admin-glass-panel">
                                <div className="stat-icon users">
                                    <Users size={24} />
                                </div>
                                <div className="stat-data">
                                    <h3>{profile.stats?.totalStudents || 0}</h3>
                                    <span>Total Students</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-details-card admin-glass-panel">
                            <div className="pd-header">
                                <h3><User size={20} /> Admin Details</h3>
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
                                    <div className="form-group full-width">
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
                                        <label>Admin Email</label>
                                        <div className="input-with-icon">
                                            <Mail size={18} />
                                            <input 
                                                type="email" 
                                                value={formData.email} 
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                disabled={!editing}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Institute Category</label>
                                        <div className="input-with-icon">
                                            <School size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.collegeCode} 
                                                onChange={(e) => setFormData({...formData, collegeCode: e.target.value})}
                                                disabled={!editing}
                                                placeholder="e.g. Engineering College"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {editing && (
                                    <button type="submit" className="btn-save-profile admin-btn-save" disabled={saving}>
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="profile-sidebar-section">
                        <div className="profile-side-card admin-glass-panel">
                            <h3>Branding Assets</h3>
                            <div className="seal-management-card">
                                <div className="seal-thumbnail">
                                    {profile.sealUrl ? (
                                        <img src={profile.sealUrl} alt="Official Seal" />
                                    ) : (
                                        <div className="empty-seal">
                                            <Award size={32} />
                                            <span>No Seal Uploaded</span>
                                        </div>
                                    )}
                                </div>
                                <button className="btn-manage-seal" onClick={() => setShowSealModal(true)}>
                                    <Award size={16} /> {profile.sealUrl ? 'Update Seal' : 'Upload Seal'}
                                </button>
                                <p className="seal-help-text">This official seal will be used on all system-generated certificates.</p>
                            </div>
                        </div>

                        <div className="profile-side-card admin-glass-panel">
                            <h3>Security</h3>
                            <div className="profile-side-links">
                                <button className="profile-side-link" onClick={() => setShowPasswordModal(true)}>
                                    <span>Change Password</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showSealModal && (
                <div className="modal-overlay">
                    <div className="cert-modal admin-glass-panel animate-scale-up">
                        <div className="modal-header">
                            <h3><Award size={18} /> Official Platform Seal</h3>
                            <button className="btn-close" onClick={() => setShowSealModal(false)}><X /></button>
                        </div>
                        <div className="modal-body">
                            <p>Upload the official institute or platform stamp to be used for all certificates across the portal.</p>
                            
                            <div className="signature-preview-box admin-seal-preview">
                                {profile.sealUrl ? (
                                    <img src={profile.sealUrl} alt="Seal Preview" />
                                ) : (
                                    <div className="empty-signature">
                                        <ImageIcon size={48} />
                                        <span>No seal uploaded</span>
                                    </div>
                                )}
                            </div>

                            <label className="btn-upload-label admin-btn-upload">
                                {uploadingSeal ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                                {uploadingSeal ? 'Processing...' : 'Upload Seal Image'}
                                <input type="file" accept="image/*" onChange={handleSealUpload} hidden />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="feedback-modal admin-glass-panel animate-scale-up">
                        <div className="modal-header">
                            <h3><Lock size={20} /> Change Admin Password</h3>
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
                                <button type="submit" className="btn-submit-feedback admin-btn-save" disabled={changingPassword}>
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

export default AdminProfile;
