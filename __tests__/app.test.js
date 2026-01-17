const request = require('supertest');
const app = require('../app');

describe('NodeJS Todo App – Basic Functional Tests', () => {

  test('GET / → should load home page successfully', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Todo');
  });

  test('POST /add → should add a new todo', async () => {
    const response = await request(app)
      .post('/add')
      .send('todo=Jenkins Test Todo');

    expect(response.statusCode).toBe(302);
  });

  test('POST /clear-completed → should clear completed todos', async () => {
    const response = await request(app).post('/clear-completed');
    expect(response.statusCode).toBe(302);
  });

  /* ================= ADD THESE ================= */

  test('POST /toggle/0 → should toggle todo status', async () => {
    await request(app).post('/add').send('todo=Toggle Test');
    const response = await request(app).post('/toggle/0');
    expect(response.statusCode).toBe(302);
  });

  test('POST /edit/0 → should edit a todo', async () => {
    await request(app).post('/add').send('todo=Edit Test');
    const response = await request(app)
      .post('/edit/0')
      .send('updatedTodo=Edited Todo');

    expect(response.statusCode).toBe(302);
  });

  test('POST /delete/0 → should delete a todo', async () => {
    await request(app).post('/add').send('todo=Delete Test');
    const response = await request(app).post('/delete/0');
    expect(response.statusCode).toBe(302);
  });

});
