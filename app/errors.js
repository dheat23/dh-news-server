exports.handlePsqlErrors = (err, req, res, next) => {
    next(err)
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).send({msg: err.msg})
    } else next(err)
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
}