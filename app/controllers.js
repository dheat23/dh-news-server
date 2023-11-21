const { selectAllTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId, checkArticleExists, updateArticle } = require("./models");
const fs = require("fs/promises")


exports.getAllTopics = (req, res, next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
};

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
};

exports.getAllEndpoints = (req, res, next) => {
    fs.readFile(`${__dirname}/../endpoints.json`)
    .then((apiEndpoints) => {
        res.status(200).send({apiEndpoints: JSON.parse(apiEndpoints)})
    })
};

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then(articles => {
        res.status(200).send({articles})
    })
    .catch(next)
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

exports.patchArticle = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;

    const articlesPromises = [updateArticle(article_id, inc_votes), checkArticleExists(article_id)]
    Promise.all(articlesPromises)
    .then(resolvedPromises => {
        const updatedArticle = resolvedPromises[0]
        res.status(200).send({updatedArticle})
    })
    .catch(next)
}