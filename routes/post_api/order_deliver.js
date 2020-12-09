const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");

const orderDelivered = async (req, res) => {
    try {
        // get data frome body
        const { orderId } = req.body;
        // chnage order status
        await knex("order").where("id", orderId).update("status", "1");

        // user order details
        const order = await knex("order")
            .select("phone_number", "total")
            .where("id", orderId);
        //get priviuse bill total
        let pymentTotal = await knex("pyment_details")
            .selec("total")
            .where("phone_number", order.phone_number);

        const total = pymentTotal + order.total; // add new order in bill
        // save new total in bill
        await knex("pyment_details")
            .where("phone_number", order.phone_number)
            .update("total", total);

        return res.status(200).json({
            meta: {
                status: "1",
                message: `${total}`,
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
router.post("/orderDelivered", orderDelivered);

module.exports = router;
