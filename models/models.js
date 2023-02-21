const db = require("../db/connection");

exports.fetchCategories = () => {
	return db.query("SELECT * FROM categories").then((result) => {
		const categories = result.rows;
		return categories;
	});
};

exports.fetchReviews = () => {
	return db.query("SELECT * FROM reviews ORDER BY created_at DESC").then((result) => {
		const reviews = result.rows;
		return reviews;
	});
};

exports.fetchComments = () => {
	return db.query("SELECT * FROM comments").then((result) => {
		const comments = result.rows;
		return comments;
	});
};
