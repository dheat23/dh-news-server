const { deleteComment, patchCommentVotes } = require('../../app/controllers');

const commentsRouter = require('express').Router();

commentsRouter.get('/', (req, res) => {
    res.status(200).send({msg: "if you're looking for comments, try /articles/:article_id/comments"})
});

commentsRouter
.route('/:comment_id')
.delete(deleteComment)
.patch(patchCommentVotes);

module.exports = commentsRouter