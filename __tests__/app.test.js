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
});
describe("GET /api/topics", () => {
  test("200: Responds an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
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
  test("200: Responds with an array of all articles when no query passed.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
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
  test("200: Responds with an array of all articles with total comment count for each article ID.", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { ascending: true });
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
});
describe("GET: Article Sorting: Responds with an array of all articles sorted by any column in any order", () => {
  test("200: Sorted by: Title:ASC", () => {
    return request(app)
      .get(`/api/articles?sort_by=title&order=asc`)
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("title", { ascending: true });
      });
  });
  test("200: Sorted by: Title:DESC", () => {
    return request(app)
      .get(`/api/articles?sort_by=title&order=desc`)
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: Sorted by: Author:ASC", () => {
    return request(app)
      .get(`/api/articles?sort_by=author&order=asc`)
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("author", { ascending: true });
      });
  });
  test("200: Sorted by: Topic:DESC", () => {
    return request(app)
      .get(`/api/articles?sort_by=topic&order=desc`)
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("200: Sorted by: Article ID:ASC", () => {
    return request(app)
      .get(`/api/articles?sort_by=article_id&order=asc`)
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("article_id", { ascending: true });
      });
  });
  test("200: Sorted by: Votes:DESC", () => {
    return request(app)
      .get(`/api/articles?sort_by=votes&order=desc`)
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes", { descending: true });
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
  test("400: Responds with error if sort query entered is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=iguana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort input");
      });
  });
  test("400: Responds with error if order query entered is not valid", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order");
      });
  });
});
describe("GET: TOPIC QUERY", () => {
  test("200: Responds with all articles of a given topic", () => {
    return request(app)
      .get(`/api/articles?topic=cats`)
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("404: Responds with error if topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=trees")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Topic 'trees' does not exist`);
      });
  });
  test("200: Responds with an empty array if topic exists but no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
});
describe("GET: /api/articles/:article_id", () => {
  test("200: Responds with an individual article object when passed an article id.", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
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
  test("200: Responds with an individual article object with comment count when passed an article id.", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(3);
        expect(article.title).toBe("Eight pug gifs that remind me of mitch");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(article.body).toBe("some gifs");
        expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(article.votes).toBe(0);
        expect(article.comment_count).toBe(2);
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
    .get("/api/articles/9999999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found!");
    });
});
})
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
describe("GET: /api/users", () => {
  test("200: Responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("200: Responds with an array of all users sorted in ascending order by username", () => {
    return request(app)
      .get("/api/users?sort_by=username&order=asc")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        expect(users).toBeSortedBy("username", { ascending: true });
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("400: Responds with error if sort query entered is not valid", () => {
    return request(app)
      .get("/api/users?sort_by=cats")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort input");
      });
  });
  test("400: Responds with error if order query entered is not valid", () => {
    return request(app)
      .get("/api/users?order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order");
      });
  });
});
describe("GET: /api/users/:username", () => {
  test("200: Responds with an individual user profile when a username is passed", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: "butter_bridge",
              name: "jonny",
              avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            })
          );
        });
      });
  test("400: Responds with error if invalid username input", () => {
    return request(app)
      .get("/api/users/inv lid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid username");
      });
  });
  test("404: Responds with error if username not exist", () => {
    return request(app)
      .get("/api/users/charming_beetle")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
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
  test("400: Responds with error if missing properties in request body", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing properties in request body");
      });
  });
  test("400: Responds with error if article ID invalid", () => {
    return request(app)
      .patch("/api/articles/notValid")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article id");
      });
  });
});
describe("POST: /api/articles/:article_id/comments", () => {
  test("201: Creates a new comment object and inserts the comment into the database, responding with the inserted comment.", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        body: "Testing, testing, testing",
        username: "rogersop",
      })
      .expect(201)
      .then(({ body: { newComment } }) => {
        expect(newComment).toHaveProperty("article_id", 4);
        expect(newComment).toHaveProperty(
          "article_title",
          "Student SUES Mitch!"
        );
        expect(newComment).toHaveProperty("body", "Testing, testing, testing");
        expect(newComment).toHaveProperty("author", "rogersop");
        expect(newComment).toHaveProperty("comment_id");
        expect(newComment).toHaveProperty("created_at");
        expect(newComment).toHaveProperty("votes", 0);
      });
  });
  test("400: Responds with error if no username", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        username: "",
        body: "Testing, testing, testing",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Username required");
      });
  });
  test("400: Responds with error if no body", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        username: "rogersop",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Body is required");
      });
  });
  test("404: Responds with error if username does not exist in database", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        body: "Testing, testing 123..",
        username: "charming_beetle",
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
})