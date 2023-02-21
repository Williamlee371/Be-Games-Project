const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

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
