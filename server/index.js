const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const environment = require('./config/environment');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();



// ── Security Hardening ─────────────────────────
app.use(helmet());

const allowedOrigins = [
  environment.clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        environment.nodeEnv !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ── Parsing & Logging ──────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (environment.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// ── Mounted Routes ─────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/user', userRoutes);
app.use('/api/store-owner', ownerRoutes);
app.use('/store-owner', ownerRoutes);



// Fallback 404 handler
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);


// ── Startup & Initialization ───────────────────
if (require.main === module) {
  const bootstrapDb = require('./config/bootstrapDb');

  bootstrapDb()
    .catch((err) => {
      console.warn('⚠️ Bootstrap warning:', err.message);
    })
    .finally(() => {
      app.listen(environment.port, () => {
        console.log(`\n🚀 RateSphere API running on http://localhost:${environment.port}`);
        console.log(`   Environment: ${environment.nodeEnv}`);
        console.log(`   Health Check: http://localhost:${environment.port}/api/health\n`);
      });
    });
}

module.exports = app;
