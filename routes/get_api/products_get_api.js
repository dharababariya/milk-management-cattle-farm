const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');

const getProductList = async (req,res)=>{

    const productList = await knex('public.product').select('*')

    res.send(productList) 
    res.send()  

}

router.get('/login',getProductList);

module.exports =router;