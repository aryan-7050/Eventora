import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event, onClick }) => {
    // Handle both mock data and real backend data
    const title = event.title;
    const club = event.clubName || (event.organizingClub ? event.organizingClub.name : 'Unknown Club');
    const date = event.date || (event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD');
    const time = event.time || event.startTime || 'TBD';
    const venue = event.venue || 'TBD';
    const image = event.image || event.posterUrl || "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=600&q=80";
    const participantsCount = event.participants || (event.maxParticipants ? `Up to ${event.maxParticipants}` : 'Open');
    const type = event.type || (event.mode); // Mock uses 'type', backend uses 'mode'

    return (
        <div className="event-card glass-panel flex-col" onClick={onClick}>
            <div className="event-image">
                <img src={image} alt={title} />
                <div className="event-badges">
                    {event.isTrending && <span className="badge-trending">Trending</span>}
                    <span className={`badge-type ${(type === 'Free' || type === 'Online' || !type) ? 'free' : 'paid'}`}>
                        {type || 'Event'}
                    </span>
                </div>
            </div>

            <div className="event-details flex-col">
                <h3 className="event-title">{title}</h3>
                <p className="event-club">{club}</p>

                <div className="event-meta">
                    <div className="meta-item">
                        <CalendarIcon size={14} /> <span>{date}</span>
                    </div>
                    <div className="meta-item">
                        <Clock size={14} /> <span>{time}</span>
                    </div>
                    <div className="meta-item">
                        <MapPin size={14} /> <span>{venue}</span>
                    </div>
                    <div className="meta-item">
                        <Users size={14} /> <span>{participantsCount}</span>
                    </div>
                </div>

                <div className="event-footer mt-auto">
                    <button className="btn btn-primary w-full text-sm">
                        View Details <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
