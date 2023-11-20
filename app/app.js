const express = require("express");
const { getAllTopics, getArticleById } = require("./controllers");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app