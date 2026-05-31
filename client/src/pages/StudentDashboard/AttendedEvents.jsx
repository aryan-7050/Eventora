import React, { useState, useEffect } from 'react';
import { getStudentRegistrations } from '../../api/registrations';
import { submitFeedback, getStudentFeedback } from '../../api/feedback';
import {
    Calendar, CheckCircle2, MapPin,
    Trophy, Download, Award, Star
} from 'lucide-react';
import { toast } from 'react-toastify';
import './AttendedEvents.css';

const AttendedEvents = () => {
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAttendedEvents();
    }, []);

    const fetchAttendedEvents = async () => {
        try {
            const student = JSON.parse(localStorage.getItem('user'));
            if (!student) return;
            const studentId = student.id || student._id;

            // Fetch registrations and feedback history in parallel
            const [regRes, feedbackRes] = await Promise.all([
                getStudentRegistrations(studentId),
                getStudentFeedback(studentId)
            ]);

            // Filter only events where attendance is marked as 'present'
            const attended = regRes.data.filter(reg => reg.attendanceStatus === 'present');
            setAttendedEvents(attended);
            setSubmittedFeedbacks(feedbackRes.data.map(f => f.eventId));
        } catch (err) {
            toast.error('Failed to load attended events');
        } finally {
            setLoading(false);
        }
    };

    const isFeedbackSubmitted = (eventId) => {
        return submittedFeedbacks.includes(eventId);
    };

    const handleFeedbackSubmit = async () => {
        const student = JSON.parse(localStorage.getItem('user'));
        if (!student || !selectedEvent) return;

        setSubmitting(true);
        try {
            await submitFeedback({
                eventId: selectedEvent.id,
                studentId: student.id || student._id,
                rating,
                review
            });
            toast.success('Feedback submitted! Thank you.');
            // Update local state to hide button immediately
            setSubmittedFeedbacks([...submittedFeedbacks, selectedEvent.id]);
            setShowFeedbackModal(false);
            setRating(0);
            setReview('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container">Retrieving your history...</div>;

    return (
        <div className="attended-events-container animate-fade-in">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Attended Events</h1>
                <p className="dashboard-subtitle">A record of all events you have successfully participated in.</p>
            </div>

            {attendedEvents.length > 0 ? (
                <div className="attended-grid">
                    {attendedEvents.map((reg) => (
                        <div key={reg._id} className="attended-card glass-panel">
                            <div className="attended-badge">
                                <CheckCircle2 size={16} /> <span>Verified Attendance</span>
                            </div>

                            <h3 className="attended-title">{reg.event.title}</h3>
                            <p className="attended-club">Organized by {reg.event.organizingClub.name}</p>

                            <div className="attended-meta">
                                <div className="attended-meta-item">
                                    <Calendar size={14} />
                                    <span>{new Date(reg.registeredAt).toLocaleDateString()}</span>
                                </div>
                                <div className="attended-meta-item">
                                    <Award size={14} />
                                    <span>Participation Verified</span>
                                </div>
                            </div>

                            <div className="attended-actions">
                                {reg.isCertificatePosted ? (
                                    <button 
                                        className="btn-certificate-download active" 
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = reg.certificateUrl;
                                            link.download = `${reg.event.title}_Certificate.jpg`;
                                            link.click();
                                        }}
                                    >
                                        <Award size={16} /> Download Certificate
                                    </button>
                                ) : (
                                    <button className="btn-certificate-download" disabled>
                                        <Download size={16} /> Certificate Coming Soon
                                    </button>
                                )}
                                {!isFeedbackSubmitted(reg.event.id) ? (
                                    <button 
                                        className="btn-give-feedback" 
                                        onClick={() => {
                                            setSelectedEvent(reg.event);
                                            setShowFeedbackModal(true);
                                        }}
                                    >
                                        <Trophy size={16} /> Give Feedback
                                    </button>
                                ) : (
                                    <div className="feedback-submitted-badge">
                                        <CheckCircle2 size={14} /> Review Submitted
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-panel">
                    <Trophy size={48} className="empty-icon" />
                    <h3>No attended events yet</h3>
                    <p>Once you mark your attendance at an event, it will appear here.</p>
                </div>
            )}

            {showFeedbackModal && selectedEvent && (
                <div className="modal-overlay">
                    <div className="feedback-modal glass-panel animate-scale-up">
                        <div className="modal-header">
                            <h3>Rate & Review</h3>
                            <button className="btn-close" onClick={() => setShowFeedbackModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-event-name">{selectedEvent.title}</p>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span 
                                        key={star} 
                                        className={`star ${star <= rating ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <textarea 
                                placeholder="Share your experience..." 
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn-submit-feedback" 
                                onClick={handleFeedbackSubmit}
                                disabled={submitting || !rating || !review.trim()}
                            >
                                {submitting ? 'Submitting...' : 'Post Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendedEvents;
