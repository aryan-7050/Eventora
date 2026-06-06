import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Users, MessageCircle, Flag, Star, ThumbsUp, Smile } from 'lucide-react';
import './Legal.css';

const CommunityGuidelines = () => {
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
                <h1>Community Guidelines</h1>
                <p>Building a positive and inclusive event community</p>
            </div>

            <div className="legal-content glass-panel">
                <div className="guidelines-intro">
                    <Heart size={48} className="intro-icon" />
                    <p>Eventora is dedicated to creating a vibrant, respectful, and engaging community for students, clubs, and college administrators. These guidelines help us maintain a positive environment for everyone.</p>
                </div>

                <section className="legal-section">
                    <div className="section-icon">
                        <Users size={28} />
                    </div>
                    <h2>1. Be Respectful and Inclusive</h2>
                    <ul>
                        <li>Treat all community members with respect and kindness</li>
                        <li>Celebrate diversity and be inclusive of all backgrounds</li>
                        <li>Use respectful language and avoid personal attacks</li>
                        <li>Respect different opinions and perspectives</li>
                        <li>No hate speech, discrimination, or harassment of any kind</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <MessageCircle size={28} />
                    </div>
                    <h2>2. Communicate Constructively</h2>
                    <ul>
                        <li>Provide helpful and constructive feedback</li>
                        <li>Avoid spamming, trolling, or excessive self-promotion</li>
                        <li>Keep discussions relevant to events and college activities</li>
                        <li>Report issues to moderators instead of engaging in arguments</li>
                        <li>Use appropriate channels for different types of communication</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <Flag size={28} />
                    </div>
                    <h2>3. Report Inappropriate Content</h2>
                    <ul>
                        <li>Use the report button to flag violations</li>
                        <li>Report harassment, bullying, or threatening behavior</li>
                        <li>Flag false or misleading event information</li>
                        <li>Report impersonation or fake accounts</li>
                        <li>Do not publicly call out violations - let moderators handle them</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <Star size={28} />
                    </div>
                    <h2>4. Event Participation Etiquette</h2>
                    <ul>
                        <li>Register only for events you genuinely plan to attend</li>
                        <li>Cancel registrations if your plans change (at least 24 hours before)</li>
                        <li>Arrive on time for events and check-in properly</li>
                        <li>Participate actively and engage with event organizers</li>
                        <li>Provide honest feedback to help improve future events</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <ThumbsUp size={28} />
                    </div>
                    <h2>5. Club Organizers' Responsibilities</h2>
                    <ul>
                        <li>Provide clear, accurate event details and schedules</li>
                        <li>Respond to student inquiries promptly and professionally</li>
                        <li>Ensure events are safe and well-organized</li>
                        <li>Treat all participants fairly and respectfully</li>
                        <li>Issue certificates and feedback within promised timelines</li>
                        <li>Avoid favoritism and ensure equal opportunities</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <div className="section-icon">
                        <Smile size={28} />
                    </div>
                    <h2>6. Prohibited Behavior</h2>
                    <p>The following behaviors are strictly prohibited:</p>
                    <ul>
                        <li>Bullying, harassment, or intimidation of any kind</li>
                        <li>Sharing personal information without consent (doxxing)</li>
                        <li>Posting NSFW or inappropriate content</li>
                        <li>Cheating the attendance or certificate system</li>
                        <li>Creating multiple accounts to bypass restrictions</li>
                        <li>Exploiting platform bugs for unfair advantage</li>
                        <li>Commercial solicitation or spam</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>7. Consequences of Violations</h2>
                    <p>Violations of these guidelines may result in:</p>
                    <ul>
                        <li>Warning notifications</li>
                        <li>Temporary suspension of account features</li>
                        <li>Removal of event registration privileges</li>
                        <li>Permanent account ban (for severe or repeated violations)</li>
                        <li>Reporting to college administration</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>8. Be an Upstander, Not a Bystander</h2>
                    <p>If you see something wrong, speak up. Report violations, support those being targeted, and help maintain a safe community. Small actions make a big difference.</p>
                </section>

                <section className="legal-section">
                    <h2>9. Giving and Receiving Feedback</h2>
                    <ul>
                        <li>Provide constructive feedback focused on events, not people</li>
                        <li>Avoid personal criticism or attacks</li>
                        <li>Suggest improvements rather than just complaining</li>
                        <li>Be open to feedback about your own behavior</li>
                        <li>Use feedback to grow and improve community interactions</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>10. Our Commitment to You</h2>
                    <p>We promise to:</p>
                    <ul>
                        <li>Enforce these guidelines fairly and consistently</li>
                        <li>Protect your privacy and data</li>
                        <li>Listen to community concerns and suggestions</li>
                        <li>Continuously improve our platform based on feedback</li>
                        <li>Maintain transparency about our policies and decisions</li>
                    </ul>
                </section>

                <div className="guidelines-quote">
                    <Heart size={24} />
                    <p>Together, we can build an amazing event community where everyone feels welcome, valued, and inspired to participate!</p>
                </div>

                <div className="legal-footer">
                    <Link to="/" className="btn btn-primary">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default CommunityGuidelines;