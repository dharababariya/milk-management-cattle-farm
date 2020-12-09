const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");
const Joi = require("joi");

// new order fuction
const cancelOrder = async (req, res) => {
    //joi validation schema
    const authSchema = Joi.object({
        id: Joi.number().required(),
    });

    try {
        // get data from body
        const { id } = req.body;
        //validate data
        await authSchema.validateAsync({ id });

        // get product price from database
        const result = await knex("order")
            .select("*")
            .where("id", id)
            .limit(1);

        if (result[0].status == 2) {
            throw new Error("your order is deleverd ");
        }

        if (result[0].status == 0) {
            throw new Error("your order is alrady canceled  ");
        }

        // inser in to database
        await knex("order").where("id", id).update({ status: 0 });

        // send resposnce
        return res.status(202).json({
            meta: {
                status: "1",
                message: `order cancle`,
            },
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

router.post("/cancelOrder", cancelOrder);

module.exports = router;
