const express = require("express");
const { getAllTopics, getArticleById, getAllEndpoints, getAllArticles, getCommentsByArticleId, postComment, patchArticle, deleteComment, getAllUsers } = require("./controllers");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();
app.use(express.json())

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api", getAllEndpoints);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteComment);
app.get('/api/users', getAllUsers);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app