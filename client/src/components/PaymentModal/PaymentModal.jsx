import React, { useState } from 'react';
import { X, CreditCard, User, Hash, ShieldCheck } from 'lucide-react';
import './PaymentModal.css';

const PaymentModal = ({ event, onClose, onConfirm, loading }) => {
    const [formData, setFormData] = useState({
        transactionID: '',
        paymentUsername: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <div className="pm-modal-overlay" onClick={onClose}>
            <div className="pm-modal-content glass-panel animate-scale-up" onClick={e => e.stopPropagation()}>
                <button className="pm-modal-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="pm-modal-header">
                    <div className="pm-icon-wrapper">
                        <CreditCard size={24} />
                    </div>
                    <h2 className="pm-title">Complete Registration</h2>
                    <p className="pm-subtitle">Please provide your payment details for <span>{event.title}</span></p>
                </div>

                <div className="pm-amount-badge">
                    <span>Amount to Pay</span>
                    <h3>₹{event.registrationAmount}</h3>
                </div>

                <form onSubmit={handleSubmit} className="pm-form">
                    <div className="pm-input-group">
                        <label><Hash size={16} /> Transaction ID / Refernce No.</label>
                        <input
                            type="text"
                            name="transactionID"
                            required
                            placeholder="Enter the 12-digit transaction ID"
                            value={formData.transactionID}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pm-input-group">
                        <label><User size={16} /> Payment ID / Username</label>
                        <input
                            type="text"
                            name="paymentUsername"
                            required
                            placeholder="Name or ID used for payment"
                            value={formData.paymentUsername}
                            onChange={handleChange}
                        />
                        <span className="pm-hint">So we can verify your payment manually.</span>
                    </div>

                    <div className="pm-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-club pm-submit-btn" disabled={loading}>
                            {loading ? 'Processing...' : (
                                <>
                                    <ShieldCheck size={18} /> Confirm Registration
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
