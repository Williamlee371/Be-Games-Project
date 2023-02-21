const db=require('../db/connection')

exports.fetchCategories=()=>{
    return db.query('SELECT * FROM categories').then((result)=>{
        const categories=result.rows
        if(!categories){
            return promise.reject({
                status:404,
                msg:'No categories found'
            })
        }
        return categories
    })
}