import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Clock, Info, Check } from 'lucide-react';
import { getClubNotifications, markClubNotificationRead, markAllClubNotificationsRead } from '../../api/notifications';
import { toast } from 'react-toastify';
import './ClubNotifications.css';

const ClubNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clubId, setClubId] = useState(null);

    useEffect(() => {
        const club = JSON.parse(localStorage.getItem('user'));
        if (club) {
            const id = club.id || club._id;
            setClubId(id);
            fetchNotifications(id);
        }
    }, []);

    const fetchNotifications = async (id) => {
        try {
            const res = await getClubNotifications(id);
            setNotifications(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Failed to fetch notifications');
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markClubNotificationRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllClubNotificationsRead(clubId);
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast.success('All marked as read');
        } catch (err) {
            toast.error('Failed to update notifications');
        }
    };

    if (loading) return <div className="loading-spinner">Fetching alerts...</div>;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notifications-container animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Notifications</h1>
                    <p className="dashboard-subtitle">Stay updated on your event proposals and administration alerts.</p>
                </div>
                {unreadCount > 0 && (
                    <button className="btn-mark-all" onClick={handleMarkAllRead}>
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notifications-list glass-panel">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n._id} className={`notification-item ${n.type} ${n.read ? 'read' : 'unread'}`}>
                            <div className="n-icon">
                                {n.type === 'success' && <CheckCircle size={20} />}
                                {n.type === 'error' && <XCircle size={20} />}
                                {n.type === 'warning' && <Clock size={20} />}
                                {n.type === 'info' && <Info size={20} />}
                            </div>
                            <div className="n-content">
                                <div className="n-header">
                                    <h4 className="n-title">{n.title}</h4>
                                    {!n.read && (
                                        <button className="mark-read-btn" title="Mark as read" onClick={() => handleMarkRead(n._id)}>
                                            <Check size={14} />
                                        </button>
                                    )}
                                </div>
                                <p className="n-text">{n.message}</p>
                                <span className="n-time">{new Date(n.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-notifications">
                        <Bell size={40} className="muted-icon" />
                        <p>No new notifications at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClubNotifications;
