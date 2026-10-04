import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="rs-footer">
      <div className="rs-footer-container">
        <div className="rs-footer-left">
          <span className="rs-footer-brand">RateSphere Platform</span>
          <span className="rs-footer-status">
            <FiCheckCircle className="rs-status-icon" /> Systems Operational
          </span>
        </div>
        <div className="rs-footer-right">
          <span>Enterprise Store Rating & Intelligence Architecture</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
