import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { authenticateUser } from '../services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { FiShield, FiShoppingBag, FiUser, FiStar, FiArrowRight, FiCheckCircle } from 'react-icons/fi';


const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuickDemo = async (email, password, route) => {
    try {
      const res = await authenticateUser({ email, password });
      dispatch(setCredentials(res.data.data));
      toast.success(`Logged in as ${res.data.data.user.role.replace('_', ' ')}`);
      navigate(route);
    } catch (err) {
      toast.error('Quick login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="rs-page-wrapper">
      <Navbar />

      <main className="rs-landing-main">
        <section className="rs-hero-section">
          <div className="rs-hero-container">
            <div className="rs-hero-pill">
              <span className="rs-pill-badge">Release 2026</span>
              <span>Full-Stack Store Rating & Performance Intelligence</span>
            </div>

            <h1 className="rs-hero-title">
              Transparent Store Ratings. <br />
              Actionable Business Insights.
            </h1>

            <p className="rs-hero-subtitle">
              A unified platform connecting consumers, store merchants, and platform administrators.
              Rate local businesses with verified integrity, monitor real-time satisfaction metrics,
              and streamline merchant operations with role-based access control.
            </p>

            <div className="rs-hero-cta">
              <Link to="/login" className="rs-btn rs-btn-primary rs-btn-lg">
                Enter Platform <FiArrowRight />
              </Link>
              <Link to="/signup" className="rs-btn rs-btn-outline rs-btn-lg">
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* Instant Reviewer Demo Cards */}
        <section className="rs-demo-section">
          <div className="rs-demo-container">
            <div className="rs-section-header">
              <h2>Instant Demo Accounts for Reviewers</h2>
              <p>Test all three distinct roles with one-click direct authentication</p>
            </div>

            <div className="rs-demo-grid">
              <div className="rs-demo-card">
                <div className="rs-demo-icon rs-icon-admin">
                  <FiShield />
                </div>
                <h3>System Administrator</h3>
                <p>Complete control over system metrics, user governance, store catalog, and owner assignment.</p>
                <div className="rs-demo-cred">
                  <span>admin@storerating.com</span>
                  <code>Admin@123</code>
                </div>
                <button
                  type="button"
                  className="rs-btn rs-btn-secondary rs-btn-full"
                  onClick={() => handleQuickDemo('admin@storerating.com', 'Admin@123', '/admin')}
                >
                  Quick Sign In (Admin)
                </button>
              </div>

              <div className="rs-demo-card">
                <div className="rs-demo-icon rs-icon-owner">
                  <FiShoppingBag />
                </div>
                <h3>Store Owner</h3>
                <p>Monitor your store's average ratings, customer count, and detailed customer reviews table.</p>
                <div className="rs-demo-cred">
                  <span>owner@store1.com</span>
                  <code>Owner@123</code>
                </div>
                <button
                  type="button"
                  className="rs-btn rs-btn-secondary rs-btn-full"
                  onClick={() => handleQuickDemo('owner@store1.com', 'Owner@123', '/owner')}
                >
                  Quick Sign In (Owner)
                </button>
              </div>

              <div className="rs-demo-card">
                <div className="rs-demo-icon rs-icon-user">
                  <FiUser />
                </div>
                <h3>Normal Consumer</h3>
                <p>Browse registered stores, sort by name or rating, and submit or modify 1-to-5 star ratings.</p>
                <div className="rs-demo-cred">
                  <span>user@example.com</span>
                  <code>User@1234</code>
                </div>
                <button
                  type="button"
                  className="rs-btn rs-btn-secondary rs-btn-full"
                  onClick={() => handleQuickDemo('user@example.com', 'User@1234', '/user')}
                >
                  Quick Sign In (Consumer)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="rs-features-section">
          <div className="rs-features-container">
            <div className="rs-feature-row">
              <div className="rs-feature-content">
                <span className="rs-feature-tag">Unified Security</span>
                <h3>Strict Validation & JWT Token Architecture</h3>
                <p>
                  Built with Zod schemas for shared frontend/backend contract validation. Session
                  tokens are split into in-memory access tokens and secure httpOnly cookies.
                </p>
                <ul className="rs-feature-list">
                  <li><FiCheckCircle /> Name length: 20 to 60 characters</li>
                  <li><FiCheckCircle /> Address limit: up to 400 characters</li>
                  <li><FiCheckCircle /> Password security: 8–16 chars with uppercase & symbol</li>
                </ul>
              </div>

              <div className="rs-feature-content">
                <span className="rs-feature-tag">Business Transparency</span>
                <h3>Upsert Rating Engine with Instant Analytics</h3>
                <p>
                  Store ratings feature PostgreSQL `ON CONFLICT` atomic upserts, computing
                  average ratings and real-time review totals with zero duplicate entries.
                </p>
                <ul className="rs-feature-list">
                  <li><FiCheckCircle /> Dynamic star hover interaction</li>
                  <li><FiCheckCircle /> Live store sorting by rating or alphabet</li>
                  <li><FiCheckCircle /> Individual user rating visibility</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
