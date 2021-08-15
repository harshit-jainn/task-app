const app = require('./library/index');
const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server is up on port ' + port)
});

