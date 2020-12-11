const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");
const Joi = require("joi");

const updateProductPrice = async (req, res) => {
    //joi validation schema
    const schema = Joi.object({
        product: Joi.string().required(),
        price: Joi.number().required(),
    });

    try {
        // get data from body
        const newProductPrice = {
            product: req.body.product,
            price: req.body.price,
        };

        // validate data
        schema.validateAsync(newProductPrice);
        //update price in database
        await knex("product")
            .where("product_name", newProductPrice.product)
            .update("price", Number(newProductPrice.price));

        return res.status(200).json({
            success: "OK",
        });
    } catch (err) {
        return res.status(400).json({
            meta: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};
router.put("/updateProductPrice", updateProductPrice);

module.exports = router;
