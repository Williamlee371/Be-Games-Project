const format = require("pg-format");
const { fetchData } = require("../models/models");

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

