import React, { useState, useEffect } from 'react';
import { Send, Building2, Users, ShieldAlert, Megaphone, AlertTriangle, Check, Search, Clock, History } from 'lucide-react';
import { createAnnouncement, getAnnouncementHistory } from '../../api/announcements';
import { getApprovedClubs } from '../../api/admin';
import { toast } from 'react-toastify';
import './AdminAnnouncements.css';

const AdminAnnouncements = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [history, setHistory] = useState([]);
    
    const [formData, setFormData] = useState({
        message: '',
        audience: ['all_clubs'] // Default array
    });

    useEffect(() => {
        fetchClubs();
        const adminUser = JSON.parse(localStorage.getItem('user'));
        if (adminUser) {
            fetchHistory(adminUser.id || adminUser._id);
        }
    }, []);

    const fetchHistory = async (adminId) => {
        try {
            const res = await getAnnouncementHistory(adminId);
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchClubs = async () => {
        try {
            const res = await getApprovedClubs();
            setClubs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleAudience = (type) => {
        if (formData.audience.includes(type)) {
            if (formData.audience.length === 1) return;
            setFormData({ ...formData, audience: formData.audience.filter(t => t !== type) });
        } else {
            setFormData({ ...formData, audience: [...formData.audience, type] });
        }
    };

    const toggleClubSelection = (id) => {
        if (selectedClubs.includes(id)) {
            setSelectedClubs(selectedClubs.filter(cid => cid !== id));
        } else {
            setSelectedClubs([...selectedClubs, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.message.trim()) return toast.warn('Please enter a message');
        if (formData.audience.includes('specific_clubs') && selectedClubs.length === 0) {
            return toast.warn('Please select at least one club');
        }

        setLoading(true);
        try {
            const adminUser = JSON.parse(localStorage.getItem('user'));
            const data = {
                senderId: adminUser.id || adminUser._id,
                senderType: 'Admin',
                senderName: 'System Administrator',
                message: formData.message,
                audience: formData.audience,
                targetClubIds: formData.audience.includes('specific_clubs') ? selectedClubs : undefined
            };

            await createAnnouncement(data);
            toast.success('Admin announcement broadcasted successfully!');
            setFormData({ ...formData, message: '' });
            setSelectedClubs([]);
            fetchHistory(adminUser.id || adminUser._id);
        } catch (err) {
            toast.error('Failed to send announcement');
        } finally {
            setLoading(false);
        }
    };

    const filteredClubs = clubs.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-announcements-container animate-fade-in">
            <div className="dashboard-header">
                <h1 className="dashboard-title">System Announcements</h1>
                <p className="dashboard-subtitle">Broadcast urgent notices to clubs and students across the platform.</p>
            </div>

            <div className="announcement-layout">
                <div className="announcement-form-wrapper glass-panel">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label><Megaphone size={18} /> Official Message</label>
                            <textarea
                                placeholder="Enter official directive or emergency notice..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div className="audience-selector">
                            <label><Users size={18} /> Official Broadcast Scope (Select Multiple Allowed)</label>
                            <div className="audience-grid">
                                <div 
                                    className={`audience-card ${formData.audience.includes('all_clubs') ? 'active' : ''}`}
                                    onClick={() => toggleAudience('all_clubs')}
                                >
                                    <Building2 size={24} />
                                    <span>All Clubs</span>
                                </div>
                                <div 
                                    className={`audience-card ${formData.audience.includes('all_students') ? 'active' : ''}`}
                                    onClick={() => toggleAudience('all_students')}
                                >
                                    <Users size={24} />
                                    <span>All Students</span>
                                </div>
                                <div 
                                    className={`audience-card ${formData.audience.includes('everyone') ? 'active' : ''}`}
                                    onClick={() => toggleAudience('everyone')}
                                >
                                    <ShieldAlert size={24} />
                                    <span>Global Alert</span>
                                </div>
                                <div 
                                    className={`audience-card ${formData.audience.includes('specific_clubs') ? 'active' : ''}`}
                                    onClick={() => toggleAudience('specific_clubs')}
                                >
                                    <Check size={24} />
                                    <span>Select Clubs</span>
                                </div>
                            </div>
                        </div>

                        {formData.audience.includes('specific_clubs') && (
                            <div className="club-selection-box animate-slide-down">
                                <div className="selection-header">
                                    <label>Target Clubs ({selectedClubs.length} selected)</label>
                                    <div className="search-mini">
                                        <Search size={14} />
                                        <input 
                                            type="text" 
                                            placeholder="Filter clubs..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="clubs-grid-mini">
                                    {filteredClubs.map(club => (
                                        <div 
                                            key={club._id} 
                                            className={`club-chip ${selectedClubs.includes(club._id) ? 'selected' : ''}`}
                                            onClick={() => toggleClubSelection(club._id)}
                                        >
                                            {club.name}
                                            {selectedClubs.includes(club._id) && <Check size={12} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn-broadcast-admin" disabled={loading}>
                            {loading ? 'Broadcasting...' : <><Send size={18} /> Send Official Alert</>}
                        </button>
                    </form>
                </div>

                <div className="announcement-guide glass-panel">
                    <h3><AlertTriangle size={20} /> Admin Authority</h3>
                    <p className="guide-intro">Alerts sent from this console carry the highest priority and will be visible to all recipients immediately.</p>
                    <ul>
                        <li><strong>Global Alert:</strong> Reaches every registered student and approved club.</li>
                        <li><strong>Specific Clubs:</strong> Use for targeted administrative notices (e.g., policy updates).</li>
                        <li><strong>System-wide:</strong> These alerts are logged for compliance and audit.</li>
                    </ul>
                    <div className="authority-seal">
                        <ShieldAlert size={40} />
                        <span>System Verified Broadcast</span>
                    </div>
                </div>
            </div>

            {/* NEW HISTORY SECTION */}
            <div className="admin-announcement-history animate-slide-up">
                <div className="section-header-row">
                    <h2><History size={22} /> Official Log of Sent Notices</h2>
                    <span className="history-count">{history.length} Directives Issued</span>
                </div>

                <div className="history-list">
                    {history.length > 0 ? (
                        history.map(item => (
                            <div key={item._id} className="history-card glass-panel">
                                <div className="hc-header">
                                    <div className="hc-meta">
                                        <span className="hc-date">
                                            <Clock size={14} />
                                            {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                        <div className="hc-labels">
                                            {item.audience.map(a => (
                                                <span key={a} className={`badge-${a}`}>
                                                    {a.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="hc-message">{item.message}</p>
                            </div>
                        ))
                    ) : (
                        <div className="empty-history-admin glass-panel">
                            <Megaphone size={40} />
                            <p>No previous directives found in the audit log.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnnouncements;
