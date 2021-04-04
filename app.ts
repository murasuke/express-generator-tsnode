import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

var indexRouter = require('./routes/index');
import usersRouter from './routes/users';
import weatherRouter from './routes/weather';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/weather', weatherRouter);

// importでもrequire()でも読み込めるように2種類export
module.exports = app;
export default app;
