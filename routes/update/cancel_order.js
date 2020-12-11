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

        // get order deatils  from database
        const orderData = await knex("order")
            .select("*")
            .where("id", id)
            .limit(1);

        //check order status
        if (orderData[0].status == 2) {
            throw new Error("your order is deleverd ");
        }

        if (orderData[0].status == 0) {
            throw new Error("your order is alrady canceled  ");
        }

        // inser in to database
        await knex("order").where("id", id).update({ status: 0 });

        // update product Quantity in product table
        const currentData = await knex("product").select('*').where('product_name',orderData[0].product)

        const newQuantity = Number(currentData[0].quantity)+Number(orderData[0].quantity)

        await knex('product').update('quantity',newQuantity).where('product_name',orderData[0].product)

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

router.put("/cancelOrder", cancelOrder);

module.exports = router;
