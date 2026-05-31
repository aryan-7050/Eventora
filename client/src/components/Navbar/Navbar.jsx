import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // Secret admin login: click logo 5 times within 2 seconds
    const clickCount = useRef(0);
    const clickTimer = useRef(null);

    const handleLogoClick = () => {
        clickCount.current += 1;

        // Clear pending timer on every click
        if (clickTimer.current) clearTimeout(clickTimer.current);

        // 5 rapid clicks → admin login immediately
        if (clickCount.current >= 5) {
            clickCount.current = 0;
            navigate('/admin/login');
            return;
        }

        // 600ms after the LAST click, if not yet 5 → go home
        clickTimer.current = setTimeout(() => {
            navigate('/');
            clickCount.current = 0;
        }, 600);
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                {/* Logo — click 5× quickly to access admin */}
                <div className="brand" role="link" tabIndex={0} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <Calendar className="brand-icon" />
                    <span className="brand-text">Eventora</span>
                </div>

                {/* Desktop Menu */}
                <div className="nav-links desktop-only">
                    <a href="/#features" className="nav-link">Features</a>
                    <a href="/#about" className="nav-link">About</a>
                    <a href="/#portals" className="nav-link">Portals</a>
                </div>

                <div className="nav-actions desktop-only">
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <Link to="/student/login" className="btn btn-secondary">Student Login</Link>
                    <Link to="/club/login" className="btn btn-primary">Club Portal</Link>
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle">
                    <button onClick={toggleTheme} className="theme-toggle" style={{ marginRight: '1rem' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="menu-btn">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="mobile-menu">
                    <div className="container">
                        <a href="/#features" className="mobile-link" onClick={() => setIsOpen(false)}>Features</a>
                        <a href="/#about" className="mobile-link" onClick={() => setIsOpen(false)}>About</a>
                        <a href="/#portals" className="mobile-link" onClick={() => setIsOpen(false)}>Portals</a>
                        <hr className="divider" />
                        <Link to="/student/login" className="mobile-link" onClick={() => setIsOpen(false)}>Student Login</Link>
                        <Link to="/club/login" className="mobile-link highlight" onClick={() => setIsOpen(false)}>Club Portal</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
