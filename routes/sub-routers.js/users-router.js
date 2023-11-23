const { getAllUsers } = require('../../app/controllers');

const usersRouter = require('express').Router();

usersRouter.get('/', getAllUsers)
module.exports = usersRouter