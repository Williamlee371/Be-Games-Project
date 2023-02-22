const db = require("../db/connection");

exports.fetchData=(input)=>{
	return db.query(input).then((result)=>{
		return result.rows
	})
}

exports.fetchReviewsById=(id)=>{
	return db.query('SELECT * FROM reviews WHERE review_id=$1',[id]).then((result)=>{
		return result.rows
	})
}
