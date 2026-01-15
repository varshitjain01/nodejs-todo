const request = require('supertest');
const app = require('../app');

describe('NodeJS Todo App – Basic Functional Tests', () => {

  test('GET / → should load home page successfully', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Todo'); // basic UI validation
  });

  test('POST /add → should add a new todo', async () => {
    const response = await request(app)
      .post('/add')
      .send('todo=Jenkins Test Todo');

    expect(response.statusCode).toBe(302); // redirect after add
  });

  test('POST /clear-completed → should clear completed todos', async () => {
    const response = await request(app).post('/clear-completed');
    expect(response.statusCode).toBe(302);
  });

});
