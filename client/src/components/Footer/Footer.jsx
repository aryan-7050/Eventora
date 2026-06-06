import React from 'react';
import { Calendar, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer id="about" className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="brand">
                            <Calendar className="brand-icon" />
                            <span className="brand-text">Eventora</span>
                        </Link>
                        <p className="footer-description">
                            The smart event management platform designed exclusively for modern college campuses.
                            Connecting students, clubs, and admin seamlessly.
                        </p>
                        <div className="social-links">
                            <a href="https://twitter.com/aryanpatil7050" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="https://github.com/aryan-7050" className="social-link" aria-label="Github"><Github size={20} /></a>
                            <a href="https://www.linkedin.com/in/aryan-patil-5b9331291" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
                            <a href="mailto:aryanpatil7050@gmail.com" className="social-link" aria-label="Email"><Mail size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Portals</h4>
                        <ul>
                            <li><Link to="/student/login">Student Login</Link></li>
                            <li><Link to="/club/login">Club Dashboard</Link></li>
                            <li><Link to="/admin/login">Admin Console</Link></li>
                            <li><Link to="/register">Create Account</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Features</h4>
                        <ul>
                            <li><a href="#features">Smart Recommendations</a></li>
                            <li><a href="#features">QR Attendance</a></li>
                            <li><a href="#features">Analytics Dashboard</a></li>
                            <li><a href="#features">Auto Certificates</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/guidelines">Community Guidelines</Link></li>
                        </ul>
                        
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Eventora. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
