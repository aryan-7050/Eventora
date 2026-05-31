import React, { useState, useEffect } from 'react';
import { 
    MessageSquare, Star, User, 
    Calendar, Filter, Search,
    BarChart3, RefreshCw
} from 'lucide-react';
import { getClubEvents } from '../../api/events';
import { getEventFeedback } from '../../api/feedback';
import { toast } from 'react-toastify';
import './ClubFeedback.css';

const ClubFeedback = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eventsLoading, setEventsLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            fetchEvents(user.id || user._id);
        }
    }, []);

    const fetchEvents = async (clubId) => {
        try {
            const res = await getClubEvents(clubId);
            // Show all events posted by this club
            setEvents(res.data);
        } catch (err) {
            toast.error('Failed to load events');
        } finally {
            setEventsLoading(false);
        }
    };

    const handleEventSelect = async (eventId) => {
        setSelectedEventId(eventId);
        if (!eventId) {
            setFeedbacks([]);
            return;
        }

        setLoading(true);
        try {
            const res = await getEventFeedback(eventId);
            setFeedbacks(res.data);
        } catch (err) {
            toast.error('Failed to load feedback');
        } finally {
            setLoading(false);
        }
    };

    const calculateAverageRating = () => {
        if (feedbacks.length === 0) return 0;
        const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
        return (sum / feedbacks.length).toFixed(1);
    };

    const avgRating = calculateAverageRating();

    return (
        <div className="feedback-analyzer-container animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Feedback Analyzer</h1>
                    <p className="dashboard-subtitle">Understand student sentiment and improve your future events.</p>
                </div>
            </div>

            <div className="filter-section glass-panel">
                <div className="filter-group">
                    <label><Filter size={18} /> Select Event to Analyze</label>
                    <select 
                        value={selectedEventId} 
                        onChange={(e) => handleEventSelect(e.target.value)}
                        disabled={eventsLoading}
                    >
                        <option value="">-- Choose an Event --</option>
                        {events.map(e => (
                            <option key={e._id} value={e._id}>{e.title}</option>
                        ))}
                    </select>
                </div>
                {selectedEventId && feedbacks.length > 0 && (
                    <div className="analysis-summary">
                        <div className="summary-stat">
                            <Star size={20} className="text-warning" />
                            <div>
                                <span>Avg Rating</span>
                                <h3>{avgRating} / 5</h3>
                            </div>
                        </div>
                        <div className="summary-stat">
                            <MessageSquare size={20} className="text-primary" />
                            <div>
                                <span>Reviews</span>
                                <h3>{feedbacks.length}</h3>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!selectedEventId && (
                <div className="analyzer-empty-state glass-panel">
                    <BarChart3 size={64} className="muted-icon" />
                    <h3>No Event Selected</h3>
                    <p>Select an event from your portfolio to view detailed student feedback and ratings.</p>
                </div>
            )}

            {selectedEventId && (
                <div className="feedback-content">
                    {loading ? (
                        <div className="loader-overlay">
                            <RefreshCw className="animate-spin" size={32} />
                            <p>Analyzing feedbacks...</p>
                        </div>
                    ) : (
                        <div className="feedback-list">
                            {feedbacks.length > 0 ? (
                                feedbacks.map((f) => (
                                    <div key={f._id} className="feedback-card glass-panel animate-slide-up">
                                        <div className="fc-header">
                                            <div className="fc-student">
                                                <div className="student-avatar">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <h4>{f.studentId?.name || 'Anonymous Student'}</h4>
                                                    <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="fc-rating">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={14} 
                                                        fill={i < f.rating ? "#f59e0b" : "transparent"}
                                                        color={i < f.rating ? "#f59e0b" : "rgba(255,255,255,0.1)"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="fc-body">
                                            <p>{f.review}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-feedback glass-panel">
                                    <MessageSquare size={48} className="muted-icon" />
                                    <h3>No Feedback Received</h3>
                                    <p>Students haven't reviewed this event yet. Encourage participants to share their experience!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClubFeedback;
