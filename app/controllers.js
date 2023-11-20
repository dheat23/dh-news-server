const { selectAllTopics, selectCommentsByArticleId } = require("./models");
const fs = require("fs/promises")


exports.getAllTopics = (req, res, next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getAllEndpoints = (req, res, next) => {
    fs.readFile(`${__dirname}/../endpoints.json`)
    .then((apiEndpoints) => {
        res.status(200).send({apiEndpoints: JSON.parse(apiEndpoints)})
    })
};

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id)
    .then(comments => {
        res.status(200).send({comments})
    })
    .catch(next)
}