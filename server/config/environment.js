const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server directory first, fallback to root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const environment = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || null,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'ratesphere_db',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || 'postgres'),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'ratesphere_jwt_access_secret_key_default_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'ratesphere_jwt_refresh_secret_key_default_2026',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Validate production configuration
if (environment.nodeEnv === 'production') {
  if (!process.env.DATABASE_URL && !process.env.DB_PASSWORD) {
    console.warn('⚠️ Notice: No explicit DATABASE_URL provided for production. Ensure database is accessible.');
  }
}

module.exports = environment;
