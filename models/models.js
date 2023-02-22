const db = require("../db/connection");

exports.fetchData=(input)=>{
	return db.query(input).then((result)=>{
		return result.rows
	})
}
