const { getAllArticles, getArticleById, getCommentsByArticleId, postComment, patchArticle } = require('../../app/controllers');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getAllArticles);

articlesRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticle);

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment);

module.exports = articlesRouter