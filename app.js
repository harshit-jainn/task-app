const express = require('express');
require('./library/utils');
const userRoutes = require('./controllers/userController');
const taskRoutes = require('./controllers/taskController');
// const mailer = require('./library/email');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});