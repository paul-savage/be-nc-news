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
  test("POST:201 successfully creates a topic and returns it to the client", () => {
    const data = {
      slug: "topic name",
      description: "topic description",
    };
    return request(app)
      .post("/api/topics")
      .send(data)
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic.slug).toBe(data.slug);
        expect(topic.description).toBe(data.description);
      });
  });
  test("POST:400 fail to create a topic when given invalid data", () => {
    const data = {
      description: "topic description",
    };
    return request(app)
      .post("/api/topics")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST:400 fail to create a topic when given pre-existing primary key", () => {
    const data = {
      slug: "mitch",
      description: "topic description",
    };
    return request(app)
      .post("/api/topics")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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
  test("GET:200 sends the specified article with a count of all associated comments to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.comment_count).toBe(11);
      });
  });
  test("GET:200 sends the specified article with a count of all associated comments to the client", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.comment_count).toBe(0);
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
  test("DELETE:204 deletes the specified article given a valid id", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("DELETE:404 fails to delete the specified article given a non-existent valid id", () => {
    return request(app)
      .delete("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("DELETE:400 fails to delete the specified article given an invalid id", () => {
    return request(app)
      .delete("/api/articles/notAnArticle")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles?limit=100")
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
          expect(typeof article.total_count).toBe("number");
          expect(article.total_count).toBe(13);
        });
      });
  });
  test("GET:200 sends second page, with page size 9, of array of articles to the client", () => {
    return request(app)
      .get("/api/articles?p=2&limit=9")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(4);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article.total_count).toBe(13);
        });
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid p query", () => {
    return request(app)
      .get("/api/articles?p=invalidPage")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid limit query", () => {
    return request(app)
      .get("/api/articles?limit=invalidLimit")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:200 sends an array of articles filtered by topic to the client", () => {
    return request(app)
      .get("/api/articles?topic=cats&limit=100")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(1);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET:200 sends an array of articles sorted by number of votes in descending order to the client", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&limit=100")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("GET:200 sends an array of articles sorted by number of comments in descending order to the client", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&limit=100")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("comment_count", { descending: true });
      });
  });
  test("GET:200 sends an array of articles sorted by author in descending order to the client", () => {
    return request(app)
      .get("/api/articles?sort_by=author&limit=100")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid sort query", () => {
    return request(app)
      .get("/api/articles?sort_by=notAValidSortQuery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:200 sends an array of articles sorted by number of votes in ascending order to the client", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc&limit=100")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=notAValidOrderQuery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:200 sends an array of articles sorted by default created_at in ascending order to the client", () => {
    return request(app)
      .get("/api/articles?order=asc&limit=100")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("GET:200 sends an array of articles filtered by topic, sorted by title in ascending order to the client", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=title&order=asc&limit=100")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy("title");
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("POST:201 successfully creates an article (without image url) and returns it to the client", () => {
    const data = {
      author: "butter_bridge",
      title: "The title",
      body: "The article body",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(data)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article.author).toBe(data.author);
        expect(article.title).toBe(data.title);
        expect(article.body).toBe(data.body);
        expect(article.article_id).toBe(14);
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe(0);
      });
  });
  test("POST:201 successfully creates an article (with image url) and returns it to the client", () => {
    const data = {
      author: "butter_bridge",
      title: "The title",
      body: "The article body",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(data)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article.author).toBe(data.author);
        expect(article.title).toBe(data.title);
        expect(article.body).toBe(data.body);
        expect(article.article_id).toBe(14);
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe(0);
      });
  });
  test("POST:404 fails to add an article when given an non-existent author/username", () => {
    const data = {
      author: "paul",
      title: "The title",
      body: "The article body",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("POST:404 fails to add an article when given an non-existent topic", () => {
    const data = {
      author: "butter_bridge",
      title: "The title",
      body: "The article body",
      topic: "lacrosse",
    };
    return request(app)
      .post("/api/articles")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("POST:400 fails to add an article when given insufficient parameters", () => {
    const data = {
      author: "butter_bridge",
      body: "The article body",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends the comments associated with specified article to the client", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=100")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 sends the second page of comments associated with specified article to the client", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2&limit=6")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(5);
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
  test("GET:400 sends an appropriate status and error message when given an invalid p query", () => {
    return request(app)
      .get("/api/articles/1/comments?p=invalidPQuery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid limit query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=invalidLimitQuery")
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
  test("POST:400 fails to add a comment when given an invalid id", () => {
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
  test("POST:404 fails to add a comment when given valid but non-existent id", () => {
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
  test("POST:404 fails to add a comment when given valid but non-existent username", () => {
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
  test("PATCH:404 fails to update the specified article's votes when gived a non-existent id", () => {
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
  test("PATCH:400 fails to update the specified article's votes when gived an invalid id", () => {
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
  test("PATCH:400 fails to update the specified article's votes when gived an invalid increment", () => {
    const data = {
      inc_votes: "not a number",
    };
    return request(app)
      .patch("/api/articles/1")
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
  test("DELETE:404 fails to delete the specified comment given a non-existent valid id", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("DELETE:400 fails to delete the specified comment given an invalid id", () => {
    return request(app)
      .delete("/api/comments/notAComment")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH:200 updates the specified comment's votes and returns the updated comment to the client", () => {
    const data = {
      inc_votes: 11,
    };
    return request(app)
      .patch("/api/comments/4")
      .send(data)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.body).toBe(
          " I carry a log — yes. Is it funny to you? It is not to me."
        );
        expect(comment.votes).toBe(-89);
        expect(comment.author).toBe("icellusedkars");
        expect(comment.article_id).toBe(1);
        expect(comment.created_at).toBe("2020-02-23T12:01:00.000Z");
      });
  });
  test("PATCH:404 fails to update the specified comments's votes when gived a non-existent id", () => {
    const data = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/99999")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("PATCH:400 fails to update the specified comments's votes when gived an invalid id", () => {
    const data = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/notAnId")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH:400 fails to update the specified comment's votes when gived an invalid increment", () => {
    const data = {
      inc_votes: "not a number",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/users", () => {
  test("GET:200 sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET:200 sends the specified user to the client", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user.username).toBe("butter_bridge");
        expect(user.name).toBe("jonny");
        expect(user.avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent username", () => {
    return request(app)
      .get("/api/users/paul")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
