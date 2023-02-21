const { commentData } = require("../db/data/test-data");
const comments = require("../db/data/test-data/comments");
const { fetchCategories, fetchReviews,fetchComments } = require("../models/models");

exports.getCategories = (request, response, next) => {
	fetchCategories()
		.then((categories) => {
			response.status(200).send({ categories });
		})
		.catch((error) => {
			next(error);
		});
};
exports.getReviews = (request, response, next) => {
	fetchReviews()
		.then((reviews) => {
            fetchComments().then((comments)=>{
                let commentCount=0
                reviews.forEach((review)=>{
                    comments.forEach((comment)=>{
                        if(review.review_id===comment.review_id){
                            commentCount++
                        }
                    })
                    review['comment_count']=commentCount;
                })
                response.status(200).send({ reviews });
            })
		})
		.catch((error) => {
			next(error);
		});
};
