import React from 'react';
import { ArrowRight, Sparkles, Hash, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      {/* Background elements */}
      <div className="hero-bg-accent"></div>
      <div className="hero-bg-accent hero-bg-accent-2"></div>

      <div className="container">
        <div className="hero-content">
          <div className="badge animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Sparkles size={16} className="badge-icon" />
            <span>The New Standard in Campus Events</span>
          </div>

          <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Transform How Your College <br />
            <span className="text-gradient">Experience Events</span>
          </h1>

          <p className="hero-description animate-fade-in" style={{ animationDelay: '0.3s' }}>
            EventMatrix is the ultimate platform uniting students, clubs, and administration. Smart recommendations, one-click registrations, Code attendance, and massive engagement—all in one place.
          </p>

          <div className="hero-actions animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/student/login" className="btn btn-primary pulse-btn">
              Explore Events <ArrowRight size={18} />
            </Link>
            <Link to="/club/login" className="btn btn-secondary glass-btn">
              Register Your Club
            </Link>
          </div>

          <div className="hero-stats animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="stat-card glass-panel animate-float">
              <div className="stat-icon-wrapper blue">
                <Hash size={24} />
              </div>
              <div className="stat-info">
                <h3>Smart Tracking</h3>
                <p>Code based attendance instantly</p>
              </div>
            </div>

            <div className="stat-card glass-panel animate-float" style={{ animationDelay: '2s' }}>
              <div className="stat-icon-wrapper purple">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <h3>Engagement</h3>
                <p>Connect with your community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
