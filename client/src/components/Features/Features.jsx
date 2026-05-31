import React from 'react';
import { Hash, TrendingUp, BarChart3, ShieldAlert, Award, Search, Layout } from 'lucide-react';
import './Features.css';

const features = [
    {
        icon: <Search size={24} />,
        title: "Smart Recommendations",
        description: "Get personalized event suggestions based on your interests, followed clubs, and past registrations.",
        color: "blue"
    },
    {
        icon: <Hash size={24} />,
        title: "Code Attendance",
        description: "Secure code-based attendance system. Fast, reliable, and completely eliminates manual verification.",
        color: "purple"
    },
    {
        icon: <TrendingUp size={24} />,
        title: "Trending Events",
        description: "Discover the most popular events with our dynamic trending badges and popularity scores.",
        color: "orange"
    },
    {
        icon: <BarChart3 size={24} />,
        title: "Club Analytics",
        description: "Comprehensive dashboards for clubs to track registrations, feedback, and engagement metrics.",
        color: "green"
    },
    {
        icon: <Award size={24} />,
        title: "Auto Certificates",
        description: "Automatically generate and distribute participation certificates upon successful event completion.",
        color: "gold"
    },
    {
        icon: <ShieldAlert size={24} />,
        title: "Emergency Alerts",
        description: "Instant notification system for admins and clubs to broadcast urgent updates to attendees.",
        color: "red"
    }
];

const Features = () => {
    return (
        <section id="features" className="features">
            <div className="container">
                <div className="features-header text-center">
                    <h2 className="section-title">Everything You Need to <br /> <span className="text-gradient">Manage Events</span></h2>
                    <p className="section-description">
                        EventMatrix provides powerful tools for students, clubs, and administrators to create a seamless campus experience.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card glass-panel"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`feature-icon-wrapper ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div id="portals" className="interactive-demo glass-panel mt-16">
                    <div className="demo-content">
                        <h3>Three Dedicated Portals</h3>
                        <p>A unified platform tailored to the needs of every stakeholder.</p>

                        <div className="portal-cards">
                            <div className="portal-card">
                                <div className="portal-icon blue"><Layout size={24} /></div>
                                <h4>Student Portal</h4>
                                <p>Browse events, register with one click, and track your participation history.</p>
                            </div>
                            <div className="portal-card">
                                <div className="portal-icon purple"><Layout size={24} /></div>
                                <h4>Club Portal</h4>
                                <p>Create events, manage registrations, track analytics, and gather feedback.</p>
                            </div>
                            <div className="portal-card">
                                <div className="portal-icon green"><Layout size={24} /></div>
                                <h4>Admin Portal</h4>
                                <p>Oversee all activities, approve events, and manage club access.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
