const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
require("jest-sorted");

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	db.end();
});

describe("Get", () => {
	describe("api/categories", () => {
		test("200-responses with an array of objects", () => {
			return request(app)
				.get("/api/categories")
				.expect(200)
				.then(({ body }) => {
					expect(body["categories"].length).toBe(4);
					body["categories"].forEach((categories) => {
						expect(categories).toMatchObject({
							slug: expect.any(String),
							description: expect.any(String),
						});
					});
				});
		});
	});
	describe("api/reviews", () => {
		test("200-responses with an array of objects", () => {
			return request(app)
				.get("/api/reviews")
				.expect(200)
				.then(({ body }) => {
					expect(body["reviews"].length).toBe(13);
					body["reviews"].forEach((reviews) => {
						expect(reviews).toMatchObject({
							owner: expect.any(String),
							title: expect.any(String),
							review_id: expect.any(Number),
							category: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							designer: expect.any(String),
							comment_count: expect.any(Number),
						});
					});
				});
		});
		test("200-reviews should be sorted by date descending order", () => {
			return request(app)
				.get("/api/reviews")
				.expect(200)
				.then(({ body }) => {
					const reviews = body.reviews;
					expect(reviews).toBeSortedBy("created_at", {
						descending: true,
						coerce: false,
					});
				});
		});
		test("200-each object has comment_count (worked out from the reviews and comments table)", () => {
			return request(app)
				.get("/api/reviews")
				.expect(200)
				.then(({ body }) => {
					expect(body["reviews"][7].comment_count).toEqual(3);
				});
		});
	});
	describe("api/reviews/:review_id", () => {
		test("200-responses with a single object", () => {
			return request(app)
				.get("/api/reviews/1")
				.expect(200)
				.then(({ body }) => {
					expect(body["review"]).toMatchObject({
						review_id: 1,
						title: "Agricola",
						review_body: "Farmyard fun!",
						designer: "Uwe Rosenberg",
						votes: 1,
						category: "euro game",
						owner: "mallionaire",
						created_at: "2021-01-18T10:00:20.514Z",
					});
				});
		});
		test("200-responses with the correct item", () => {
			return request(app)
				.get("/api/reviews/1")
				.expect(200)
				.then(({ body }) => {
					expect(body["review"].review_id).toBe(1);
				});
		});
	});
	describe("api/reviews/review_id/comments", () => {
		test("200-responses with an array of comment objects", () => {
			return request(app)
				.get("/api/reviews/2/comments")
				.expect(200)
				.then(({ body }) => {
					expect(body["comments"].length).toBe(3);
					body["comments"].forEach((comment) => {
						expect(comment).toMatchObject({
							comment_id: expect.any(Number),
							votes: expect.any(Number),
							created_at: expect.any(String),
							author: expect.any(String),
							body: expect.any(String),
							review_id: expect.any(Number),
						});
					});
				});
		});
		test("200-responses in order of created starting with the latest", () => {
			return request(app)
				.get("/api/reviews/2/comments")
				.expect(200)
				.then(({ body }) => {
					const comments = body.comments;
					expect(comments).toBeSortedBy("created_at", {
						descending: true,
						coerce: false,
					});
				});
		});
		test("200-responses with an empty array of comments if given valid by no existant id", () => {
			return request(app)
				.get("/api/reviews/1/comments")
				.expect(200)
				.then(({ body }) => {
					expect(body["comments"]).toEqual([]);
				});
		});
	});
});

describe("Error handling", () => {
	test("404-responses with a error if the user input is incorrect", () => {
		return request(app)
			.get("/api/categorie")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toEqual("not found");
			});
	});
	test("404-responses with an error if a user doesnt input a exsiting id", () => {
		return request(app)
			.get("/api/reviews/100")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toEqual("non-existant id");
			});
	});
	test("404-responses with an error if the user inputs a non-exsiting id (comments)", () => {
		return request(app)
			.get("/api/reviews/100/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toEqual("non-existant id");
			});
	});
	test("400-responses with an error if the user input is not an id", () => {
		return request(app)
			.get("/api/reviews/notanid")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toEqual("bad request");
			});
	});
	test("400-responses with an error if a user input isnt a id (comments)", () => {
		return request(app)
			.get("/api/reviews/noanid/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toEqual("bad request");
			});
	});
});
