const format = require("pg-format");
const db = require("../db/connection");

exports.fetchData = (input, order,direction='DESC') => {
	let queryStr
	if (!order) {
		queryStr = format(`SELECT * FROM ${input};`);
	} else {
		queryStr = format(`SELECT * FROM ${input} ORDER BY ${order} ${direction};`);
	}
	return db.query(queryStr).then((result) => {
		return result.rows;
	});
};
