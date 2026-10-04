const request = require('supertest');
const app = require('../index');

jest.setTimeout(20000);


describe('RateSphere API Health & Security Tests', () => {
  describe('GET /api/health', () => {
    it('returns 200 with service health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
    });
  });

  describe('Validation & Auth Protections', () => {
    it('rejects signup if Name is shorter than 20 characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Short Name',
          email: 'test@example.com',
          address: '123 Test Street, Suite 100',
          password: 'Password@123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === 'name')).toBe(true);
    });

    it('rejects signup if password does not meet complexity rules', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Valid Full Legal Business Name Over 20 Chars',
          email: 'test2@example.com',
          address: '123 Test Street, Suite 100',
          password: 'alllowercase123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
    });

    it('returns 401 when accessing admin dashboard without authorization token', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
