const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");

const getProductList = async (req, res) => {
    try {
        // get total fromr database
        const {phone_number} = req.body
         
        const total = await knex("payment_details")
            .select("*")
            .where("phone_number", phone_number);

        return res.status(200).send(total[0].total);
    }catch(err){
        return 0
    }
};

router.get("/productList", getProductList);

module.exports = router;
