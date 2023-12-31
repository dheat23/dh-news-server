const request = require("supertest");
const app = require("../app/app");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");
const db = require("../db/connection");
require("jest-sorted");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

describe("GET /api/topics", () => {
  test("200: should return all topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  test("200: should return array of objects describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { apiEndpoints } = body;
        for (const key in apiEndpoints) {
          const endpoint = apiEndpoints[key];
          if (key === "GET /api") {
            expect(endpoint).toEqual({
              description:
                "serves up a json representation of all the available endpoints of the api",
            });
          } else {
            expect(endpoint).toMatchObject({
              description: expect.any(String),
              queries: expect.any(Object),
              exampleResponse: expect.any(Object),
            });
          }
        }
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with article object with the given id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body}) => {
          const {article} = body;
          expect(article).toMatchObject({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              comment_count: "11",
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
      })
  });
  test("400: should respond with error when given invalid data type as parameter", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should respond with error when article does not exist with the given id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
});

describe("GET /api/articles", () => {
  describe('no queries', () => {
    test("200: should respond with an array of all article objects sorted by date created in descending order", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
          expect(Object.keys(article)).not.toContain("body");
        });
      });
    });
  });
    describe('topic queries', () => {
    test("200: should respond with filtered articles when passed valid topic query", () => {
      return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
    });
    test('404: should respond with an error when passed a topic that does not exist', () => {
      return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("not found")
      })
    });
    test('200: should respond with empty array when passed a topic that exists but has no corresponding articles', () => {
      return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({body}) => {
        const {articles} = body;
        expect(articles).toEqual([])
      })
    });
  })
  describe('sort_by queries', () => {
    test('200: should respond with sorted articles when passed a valid sort_by query', () => {
      return request(app)
      .get("/api/articles?sort_by=article_id")
    .expect(200)
    .then(({body}) => {
      const {articles} = body;
      expect(articles.length > 0).toBe(true)
      expect(articles).toBeSortedBy("article_id", {descending: true})
    })
  });
  test('400: should respond with error when passed invalid sort_by query', () => {
    return request(app)
    .get("/api/articles?sort_by=banana")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request: invalid sort_by query")
    })
  });
});
describe('order queries', () => {
  test('200: should respond with ordered articles when passed a valid order query (defaults to sort by: created_at, order: desc)', () => {
    return request(app)
    .get("/api/articles?order=asc")
    .expect(200)
    .then(({body}) => {
      const {articles} = body;
      expect(articles.length > 0).toBe(true)
      expect(articles).toBeSortedBy("created_at", {ascending: true})
    })
  });
  test('400: should respond with error when given invalid order query', () => {
    return request(app)
    .get("/api/articles?order=banana")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request: invalid order query")
    })
  });
});
describe('multiple queries', () => {
  test('200: should respond with correctly sorted and ordered array when given all queries', () => {
    return request(app)
    .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
    .expect(200)
    .then(({body}) => {
      const {articles} = body;
      expect(articles.length > 0).toBe(true)
      expect(articles).toBeSortedBy("article_id", {ascending: true});
      articles.forEach(article => {
        expect(article).toMatchObject({topic: "mitch"})
      })
    })
  });
  test('400: should respond with error when one or more queries are invalid', () => {
    return request(app)
    .get("/api/articles?topic=mitch&sort_by=article_id&order=banana")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request: invalid order query")
    })
  });
});
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with array of comments for given article id with most recent comments first", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("400: responds with error when given invalid data type as parameter", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with error when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("200: responds with empty array when article_id does exist but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should respond with the posted comment", () => {
    const newComment = { username: "butter_bridge", body: "First!" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "First!",
          votes: 0,
          author: "butter_bridge",
          article_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test("400: should respond with error when given invalid data type for article_id", () => {
    const newComment = { username: "butter_bridge", body: "First!" };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should respond with error when given non-existent article_id", () => {
    const newComment = { username: "butter_bridge", body: "First!" };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: should respond with error when username/body are null/not provided", () => {
    const newComment = { username: "butter_bridge", body: null };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Required fields missing");
      });
  });
  test("404: should respond with error when given non-existent username", () => {
    const newComment = { username: "username", body: "First!" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with patched article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test("200: responds with patched article when given negative inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("400: should respond with error when given invalid data type for article_id", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should respond with error when given invalid data type for inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "banana" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should respond with error when article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("400: should respond with error when given invalid patch object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ username: "newUser" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Required fields missing");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should respond with 204 code upon successful comment deletion", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400: should respond with error when given invalid data type for comment_id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should respond with error when given non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found");
      });
  });
});

