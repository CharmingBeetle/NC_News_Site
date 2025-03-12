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
        .then(({ body: { article } }) => {
          //rather than reponse.body.article

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
  describe("GET: /api/article/:article_id/comments", () => {
    test("200: Responds with an array of comments when passed an article id.", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
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
});
describe("PATCH: /api/articles/:article_id", () => {
  test("200: Successfully updated an article of a given ID vote property when passed an increase vote object.", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(10);
      });
  });
  test("400: Responds with error if vote input not invalid", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: "cats" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("404: Responds with error if article ID doesn't exist", () => {
    return request(app)
      .patch("/api/articles/99999")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article 99999 not found");
      });
  });
});
describe("POST: /api/articles/:article_id/comments", () => {
  test("201: Creates a new comment object and inserts the comment into the database, responding with the inserted comment.", () => {
    const timestamp = new Date();
    const timestampStr = timestamp.toISOString();
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        article_title: "Hello from test",
        body: "Testing, testing, testing",
        votes: 7,
        author: "rogersop",
        created_at: timestamp,
      })
      .expect(201)
      .then(({ body: { newComment } }) => {
        const {
          article_id,
          comment_id,
          article_title,
          body,
          votes,
          author,
          created_at,
        } = newComment;
        expect(article_id).toBe(4);
        expect(article_title).toBe("Hello from test");
        expect(comment_id).toBe(19);
        expect(body).toBe("Testing, testing, testing");
        expect(votes).toBe(7);
        expect(author).toBe("rogersop");
        expect(created_at).toBe(timestampStr);
      });
  });
  test("400: Responds with error if input invalid", () => {
    const timestamp = new Date();

    return request(app)
      .post("/api/articles/4/comments")
      .send({
        article_title: 800,
        body: 600,
        votes: 7,
        author: "rogersop",
        created_at: timestamp,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("404: Responds with error if username not found", () => {
    const timestamp = new Date();

    return request(app)
      .post("/api/articles/4/comments")
      .send({
        article_title: "Test",
        body: "Testing, testing 123..",
        votes: 7,
        author: "charming_beetle",
        created_at: timestamp,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User charming_beetle not found");
      });
  });
});
describe("DELETE: /api/comments/:comments", () => {
  test("204: Deletes an existing comment object given comment ID.", () => {
    return request(app)
      .delete("/api/comments/8")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("400: Responds with error if invalid ID", () => {
    return request(app)
      .delete("/api/comments/notValid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with error if comment not found", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
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
