const { commentData } = require("../db/data/test-data");
const comments = require("../db/data/test-data/comments");
const format = require("pg-format");
const { fetchData, fetchReviewsById } = require("../models/models");

exports.getCategories = (request, response, next) => {
	const queryString = format("SELECT * FROM categories;");
	fetchData(queryString)
		.then((categories) => {
			response.status(200).send({ categories });
		})
		.catch((error) => {
			next(error);
		});
};

exports.getReviews = (request, response, next) => {
	const queryStringReviews = format(
		"SELECT * FROM reviews ORDER BY created_at DESC;"
	);
	fetchData(queryStringReviews)
		.then((reviews) => {
			const queryStringComments = format("SELECT * FROM comments;");
			fetchData(queryStringComments).then((comments) => {
				let commentCount = 0;
				reviews.forEach((review) => {
					comments.forEach((comment) => {
						if (review.review_id === comment.review_id) {
							commentCount++;
						}
					});
					review["comment_count"] = commentCount;
				});
				response.status(200).send({ reviews });
			});
		})
		.catch((error) => {
			next(error);
		});
};

exports.getReviewsById = (request, response, next) => {
	const {review_id} = request.params;
	fetchReviewsById(review_id)
		.then((review) => {
			response.status(200).send({ review });
		})
		.catch((error) => {
			next(error);
		});
};
