const db = require("../db/connection");
const promise = require("promise");

exports.fetchReviewsById = (id) => {
	return db
		.query("SELECT * FROM reviews WHERE review_id=$1", [id])
		.then((result) => {
			if (!result.rows[0]) {
				return promise.reject({
					status: 404,
					msg: "non-existant id",
				});
			}
			return result.rows[0];
		});
};

exports.fetchCommentsByReviews = (id) => {
	return this.checkIdExists(id).then(() => {
		return db
			.query(
				"SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at DESC",
				[id]
			)
			.then((result) => {
				return result.rows;
			});
	});
};

exports.checkIdExists = (id) => {
	return db
		.query("SELECT * FROM reviews WHERE review_id=$1", [id])
		.then((result) => {
			if (!result.rows[0]) {
				return promise.reject({
					status: 404,
					msg: "non-existant id",
				});
			}
		});
};
