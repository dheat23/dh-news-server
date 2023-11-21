
const { selectAllTopics, selectCommentsByArticleId, checkArticleExists } = require("./models");
const fs = require("fs/promises");


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

    const commentsPromises = [selectCommentsByArticleId(article_id), checkArticleExists(article_id)]
    
    Promise.all(commentsPromises)
    .then(resolvedPromises => {
        const comments = resolvedPromises[0]
        res.status(200).send({comments})
    })
    .catch(next)
}