const db = require("../db/connection");
const promise=require('promise')

exports.fetchReviewsById=(id)=>{
	return db.query('SELECT * FROM reviews WHERE review_id=$1',[id]).then((result)=>{
		if(!result.rows[0]){
			return promise.reject({
				status:404,
				msg:'non-existant id'
			})
		}
		return result.rows[0]
	})
}