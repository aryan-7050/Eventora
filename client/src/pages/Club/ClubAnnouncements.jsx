import React, { useState, useEffect } from 'react';
import { Send, Users, User, ShieldAlert, Megaphone, AlertTriangle, Calendar, Clock, History, Globe } from 'lucide-react';
import { createAnnouncement, getAnnouncementHistory } from '../../api/announcements';
import { getClubEvents } from '../../api/events';
import { toast } from 'react-toastify';
import './ClubAnnouncements.css';

const ClubAnnouncements = () => {
    const [clubInfo, setClubInfo] = useState(null);
    const [history, setHistory] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        message: '',
        audience: ['all_students'], // Default as array
        targetEventId: ''
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setClubInfo(user);
            const id = user.id || user._id;
            fetchEvents(id);
            fetchHistory(id);
        }
    }, []);

    const fetchHistory = async (clubId) => {
        try {
            const res = await getAnnouncementHistory(clubId);
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchEvents = async (clubId) => {
        try {
            const res = await getClubEvents(clubId);
            setEvents(res.data.filter(e => e.status === 'approved' && e.isPosted));
        } catch (err) {
            console.error(err);
        }
    };

    const toggleAudience = (type) => {
        if (formData.audience.includes(type)) {
            if (formData.audience.length === 1) return; // Must have at least one
            setFormData({ ...formData, audience: formData.audience.filter(t => t !== type) });
        } else {
            setFormData({ ...formData, audience: [...formData.audience, type] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.message.trim()) return toast.warn('Please enter a message');
        if (formData.audience.includes('registered_participants') && !formData.targetEventId) {
            return toast.warn('Please select an event for participants');
        }

        setLoading(true);
        try {
            const data = {
                senderId: clubInfo.id || clubInfo._id,
                senderType: 'Club',
                senderName: clubInfo.name,
                message: formData.message,
                audience: formData.audience,
                targetEventId: formData.targetEventId || undefined
            };

            await createAnnouncement(data);
            toast.success('Emergency announcement broadcasted!');
            setFormData({ ...formData, message: '', targetEventId: '' });
            fetchHistory(clubInfo.id || clubInfo._id);
        } catch (err) {
            toast.error('Failed to send announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="announcements-container animate-fade-in">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Emergency Announcements</h1>
                <p className="dashboard-subtitle">Broadcast urgent updates to students or administration.</p>
            </div>

            <div className="announcement-layout">
                <div className="announcement-form-wrapper glass-panel">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label><Megaphone size={18} /> Announcement Message</label>
                            <textarea
                                placeholder="Type your urgent message here..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            ></textarea>
                            <span className="char-hint">Be concise and clear. This will be sent as a priority alert.</span>
                        </div>

                        <div className="audience-selector">
                            <label><Users size={18} /> Select Target Audience (Multiple Allowed)</label>
                            <div className="audience-grid">
                                <div 
                                    className={`audience-card ${formData.audience.includes('all_students') ? 'active' : ''}`}
                                    onClick={() => toggleAudience('all_students')}
                                >
                                    <Users size={24} />
                                    <span>All Students</span>
                                </div>
                                <div 
                                    className={`audience-card ${formData.audience.includes('admin') ? 'active' : ''}`}
                                    onClick={() => toggleAudience('admin')}
                                >
                                    <ShieldAlert size={24} />
                                    <span>Administrator</span>
                                </div>
                                <div 
                                    className={`audience-card ${formData.audience.includes('everyone') ? 'active' : ''}`}
                                    onClick={() => toggleAudience('everyone')}
                                >
                                    <Globe size={24} />
                                    <span>Everyone</span>
                                </div>
                                <div 
                                    className={`audience-card ${formData.audience.includes('registered_participants') ? 'active' : ''}`}
                                    onClick={() => toggleAudience('registered_participants')}
                                >
                                    <Calendar size={24} />
                                    <span>Event Participants</span>
                                </div>
                            </div>
                        </div>

                        {formData.audience.includes('registered_participants') && (
                            <div className="form-group animate-slide-down">
                                <label>Select Event</label>
                                <select 
                                    value={formData.targetEventId}
                                    onChange={(e) => setFormData({ ...formData, targetEventId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select an Event --</option>
                                    {events.map(e => (
                                        <option key={e._id} value={e._id}>{e.title}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button type="submit" className="btn-send-alert" disabled={loading}>
                            {loading ? 'Broadcasting...' : <><Send size={18} /> Broadcast Alert</>}
                        </button>
                    </form>
                </div>

                <div className="announcement-guide glass-panel">
                    <h3><AlertTriangle size={20} /> Important Guidelines</h3>
                    <ul>
                        <li>Use this feature only for <strong>urgent</strong> or <strong>critical</strong> updates.</li>
                        <li>Emergency alerts bypass standard notification filters.</li>
                        <li>Targeted event participants will receive a direct push alert.</li>
                        <li>False or spam alerts may lead to portal restrictions.</li>
                    </ul>
                    <div className="preview-box">
                        <span className="preview-label">Notification Preview:</span>
                        <div className="notification-preview">
                            <div className="p-icon"><Clock size={16} /></div>
                            <div className="p-content">
                                <strong>Emergency Alert: {clubInfo?.name}</strong>
                                <p>{formData.message || 'Your message will appear here...'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW HISTORY SECTION */}
            <div className="announcement-history-section animate-slide-up">
                <div className="section-header-row">
                    <h2><History size={22} /> Broadcast History</h2>
                    <span className="history-count">{history.length} Messages Sent</span>
                </div>

                <div className="history-grid">
                    {history.length > 0 ? (
                        history.map(item => (
                            <div key={item._id} className="history-item glass-panel">
                                <div className="hi-header">
                                    <div className="hi-date">
                                        <Clock size={14} />
                                        {new Date(item.createdAt).toLocaleString()}
                                    </div>
                                    <div className="hi-audiences">
                                        {item.audience.map(a => (
                                            <span key={a} className={`audience-badge ${a}`}>
                                                {a.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="hi-message">{item.message}</p>
                            </div>
                        ))
                    ) : (
                        <div className="empty-history glass-panel">
                            <Megaphone size={32} />
                            <p>No previous announcements found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ClubAnnouncements;
