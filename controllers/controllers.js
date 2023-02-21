const {fetchCategories}=require('../models/models')

exports.getCategories=(request,response,next)=>{
    fetchCategories().then((categories)=>{
        response.status(200).send({categories})
    }).catch((error)=>{
        next(error);
    })
}