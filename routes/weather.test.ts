import jest from 'jest';
import app from '../app';
import request from 'supertest';

describe('weather', () => {
  test('', async() => {
    const resuponse = await request(app).get('/weather/474-0025');
    expect(resuponse.status).toBe(200);
    expect(resuponse.body.sys.country).toBe('JP');
    expect(typeof resuponse.body.main.temp).toBe('number');
  });
});