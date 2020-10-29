const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');

const getProductList = async (req,res)=>{

    const productList = await knex('product').select('*')

    res.send(productList) 
    res.send()  

}

router.get('/product_list',getProductList);

module.exports =router;