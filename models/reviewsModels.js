const db = require("../db/connection");

exports.fetchReviewsById=(id)=>{
	return db.query('SELECT * FROM reviews WHERE review_id=$1',[id]).then((result)=>{
		return result.rows[0]
	})
}