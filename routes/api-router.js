const apiRouter = require('express').Router();
const { getAllEndpoints } = require('../app/controllers');
const {articlesRouter, topicsRouter, commentsRouter, usersRouter} = require('./sub-routers.js')

apiRouter.get('/', getAllEndpoints);

apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);


module.exports = apiRouter