const express = require("express");
const { getAllTopics, getAllEndpoints, getAllArticles } = require("./controllers");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints)
app.get("/api/articles", getAllArticles)
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app