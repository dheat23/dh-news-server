const { deleteComment } = require('../../app/controllers');

const commentsRouter = require('express').Router();

commentsRouter.get('/', (req, res) => {
    res.status(200).send({msg: "if you're looking for comments, try /articles/:article_id/comments"})
});

commentsRouter.delete('/:comment_id', deleteComment);

module.exports = commentsRouter