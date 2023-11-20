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

describe('GET /api/articles/:article_id', () => {
    test('200: should respond with article object with the given id', () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    });
    test('400: should respond with error when given invalid data type as parameter', () => {
        return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    });
    test('404: should respond with error when article does not exist with the given id', () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Article does not exist")
        })
    });
});