const request = require("supertest");
const app = require("../app/app");
const seed = require("../db/seeds/seed");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => {
    return db.end()
});

beforeEach(() => {
    return seed({articleData, commentData, topicData, userData})
});

describe("GET /api/topics", ()=>{
    test('200: should return all topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const {topics} = body;
            expect(topics).toHaveLength(3);
            topics.forEach(topic => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    });
})