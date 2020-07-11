const express = require('express');
require('./utils');
const userRoutes = require('../controllers/userController');
const taskRoutes = require('../controllers/taskController');
// const mailer = require('./library/email');
const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

module.exports = app;