const app = require('../library/index');
const supertest = require('supertest');
const User = require('../models/User');

beforeEach(async () => {
    await User.deleteMany();
});

test('app create', async () => {
    await supertest(app).post('/user').send({
        name: 'Harshit',
        email: 'hjjrocks6@gmail.com',
        password: 'hjjrocks6@gmail.com',
    }).expect(200);
});