const request = require('supertest');
const app = require('../server');
const { Pool } = require('pg');


describe('API Endpoints Testing', () => {

    describe('GET /api/health', () => {
        it('should return status ok', async () => {
            const res = await request(app).get('/api/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('status', 'ok');
        });
    });

    describe('GET /api/restaurants', () => {
        it('should return a list of restaurants', async () => {
            const res = await request(app).get('/api/restaurants');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            if (res.body.length > 0) {
                expect(res.body[0]).toHaveProperty('id');
                expect(res.body[0]).toHaveProperty('name');
            }
        });
    });

    describe('Admin Security Middleware', () => {
        it('should block POST /api/restaurants without token', async () => {
            const res = await request(app).post('/api/restaurants/signup').send({
                name: 'Test Store',
                ownerName: 'Test Owner',
                ownerEmail: 'test@admin.com',
                address: '123 Test St'
            });
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Unauthorized. Admin access required.');
        });

        it('should allow POST /api/restaurants with correct token', async () => {
            const res = await request(app)
                .post('/api/restaurants/signup')
                .set('x-admin-token', 'admin123')
                .send({}); 

            expect(res.statusCode).toEqual(400); 
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toContain('Missing required fields');
        });
    });

});
