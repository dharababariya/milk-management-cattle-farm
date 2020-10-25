const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');
const Joi = require('joi');


const newOrder = async(req,res)=>{


    const authSchema = Joi.object({
        phone_number : Joi
                        .number()
                        .required()
                        .min(999999999)
                        .max(9999999999),
        amount : Joi.required(),
        product : Joi.required()    
    })
    try{

        let receiveData={
            phone_number : req.body.phone_number,
            amount : req.body.amount,
            product : req.body.product
        }

        const result = await knex ('product').select('price').where('product_name',receiveData.product);
        const price = parseInt(result[0].price)

        const ans= price * receiveData.amount;

        receiveData.total=ans;

        const op = await knex ('order').insert(receiveData);

        res.status(200).json({
            meta: {
                status: '1',
                message: `Total : ${receiveData.total}`
            },
            
        });
        res.end()


    }catch(err){

        res.status(401).json({
            meta: {
                status: '0',
                message: `${err}`
            },
            
        });

        res.end()
    }

}

router.post('/newOrder',newOrder);

module.exports =router;
