const mongoose = require('mongoose');
const url = process.env.MONGODB_URL + '/' + process.env.MONGOOSE_DB_NAME;
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
module.exports = mongoose;