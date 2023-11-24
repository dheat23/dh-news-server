const { getAllArticles, getArticleById, getCommentsByArticleId, postComment, patchArticle, postArticle } = require('../../app/controllers');

const articlesRouter = require('express').Router();

articlesRouter.route('/')
.get(getAllArticles)
.post(postArticle);

articlesRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticle);

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment);

module.exports = articlesRouter