const { getAllTopics } = require('../../app/controllers');

const topicsRouter = require('express').Router();

topicsRouter.get('/', getAllTopics)
module.exports = topicsRouter