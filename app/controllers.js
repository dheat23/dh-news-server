const { selectAllTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId, checkArticleExists, insertComment, updateArticle, deleteCommentSql, selectAllUsers, checkTopicExists, selectUserByUsername, updateCommentVotes } = require("./models");
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
    const {topic, sort_by, order} = req.query;
    const articlesPromises = [selectAllArticles(topic, sort_by, order)];
    if (topic) {
        articlesPromises.push(checkTopicExists(topic))
    }
    Promise.all(articlesPromises)
    .then(resolvedPromises => {
        const articles = resolvedPromises[0]
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
};

exports.postComment = (req, res, next) => {
  const {username, body} = req.body;
  const {article_id} = req.params;
  insertComment(username, body, article_id)
  .then(comment => {
    res.status(201).send({comment})
  })
  .catch(next)
  
}

exports.patchArticle = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;

    updateArticle(article_id, inc_votes)
    .then(updatedArticle => {
        res.status(200).send({updatedArticle})
    })
    .catch(next)
}


exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params;
    deleteCommentSql(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}

exports.getAllUsers = (req, res, next) => {
    selectAllUsers()
    .then(users => {
        res.status(200).send({users})
    })
    .catch(next)
};

exports.getUserByUsername = (req, res, next) => {
    const {username} = req.params;
    selectUserByUsername(username)
    .then(user => {
        res.status(200).send({user})
    })
    .catch(next)
};

exports.patchCommentVotes = (req, res, next) => {
    const {comment_id} = req.params;
    const {inc_votes} = req.body;
    updateCommentVotes(comment_id, inc_votes)
    .then(updatedComment => {
        res.status(200).send({updatedComment})
    })
}