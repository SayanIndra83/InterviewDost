import React, { useState } from 'react';
import "../../auth/auth.form.scss";
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

function Login() {
  const { handleLogin, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isRegister = false
  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true)
    await handleLogin(email, password);
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
      
      {isSubmitting && loading && (
        <div className="submission-overlay">
          <div className="loader-container">
            <div className="spinner"></div>
            <h3 className="loader-text">{isRegister ? "Creating your account..." : "Signing you in..."}</h3>
          </div>
        </div>
      )}
      <div className="ambient-glow glow-top"></div>
      
      <div className="form-container glass-card">
        
        <Link to="/" className="back-button" aria-label="Go back to home">
            <ArrowLeft size={20} />
        </Link>

        <div className="form-header">
            <h1 className='heading'>Welcome Back</h1>
            <p className="sub-heading">Log in to continue your interview prep.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                    type='email'
                    id='email' 
                    name='email' 
                    placeholder='john@gmail.com'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                    type='password' 
                    id='password' 
                    name='password' 
                    placeholder='••••••••' 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
          </div>

          <div className="form-options">
              <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
              </label>
          </div>

          <button className='button primary-button' type="submit">
              Sign In
          </button>

        </form>

        <p className="auth-footer">
            Don't have an account? <Link to={"/register"}>Create Account</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;