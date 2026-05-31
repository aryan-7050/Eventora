import React, { useState, useEffect } from 'react';
import { CalendarCheck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import EventCard from '../../components/EventCard/EventCard';
import { getStudentProfile } from '../../api/student';
import { browseEvents } from '../../api/events';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ registrations: 0, attended: 0, pending: 0 });
    const [events, setEvents] = useState([]);
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.id) return;

                setStudentName(user.name.split(' ')[0]);

                const [profileRes, eventsRes] = await Promise.all([
                    getStudentProfile(user.id),
                    browseEvents()
                ]);

                if (profileRes.data && profileRes.data.stats) {
                    setStats(profileRes.data.stats);
                }

                if (eventsRes.data) {
                    // Show top 3 events as "Recommended"
                    setEvents(eventsRes.data.slice(0, 3));
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Welcome back, {studentName}! 👋</h1>
                <p className="dashboard-subtitle">Here's what's happening around campus.</p>
            </div>

            {/* Stats Section */}
            <div className="stats-grid">
                <div className="stat-card-dash glass-panel blue-accent">
                    <div className="stat-icon"><CalendarCheck size={28} /></div>
                    <div className="stat-content">
                        <h3>Registered</h3>
                        <span className="stat-value">{stats.registrations}</span>
                        <p>Upcoming events</p>
                    </div>
                </div>

                <div className="stat-card-dash glass-panel green-accent">
                    <div className="stat-icon"><CheckCircle size={28} /></div>
                    <div className="stat-content">
                        <h3>Attended</h3>
                        <span className="stat-value">{stats.attended}</span>
                        <p>Past events</p>
                    </div>
                </div>

                <div className="stat-card-dash glass-panel purple-accent">
                    <div className="stat-icon"><Clock size={28} /></div>
                    <div className="stat-content">
                        <h3>Pending</h3>
                        <span className="stat-value">{stats.pending}</span>
                        <p>Awaiting approval</p>
                    </div>
                </div>
            </div>

            {/* Recommended Events Section */}
            <div className="dashboard-section mt-8">
                <div className="section-header">
                    <h2>Recommended for You</h2>
                    <a href="/student/browse" className="view-all-link">Browse All</a>
                </div>

                {events.length > 0 ? (
                    <div className="events-grid">
                        {events.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="no-events-card glass-panel">
                        <p>No upcoming events recommended at the moment. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
