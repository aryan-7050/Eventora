import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import ClubSidebar from './ClubSidebar';
import './ClubLayout.css';

const ClubLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className="club-layout">
            <ClubSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="club-main">
                <header className="club-topbar">
                    <button className="club-menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>

                    <div className="club-topbar-right">
                        <button
                            className="club-theme-toggle"
                            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <Link to="/club/notifications" className="club-notif-btn">
                            <Bell size={20} />
                            <span className="notif-badge">3</span>
                        </Link>
                        <Link to="/club/profile" className="club-avatar">CB</Link>
                    </div>
                </header>

                <main className="club-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ClubLayout;
