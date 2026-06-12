import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, User, UploadCloud ,Mail } from 'lucide-react'; 
import "../style/home.style.scss";
import { useInterview } from '../hooks/useInterview.hooks.js';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth.js';
import toast from 'react-hot-toast';

const GithubIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

function Home() {

  const navigate = useNavigate()

  const {user} = useAuth()
  const {loading, generateAiReport, reports, getAiReports} = useInterview()
  const [fileName, setFileName] = useState("");
  const [charCount, setCharCount] = useState(0);
  const[jobDescription, setJobDescripton] = useState("")
  const[selfDescription, setSelfDescription] = useState("")
  const resumeInputRef = useRef()
  // console.log(reports)

  useEffect(() =>{
    if(user){
      getAiReports()
    }
  }, [user])

  const handleSubmit = async(e)=>{
    e.preventDefault();

    if(!user){
      navigate("/login")
      return;
    }
    const resumeFile = resumeInputRef.current.files[0]
    if (!resumeFile) {
        toast("Please upload your resume (.pdf or .docx) to generate the report.");
        return;
    }
     await generateAiReport({resumeFile, selfDescription, jobDescription})
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if(file){
      if (e.target.files.length > 0) {
      if (file.size > 3145728) {
        toast("Resume file size exceeds the 3MB limit. Please upload a smaller file.");
        e.target.value = null;
        setFileName(""); 
        return;
      }
      setFileName(file.name);
    }
    }
    
    }

  const handleTextareaChange = (e) => {
    setJobDescripton(e.target.value)
    setCharCount(e.target.value.length);
  };
if(loading) return(
  <main className="auth-page">
            <div className="silent-loader-container">
                <div className="loader-text-tiny">Loading...</div>
            </div>
        </main>
)
  return (
    <main className='home'>
      <div className="ambient-background">
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
        <div className="ambient-glow glow-3"></div>
      </div>

      <div className="full-screen-wrapper">
        
        <header className="home-header">
          <h1>Build Your <span className="highlight">Interview Strategy</span></h1>
          <p>Provide your target role, resume, and a brief self-description to initialize the AI analysis.</p>
        </header>

        <div className="interview-grid">
          
          <div className="glass-pane">
            <div className="pane-header">
              <div className="title-group">
                <Briefcase size={20} className="icon-accent" />
                <h2>Target Job Description</h2>
              </div>
            </div>
            
            <div className="input-wrapper">
              <textarea 
                name="jobDescription" 
                id="jobDescription" 
                placeholder="Enter the complete job description here...&#10;&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                onChange={handleTextareaChange}
              ></textarea>
              <div className="char-count">{charCount}/5000 chars</div>
            </div>
          </div>

          <div className="glass-pane">
            <div className="pane-header">
              <div className="title-group">
                <User size={20} className="icon-accent" />
                <h2>Candidate Profile</h2>
              </div>
            </div>

            <div className="input-group">
              <label>Upload your Resume</label>
              
              <label className='file-drop-zone' htmlFor="resume">
                <UploadCloud size={36} className="icon-muted drop-icon" />
                <span className="upload-text">
                  {fileName ? fileName : "Click or drag your resume here"}
                </span>
                {!fileName && <span className="upload-subtext">PDF or DOCX (Max 3MB)</span>}
              </label>
              <input 
                onChange={handleFileChange} 
                hidden 
                type="file" 
                name='resume' 
                id='resume' 
                accept='.pdf,.docx'
                ref={resumeInputRef}
              />
            </div>

            <div className="input-group">
              <label htmlFor="selfDescription">Self Description</label>
              <textarea 
                name="selfDescription" 
                id="selfDescription" 
                className="small-textarea"
                placeholder='Highlight your core skills, current role, and any specific areas you want the AI to focus on...'
                onChange={(e)=> setSelfDescription(e.target.value)}
              ></textarea> 
            </div>
          </div>
          
        </div>

        <div className="action-bar">
          <button onClick={handleSubmit} className='generate-btn'>
            Generate Strategy Report ✨
          </button>
        </div>

  {
  (reports.length > 0 && (
          <div className="recent-reports">
            <div className="reports-header">
               <h2>My Recent Interview Plans</h2>
            </div>
            <ul className="reports-grid">
              {reports.map(report => {
                // Safely format the date if your database provides one!
                const dateStr = report.createdAt 
                  ? new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : "Recently";

                return (
                  <li key={report._id} className="report-card" onClick={() => navigate(`/interview/${report._id}`)}>
                    <div className="card-content">
                      <h3>{report.title || "Untitled Position"}</h3>
                      <p>Generated on {dateStr}</p>
                    </div>
                    <div className="card-arrow">→</div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}      
      </div>

      <footer className="developer-footer">
        <div className="footer-content">
          
          <div className="footer-top">
            <p className="developer-name">Developed by Sayan Indra</p>
            
            <div className="social-links">
              <a href="https://github.com/sayanindra83" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon size={22} />
              </a>
              <a href="https://www.linkedin.com/in/sayan-indra-a41319369/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinIcon size={22} />
              </a>
              <a href="mailto:sayanindra77@gmail.com" aria-label="Email">
                <Mail size={22} />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Interview Dost. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </main>
  );
}

export default Home;