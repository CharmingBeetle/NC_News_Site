const db = require("../db/connection")
const endpointsJson = require("../endpoints.json");
const app = require("../app")
const request = require("supertest")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data");
const topics = require("../db/data/test-data/topics");


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
      })
    })
  })
describe("GET: /api/articles/:article_id", ()=> {

    test("200: Responds with an article object when passed an article id.", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const article = response.body.article
          expect(article.title).toBe("Sony Vaio; or, The Laptop");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("icellusedkars")
          expect(article.body).toBe("Call me Mitchell. Some years ago..");
          expect(article.created_at).toBe('2020-10-16T05:03:00.000Z');
          expect(article.votes).toBe(0);
          expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        });
      })
        test("400: Responds with error if article ID is not valid",() => {
          return request(app)
           .get('/api/articles/notValidId')
           .expect(400)
           .then(({body}) => {
               expect(body.msg).toBe("Bad request")
                   })
                   })
        test("404: Responds with error if article does not exist",() => {
           return request(app)
           .get('/api/articles/99')
           .expect(404)
           .then(({body}) => {
               expect(body.msg).toBe("Article not found!")
                       })
                       })
    });
});

describe("ANY: /notpath", ()=> {
  test("404: Responds with error if path not found",() => {
      return request(app)
          .get('/notpath')
          .expect(404)
          .then(({body}) => {
              expect(body.msg).toBe("Path not found")
                      })
                      })
          })
      
