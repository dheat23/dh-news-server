const express = require("express");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors, handle404Errors } = require("./errors");
const apiRouter = require('../routes/api-router');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json())

app.use('/api', apiRouter);

app.all('*', handle404Errors);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app