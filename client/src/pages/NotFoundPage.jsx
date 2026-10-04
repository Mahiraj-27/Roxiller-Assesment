import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#334155', margin: '0 0 1rem' }}>Page Not Found</h2>
      <p style={{ color: '#64748b', maxWidth: '400px', marginBottom: '2rem' }}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/" style={{ padding: '0.75rem 1.5rem', background: '#0f172a', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
