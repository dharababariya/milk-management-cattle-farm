const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');
const Joi = require('joi');

const addProduct = async (req,res)=>{

    const schema = Joi.object({
        product_name : Joi.string().required(),
        price : Joi.string().required()
    })

    try{
        const newProduct ={ 
            product_name : req.body.product,
            price : req.body.price
        }
        
        const isProductExist= await knex(product).where('product_name',newProduct.product_name).select("id")

        if(isProductExist.length!=0){
            throw new Error('Product is Alrady Availble'); 
        }

        const result = schema.validateAsync(newProduct)
        console.log(result)         
        const output = await knex('public.product').
        console.log(output)     

        res.status(200).json({
            meta: {
                status: '1',
                message: 'Product added'
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



router.post('/addProduct',addProduct);

module.exports =router;