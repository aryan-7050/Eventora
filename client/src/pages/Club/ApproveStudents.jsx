import React, { useState, useEffect } from 'react';
import { getClubRegistrations, updateRegistrationStatus } from '../../api/registrations';
import {
    User, Mail, Hash, CreditCard, CheckCircle, XCircle,
    Eye, AlertCircle, MessageSquare, ExternalLink, Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import EventDetailsModal from '../../components/EventDetailsModal/EventDetailsModal';
import './ApproveStudents.css';

const ApproveStudents = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReg, setSelectedReg] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('Not applicable for this event');
    const [customReason, setCustomReason] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            fetchRegistrations(storedUser.id || storedUser._id);
        }
    }, []);

    const fetchRegistrations = async (clubId) => {
        try {
            const res = await getClubRegistrations(clubId);
            setRegistrations(res.data.filter(r => r.status === 'pending'));
        } catch (err) {
            toast.error('Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            const reason = rejectionReason === 'Other' ? customReason : rejectionReason;
            await updateRegistrationStatus(id, { status, rejectionReason: reason });
            toast.success(`Registration ${status} successfully!`);
            setRegistrations(prev => prev.filter(r => r._id !== id));
            setRejectingId(null);
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="loading-container">Loading requests...</div>;

    return (
        <>
            <div className="approve-students-container animate-fade-in">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Approve Registrations</h1>
                    <p className="dashboard-subtitle">Review and manage student sign-ups for your events.</p>
                </div>

                <div className="requests-list">
                    {registrations.length > 0 ? registrations.map((reg) => (
                        <div key={reg._id} className="request-card glass-panel">
                            <div className="request-info-main">
                                <div className="student-profile-mini">
                                    <div className="avatar-placeholder">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3>{reg.student.name}</h3>
                                        <p className="event-name-tag">Registered for: <strong>{reg.event.title}</strong></p>
                                    </div>
                                </div>

                                <div className="registration-details-row">
                                    <div className="detail-item">
                                        <Hash size={16} />
                                        <span>{reg.student.universityID}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Mail size={16} />
                                        <span>{reg.student.email}</span>
                                    </div>
                                    {reg.isPaid && (
                                        <div className="detail-item payment-verified">
                                            <CreditCard size={16} />
                                            <span>TXN: {reg.transactionID}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="request-actions">
                                <button className="btn btn-secondary action-btn" onClick={() => setSelectedReg(reg)}>
                                    <Eye size={18} /> View Details
                                </button>
                                <button className="btn btn-club action-btn approve" onClick={() => handleAction(reg._id, 'approved')}>
                                    <CheckCircle size={18} /> Approve
                                </button>
                                <button className="btn btn-danger action-btn reject" onClick={() => setRejectingId(reg._id)}>
                                    <XCircle size={18} /> Reject
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="empty-state glass-panel">
                            <CheckCircle size={48} className="empty-icon" />
                            <h3>No pending requests</h3>
                            <p>All student registrations have been processed.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Rejection Reason Modal */}
            {rejectingId && (
                <div className="modal-overlay" onClick={() => setRejectingId(null)}>
                    <div className="modal-content glass-panel animate-scale-up" onClick={e => e.stopPropagation()}>
                        <h3>Reason for Rejection</h3>
                        <p>Please specify why this registration is being rejected.</p>

                        <div className="form-group mt-4">
                            <select
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="reason-select"
                            >
                                <option value="Not applicable for this event">Not applicable for this event</option>
                                <option value="Insufficient information provided">Insufficient information</option>
                                <option value="Payment verification failed">Payment verification failed</option>
                                <option value="Seat capacity full">Seat capacity full</option>
                                <option value="Other">Other (Type below)</option>
                            </select>
                        </div>

                        {rejectionReason === 'Other' && (
                            <div className="form-group mt-3">
                                <textarea
                                    placeholder="Enter custom reason..."
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        )}

                        <div className="modal-actions mt-6">
                            <button className="btn btn-secondary" onClick={() => setRejectingId(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleAction(rejectingId, 'rejected')}>
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {selectedReg && (
                <div className="modal-overlay" onClick={() => setSelectedReg(null)}>
                    <div className="modal-content glass-panel details-modal animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Registration Details</h2>
                            <button className="close-btn" onClick={() => setSelectedReg(null)}><XCircle size={20} /></button>
                        </div>

                        <div className="details-grid-full">
                            <div className="detail-section">
                                <h4 className="section-label">Student Information</h4>
                                <p><strong>Name:</strong> {selectedReg.student.name}</p>
                                <p><strong>University ID:</strong> {selectedReg.student.universityID}</p>
                                <p><strong>Email:</strong> {selectedReg.student.email}</p>
                            </div>
                            <div className="detail-section">
                                <h4 className="section-label">Event Information</h4>
                                <p><strong>Event:</strong> {selectedReg.event.title}</p>
                                <p><strong>Club:</strong> {selectedReg.event.organizingClub.name}</p>
                            </div>
                            {selectedReg.isPaid && (
                                <div className="detail-section payment-box">
                                    <h4 className="section-label">Payment Information</h4>
                                    <p><strong>Transaction ID:</strong> {selectedReg.transactionID}</p>
                                    <p><strong>Payment Username/ID:</strong> {selectedReg.paymentUsername}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApproveStudents;
