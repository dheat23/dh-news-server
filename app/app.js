const express = require("express");
const { getAllTopics, getArticleById, getAllEndpoints, getAllArticles, getCommentsByArticleId, postComment, patchArticle } = require("./controllers");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();
app.use(express.json())

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api", getAllEndpoints);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment)
app.patch("/api/articles/:article_id", patchArticle)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app