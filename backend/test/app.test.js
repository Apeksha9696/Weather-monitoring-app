const request = require('supertest');
const app = require('../server');

describe('GET /weather', () => {
    it('should return 400 if no city is provided', async () => {
        const res = await request(app).get('/weather');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'City name is required');
    });
});

describe('GET /forecast', () => {
    it('should return 400 if no city is provided', async () => {
        const res = await request(app).get('/forecast');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'City name is required');
    });
});
