import React, { useState, useEffect } from 'react';
import { getStudentNotifications, markAsRead } from '../../api/notifications';
import { Bell, CheckCircle, XCircle, Info, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import './StudentNotifications.css';

const StudentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const student = JSON.parse(localStorage.getItem('user'));
            if (!student) return;
            const res = await getStudentNotifications(student.id || student._id);
            setNotifications(res.data);
        } catch (err) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="loading-container">Fetching updates...</div>;

    return (
        <div className="student-notifications-container animate-fade-in">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Notifications</h1>
                <p className="dashboard-subtitle">Stay updated on your registration statuses and event news.</p>
            </div>

            <div className="notifications-wrapper glass-panel">
                {notifications.length > 0 ? (
                    <div className="n-list">
                        {notifications.map(n => (
                            <div
                                key={n._id}
                                className={`n-card ${n.type} ${n.read ? 'read' : 'unread'}`}
                                onClick={() => !n.read && handleMarkRead(n._id)}
                            >
                                <div className="n-icon-box">
                                    {n.type === 'success' && <CheckCircle size={22} />}
                                    {n.type === 'error' && <XCircle size={22} />}
                                    {n.type === 'info' && <Info size={22} />}
                                </div>
                                <div className="n-body">
                                    <h4 className="n-title">{n.title} {!n.read && <span className="unread-dot" />}</h4>
                                    <p className="n-message">{n.message}</p>
                                    <span className="n-date">{new Date(n.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-n-state">
                        <Bell size={48} className="muted-icon" />
                        <h3>Inbox is clear!</h3>
                        <p>You'll receive notifications here when your registrations are processed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNotifications;
