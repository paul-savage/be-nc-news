const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET:200 sends an object describing all available endpoints on the API to the client", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 sends the specified article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
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

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends the comments associated with specified article to the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 sends an empty array for a valid article with no comments to the client", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(0);
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST:201 successfully adds a comment for the specified article", () => {
    const data = {
      username: "butter_bridge",
      body: "The comment body",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(data)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.author).toBe(data.username);
        expect(comment.body).toBe(data.body);
      });
  });
  test("POST:400 unsuccessfully adds a comment when given an invalid id", () => {
    const data = {
      username: "butter_bridge",
      body: "The comment body",
    };
    return request(app)
      .post("/api/articles/notAnId/comments")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST:404 unsuccessfully adds a comment when given valid but non-existent id", () => {
    const data = {
      username: "butter_bridge",
      body: "The comment body",
    };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("POST:404 unsuccessfully adds a comment when given valid but non-existent username", () => {
    const data = {
      username: "paul",
      body: "The comment body",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("PATCH:200 updates the specified article's votes and returns the updated article to the client", () => {
    const data = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(data)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(101);
      });
  });
  test("PATCH:404 unsuccessfully updates the specified article's votes when gived a non-existent id", () => {
    const data = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/99999")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("PATCH:400 unsuccessfully updates the specified article's votes when gived an invalid id", () => {
    const data = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/notAnId")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes the specified comment given a valid id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE:404 unsuccessfully deletes the specified comment given a non-existent valid id", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("DELETE:400 unsuccessfully deletes the specified comment given an invalid id", () => {
    return request(app)
      .delete("/api/comments/notAComment")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
