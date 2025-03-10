const db = require("../db/connection")
const endpointsJson = require("../endpoints.json");
const app = require("../app")
const request = require("supertest")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data");
const topics = require("../db/data/test-data/topics");


/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(()=> {
  return seed(data)
})
afterAll(()=> {
  return db.end()
})
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  describe("GET /api/topics", () => {
  test("200: Responds an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        const topics = body.topics
        console.log(topics, "<<<<<<< TOPICS")
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.img_url).toBe("string");
        })
      });
  });
});
})