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
		test("200-responses with a array with a single object", () => {
			return request(app)
				.get("/api/reviews/1")
				.expect(200)
				.then(({ body }) => {
					expect(body["review"].length).toBe(1);
					body["review"].forEach((review) => {
						expect(review).toMatchObject({
							review_id: expect.any(Number),
							title: expect.any(String),
							review_body: expect.any(String),
							designer: expect.any(String),
							votes: expect.any(Number),
							category: expect.any(String),
							owner: expect.any(String),
							created_at: expect.any(String),
						});
					});
				});
		});
		test('200-responses with the correct item',()=>{
			return request(app).get('/api/reviews/1').expect(200).then(({body})=>{
				body['review'].forEach((review)=>{
					expect(review.review_id).toBe(1)
				})
			})
		})
		test('200-responses with an empty array if input a id that doesnt exist',()=>{
			return request(app).get('/api/reviews/100').expect(200).then(({body})=>{
				expect(body['review']).toEqual([])
			})
		})
	});
});

describe("Error handling", () => {
	test("404-responses with a error if the user input is incorrect", () => {
		return request(app)
			.get("/api/categorie")
			.expect(404)
			.then((result) => {
				expect(result.body.msg).toEqual("not found");
			});
	});
});
