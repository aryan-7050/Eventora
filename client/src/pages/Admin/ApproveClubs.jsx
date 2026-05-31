import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Building2, User, Mail, FileText, AlertTriangle } from 'lucide-react';
import { getPendingClubs, approveClub, rejectClub } from '../../api/admin';
import { toast } from 'react-toastify';
import './ApproveClubs.css';

const ApproveClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectionModal, setRejectionModal] = useState({ show: false, clubId: null, reason: '' });
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const res = await getPendingClubs();
            setClubs(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Failed to fetch pending clubs');
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setProcessingId(id);
        try {
            const res = await approveClub(id);
            toast.success(res.data.message || 'Club approved successfully!');
            setClubs(clubs.filter(club => club._id !== id));
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Approval failed');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectClick = (id) => {
        setRejectionModal({ show: true, clubId: id, reason: '' });
    };

    const handleFinalReject = async () => {
        if (!rejectionModal.reason.trim()) {
            return toast.warn('Please provide a reason for rejection');
        }
        try {
            await rejectClub(rejectionModal.clubId, rejectionModal.reason);
            toast.info('Club registration rejected');
            setClubs(clubs.filter(club => club._id !== rejectionModal.clubId));
            setRejectionModal({ show: false, clubId: null, reason: '' });
        } catch (err) {
            toast.error('Rejection failed');
        }
    };

    if (loading) return <div className="loading-spinner">Loading pending clubs...</div>;

    return (
        <div className="approve-clubs-container animate-fade-in">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Approve Clubs</h1>
                <p className="dashboard-subtitle">Review incoming club registration requests and approve or reject them.</p>
            </div>

            <div className="clubs-grid">
                {clubs.length > 0 ? (
                    clubs.map(club => (
                        <div key={club._id} className="club-approval-card glass-panel">
                            <div className="card-badge">Pending Approval</div>
                            <div className="club-card-header">
                                <div className="club-avatar">
                                    <Building2 size={24} />
                                </div>
                                <div className="club-identity">
                                    <h3>{club.name}</h3>
                                    <span className="club-cc">CODE: {club.collegeCode}</span>
                                </div>
                            </div>

                            <div className="club-details">
                                <div className="detail-item">
                                    <User size={16} /> <span>{club.headName}</span>
                                </div>
                                <div className="detail-item">
                                    <Mail size={16} /> <span>{club.email}</span>
                                </div>
                                <div className="detail-item description">
                                    <FileText size={16} />
                                    <p>{club.description}</p>
                                </div>
                            </div>

                            <div className="card-actions">
                                <button 
                                    className={`btn approve-btn ${processingId === club._id ? 'loading' : ''}`} 
                                    onClick={() => handleApprove(club._id)}
                                    disabled={processingId !== null}
                                >
                                    {processingId === club._id ? (
                                        <>Approving...</>
                                    ) : (
                                        <><CheckCircle size={18} /> Approve</>
                                    )}
                                </button>
                                <button 
                                    className="btn reject-btn" 
                                    onClick={() => handleRejectClick(club._id)}
                                    disabled={processingId !== null}
                                >
                                    <XCircle size={18} /> Reject
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state glass-panel">
                        <CheckCircle size={48} className="success-icon" />
                        <h3>All caught up!</h3>
                        <p>There are no pending club registration requests at the moment.</p>
                    </div>
                )}
            </div>

            {rejectionModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel animate-zoom-in">
                        <div className="modal-header">
                            <AlertTriangle size={24} className="warn-icon" />
                            <h2>Reject Registration</h2>
                        </div>
                        <p>Please provide a reason for rejecting this club. This helps the club understand what to fix before re-registering.</p>
                        <textarea
                            placeholder="Reason for rejection (e.g., incomplete description, invalid head name)..."
                            value={rejectionModal.reason}
                            onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
                        ></textarea>
                        <div className="modal-actions">
                            <button className="btn cancel-btn" onClick={() => setRejectionModal({ show: false, clubId: null, reason: '' })}>
                                Cancel
                            </button>
                            <button className="btn final-reject-btn" onClick={handleFinalReject}>
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproveClubs;
