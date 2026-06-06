import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Shield, Lock, Eye, Database, Globe } from 'lucide-react';
import './Legal.css';

const PrivacyPolicy = () => {
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
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>

            <div className="legal-content glass-panel">
                <section className="legal-section">
                    <div className="section-icon">
                        <Shield size={28} />
                    </div>
                    <h2>1. Information We Collect</h2>
                    <p>At Eventora, we collect information to provide better services to all our users. We collect:</p>
                    <ul>
                        <li><strong>Personal Information:</strong> Name, email address, student ID, college code, and profile information</li>
                        <li><strong>Event Data:</strong> Events you register for, attend, and your participation history</li>
                        <li><strong>Usage Data:</strong> How you interact with our platform, including pages visited and features used</li>
                        <li><strong>Device Information:</strong> IP address, browser type, and device identifiers</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <Database size={28} />
                    </div>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Process event registrations and manage attendance</li>
                        <li>Send notifications about events, deadlines, and updates</li>
                        <li>Improve and personalize your experience on Eventora</li>
                        <li>Generate certificates and track participation</li>
                        <li>Communicate with you about platform updates and policies</li>
                        <li>Prevent fraud and ensure platform security</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <Lock size={28} />
                    </div>
                    <h2>3. Data Security</h2>
                    <p>We implement robust security measures to protect your information:</p>
                    <ul>
                        <li>Encryption of sensitive data during transmission (SSL/TLS)</li>
                        <li>Secure storage of passwords using industry-standard hashing</li>
                        <li>Regular security audits and vulnerability assessments</li>
                        <li>Access controls and authentication for data access</li>
                        <li>Automatic session timeout for inactive users</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <Eye size={28} />
                    </div>
                    <h2>4. Information Sharing</h2>
                    <p>We do not sell your personal information. We may share your information in these circumstances:</p>
                    <ul>
                        <li><strong>With Clubs:</strong> Your name and student ID when you register for their events</li>
                        <li><strong>With College Administration:</strong> For attendance tracking and event participation records</li>
                        <li><strong>Service Providers:</strong> Third parties who help us operate our platform</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <Globe size={28} />
                    </div>
                    <h2>5. Your Rights and Choices</h2>
                    <p>You have the following rights regarding your data:</p>
                    <ul>
                        <li>Access and download your personal information</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your account and associated data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Export your event participation history</li>
                    </ul>
                    <p className="mt-3">To exercise these rights, contact us at <strong>privacy@eventora.com</strong></p>
                </section>

                <section className="legal-section">
                    <h2>6. Cookies and Tracking</h2>
                    <p>We use cookies and similar technologies to:</p>
                    <ul>
                        <li>Keep you logged in and remember your preferences</li>
                        <li>Analyze platform usage and improve performance</li>
                        <li>Provide personalized content and recommendations</li>
                    </ul>
                    <p>You can control cookie settings through your browser preferences.</p>
                </section>

                <section className="legal-section">
                    <h2>7. Data Retention</h2>
                    <p>We retain your information as long as your account is active. After account deletion, we retain certain data for legal compliance and analytics purposes for up to 30 days.</p>
                </section>

                <section className="legal-section">
                    <h2>8. Children's Privacy</h2>
                    <p>Eventora is intended for college students and educational institutions. We do not knowingly collect information from children under 13 years of age.</p>
                </section>

                <section className="legal-section">
                    <h2>9. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notification.</p>
                </section>

                <section className="legal-section">
                    <h2>10. Contact Us</h2>
                    <p>If you have questions about this Privacy Policy, please contact us:</p>
                    <ul>
                        <li>Email: privacy@eventora.com</li>
                        <li>Address: [Your College Address]</li>
                        <li>Phone: [Your Contact Number]</li>
                    </ul>
                </section>

                <div className="legal-footer">
                    <p>By using Eventora, you consent to this Privacy Policy.</p>
                    <Link to="/" className="btn btn-primary">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;