import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar/StudentSidebar';
import './StudentLayout.css';

const StudentLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

    return (
        <div className="student-layout">
            <StudentSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="student-main">
                <header className="student-topbar">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>

                    <div className="topbar-right">
                        {/* Theme Toggle */}
                        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {/* Notifications */}
                        <Link to="/student/notifications" className="notification-btn">
                            <Bell size={20} />
                            <span className="notification-badge">3</span>
                        </Link>

                        {/* Avatar */}
                        <Link to="/student/profile" className="user-avatar">JD</Link>
                    </div>
                </header>

                <main className="student-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
