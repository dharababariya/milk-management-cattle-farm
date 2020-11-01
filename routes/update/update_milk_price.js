const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');
const Joi = require('joi');

const updateProductPrice = async (req,res)=>{

    const schema = Joi.object({
        product : Joi.string().required(),
        price : Joi.number().required()
    })

    try{
        const newProductPrice ={ 
            product : req.body.product,
            price : req.body.price                                
        }
        console.log(newProductPrice)

        schema.validateAsync(newProductPrice)

               
        const output = await knex('product').where("product_name", newProductPrice.product).update("price", Number(newProductPrice.price))       

        res.status(200).json({            
            meta: {
                status: '1',
                message: 'Product Price updated'
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



router.put('/update_price',updateProductPrice);

module.exports =router;
