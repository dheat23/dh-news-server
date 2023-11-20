const express = require("express");
const { getAllTopics, getAllEndpoints } = require("./controllers");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();
app.use(express.json())

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app