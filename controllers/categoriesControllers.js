const format = require("pg-format");
const { fetchData } = require("../models/models");

exports.getCategories = (request, response, next) => {
	const queryStr='categories'
	fetchData(queryStr)
		.then((categories) => {
			response.status(200).send({ categories });
		})
		.catch((error) => {
			next(error);
		});
};

