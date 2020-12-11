const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");
const Joi = require("joi");

// new order fuction
const newOrder = async (req, res) => {
    //joi validation schema
    const schema = Joi.object({
        phone_number: Joi.number().required().min(999999999).max(9999999999),
        quantity: Joi.number().required(),
        product: Joi.required(),
    });

    try {
        // get data from body
        let receiveData = {
            phone_number: req.body.phone_number,
            quantity: Number(req.body.quantity),
            product: req.body.product,
        };

        //validate data
        await schema.validateAsync(receiveData);
        // get product price from database
        const result = await knex("product")
            .select("price", "quantity")
            .where("product_name", receiveData.product)
            .limit(1);
        if (Number(result[0].quantity) <= 0) {
            throw new Error(`${result[0].product_name} is outof stock`);
        }

        //calculate total order
        const price = parseInt(result[0].price);
        const ans = price * receiveData.quantity;
        receiveData.total = ans;
        receiveData.status = 1;

        // inser in to database
        await knex("order").insert(receiveData);
        const newQuantity = Number(result[0].quantity) - receiveData.quantity;
        await knex("product")
            .update("quantity", newQuantity)
            .where("product_name", "=", receiveData.product);
        // send resposnce
        return res.status(202).json({
            Total: receiveData.total,
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

router.post("/newOrder", newOrder);

module.exports = router;
