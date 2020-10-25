const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');
const Joi = require('joi');

const addProduct = async (req,res)=>{

    const schema = Joi.object({
        product : Joi.string().required()
    })

    try{
        const newProduct ={ product : req.body.product}
        
        const isProductExist= await knex(product)

        if(isProductExist){
            throw new Error('Product is Alrady Availble'); 
        }

        const result = schema.validateAsync(newProduct)
        console.log(result)         
        const output = await knex('public.product').
        console.log(output)     

        res.status(401).json({
            meta: {
                status: '1',
                message: 'Product added '
            },
            
        });
    }
    catch(err){

        res.status(401).json({
            meta: {
                status: '0',
                message: `${err}`
            },
            
        });
    }

}



router.get('/new_product',addProduct);

module.exports =router;