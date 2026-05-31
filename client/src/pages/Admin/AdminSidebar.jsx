import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Building2,
    CalendarCheck,
    ClipboardList,
    ShieldCheck,
    Key,
    User,
    LogOut,
    Megaphone,
    Bell
} from 'lucide-react';
import { toast } from 'react-toastify';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.info('Logged out from Admin Console');
        navigate('/admin/login', { replace: true });
    };

    const navLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Registered Students', path: '/admin/students', icon: <Users size={20} /> },
        { name: 'Registered Clubs', path: '/admin/clubs', icon: <Building2 size={20} /> },
        { name: 'Approve Clubs', path: '/admin/approve-clubs', icon: <ShieldCheck size={20} /> },
        { name: 'Approve Events', path: '/admin/approve-events', icon: <ClipboardList size={20} /> },
        { name: 'Events Conducted', path: '/admin/conducted-events', icon: <CalendarCheck size={20} /> },
        { name: 'College Code', path: '/admin/college-code', icon: <Key size={20} /> },
        { name: 'Announcements', path: '/admin/announcements', icon: <Megaphone size={20} /> },
        { name: 'Club Alerts', path: '/admin/notifications', icon: <Bell size={20} /> },
    ];

    return (
        <>
            {isOpen && <div className="admin-overlay" onClick={() => setIsOpen(false)} />}
            <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-logo-wrapper">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <span className="admin-brand-text">Admin Console</span>
                        <span className="admin-badge-pill">Super Admin</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    <span className="section-title">Management</span>
                    {navLinks.map((link, i) => (
                        <NavLink
                            key={i}
                            to={link.path}
                            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <NavLink
                        to="/admin/profile"
                        className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                        onClick={() => setIsOpen(false)}
                    >
                        <User size={20} />
                        <span>My Profile</span>
                    </NavLink>
                    <button className="admin-link logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
