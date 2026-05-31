import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Compass,
    CalendarCheck,
    CheckCircle,
    User,
    LogOut,
    Calendar,
    Bell
} from 'lucide-react';
import { toast } from 'react-toastify';
import './StudentSidebar.css';

const StudentSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.info('Logged out successfully');
        navigate('/student/login', { replace: true });
    };

    const navLinks = [
        { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Browse Events', path: '/student/browse', icon: <Compass size={20} /> },
        { name: 'Notifications', path: '/student/notifications', icon: <Bell size={20} /> },
        { name: 'Registered Events', path: '/student/registered', icon: <CalendarCheck size={20} /> },
        { name: 'Attended Events', path: '/student/attended', icon: <CheckCircle size={20} /> },
    ];

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
            <aside className={`student-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Calendar className="sidebar-brand-icon" />
                    <span className="sidebar-brand-text">Student Portal</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="section-title">Menu</span>
                        {navLinks.map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.path}
                                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <NavLink
                        to="/student/profile"
                        className={({ isActive }) => `sidebar-link profile-link ${isActive ? 'active' : ''}`}
                        onClick={() => setIsOpen(false)}
                    >
                        <User size={20} />
                        <span>My Profile</span>
                    </NavLink>
                    <button className="sidebar-link logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default StudentSidebar;
