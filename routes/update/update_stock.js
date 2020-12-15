const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");
const Joi = require("joi");

const addProductStock = async (req, res) => {
    //joi validation schema
    const schema = Joi.object({
        product_name: Joi.string().required(),
        quantity: Joi.number().required(),
    });

    try {
        //get data from body
        const newData = {
            product_name: req.body.product_name,
            quantity: req.body.quantity,
        };

        await schema.validateAsync(newData); // validate data

        const currentData = await knex("product")
            .where("product_name", newData.product_name)
            .select("*");
        // check  prosuct is availabele
        if (currentData.length == 0) {
            throw new Error("product not found");
        }
        // sum of current stock and new stock
        const totalQuantity =
            Number(currentData[0].quantity) + Number(newData.quantity);

        await knex("product")
            .update("quantity", totalQuantity)
            .where("product_name", newData.product_name);

        return res.status(201).json({
            data: { totalQuantity },
        });
    } catch (err) {
        return res.status(401).json({
            error: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};
router.put("/addProductStock", addProductStock);

module.exports = router;
