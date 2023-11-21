const db = require("../db/connection");

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
};

exports.selectCommentsByArticleId = (id) => {
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC;`, [id])
    .then(({rows}) => {
            return rows
    })
};

exports.checkArticleExists = (value) => {
    const queryStr = `SELECT * FROM articles WHERE article_id = $1;`;
    return db.query(queryStr, [value])
    .then(({rows}) => {
      if (!rows.length) {
        return Promise.reject({status: 404, msg: "not found"})
      }
    })
  }