const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const topics = require("../db/data/test-data/topics");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});
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
        .then(({ body }) => {
          const topics = body.topics;
          // console.log(topics, "<<<<<<< TOPICS");
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.img_url).toBe("string");
          });
        });
    });
  });
  describe("GET: /api/articles", () => {
    test("200: Responds with an array of all articles with total comment count for each article ID.", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=desc")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(13);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect(article.comment_count).toBeGreaterThanOrEqual(0);
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("400: Responds with error if query entered is not valid", () => {
      return request(app)
        .get("/api/articles/notValidQuery")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("GET: /api/articles/:article_id", () => {
    test("200: Responds with an individual article object when passed an article id.", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.article_id).toBe(2);
          expect(article.title).toBe("Sony Vaio; or, The Laptop");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("icellusedkars");
          expect(article.body).toBe("Call me Mitchell. Some years ago..");
          expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
          expect(article.votes).toBe(0);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("400: Responds with error if article ID is not valid", () => {
      return request(app)
        .get("/api/articles/notValidId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("404: Responds with error if article does not exist", () => {
      return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found!");
        });
    });
    test("200: Responds with an array of comments when passed an article id.", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then((response) => {
          const {comments} = response.body;
          expect(comments.length).toBe(2);
          expect(comments).toBeSortedBy("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.article_id).toBe("number");
          });
        });
    });
    test("400: Responds with error if article ID is not valid", () => {
      return request(app)
        .get("/api/articles/notValidId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("200: Responds with an empty array if category exists but no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toEqual([]);
        });
    });
  });
});

describe("ANY: /notpath", () => {
  test("404: Responds with error if path not found", () => {
    return request(app)
      .get("/notpath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
