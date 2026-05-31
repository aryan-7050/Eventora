import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, MapPin, Users, FileText,
    Image as ImageIcon, Mail, Phone, ShieldCheck,
    MessageSquare, Plus, Trash2, Globe, Link as LinkIcon,
    CreditCard, QrCode, ArrowLeft
} from 'lucide-react';
import { getEventById, proposeEventEdit } from '../../api/events';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateEvent.css'; // Reuse CreateEvent styles

const ManageEditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [clubInfo, setClubInfo] = useState({ id: '', name: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Workshop',
        eventDate: '',
        startTime: '',
        endTime: '',
        registrationDeadline: '',
        venue: '',
        mode: 'Offline',
        meetingLink: '',
        maxParticipants: '',
        eligibility: '',
        registrationRequired: true,
        posterUrl: '',
        brochureUrl: '',
        organizerName: '',
        contactEmail: '',
        contacts: [{ name: '', number: '' }],
        certificateAvailable: false,
        feedbackEnabled: false,
        isPaid: false,
        registrationAmount: '',
        paymentQRUrl: ''
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            const clubId = storedUser.id || storedUser._id;
            setClubInfo({ id: clubId, name: storedUser.name });
            fetchEventData();
        } else {
            toast.error("Club info not found! Please login again.");
            navigate('/club/login');
        }
    }, [id]);

    const fetchEventData = async () => {
        try {
            const res = await getEventById(id);
            const data = res.data;

            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                return new Date(dateStr).toISOString().split('T')[0];
            };

            setFormData({
                ...data,
                eventDate: formatDate(data.eventDate),
                registrationDeadline: formatDate(data.registrationDeadline),
                contacts: data.contacts.length > 0 ? data.contacts : [{ name: '', number: '' }]
            });
            setLoading(false);
        } catch (err) {
            toast.error('Failed to fetch event details');
            navigate('/club/manage-events');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleContactChange = (index, field, value) => {
        const newContacts = [...formData.contacts];
        newContacts[index][field] = value;
        setFormData(prev => ({ ...prev, contacts: newContacts }));
    };

    const addContact = () => {
        setFormData(prev => ({
            ...prev,
            contacts: [...prev.contacts, { name: '', number: '' }]
        }));
    };

    const removeContact = (index) => {
        if (formData.contacts.length === 1) return;
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`${name === 'posterUrl' ? 'Poster' : (name === 'paymentQRUrl' ? 'QR Code' : 'Brochure')} must be less than 2MB`);
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.posterUrl) {
            return toast.warn('Event poster is required');
        }

        if (formData.isPaid && !formData.paymentQRUrl) {
            return toast.warn('Payment QR code is required for paid events');
        }

        setSubmitting(true);
        try {
            const dataToSubmit = {
                ...formData,
                organizingClub: {
                    id: clubInfo.id,
                    name: clubInfo.name
                }
            };

            await proposeEventEdit(id, dataToSubmit);
            toast.success('Edit proposal submitted for admin approval!');
            navigate('/club/manage-events');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit edit proposal');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-spinner">Loading event details...</div>;

    return (
        <div className="create-event-container animate-fade-in">
            <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <button
                    onClick={() => navigate('/club/manage-events')}
                    className="btn btn-secondary"
                    style={{ width: 'fit-content', padding: '0.5rem 1rem' }}
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <div>
                    <h1 className="dashboard-title">Edit Event Details</h1>
                    <p className="dashboard-subtitle">Update your event details and propose changes for admin approval.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="event-form glass-panel">
                <div className="form-section">
                    <h2 className="section-title"><FileText size={20} /> Basic Information</h2>
                    <div className="input-grid">
                        <div className="form-group full-width">
                            <label>Event Title / Name</label>
                            <input
                                type="text" name="title" required
                                value={formData.title} onChange={handleChange}
                                placeholder="Enter an eye-catching title"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Event Description</label>
                            <textarea
                                name="description" required
                                value={formData.description} onChange={handleChange}
                                placeholder="What is this event about?"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Event Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="Workshop">Workshop</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Cultural">Cultural</option>
                                <option value="Technical">Technical</option>
                                <option value="Sports">Sports</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Organizing Club</label>
                            <input type="text" value={clubInfo.name} disabled className="disabled-input" />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title"><Calendar size={20} /> Date & Time</h2>
                    <div className="input-grid">
                        <div className="form-group">
                            <label>Event Date</label>
                            <input type="date" name="eventDate" required value={formData.eventDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Registration Deadline</label>
                            <input type="date" name="registrationDeadline" required value={formData.registrationDeadline} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Start Time</label>
                            <div className="time-input">
                                <Clock size={16} />
                                <input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>End Time</label>
                            <div className="time-input">
                                <Clock size={16} />
                                <input type="time" name="endTime" required value={formData.endTime} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title"><MapPin size={20} /> Venue & Mode</h2>
                    <div className="input-grid">
                        <div className="form-group">
                            <label>Event Mode</label>
                            <select name="mode" value={formData.mode} onChange={handleChange}>
                                <option value="Offline">Offline</option>
                                <option value="Online">Online</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Venue / Location</label>
                            <input
                                type="text" name="venue" required
                                value={formData.venue} onChange={handleChange}
                                placeholder="Seminar Hall, Room 101, etc."
                            />
                        </div>
                        {(formData.mode === 'Online' || formData.mode === 'Hybrid') && (
                            <div className="form-group full-width">
                                <label>Meeting Link</label>
                                <div className="input-with-icon">
                                    <LinkIcon size={16} />
                                    <input
                                        type="url" name="meetingLink"
                                        value={formData.meetingLink} onChange={handleChange}
                                        placeholder="Zoom, GMeet link, etc."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title"><Users size={20} /> Logistics & Eligibility</h2>
                    <div className="input-grid">
                        <div className="form-group">
                            <label>Maximum Participants</label>
                            <input type="number" name="maxParticipants" required value={formData.maxParticipants} onChange={handleChange} placeholder="0 for unlimited" />
                        </div>
                        <div className="form-group">
                            <label>Eligibility Criteria</label>
                            <input type="text" name="eligibility" value={formData.eligibility} onChange={handleChange} placeholder="TE Students, Open for all, etc." />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title"><CreditCard size={20} /> Registration & Payment</h2>
                    <div className="input-grid">
                        <div className="form-group">
                            <label>Registration Type</label>
                            <select
                                name="isPaid"
                                value={formData.isPaid}
                                onChange={(e) => setFormData(prev => ({ ...prev, isPaid: e.target.value === 'true' }))}
                            >
                                <option value="false">Free Event</option>
                                <option value="true">Paid Event</option>
                            </select>
                        </div>

                        {formData.isPaid && (
                            <>
                                <div className="form-group">
                                    <label>Registration Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="registrationAmount"
                                        required={formData.isPaid}
                                        value={formData.registrationAmount}
                                        onChange={handleChange}
                                        placeholder="Enter amount in INR"
                                    />
                                </div>
                                <div className="file-upload-group full-width">
                                    <label>Payment QR Code (Scanner Image)</label>
                                    <div className="file-input-wrapper">
                                        <QrCode size={20} />
                                        <input
                                            type="file"
                                            name="paymentQRUrl"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <span className="file-status">
                                            {formData.paymentQRUrl ? 'QR Selected ✅' : 'Upload Payment QR (JPG/PNG)'}
                                        </span>
                                    </div>
                                    {formData.paymentQRUrl && (
                                        <img src={formData.paymentQRUrl} alt="QR Preview" className="qr-preview" />
                                    )}
                                </div>
                            </>
                        )}

                        <div className="form-group-checkbox">
                            <input
                                type="checkbox" name="registrationRequired" id="regRequired"
                                checked={formData.registrationRequired} onChange={handleChange}
                            />
                            <label htmlFor="regRequired">Registration Required</label>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title"><ImageIcon size={20} /> Media & Outreach</h2>
                    <div className="input-grid">
                        <div className="file-upload-group">
                            <label>Event Poster</label>
                            <div className="file-input-wrapper">
                                <ImageIcon size={20} />
                                <input type="file" name="posterUrl" accept="image/*" onChange={handleFileChange} />
                                <span className="file-status">{formData.posterUrl ? 'Image Selected ✅' : 'Choose Image (JPG/PNG)'}</span>
                            </div>
                            {formData.posterUrl && <img src={formData.posterUrl} alt="Preview" className="poster-preview" />}
                        </div>
                        <div className="file-upload-group">
                            <label>Event Brochure (Optional)</label>
                            <div className="file-input-wrapper">
                                <FileText size={20} />
                                <input type="file" name="brochureUrl" accept=".pdf,.doc,.docx,image/*" onChange={handleFileChange} />
                                <span className="file-status">{formData.brochureUrl ? 'Document Selected ✅' : 'Upload Document'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title"><Mail size={20} /> Contact & Support</h2>
                    <div className="input-grid">
                        <div className="form-group">
                            <label>Lead Organizer Name</label>
                            <input type="text" name="organizerName" required value={formData.organizerName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Contact Email</label>
                            <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="dynamic-contacts">
                        <label>Additional Contacts</label>
                        {formData.contacts.map((contact, index) => (
                            <div key={index} className="contact-row">
                                <input
                                    type="text" placeholder="Name"
                                    value={contact.name} onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                                />
                                <input
                                    type="text" placeholder="Number"
                                    value={contact.number} onChange={(e) => handleContactChange(index, 'number', e.target.value)}
                                />
                                <button type="button" onClick={() => removeContact(index)} className="remove-btn"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={addContact} className="add-btn"><Plus size={16} /> Add Another Contact</button>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title"><ShieldCheck size={20} /> Features</h2>
                    <div className="checkbox-row">
                        <div className="form-group-checkbox">
                            <input
                                type="checkbox" name="certificateAvailable" id="cert"
                                checked={formData.certificateAvailable} onChange={handleChange}
                            />
                            <label htmlFor="cert">Certificate Available</label>
                        </div>
                        <div className="form-group-checkbox">
                            <input
                                type="checkbox" name="feedbackEnabled" id="feedback"
                                checked={formData.feedbackEnabled} onChange={handleChange}
                            />
                            <label htmlFor="feedback">Feedback Form Enabled</label>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/club/manage-events')}>Cancel</button>
                    <button type="submit" className="btn btn-club create-btn" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Edit & Propose for Approval'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageEditEvent;
