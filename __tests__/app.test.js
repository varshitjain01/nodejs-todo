const request = require('supertest');
const app = require('../app');

describe('NodeJS Todo App - Basic Tests', () => {

  test('Home page should load successfully', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

});
