const { getAllUsers, getUserByUsername } = require('../../app/controllers');

const usersRouter = require('express').Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:username', getUserByUsername)
module.exports = usersRouter