import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className="admin-layout">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="admin-main">
                <header className="admin-topbar">
                    <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>

                    <div className="admin-topbar-right">
                        <button
                            className="admin-theme-toggle"
                            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <Link to="/admin/notifications" className="admin-notif-btn">
                            <Bell size={20} />
                            <span className="notif-badge">2</span>
                        </Link>
                        <Link to="/admin/profile" className="admin-topbar-avatar">AD</Link>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
