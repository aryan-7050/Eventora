import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarPlus,
    CalendarCheck,
    Users,
    Award,
    Megaphone,
    BarChart3,
    Wallet,
    CheckSquare,
    User,
    LogOut,
    Building2,
    Bell,
    Settings
} from 'lucide-react';
import { toast } from 'react-toastify';
import './ClubSidebar.css';

const ClubSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.info('Logged out from Club Portal');
        navigate('/club/login', { replace: true });
    };

    const navLinks = [
        { name: 'Dashboard', path: '/club/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Approve Students', path: '/club/approve-students', icon: <Users size={20} /> },
        { name: 'Create Events', path: '/club/create-event', icon: <CalendarPlus size={20} /> },
        // { name: 'Events Posted', path: '/club/posted-events', icon: <Building2 size={20} /> },
        { name: 'Approved/Rejected', path: '/club/event-status', icon: <CalendarCheck size={20} /> },
        { name: 'Manage Events', path: '/club/manage-events', icon: <Settings size={20} /> },
        { name: 'Notifications', path: '/club/notifications', icon: <Bell size={20} /> },
        { name: 'Certificate Gen', path: '/club/certificates', icon: <Award size={20} /> },
        { name: 'Emergency Announcement', path: '/club/announcements', icon: <Megaphone size={20} /> },
        { name: 'Feedback Analysis', path: '/club/feedback', icon: <BarChart3 size={20} /> },
        { name: 'Budget Tracker', path: '/club/budget', icon: <Wallet size={20} /> },
        { name: 'Attendance Mgmt', path: '/club/attendance', icon: <CheckSquare size={20} /> },
    ];

    return (
        <>
            {isOpen && <div className="club-overlay" onClick={() => setIsOpen(false)} />}
            <aside className={`club-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="club-sidebar-header">
                    <div className="club-logo-wrapper">
                        <Building2 size={22} />
                    </div>
                    <div>
                        <span className="club-brand-text">Club Portal</span>
                        <span className="club-badge-pill">Organizer</span>
                    </div>
                </div>

                <nav className="club-nav">
                    <span className="section-title">Management</span>
                    {navLinks.map((link, i) => (
                        <NavLink
                            key={i}
                            to={link.path}
                            className={({ isActive }) => `club-link-item ${isActive ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="club-sidebar-footer">
                    <NavLink
                        to="/club/profile"
                        className={({ isActive }) => `club-link-item ${isActive ? 'active' : ''}`}
                        onClick={() => setIsOpen(false)}
                    >
                        <User size={20} />
                        <span>My Profile</span>
                    </NavLink>
                    <button className="club-link-item logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default ClubSidebar;
