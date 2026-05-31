import React, { useState, useEffect } from 'react';
import {
    CalendarPlus,
    CalendarCheck,
    Users,
    TrendingUp,
    ArrowRight,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    AlertTriangle,
    Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getClubDashboard } from '../../api/club';
import { toast } from 'react-toastify';
import './ClubDashboard.css';

const ClubDashboard = () => {
    const [stats, setStats] = useState([]);
    const [quickStats, setQuickStats] = useState({
        attendanceRate: '0%',
        totalReach: 0,
        certificatesIssued: 0
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const [newRegistrations, setNewRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await getClubDashboard(user.id || user._id);
            if (res.data) {
                setStats(res.data.stats);
                setQuickStats(res.data.quickStats);
                setRecentEvents(res.data.recentEvents);
                setNewRegistrations(res.data.newRegistrations);
            }
        } catch (err) {
            toast.error('Failed to sync institutional dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Loader2 className="animate-spin" size={48} />
                <p>Synchronizing Institutional Dashboard...</p>
            </div>
        );
    }

    const getIcon = (label) => {
        if (label.includes('Created')) return <CalendarPlus size={26} />;
        if (label.includes('Approved')) return <CalendarCheck size={26} />;
        return <Users size={26} />;
    };

    return (
        <div className="club-dash animate-fade-in">
            <div className="club-dash-header">
                <div>
                    <h1 className="dashboard-title">Club Dashboard</h1>
                    <p className="dashboard-subtitle">Manage your club's events and student engagement.</p>
                </div>
                <Link to="/club/create-event" className="btn btn-club">
                    <CalendarPlus size={18} /> Create New Event
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="club-stats-grid">
                {stats.map((s, i) => (
                    <Link to={s.link} key={i} className={`club-stat-card glass-panel accent-${s.color}`}>
                        <div className={`cstat-icon ${s.color}`}>{getIcon(s.label)}</div>
                        <div className="cstat-info">
                            <span className="cstat-value">{s.value.toLocaleString()}</span>
                            <span className="cstat-label">{s.label}</span>
                        </div>
                        <ArrowRight size={18} className="cstat-arrow" />
                    </Link>
                ))}
            </div>

            <div className="club-tables-grid">
                {/* Recent Events */}
                <div className="club-table-card glass-panel">
                    <div className="table-card-header">
                        <h3><Clock size={18} /> Recent Events</h3>
                        <Link to="/club/posted-events" className="view-all-link">View All</Link>
                    </div>
                    {recentEvents.length > 0 ? (
                        <table className="club-table">
                            <thead>
                                <tr><th>Event Title</th><th>Date</th><th>Status</th><th>Regs</th></tr>
                            </thead>
                            <tbody>
                                {recentEvents.map(e => (
                                    <tr key={e._id}>
                                        <td className="bold">{e.title}</td>
                                        <td className="muted">{new Date(e.eventDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${e.status.toLowerCase()}`}>
                                                {e.status === 'approved' && <CheckCircle2 size={12} />}
                                                {e.status === 'pending' && <Clock size={12} />}
                                                {e.status === 'rejected' && <XCircle size={12} />}
                                                {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="bold">{e.registrations}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data-card">
                            <AlertTriangle size={32} />
                            <p>No recent events found. Create your first event to get started!</p>
                        </div>
                    )}
                </div>

                {/* Pending Student Registrations */}
                <div className="club-table-card glass-panel">
                    <div className="table-card-header">
                        <h3><Users size={18} /> New Registrations</h3>
                        <Link to="/club/approve-students" className="view-all-link">View All</Link>
                    </div>
                    {newRegistrations.length > 0 ? (
                        <div className="reg-list">
                            {newRegistrations.map(r => (
                                <div key={r._id} className="reg-item">
                                    <div className="reg-avatar">{r.student.name.split(' ').map(n => n[0]).join('')}</div>
                                    <div className="reg-info">
                                        <p className="reg-name">{r.student.name}</p>
                                        <p className="reg-meta">Registered for <span>{r.event.title}</span> • {new Date(r.registeredAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="reg-actions">
                                        <Link to="/club/approve-students" className="icon-btn approve" title="Manage Registrations">
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data-card">
                            <Users size={32} />
                            <p>No new student registrations recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="quick-stats-bar glass-panel">
                <div className="qs-item">
                    <TrendingUp size={20} className="qs-icon teal" />
                    <div>
                        <span className="qs-val">{quickStats.attendanceRate}</span>
                        <span className="qs-lbl">Attendance Rate</span>
                    </div>
                </div>
                <div className="qs-divider" />
                <div className="qs-item">
                    <Users size={20} className="qs-icon blue" />
                    <div>
                        <span className="qs-val">{quickStats.totalReach}</span>
                        <span className="qs-lbl">Total Reach</span>
                    </div>
                </div>
                <div className="qs-divider" />
                <div className="qs-item">
                    <CalendarCheck size={20} className="qs-icon green" />
                    <div>
                        <span className="qs-val">{quickStats.certificatesIssued}</span>
                        <span className="qs-lbl">Certificates Issued</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubDashboard;
