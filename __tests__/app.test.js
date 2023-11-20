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
const fs = require("fs/promises");

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
