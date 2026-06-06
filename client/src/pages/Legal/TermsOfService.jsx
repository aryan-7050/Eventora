import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, CheckCircle, AlertCircle, Users, CreditCard } from 'lucide-react';
import './Legal.css';

const TermsOfService = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-container">
            <div className="legal-header">
                <Link to="/" className="brand">
                    <Calendar className="brand-icon" />
                    <span className="brand-text">Eventora</span>
                </Link>
                <h1>Terms of Service</h1>
                <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>

            <div className="legal-content glass-panel">
                <section className="legal-section">
                    <div className="section-icon">
                        <FileText size={28} />
                    </div>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using Eventora, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the platform.</p>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <Users size={28} />
                    </div>
                    <h2>2. User Accounts</h2>
                    <h3>2.1 Eligibility</h3>
                    <p>You must be a registered student, club representative, or administrator of a participating college to use Eventora.</p>
                    
                    <h3>2.2 Account Responsibility</h3>
                    <p>You are responsible for:</p>
                    <ul>
                        <li>Maintaining the confidentiality of your password</li>
                        <li>All activities that occur under your account</li>
                        <li>Notifying us immediately of any unauthorized use</li>
                        <li>Providing accurate and complete registration information</li>
                    </ul>

                    <h3>2.3 Account Types</h3>
                    <ul>
                        <li><strong>Student Accounts:</strong> For event registration, participation, and profile management</li>
                        <li><strong>Club Accounts:</strong> For event creation, management, and student coordination</li>
                        <li><strong>Admin Accounts:</strong> For platform oversight and college management</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <CheckCircle size={28} />
                    </div>
                    <h2>3. User Conduct</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Impersonate another person or entity</li>
                        <li>Share your account credentials with others</li>
                        <li>Use the platform for any illegal purpose</li>
                        <li>Interfere with or disrupt the platform's operation</li>
                        <li>Attempt to gain unauthorized access to any part of the platform</li>
                        <li>Harass, abuse, or harm other users</li>
                        <li>Post false, misleading, or deceptive content</li>
                        <li>Register for events you do not intend to attend</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>4. Event Registration and Attendance</h2>
                    <ul>
                        <li>Event registration is binding and subject to club cancellation policies</li>
                        <li>You must check-in using your college ID at event venues</li>
                        <li>No-shows may result in restrictions on future event registrations</li>
                        <li>Certificates are issued only for verified attendance</li>
                        <li>Clubs reserve the right to refuse entry to events</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>5. Content and Intellectual Property</h2>
                    <h3>5.1 Platform Content</h3>
                    <p>All content on Eventora, including logos, designs, text, and code, is the property of Eventora and protected by copyright laws.</p>
                    
                    <h3>5.2 User Content</h3>
                    <p>By posting content on Eventora, you grant us a license to display and distribute your content on the platform. You retain ownership of your original content.</p>
                </section>

                <section className="legal-section">
                    <h2>6. Club Responsibilities</h2>
                    <p>Clubs using Eventora must:</p>
                    <ul>
                        <li>Provide accurate event information and dates</li>
                        <li>Manage event registrations and attendance properly</li>
                        <li>Issue certificates within 7 days of event completion</li>
                        <li>Respond to student inquiries in a timely manner</li>
                        <li>Maintain appropriate conduct with student participants</li>
                        <li>Comply with college guidelines and regulations</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>7. Termination</h2>
                    <p>We may terminate or suspend your account immediately, without prior notice, for conduct that violates these Terms. You may delete your account at any time through your profile settings.</p>
                </section>

                <section className="legal-section">
                    <h2>8. Disclaimer of Warranties</h2>
                    <p>Eventora is provided "as is" without warranties of any kind. We do not guarantee that the platform will be uninterrupted or error-free.</p>
                </section>

                <section className="legal-section">
                    <h2>9. Limitation of Liability</h2>
                    <p>Eventora shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
                </section>

                <section className="legal-section">
                    <h2>10. Changes to Terms</h2>
                    <p>We reserve the right to modify these Terms at any time. Continued use of Eventora after changes constitutes acceptance of the new Terms.</p>
                </section>

                <section className="legal-section">
                    <h2>11. Governing Law</h2>
                    <p>These Terms shall be governed by the laws of [Your Country/State].</p>
                </section>

                <div className="legal-footer">
                    <p>By using Eventora, you acknowledge that you have read and agree to these Terms of Service.</p>
                    <Link to="/" className="btn btn-primary">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;