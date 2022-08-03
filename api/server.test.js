const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true);
})

test('Testing NODE_ENV', () => {
  expect(process.env.NODE_ENV).toBe('testing');
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})
beforeEach(async () => {
  await db('users').truncate();
})
afterAll(async () => {
  await db.destroy();
})

describe('auth tests', () => {
  describe('POST to /api/auth/register endpoint', () => {
    it('testing for correct message without password, username, and both', async () => {
      let test = await request(server)
      .post('/api/auth/register')
      .send({ username: '', password: '1234'})

      expect(test.body.message).toBe('username and password required');

      test = await request(server)
      .post('/api/auth/register')
      .send({ username: 'andrew', password: '' })

      expect(test.body.message).toBe('username and password required');

      test = await request(server)
      .post('/api/auth/register')
      .send({ username: '', password: '' })

      expect(test.body.message).toBe('username and password required');
    })

    it('testing for correct resp with valid credentials', async () => {
      let test = await request(server)
        .post('/api/auth/register')
        .send({ username: 'Andrew', password: '1234'})
  
        const { id, username, password } = test.body;
  
        expect(id).toBeTruthy();
        expect(username).toBeTruthy();
        expect(password).toBeTruthy();

      test = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Andrew', password: '1234'})
  
      expect(test.body.message).toBe('username already exists');
    })
  })

  describe('POST /api/auth/login', () => {
    it('checking for correct resp with correct credentials', async () => {

      await request(server)
        .post('/api/auth/register')
        .send({ username: 'Andrew', password: '1234'})

      let test = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Andrew', password: '1234'})

      const { message, token } = test.body;

      expect(message).toBe(`welcome, Andrew`);
    })

    it('check for correct resp with invalid credentials', async () => {
      const test = await request(server)
      .post('/api/auth/login')
      .send({ username: 'TESTTTTTT', password: 'TESSTTTTT'})

      expect(test.body.message).toBe('invalid credentials');
    })
  })

  describe('jokes router', () => {
    it('checking for correct resp with valid credentials', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'Andrew', password: '1234'})

        let test = await request(server)
        .post('/api/auth/login')
        .send({ username: 'Andrew', password: '1234'})
  
        const { token } = test.body;

        const testing = await request(server)
        .get('/api/jokes')
        .send()
        .set({ Authorization: token})

        expect(testing.body.length).toBe(3)
    })

    it('checking for correct resp with no token', async () => {

        const testing = await request(server)
        .get('/api/jokes')
        .send()

        expect(testing.body.message).toBe('token required')
    })
  

  })
})
