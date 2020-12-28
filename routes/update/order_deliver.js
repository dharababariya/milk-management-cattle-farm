const { Router } = require("express");
const router = Router();
const Joi = require("joi");
const knex = require("../../helper/knex");

const orderDelivered = async (req, res) => {
    const schema = Joi.object({
        orderId: Joi.number().required().min(0),
    });

    try {
        // get data frome body
        const { orderId } = req.body;
        //data validation
        await schema.validateAsync({ orderId });
        // chnage order status
        const op = await knex("order")
            .where({ id: orderId, status: 1 })
            .update("status", "2");
        console.log(op);
        if (op == 0) {
            throw new Error("this order is already delever or canceld");
        }
        // user order details
        const order = await knex("order")
            .select("phone_number", "total")
            .where("id", orderId);
        console.log(order);

        //get priviuse bill total
        const pymentTotal = await knex("payment_details")
            .select("total")
            .where("phone_number", Number(order[0].phone_number));

        console.log(pymentTotal);

        const total = Number(pymentTotal[0].total) + Number(order[0].total); // add new order in bill
        console.log(total);
        // save new total in bill
        await knex("payment_details")
            .update("total", total)
            .where("phone_number", Number(order[0].phone_number));

        return res.status(200).json({
            success: true,
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
router.put("/orderDelivered", orderDelivered);

module.exports = router;
