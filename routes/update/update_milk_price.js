const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');
const Joi = require('joi');

const updateProductPrice = async (req,res)=>{

    const schema = Joi.object({
        product : Joi.string().required(),
        Price : Joi.number().required()
    })

    try{
        const newProductPrice ={ 
            product : req.body.product,
            Price : req.body.Price
                                
        }
        schema.validateAsync(newProductPrice)
        const isProductExist= await knex(newProductPrice.product)

        if(isProductExist.length==1){        
            const output = await knex('product').where({Product : newProductPrice.product}).update("Price",newProductPrice.Price)
            
        }

            

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



router.put('/update_product',updateProduct);

module.exports =router;
