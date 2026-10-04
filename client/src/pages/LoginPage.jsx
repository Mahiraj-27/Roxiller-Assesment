import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { authenticateUser } from '../services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiArrowRight, FiShield, FiShoppingBag, FiUser } from 'react-icons/fi';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterLogin = (role) => {
    const fromPath = location.state?.from?.pathname;
    if (fromPath && fromPath !== '/login' && fromPath !== '/signup') {
      navigate(fromPath, { replace: true });
      return;
    }

    switch (role) {
      case 'admin':
        navigate('/admin', { replace: true });
        break;
      case 'store_owner':
        navigate('/owner', { replace: true });
        break;
      default:
        navigate('/user', { replace: true });
        break;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await authenticateUser({ email, password });
      const { user, accessToken } = res.data.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success(`Welcome back, ${user.name}`);
      redirectAfterLogin(user.role);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div className="rs-page-wrapper">
      <Navbar />

      <main className="rs-auth-container">
        <div className="rs-auth-card">
          <div className="rs-auth-header">
            <h1 className="rs-auth-title">Sign In</h1>
            <p className="rs-auth-desc">Enter your credentials to access your RateSphere account</p>
          </div>

          {/* Quick-Fill Reviewer Shortcuts */}
          <div className="rs-quickfill-box">
            <span className="rs-quickfill-label">Reviewer Quick-Fill:</span>
            <div className="rs-quickfill-buttons">
              <button
                type="button"
                className="rs-quickfill-btn"
                onClick={() => quickFill('admin@storerating.com', 'Admin@123')}
              >
                <FiShield /> Admin
              </button>
              <button
                type="button"
                className="rs-quickfill-btn"
                onClick={() => quickFill('owner@store1.com', 'Owner@123')}
              >
                <FiShoppingBag /> Owner
              </button>
              <button
                type="button"
                className="rs-quickfill-btn"
                onClick={() => quickFill('user@example.com', 'User@1234')}
              >
                <FiUser /> User
              </button>
            </div>
          </div>

          {errorMsg && <div className="rs-alert rs-alert-error">{errorMsg}</div>}

          <form onSubmit={handleLogin} className="rs-form">
            <div className="rs-form-group">
              <label className="rs-form-label">Email Address</label>
              <div className="rs-input-icon-wrap">
                <FiMail className="rs-input-icon" />
                <input
                  type="email"
                  className="rs-form-input with-icon"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                />
              </div>
            </div>

            <div className="rs-form-group">
              <label className="rs-form-label">Password</label>
              <div className="rs-input-icon-wrap">
                <FiLock className="rs-input-icon" />
                <input
                  type="password"
                  className="rs-form-input with-icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="rs-btn rs-btn-primary rs-btn-full"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <FiArrowRight />
            </button>
          </form>

          <div className="rs-auth-footer">
            <p>
              Don't have an account yet?{' '}
              <Link to="/signup" className="rs-link">
                Register as Consumer
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
