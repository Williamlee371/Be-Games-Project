const express = require("express");
const app = express();
const {
	getCategories,
	getReviews,
	getReviewsById,
} = require("./controllers/controllers");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.use("*", (request, response, next) => {
	response.status(404).send({ msg: "not found" });
});
app.use((error, request, response, next) => {
	response.status(500).send({ msg: "server error" });
});
module.exports = app;
