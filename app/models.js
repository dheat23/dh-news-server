const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (id) => {
    return db.query(`SELECT articles.author, title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.body, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article does not exist"})
        } else {
            return rows[0]
        }
    })
}

exports.selectAllArticles = (topic, sort_by = "created_at", order = "DESC") => {
  let queryStr = `SELECT articles.author, title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
  const queryParams = [];
  const validSortBy = ['article_id', 'author', 'title', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'];
  const validOrder = ['ASC', 'DESC']
  if (topic) {
    queryStr += `WHERE articles.topic = $1 `;
    queryParams.push(topic)
  }
  queryStr += `GROUP BY articles.article_id `;
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({status: 400, msg: "Bad request: invalid sort_by query"})
  } else {
    queryStr += `ORDER BY ${sort_by} `
  }
  if (!validOrder.includes(order.toUpperCase())) {
    return Promise.reject({status: 400, msg: "Bad request: invalid order query"})
  } else {
    queryStr += `${order};`
  }
  return db.query(queryStr, queryParams).then(({ rows }) => {
     return rows;
  });
};

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkArticleExists = (value) => {
  const queryStr = `SELECT * FROM articles WHERE article_id = $1;`;
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
  });
};

exports.insertComment = (username, body, article_id) => {
  return db
    .query(
      `INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $2
    WHERE articles.article_id = $1
    RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return rows[0];
      }
    });
};

exports.deleteCommentSql = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments WHERE comment_id = $1
    RETURNING *;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};

exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users;`)
  .then(({rows}) => {
      return rows
  })
}

exports.checkTopicExists = (value) => {
  const queryStr = `SELECT * FROM topics WHERE slug = $1;`;
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
  });
};

exports.selectUserByUsername = (username) => {
  return db.query(`SELECT * FROM users WHERE users.username = $1`, [username])
  .then(({rows}) => {
    if (!rows.length) {
      return Promise.reject({status: 404, msg: "user not found"})
    }
    return rows[0]
  })
};

exports.updateCommentVotes = (comment_id, inc_votes) => {
  return db.query(`UPDATE comments
  SET votes = votes + $2
  WHERE comment_id = $1
  RETURNING *`, [comment_id, inc_votes])
  .then(({rows}) => {
    if (!rows.length) {
      return Promise.reject({status: 404, msg: "comment not found"})
    }
    return rows[0]
  })
}