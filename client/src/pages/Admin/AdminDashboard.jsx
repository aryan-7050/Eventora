import React, { useState, useEffect } from 'react';
import {
    Users, Building2, CalendarCheck, Clock,
    AlertTriangle, TrendingUp, ArrowRight, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
    getAdminDashboard, 
    approveClub, 
    rejectClub, 
    approveEvent, 
    rejectEvent 
} from '../../api/admin';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [pendingClubs, setPendingClubs] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [quickStats, setQuickStats] = useState({
        approvalRate: '0%',
        participationRate: '0%',
        semesterEvents: 0,
        activeClubs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await getAdminDashboard(user.id || user._id);
            if (res.data) {
                setStats(res.data.stats);
                setPendingClubs(res.data.pendingClubs);
                setPendingEvents(res.data.pendingEvents);
                setQuickStats(res.data.quickStats);
            }
        } catch (err) {
            toast.error('Failed to sync institutional dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveClub = async (id) => {
        try {
            await approveClub(id);
            toast.success('Club verified and activated');
            fetchDashboardData();
        } catch (err) {
            toast.error('Failed to approve club');
        }
    };

    const handleRejectClub = async (id) => {
        if (!window.confirm('Are you sure you want to reject this club registration?')) return;
        try {
            await rejectClub(id, 'Institutional policies');
            toast.info('Club registration rejected');
            fetchDashboardData();
        } catch (err) {
            toast.error('Failed to reject club');
        }
    };

    const handleApproveEvent = async (id) => {
        try {
            await approveEvent(id);
            toast.success('Event approved and pushed to live feed');
            fetchDashboardData();
        } catch (err) {
            toast.error('Failed to approve event');
        }
    };

    const handleRejectEvent = async (id) => {
        const reason = window.prompt('Enter rejection reason:');
        if (reason === null) return;
        try {
            await rejectEvent(id, reason || 'Incomplete details');
            toast.info('Event rejected and club notified');
            fetchDashboardData();
        } catch (err) {
            toast.error('Failed to reject event');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Loader2 className="animate-spin" size={48} />
                <p>Synchronizing Institutional Data Ecosystem...</p>
            </div>
        );
    }

    const getIcon = (label) => {
        if (label.includes('Students')) return <Users size={26} />;
        if (label.includes('Clubs')) return <Building2 size={26} />;
        if (label.includes('Approved')) return <CalendarCheck size={26} />;
        return <Clock size={26} />;
    };

    return (
        <div className="admin-dash animate-fade-in">
            <div className="admin-dash-header">
                <div>
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <p className="dashboard-subtitle">Manage your college events ecosystem.</p>
                </div>
                {stats[3]?.value > 0 && (
                    <div className="header-alert">
                        <AlertTriangle size={16} />
                        <span>{stats[3].value} events awaiting approval</span>
                    </div>
                )}
            </div>

            {/* Stat Cards */}
            <div className="admin-stats-grid">
                {stats.map((s, i) => (
                    <Link to={s.link} key={i} className={`admin-stat-card glass-panel accent-${s.color}`}>
                        <div className={`astat-icon ${s.color}`}>{getIcon(s.label)}</div>
                        <div className="astat-info">
                            <span className="astat-value">{s.value.toLocaleString()}</span>
                            <span className="astat-label">{s.label}</span>
                        </div>
                        <ArrowRight size={18} className="astat-arrow" />
                    </Link>
                ))}
            </div>

            <div className="admin-tables-grid">
                {/* Pending Clubs */}
                <div className="admin-table-card glass-panel">
                    <div className="table-card-header">
                        <h3><Building2 size={18} /> Clubs Awaiting Approval</h3>
                        <Link to="/admin/approve-clubs" className="view-all-link">View All</Link>
                    </div>
                    {pendingClubs.length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr><th>Club Name</th><th>Head</th><th>Applied</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {pendingClubs.map(c => (
                                    <tr key={c._id}>
                                        <td className="bold">{c.name}</td>
                                        <td>{c.headName}</td>
                                        <td className="muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn approve" onClick={() => handleApproveClub(c._id)}>Approve</button>
                                                <button className="action-btn reject" onClick={() => handleRejectClub(c._id)}>Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data-card">
                            <Building2 size={32} />
                            <p>No new club registrations awaiting approval.</p>
                        </div>
                    )}
                </div>

                {/* Pending Events */}
                <div className="admin-table-card glass-panel">
                    <div className="table-card-header">
                        <h3><Clock size={18} /> Events Awaiting Approval</h3>
                        <Link to="/admin/approve-events" className="view-all-link">View All</Link>
                    </div>
                    {pendingEvents.length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr><th>Title</th><th>Club</th><th>Date</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {pendingEvents.map(e => (
                                    <tr key={e._id}>
                                        <td className="bold">{e.title}</td>
                                        <td className="muted">{e.organizingClub.name}</td>
                                        <td className="muted">{new Date(e.eventDate).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn approve" onClick={() => handleApproveEvent(e._id)}>Approve</button>
                                                <button className="action-btn reject" onClick={() => handleRejectEvent(e._id)}>Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data-card">
                            <CalendarCheck size={32} />
                            <p>All institutional events have been processed.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="quick-stats-bar glass-panel">
                <div className="qs-item">
                    <TrendingUp size={20} className="qs-icon green" />
                    <div>
                        <span className="qs-val">{quickStats.approvalRate}</span>
                        <span className="qs-lbl">Event approval rate</span>
                    </div>
                </div>
                <div className="qs-divider" />
                <div className="qs-item">
                    <Users size={20} className="qs-icon blue" />
                    <div>
                        <span className="qs-val">{quickStats.participationRate}</span>
                        <span className="qs-lbl">Student participation</span>
                    </div>
                </div>
                <div className="qs-divider" />
                <div className="qs-item">
                    <CalendarCheck size={20} className="qs-icon purple" />
                    <div>
                        <span className="qs-val">{quickStats.semesterEvents}</span>
                        <span className="qs-lbl">Events this semester</span>
                    </div>
                </div>
                <div className="qs-divider" />
                <div className="qs-item">
                    <Building2 size={20} className="qs-icon orange" />
                    <div>
                        <span className="qs-val">{quickStats.activeClubs}</span>
                        <span className="qs-lbl">Active clubs</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
