const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");
const Joi = require("joi");

// new order fuction
const newOrder = async (req, res) => {
    //joi validation schema
    const authSchema = Joi.object({
        phone_number: Joi.number().required().min(999999999).max(9999999999),
        quantity: Joi.required(),
        product: Joi.required(),
    });

    try {
        // get data from body
        let receiveData = {
            phone_number: req.body.phone_number,
            quantity: Number(req.body.quantity),
            product: req.body.product,
        };

        console.debug(receiveData);

        //validate data
        await authSchema.validateAsync(receiveData);
        // get product price from database
        const result = await knex("product")
            .select("price")
            .where("product_name", receiveData.product)
            .limit(1);

        //calculate total order
        const price = parseInt(result[0].price);
        const ans = price * receiveData.quantity;
        receiveData.total = ans;
        receiveData.status = 1;

        // inser in to database
        await knex("order").insert(receiveData);
        
        // send resposnce
        return res.status(202).json({
            meta: {
                status: "1",
                message: `Total : ${receiveData.total}`,
            },
        });
    } catch (err) {
        return res.status(401).json({
            meta: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};

router.post("/newOrder", newOrder);

module.exports = router;
