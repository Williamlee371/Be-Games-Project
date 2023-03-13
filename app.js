const cors = require('cors');
const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categoriesControllers");
const {
	getReviews,
	getReviewsById,
	getCommentsByReview,
	postComment,
	patchvotes,
} = require("./controllers/reviewsControllers");

app.use(express.json())
app.use(cors())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.get("/api/reviews/:review_id/comments", getCommentsByReview);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id",patchvotes);

app.use((error, request, response, next) => {
	if (error.status && error.msg) {
		response.status(error.status).send({ msg: error.msg });
	} else {
		next(error);
	}
});

app.use((error, request, response, next) => {
	if ((error.code = "22P02")) {
		response.status(400).send({ msg: "bad request" });
	} else {
		next(error);
	}
});

app.use((error, request, response, next) => {
	response.status(500).send({ msg: "server error" });
});

app.use("*", (request, response, next) => {
	response.status(404).send({ msg: "not found" });
});

module.exports = app;
