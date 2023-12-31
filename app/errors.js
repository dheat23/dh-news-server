exports.handlePsqlErrors = (err, req, res, next) => {
    switch(err.code) {
        case "22P02": {
            res.status(400).send({msg: "Bad request"})
        } break;
        case "23503": {
            res.status(404).send({msg: "Not found"})
        } break;
        case "23502": {
            res.status(400).send({msg: "Required fields missing"})
        }
        default: next(err)
    }
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({msg: err.msg})
    } else next(err)
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
};

exports.handle404Errors = (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
}