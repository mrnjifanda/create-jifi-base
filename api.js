const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const usersRouter = require('./routes/users.route');
const indexRouter = require('./routes/index.route');

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(3000, () => {
    console.log('Application running on port 3000: http://localhost:3000');
})