describe('GET /api/users', () => {
  test('200: should respond with array of all users', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({body}) => {
      const {users} = body;
      expect(users).toHaveLength(4);
      users.forEach(user => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    })
  });
});

describe('Any other path ', () => {
  test('404: should respond with error for any invalid path', () => {
    return request(app)
    .get('/banana')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("path not found")
    })
  });
});

describe('GET /api/users/:username', () => {
  test('200: should return user object when passed a valid username', () => {
    return request(app)
    .get('/api/users/butter_bridge')
    .expect(200)
    .then(({body}) => {
      const {user} = body;
      expect(user).toMatchObject({
        username: 'butter_bridge',
        avatar_url: expect.any(String),
        name: expect.any(String)
      })
    })
  });
  test('404: should return error when username does not correspond to a user', () => {
    return request(app)
    .get('/api/users/banana')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("user not found")
    })
  });
});

describe('PATCH /api/comments/:comment_id', () => {
  test('200: should respond with updated comment', () => {
    return request(app)
    .patch('/api/comments/1')
    .send({inc_votes: 1})
    .expect(200)
    .then(({body}) => {
      const {updatedComment} = body;
      expect(updatedComment).toMatchObject({
        comment_id: 1,
        votes: 17
      })
    })
  });
  test('400: should respond with error when given invalid data type for comment_id', () => {
    return request(app)
    .patch('/api/comments/banana')
    .send({inc_votes: 1})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request")
    })
  });
  test('400: should respond with error when given invalid data type for inc_votes', () => {
    return request(app)
    .patch('/api/comments/1')
    .send({inc_votes: 'banana'})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request")
    })
  });
  test('400: should respond with error when given incorrect patch obj', () => {
    return request(app)
    .patch('/api/comments/1')
    .send({})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Required fields missing")
    })
  });
  test('404: should respond with error comment_id does not exist', () => {
    return request(app)
    .patch('/api/comments/999')
    .send({inc_votes: 1})
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("comment not found")
    })
  });
});

describe('POST /api/articles', () => {
  test('201: should respond with newly added article', () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Building Tests",
      body: "if at first you don't fail, try and try again",
      topic: "cats"
    }
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(201)
    .then(({body}) => {
      const {article} = body;
      expect(article).toEqual({
        article_id: expect.any(Number),
        author: "butter_bridge",
        title: "Building Tests",
        body: "if at first you don't fail, try and try again",
        topic: "cats",
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
        created_at: expect.any(String),
        comment_count: "0"
      })
    })
  });
  test('201: should respond with newly added article when article_img_url is provided', () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Building Tests",
      body: "if at first you don't fail, try and try again",
      topic: "cats",
      article_img_url: "link to an image"
    }
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(201)
    .then(({body}) => {
      const {article} = body;
      expect(article).toEqual({
        article_id: expect.any(Number),
        author: "butter_bridge",
        title: "Building Tests",
        body: "if at first you don't fail, try and try again",
        topic: "cats",
        votes: 0,
        article_img_url: 'link to an image',
        created_at: expect.any(String),
        comment_count: "0"
      })
    })
  });
  test("400: should respond with error when post obj is missing required field", () => {
    const newArticle = {
      title: "Building Tests",
      body: "if at first you don't fail, try and try again",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Required fields missing");
      });
  });
  test("404: should respond with error when author does not correspond to a user", () => {
    const newArticle = {
      author: "test_user",
      title: "Building Tests",
      body: "if at first you don't fail, try and try again",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});