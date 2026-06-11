import React, { useState, useEffect } from 'react';
import { Code, MessageSquare, Map, ChevronDown, X, Target, Lightbulb, Menu, Sparkles } from 'lucide-react';
import "../style/interview.style.scss";
import { useInterview } from '../hooks/useInterview.hooks';
import { useParams } from 'react-router-dom';

function Interview() {
  const { loading, report, getAiReport, ResumePdf } = useInterview();
  const [activeTab, setActiveTab] = useState('technical');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDownload, setIsDownload] = useState(false)

  const { interviewId } = useParams();
  
  useEffect(() => {
    if (interviewId) {
      getAiReport(interviewId);
    }
  }, [interviewId]);

  const targetScore = report?.ATSscore || 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  
  const scoreColor = displayScore >= 80 ? '#22c55e' : displayScore >= 60 ? '#eab308' : '#ef4444';
  const scoreText = displayScore >= 80 ? 'Strong match for this role' : displayScore >= 60 ? 'Moderate match for this role' : 'Low match for this role';

  useEffect(() => {
    if (!report) return;
    let start = 0;
    const duration = 2000; 
    const increment = targetScore / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [targetScore, report]);

  if ((loading || !report)&& !isDownload) return (
   <main className="interview-page loading-state">
      <div className="loader-container">
          <Sparkles className="loader-icon" size={32} />
          <h3 className="loader-text">Analyzing Interview Strategy...</h3>
          <p className="loader-subtext">Generating your custom roadmap and questions</p>
      </div>
  </main>
  );
  if (loading && isDownload) return (
   <main className="interview-page loading-state">
      <div className="loader-container">
          <Sparkles className="loader-icon" size={32} />

          <h3 className="loader-text">Almost there!</h3>
          <p className="loader-subtext">Formatting your experience for maximum ATS visibility...</p>
      </div>
  </main>
  );
  
  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedSkill(null);
      setIsClosing(false);
    }, 400); 
  };

  const renderQAList = (questions) => (
    <div className="qa-list">
      {questions.map((q, index) => (
        <div 
          className={`qa-card staggered-fade ${openAccordion === index ? 'open' : ''}`} 
          key={index}
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          <div className="qa-header" onClick={() => toggleAccordion(index)}>
            <div className="header-content">
              <span className="q-number">Q{index + 1}</span>
              <h4>{q.question}</h4>
            </div>
            <ChevronDown className="icon-toggle" size={20} />
          </div>
          <div className="qa-body">
            <div className="qa-body-inner">
              <div className="insight-box intention">
                <Target size={16} className="insight-icon" />
                <div>
                  <strong>Interviewer's Intention:</strong>
                  <p>{q.intention}</p>
                </div>
              </div>
              <div className="insight-box strategy">
                <Lightbulb size={16} className="insight-icon" />
                <div>
                  <strong>How to Answer Effectively:</strong>
                  <p>{q.answer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
 
  return (
    <main className="interview-page">
      <div className="ambient-background">
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
        <div className="ambient-glow glow-3"></div>
      </div>

      <div className="report-container glass-pane">
        
        {isSidebarOpen && (
            <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header-mobile">
              {/* Removed Menu Text, kept close button aligned to right */}
              <button onClick={() => setIsSidebarOpen(false)} className="close-sidebar-btn">
                  <X size={24} />
              </button>
          </div>
          
          <h3 className="section-title">SECTIONS</h3>
          <nav className="nav-menu">
            <button 
              className={`nav-item ${activeTab === 'technical' ? 'active' : ''}`}
              onClick={() => { setActiveTab('technical'); setOpenAccordion(null); setIsSidebarOpen(false); }}
            >
              <Code size={18} />
              <span>Technical Questions</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'behavioral' ? 'active' : ''}`}
              onClick={() => { setActiveTab('behavioral'); setOpenAccordion(null); setIsSidebarOpen(false); }}
            >
              <MessageSquare size={18} />
              <span>Behavioral Questions</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => { setActiveTab('roadmap'); setOpenAccordion(null); setIsSidebarOpen(false); }}
            >
              <Map size={18} />
              <span>Road Map</span>
            </button>
          </nav>

          <button className="button primary-button download-btn" onClick={() => {setIsDownload(true); ResumePdf(interviewId)}}>
            <svg height={"1.2rem"} style={{marginRight: "0.75rem", textAlign: "center"}}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956C10.277 18.5682 9.20776 18.5682 8.8704 17.7956L7.99275 15.7854C7.21171 13.9966 5.80589 12.5726 4.0523 11.7942L1.63658 10.7219C.868536 10.381.868537 9.26368 1.63658 8.92276L3.97685 7.88394C5.77553 7.08552 7.20657 5.60881 7.97427 3.75892L8.8633 1.61673C9.19319.821767 10.2916.821765 10.6215 1.61673L11.5105 3.75894C12.2782 5.60881 13.7092 7.08552 15.5079 7.88394L17.8482 8.92276C18.6162 9.26368 18.6162 10.381 17.8482 10.7219L15.4325 11.7942C13.6789 12.5726 12.2731 13.9966 11.492 15.7854L10.6144 17.7956ZM4.53956 9.82234C6.8254 10.837 8.68402 12.5048 9.74238 14.7996 10.8008 12.5048 12.6594 10.837 14.9452 9.82234 12.6321 8.79557 10.7676 7.04647 9.74239 4.71088 8.71719 7.04648 6.85267 8.79557 4.53956 9.82234ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899ZM18.3745 19.0469 18.937 18.4883 19.4878 19.0469 18.937 19.5898 18.3745 19.0469Z"></path></svg>
            Generate Resume
          </button>
        </aside>

        {/* MAIN CENTER CONTENT */}
        <section className="main-content">
          <div className="mobile-topbar">
              <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                  <Menu size={24} />
              </button>
              <span className="mobile-tab-title">
                  {activeTab === 'roadmap' ? 'Preparation Road Map' : 
                   activeTab === 'technical' ? 'Technical Questions' : 'Behavioral Questions'}
              </span>
          </div>

          {activeTab === 'roadmap' && (
            <div className="tab-content roadmap-content">
              <header className="content-header desktop-only">
                <h2>Preparation Road Map</h2>
                <span className="badge">
                    <span className="badge-dot"></span> {report.preparationPlan.length}-Day Plan
                </span>
              </header>
              <div className="timeline">
                {report.preparationPlan.map((plan, index) => (
                  <div className="timeline-item staggered-fade" key={index} style={{ animationDelay: `${index * 0.15}s` }}>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h3><span className="day-label">Day {plan.day}</span> {plan.focusArea}</h3>
                      <ul>
                        {plan.tasks.map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="tab-content qa-content">
              <header className="content-header desktop-only">
                <h2>Technical Questions</h2>
              </header>
              {renderQAList(report.technicalQuestions)}
            </div>
          )}

          {activeTab === 'behavioral' && (
            <div className="tab-content qa-content">
              <header className="content-header desktop-only">
                <h2>Behavioral Questions</h2>
              </header>
              {renderQAList(report.behavioralQuestions)}
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="metrics-panel">
          <div className="metric-card score-section">
            <h3 className="section-title">ATS SCORE</h3>
            <div className="circular-progress">
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} className="progress-bg" />
                <circle 
                  cx="50" cy="50" r={radius} 
                  className="progress-line" 
                  stroke={scoreColor}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="score-value">
                <span className="number" style={{ color: scoreColor }}>{displayScore}</span>
                <span className="percent">%</span>
              </div>
            </div>
            <p className="score-text" style={{ color: scoreColor }}>{scoreText}</p>
          </div>

          <div className="divider"></div>

          <div className="metric-card gaps-section">
            <h3 className="section-title">SKILL GAPS</h3>
            <div className="gaps-list">
              {report.skillGaps.map((gap, index) => (
                <div 
                  className="gap-badge click-effect staggered-fade" 
                  key={index}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedSkill(gap)}
                >
                  {gap.skill}
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

      {selectedSkill && (
        <div className={`skill-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleCloseModal}>
          <div className={`skill-modal glass-pane ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModal}>
              <X size={20} />
            </button>
            <h3 className="modal-title">{selectedSkill.skill}</h3>
            <div className="modal-body">
              <span className="label">Identified Severity</span>
              <div className={`severity-tag sev-${selectedSkill.severity}`}>
                <span className="sev-dot"></span>
                {selectedSkill.severity.toUpperCase()} PRIORITY
              </div>
              <p className="modal-desc">
                This skill is missing or insufficiently demonstrated in your resume relative to the target job description. Focus your preparation here to close the gap.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Interview;