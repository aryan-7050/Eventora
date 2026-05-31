import React from 'react';
import {
    X, Calendar, Clock, MapPin, Users,
    Globe, Mail, ShieldCheck, Download,
    ExternalLink, Info, Phone, MessageCircle,
    CreditCard, QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { registerForEvent } from '../../api/registrations';
import { toast } from 'react-toastify';
import PaymentModal from '../PaymentModal/PaymentModal';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, onClose, showRegister = true }) => {
    const [showPayment, setShowPayment] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    if (!event) return null;

    const poster = event.posterUrl || "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=1200&q=80";
    const date = event.eventDate ? new Date(event.eventDate).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : 'TBD';
    const deadline = event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : 'TBD';

    return (
        <div className="edm-modal-overlay" onClick={onClose}>
            <div className="edm-modal-content glass-panel animate-scale-up" onClick={e => e.stopPropagation()}>
                <button className="edm-modal-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="edm-modal-body">
                    {/* Left Side: Images & Quick Stats */}
                    <div className="edm-modal-sidebar">
                        <div className="edm-modal-poster">
                            <img src={poster} alt={event.title} />
                            <div className="edm-modal-type-badge">{event.mode || 'Event'}</div>
                        </div>

                        <div className="quick-info-grid">
                            <div className="quick-info-item">
                                <Users size={18} />
                                <div>
                                    <span>Capacity</span>
                                    <p>{event.maxParticipants ? `${event.maxParticipants} slots` : 'Unlimited'}</p>
                                </div>
                            </div>
                            <div className="quick-info-item">
                                <Calendar size={18} />
                                <div>
                                    <span>Deadline</span>
                                    <p>{deadline}</p>
                                </div>
                            </div>
                        </div>

                        {event.brochureUrl && (
                            <a href={event.brochureUrl} download className="btn btn-secondary w-full gap-2 mt-4">
                                <Download size={18} /> Download Brochure
                            </a>
                        )}

                        {showRegister && (
                            <button
                                className="btn btn-club w-full gap-2 mt-4 register-btn-glow"
                                onClick={handleRegisterClick}
                                disabled={loading}
                            >
                                <ShieldCheck size={20} /> {loading ? 'Registering...' : 'Register for Event'}
                            </button>
                        )}
                    </div>

                    {/* Right Side: Detailed Content */}
                    <div className="edm-modal-main">
                        <div className="edm-modal-header">
                            <span className="category-tag">{event.category}</span>
                            <h2 className="edm-modal-title">{event.title}</h2>
                            <p className="edm-modal-club-name">Organized by <span>{event.organizingClub?.name || 'Academic Committee'}</span></p>
                        </div>

                        <div className="info-section">
                            <h3 className="section-subtitle"><Info size={18} /> About this Event</h3>
                            <p className="edm-modal-description">{event.description}</p>
                        </div>

                        <div className="details-grid-compact">
                            <div className="detail-card">
                                <Calendar className="icon" size={20} />
                                <div>
                                    <label>When</label>
                                    <p>{date}</p>
                                </div>
                            </div>
                            <div className="detail-card">
                                <Clock className="icon" size={20} />
                                <div>
                                    <label>Time</label>
                                    <p>{event.startTime} - {event.endTime}</p>
                                </div>
                            </div>
                            <div className="detail-card">
                                <MapPin className="icon" size={20} />
                                <div>
                                    <label>Where</label>
                                    <p>{event.venue}</p>
                                </div>
                            </div>
                            <div className="detail-card">
                                <Globe className="icon" size={20} />
                                <div>
                                    <label>Mode</label>
                                    <p>{event.mode}</p>
                                </div>
                            </div>
                        </div>

                        {event.meetingLink && (
                            <div className="link-box">
                                <Globe size={18} />
                                <div>
                                    <label>Meeting Link</label>
                                    <a href={event.meetingLink} target="_blank" rel="noreferrer">{event.meetingLink}</a>
                                </div>
                                <ExternalLink size={16} className="ms-auto" />
                            </div>
                        )}

                        {event.isPaid && (
                            <div className="info-section payment-section glass-panel">
                                <h3 className="section-subtitle"><CreditCard size={18} /> Payment Information</h3>
                                <div className="payment-details">
                                    <div className="payment-info-text">
                                        <p>This is a <strong>Paid Event</strong>.</p>
                                        <p className="payment-amount">Registration Fee: <span>₹{event.registrationAmount}</span></p>
                                        <p className="payment-instruction">Please scan the QR code below to complete your payment. Upload the transaction screenshot during registration.</p>
                                    </div>
                                    {event.paymentQRUrl && (
                                        <div className="payment-qr-container">
                                            <img src={event.paymentQRUrl} alt="Payment QR Code" className="payment-qr-image" />
                                            <span>Scan to Pay</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="info-section">
                            <h3 className="section-subtitle"><Phone size={18} /> Contact Organizers</h3>
                            <div className="contacts-list">
                                <div className="contact-item">
                                    <Mail size={16} />
                                    <span>{event.contactEmail}</span>
                                </div>
                                {event.contacts?.map((contact, i) => (
                                    <div key={i} className="contact-item">
                                        <MessageCircle size={16} />
                                        <span>{contact.name}: <strong>{contact.number}</strong></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPayment && (
                <PaymentModal
                    event={event}
                    onClose={() => setShowPayment(false)}
                    onConfirm={handlePaidRegistration}
                    loading={loading}
                />
            )}
        </div>
    );

    async function handleRegisterClick() {
        const student = JSON.parse(localStorage.getItem('user'));
        const userRole = localStorage.getItem('userRole');
        if (!student || userRole !== 'student') {
            return toast.error('Please login as a student to register.');
        }

        if (event.isPaid) {
            setShowPayment(true);
        } else {
            submitRegistration(student, { isPaid: false });
        }
    }

    async function handlePaidRegistration(paymentData) {
        const student = JSON.parse(localStorage.getItem('user'));
        submitRegistration(student, { isPaid: true, ...paymentData });
    }

    async function submitRegistration(student, extraData) {
        setLoading(true);
        try {
            const registrationData = {
                eventId: event._id,
                studentId: student.id || student._id,
                studentName: student.name,
                universityID: student.universityID || 'N/A',
                email: student.email,
                ...extraData
            };

            await registerForEvent(registrationData);
            toast.success('Registration submitted! Wait for club approval.');
            setShowPayment(false);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }
};

export default EventDetailsModal;
