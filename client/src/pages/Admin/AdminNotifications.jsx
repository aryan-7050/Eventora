import React, { useState, useEffect } from 'react';
import { getAdminNotifications, markAdminNotificationRead, markAllAdminNotificationsRead } from '../../api/adminNotifications';
import { Bell, CheckCircle, ShieldAlert, AlertCircle, Clock, CheckCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import './AdminNotifications.css';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await getAdminNotifications();
            setNotifications(res.data);
        } catch (err) {
            toast.error('Failed to load alerts');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markAdminNotificationRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAdminNotificationsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast.success('All alerts marked as read');
        } catch (err) {
            toast.error('Failed to update alerts');
        }
    };

    if (loading) return <div className="admin-loading">Loading Command Center Alerts...</div>;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="admin-notifications-container animate-fade-in">
            <div className="dashboard-header">
                <div className="header-with-action">
                    <div>
                        <h1 className="dashboard-title">Club Alerts & Notifications</h1>
                        <p className="dashboard-subtitle">Monitor incoming emergency messages and official updates from club administrators.</p>
                    </div>
                    {unreadCount > 0 && (
                        <button className="btn-mark-all" onClick={handleMarkAllRead}>
                            <CheckCheck size={18} /> Mark All as Read
                        </button>
                    )}
                </div>
            </div>

            <div className="notifications-portal glass-panel">
                {notifications.length > 0 ? (
                    <div className="alerts-list">
                        {notifications.map(n => (
                            <div 
                                key={n._id} 
                                className={`alert-card ${n.read ? 'read' : 'unread'} ${n.type}`}
                                onClick={() => !n.read && handleMarkAsRead(n._id)}
                            >
                                <div className="alert-icon-box">
                                    {n.type === 'warning' ? <AlertCircle size={24} /> : <ShieldAlert size={24} />}
                                </div>
                                <div className="alert-content">
                                    <div className="alert-header">
                                        <div className="sender-info">
                                            <span className="sender-type">{n.sender.type}</span>
                                            <span className="sender-name">{n.sender.name}</span>
                                        </div>
                                        <span className="alert-time">
                                            <Clock size={12} />
                                            {new Date(n.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <h3 className="alert-title">{n.title}</h3>
                                    <p className="alert-message">{n.message}</p>
                                </div>
                                {!n.read && <div className="unread-indicator">NEW</div>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-alerts">
                        <Bell size={60} />
                        <h2>No Incoming Alerts</h2>
                        <p>All clear! There are no pending club announcements or system alerts.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;
