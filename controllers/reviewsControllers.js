const format = require("pg-format");
const {fetchData}=require('../models/models')
const { fetchReviewsById,  } = require("../models/reviewsModels.js");

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

exports.getCommentsByReview=(request,response,next)=>{
	const {review_id}=request.params
	const queryStringComments=format('SELECT * FROM comments ORDER BY created_at DESC')
	fetchData(queryStringComments).then((comments)=>{
		const newArr=[]
		comments.forEach((comment)=>{
			if(comment['review_id']===parseInt(review_id)){
				newArr.push(comment)
			}
		})
		response.status(200).send({comments:newArr})
	})
}
 