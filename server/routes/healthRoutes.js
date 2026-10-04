const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let dbStatus = 'connected';
    try {
      await query('SELECT 1');
    } catch (err) {
      dbStatus = 'degraded';
    }

    res.status(200).json({
      success: true,
      data: {
        service: 'RateSphere API',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        uptime: `${Math.floor(process.uptime())}s`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
    });
  }
});

module.exports = router;
