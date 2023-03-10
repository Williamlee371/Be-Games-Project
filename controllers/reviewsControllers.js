const { fetchData } = require("../models/models");
const {
	fetchReviewsById,
	fetchCommentsByReviews,
	addNewComment,
	incrementVotes,
} = require("../models/reviewsModels.js");

exports.getReviews = (request, response, next) => {
	queryStrReviews = "reviews";
	fetchData(queryStrReviews, "created_at", "DESC")
		.then((reviews) => {
			const queryStrComments = "comments";
			fetchData(queryStrComments).then((comments) => {
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
	const { review_id } = request.params;
	fetchReviewsById(review_id)
		.then((review) => {
			response.status(200).send({ review });
		})
		.catch((error) => {
			next(error);
		});
};

exports.getCommentsByReview = (request, response, next) => {
	const { review_id } = request.params;
	fetchCommentsByReviews(review_id)
		.then((comments) => {
			response.status(200).send({ comments });
		})
		.catch((error) => {
			next(error);
		});
};

exports.postComment = (request, response, next) => {
	const { review_id } = request.params;
	const data = request.body;
	addNewComment(review_id, data)
		.then((comment) => {
			response.status(201).send(comment[0]);
		})
		.catch((error) => {
			next(error);
		});
};

exports.patchvotes = (request, response, next) => {
	const { review_id } = request.params;
	const data = request.body;
	incrementVotes(review_id, data.inc_votes)
		.then((body) => {
			response.status(200).send(body);
		})
		.catch((error) => {
			next(error);
		});
};
