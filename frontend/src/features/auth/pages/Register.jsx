import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom"; // Note: usually react-router-dom
import { useAuth } from '../hooks/useAuth.js';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import "../../auth/auth.form.scss";

function Register() {
  const { handleRegister, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const isRegister = true;
  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true)
    await handleRegister(userName, email, password);
  }

 if (loading && !isSubmitting) return (
  <main className="auth-page">
            <div className="silent-loader-container">
                <div className="loader-text-tiny">Initializing Session ...</div>
            </div>
        </main>
);

  return (
    <main className="auth-page">
      
      {isSubmitting && (
        <div className="submission-overlay">
          <div className="loader-container">
            <div className="spinner"></div>
            <h3 className="loader-text">{isRegister ? "Creating your account..." : "Signing you in..."}</h3>
          </div>
        </div>
      )}

      <div className="ambient-glow glow-top"></div>
      
      <div className="form-container glass-card">
        

        <div className="form-header">
            <h1 className='heading'>Create Account</h1>
            <p className="sub-heading">Join us to build your interview strategy.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* USERNAME INPUT */}
          <div className="input-group">
            <label htmlFor="Username">Username</label>
            <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                    onChange={(e) => setUserName(e.target.value)}
                    type='text' 
                    id='Username' 
                    name='Username' 
                    placeholder='John Doe'
                    required
                />
            </div>
          </div>

          {/* EMAIL INPUT */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                    onChange={(e) => setEmail(e.target.value)}
                    type='email' 
                    id='email' 
                    name='email' 
                    placeholder='john@gmail.com'
                    required
                />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                    onChange={(e) => setPassword(e.target.value)}
                    type='password' 
                    id='password' 
                    name='password' 
                    placeholder='••••••••'
                    required
                />
            </div>
          </div>

          <button className='button primary-button' type="submit">
              Register
          </button>
          
        </form>

        <p className="auth-footer">
            Already have an account? <Link to={"/login"}>Log in</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;