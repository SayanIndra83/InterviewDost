import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Sparkles, ChevronDown, User, Bell } from 'lucide-react';
import "./styles/navbar.style.scss";
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth.js';


function Navbar() {
    const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {user,handleLogout} = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = async() => {
    await handleLogout()
    setIsDropdownOpen(false);
    navigate("/login")
  };

  return (
    <nav className="global-navbar">
      <Link to="/" className="nav-brand">
  <div className="brand-icon-wrapper">
    <Sparkles className="icon-accent" size={19} />
  </div>
  <span className="brand-name">
    Interview <span className="text-gradient">Dost</span>
  </span>
</Link>

      <div className="nav-actions-right">


        {user ? (
          <div className="nav-profile-container" ref={dropdownRef}>
            <button 
              className={`profile-trigger ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="user-avatar">
                <User size={16} strokeWidth={2} />
              </div>
              <div className="user-details-min">
                <span className="user-name-min">{user.userName || "User"}</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`chevron-icon ${isDropdownOpen ? 'rotated' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="profile-dropdown glass-pane">
                <div className="dropdown-header">
                  <div className="user-avatar large">
                    <User size={24} strokeWidth={2} />
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.userName || "User"}</span>
                    <span className="user-email" spellCheck="false">{user.email || ""}</span>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-actions">
                  <button className="dropdown-item logout" onClick={handleClick}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;