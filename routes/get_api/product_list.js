const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');

const getProductList = async (req,res)=>{

    const productList = await knex('product').select("product_name","price")

    res.send(productList) 
    res.end()  

}

router.get('/productList',getProductList);

module.exports =router;