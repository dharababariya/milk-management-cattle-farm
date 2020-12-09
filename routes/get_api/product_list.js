const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");

const getProductList = async (req, res) => {
    // get products from database
    const productList = await knex("product").select("product_name", "price");

    return res.send(productList);
};

router.get("/productList", getProductList);

module.exports = router;
