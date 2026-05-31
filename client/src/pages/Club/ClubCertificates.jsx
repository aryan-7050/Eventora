import React, { useState, useEffect, useRef } from 'react';
import { 
    Award, 
    FileCheck, 
    Upload, 
    Eye, 
    Send, 
    CheckCircle2, 
    Clock, 
    Users,
    Calendar,
    Download,
    Loader2,
    Plus,
    X,
    Image as ImageIcon
} from 'lucide-react';
import { 
    getCertificateEvents, 
    getEventAttendees, 
    saveCertificates, 
    postCertificates,
    uploadSignature,
    getClubProfile
} from '../../api/club';
import { getOfficialSeal } from '../../api/admin';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ClubCertificates.css';

const ClubCertificates = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [posting, setPosting] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [signature, setSignature] = useState(null);
    const [seal, setSeal] = useState(null);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [uploadingSignature, setUploadingSignature] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
    const [previewEventName, setPreviewEventName] = useState('');
    const certificateRef = useRef(null);

    useEffect(() => {
        fetchInitialData();
        return () => {
            if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
        };
    }, [previewBlobUrl]);

    const fetchInitialData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const clubId = user.id || user._id;
            
            const [eventsRes, profileRes, sealRes] = await Promise.all([
                getCertificateEvents(clubId),
                getClubProfile(clubId),
                getOfficialSeal()
            ]);
            
            setEvents(eventsRes.data);
            setSignature(profileRes.data.signatureUrl);
            setSeal(sealRes.data.sealUrl);
        } catch (err) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSignatureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            return toast.error('File size should be less than 2MB');
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            setUploadingSignature(true);
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                await uploadSignature(user.id || user._id, { signatureUrl: reader.result });
                setSignature(reader.result);
                toast.success('Signature updated successfully');
                setShowSignatureModal(false);
            } catch (err) {
                toast.error('Failed to upload signature');
            } finally {
                setUploadingSignature(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const generateAllCertificates = async (event) => {
        if (!signature) {
            return toast.error('Please upload an organizer signature first');
        }

        setGenerating(true);
        setSelectedEvent(event);
        
        try {
            const attendeesRes = await getEventAttendees(event._id);
            const attendees = attendeesRes.data;

            if (attendees.length === 0) {
                toast.warn('No attendees found for this event');
                setGenerating(false);
                return;
            }

            const certificatesData = [];
            
            // Generate for each attendee sequentially to avoid overwhelming the browser
            for (const attendee of attendees) {
                const dataUrl = await renderCertificateToImage(attendee, event);
                if (dataUrl) {
                    certificatesData.push({
                        studentId: attendee.student.id,
                        certificateUrl: dataUrl
                    });
                }
            }

            await saveCertificates(event._id, { certificates: certificatesData });
            toast.success('All certificates generated and saved!');
            fetchInitialData(); // Refresh list
        } catch (err) {
            toast.error('Failed to generate certificates');
            console.error(err);
        } finally {
            setGenerating(false);
            setSelectedEvent(null);
        }
    };

    const renderCertificateToImage = (student, event) => {
        return new Promise((resolve) => {
            // Create a temporary container for the certificate
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '-9999px';
            document.body.appendChild(container);

            // Render the certificate template
            const certHtml = `
                <div id="cert1" style="width: 1000px; height: 707px; background: white; padding: 40px; border: 2px solid #3b82f6; position: relative; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #1e293b; box-sizing: border-box; overflow: hidden;">
                    <!-- Decorative Light Blue Background Elements -->
                    <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(59, 130, 246, 0.05); border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: -50px; left: -50px; width: 300px; height: 300px; background: rgba(59, 130, 246, 0.05); border-radius: 50%;"></div>
                    
                    <!-- Inner Border -->
                    <div style="position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px; border: 1px solid rgba(59, 130, 246, 0.3); pointer-events: none;"></div>

                    <!-- Corner Accents -->
                    <div style="position: absolute; top: 0; left: 0; width: 60px; height: 60px; border-top: 8px solid #3b82f6; border-left: 8px solid #3b82f6;"></div>
                    <div style="position: absolute; top: 0; right: 0; width: 60px; height: 60px; border-top: 8px solid #3b82f6; border-right: 8px solid #3b82f6;"></div>
                    <div style="position: absolute; bottom: 0; left: 0; width: 60px; height: 60px; border-bottom: 8px solid #3b82f6; border-left: 8px solid #3b82f6;"></div>
                    <div style="position: absolute; bottom: 0; right: 0; width: 60px; height: 60px; border-bottom: 8px solid #3b82f6; border-right: 8px solid #3b82f6;"></div>

                    <div style="position: absolute; top: 50px; left: 60px; height: 50px; display: flex; align-items: center; gap: 15px;">
                        <img src="/logo.png" style="height: 100%;" />
                        <div style="width: 1px; height: 30px; background: #cbd5e1;"></div>
                        <span style="font-weight: 700; font-size: 14px; letter-spacing: 1px; color: #64748b;">EVENTMATRIX</span>
                    </div>

                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="font-size: 16px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">Datta Meghe College of Engineering, Navi Mumbai</p>
                        <h1 style="font-size: 82px; margin: 0; color: #1e1b4b; text-transform: uppercase; letter-spacing: 8px; font-weight: 800;">Certificate</h1>
                        <h2 style="font-size: 20px; margin: 5px 0 0 0; color: #3b82f6; font-weight: 700; letter-spacing: 5px; text-transform: uppercase;">of participation</h2>
                    </div>

                    <p style="font-size: 18px; color: #64748b; margin-bottom: 10px; font-style: italic;">This prestigious award is presented to</p>
                    
                    <h3 style="font-size: 52px; margin: 10px 0; color: #1e1b4b; font-weight: 800; border-bottom: 2px solid #f1f5f9; padding: 0 40px 10px 40px; min-width: 400px; text-align: center;">${student.student.name}</h3>
                    
                    <p style="font-size: 18px; line-height: 1.8; text-align: center; max-width: 750px; color: #475569; margin-top: 20px;">
                        for their exceptional contribution and active participation in the event <br/>
                        <span style="color: #1e1b4b; font-weight: 700; font-size: 22px;">"${event.title}"</span> <br/>
                        organized by <span style="color: #3b82f6; font-weight: 600;">${event.organizingClub.name}</span> on <strong>${new Date(event.eventDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
                    </p>

                    <div style="margin-top: 50px; width: 100%; display: flex; justify-content: space-around; align-items: flex-end; padding: 0 100px;">
                        <div style="text-align: center;">
                            <div style="height: 70px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center;">
                                <img src="${signature}" style="height: 100%; max-width: 180px; filter: contrast(1.2) multiply(1.1);" />
                            </div>
                            <div style="width: 180px; height: 1.5px; background: #3b82f6; margin-bottom: 8px;"></div>
                            <span style="font-weight: 700; font-size: 14px; color: #1e1b4b; text-transform: uppercase; letter-spacing: 1px;">Club Organizer</span>
                        </div>
                        
                        <div style="text-align: center; position: relative;">
                            <div style="width: 80px; height: 80px; border: 4px double #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto; background: rgba(59, 130, 246, 0.05); overflow: hidden;">
                                <img src="${seal || '/logo.png'}" style="${seal ? 'width: 100%; height: 100%; object-fit: contain;' : 'width: 40px; opacity: 0.8;'}" />
                            </div>
                            <span style="font-weight: 700; font-size: 14px; color: #1e1b4b; text-transform: uppercase; letter-spacing: 1px;">Official Seal</span>
                        </div>
                    </div>

                    <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); color: #94a3b8; font-size: 10px; letter-spacing: 1px;">
                        VERIFIED BY EVENTMATRIX PLATFORM • CERTIFICATE ID: ${student._id.toString().toUpperCase()}
                    </div>
                </div>
            `;
            container.innerHTML = certHtml;

            // Wait for all images in the container to load
            const images = container.querySelectorAll('img');
            const imagePromises = Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve; // Continue anyway if one fails
                });
            });

            Promise.all(imagePromises).then(async () => {
                try {
                    const certElement = container.querySelector('#cert1');
                    if (!certElement) {
                        document.body.removeChild(container);
                        return resolve(null);
                    }

                    // A small extra delay for layout stabilization
                    await new Promise(r => setTimeout(r, 200));

                    const canvas = await html2canvas(certElement, { 
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff',
                        logging: false
                    });
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    document.body.removeChild(container);
                    resolve(dataUrl);
                } catch (err) {
                    console.error('html2canvas error:', err);
                    if (document.body.contains(container)) {
                        document.body.removeChild(container);
                    }
                    resolve(null);
                }
            });
        });
    };

    const handlePostCertificates = async (eventId) => {
        setPosting(true);
        try {
            await postCertificates(eventId);
            toast.success('Certificates posted! Students notified.');
            fetchInitialData();
        } catch (err) {
            toast.error('Failed to post certificates');
        } finally {
            setPosting(false);
        }
    };

    const viewAllCertificates = async (event) => {
        setLoading(true);
        try {
            const attendeesRes = await getEventAttendees(event._id);
            const attendees = attendeesRes.data.filter(a => a.certificateUrl);
            
            if (attendees.length === 0) {
                return toast.error('Generate certificates first');
            }

            const pdf = new jsPDF('landscape', 'px', [1000, 707]);
            
            for (let i = 0; i < attendees.length; i++) {
                if (i > 0) pdf.addPage();
                pdf.addImage(attendees[i].certificateUrl, 'JPEG', 0, 0, 1000, 707);
            }

            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);
            setPreviewBlobUrl(url);
            setPreviewEventName(event.title);
            setShowPreviewModal(true);
        } catch (err) {
            toast.error('Failed to prepare PDF preview');
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = () => {
        if (!previewBlobUrl) return;
        const link = document.createElement('a');
        link.href = previewBlobUrl;
        link.download = `${previewEventName}_Certificates.pdf`;
        link.click();
    };

    if (loading && events.length === 0) return (
        <div className="loader-container">
            <Loader2 className="animate-spin" size={48} />
            <p>Loading certificate dashboard...</p>
        </div>
    );

    return (
        <div className="cert-generator-container">
            <div className="cert-header">
                <div className="header-text">
                    <h1><Award /> Certificate Generator</h1>
                    <p>Automate participation certificates for your event attendees</p>
                </div>
                <div className="header-actions">
                    <button className="btn-signature" onClick={() => setShowSignatureModal(true)}>
                        <Upload size={18} /> {signature ? 'Update Signature' : 'Add Organizer Signature'}
                    </button>
                </div>
            </div>

            <div className="cert-events-grid">
                {events.length === 0 ? (
                    <div className="empty-cert-state glass-panel">
                        <Award size={64} />
                        <h3>No Events Ready</h3>
                        <p>Events will appear here once attendance is marked for at least one student.</p>
                    </div>
                ) : (
                    events.map(event => (
                        <div key={event._id} className="cert-event-card glass-panel animate-fade-in">
                            <div className="card-badge">
                                {event.certificatesPosted ? (
                                    <span className="badge-posted"><CheckCircle2 size={14}/> Posted</span>
                                ) : (
                                    <span className="badge-pending"><Clock size={14}/> Draft</span>
                                )}
                            </div>
                            
                            <div className="event-info">
                                <h3>{event.title}</h3>
                                <div className="event-meta">
                                    <span><Users size={14} /> {event.attendeeCount} Attendees</span>
                                    <span><Calendar size={14} /> {new Date(event.eventDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="card-actions">
                                {!event.certificatesPosted ? (
                                    <>
                                        <button 
                                            className="btn-cert-primary" 
                                            onClick={() => generateAllCertificates(event)}
                                            disabled={generating && selectedEvent?._id === event._id}
                                        >
                                            {generating && selectedEvent?._id === event._id ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <FileCheck size={18} />
                                            )}
                                            {generating && selectedEvent?._id === event._id ? 'Generating...' : 'Generate Certificates'}
                                        </button>
                                        <button 
                                            className="btn-cert-secondary" 
                                            onClick={() => viewAllCertificates(event)}
                                        >
                                            <Eye size={18} /> Preview PDF
                                        </button>
                                        <button 
                                            className="btn-cert-post" 
                                            onClick={() => handlePostCertificates(event._id)}
                                            disabled={posting}
                                        >
                                            <Send size={18} /> Post Certificates
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            className="btn-cert-secondary full-width" 
                                            onClick={() => viewAllCertificates(event)}
                                        >
                                            <Download size={18} /> Download All Certificates
                                        </button>
                                        <div className="success-footer">
                                            <CheckCircle2 size={16} /> Certificates are live in student portals
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showSignatureModal && (
                <div className="modal-overlay">
                    <div className="cert-modal glass-panel animate-scale-up">
                        <div className="modal-header">
                            <h3><Upload size={18} /> Organizer Signature</h3>
                            <button className="btn-close" onClick={() => setShowSignatureModal(false)}><X /></button>
                        </div>
                        <div className="modal-body">
                            <p>Upload a clear image of the signature (transparent PNG recommended) to be displayed on all certificates.</p>
                            
                            <div className="signature-preview-box">
                                {signature ? (
                                    <img src={signature} alt="Signature Preview" />
                                ) : (
                                    <div className="empty-signature">
                                        <ImageIcon size={48} />
                                        <span>No signature uploaded</span>
                                    </div>
                                )}
                            </div>

                            <label className="btn-upload-label">
                                {uploadingSignature ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                                {uploadingSignature ? 'Processing...' : 'Upload Signature Image'}
                                <input type="file" accept="image/*" onChange={handleSignatureUpload} hidden />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {showPreviewModal && (
                <div className="modal-overlay">
                    <div className="pdf-preview-modal glass-panel animate-scale-up">
                        <div className="modal-header">
                            <div>
                                <h3><Eye size={20} /> Certificate Preview</h3>
                                <p className="modal-subtitle">{previewEventName}</p>
                            </div>
                            <button className="btn-close" onClick={() => setShowPreviewModal(false)}><X /></button>
                        </div>
                        <div className="modal-body pdf-body">
                            {previewBlobUrl && (
                                <iframe 
                                    src={`${previewBlobUrl}#toolbar=0`} 
                                    title="PDF Preview"
                                    className="pdf-iframe"
                                />
                            )}
                        </div>
                        <div className="modal-footer preview-footer">
                            <button className="btn-cert-secondary" onClick={() => setShowPreviewModal(false)}>
                                Close Preview
                            </button>
                            <button className="btn-cert-primary" onClick={downloadPdf}>
                                <Download size={18} /> Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubCertificates;
