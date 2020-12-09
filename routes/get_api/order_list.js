const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");

const getOrderList = async (req, res) => {
    try {
        // get phone_number form body
        const phone_number = Number(req.body.phone_number);

        // get order list from database
        const orderList = await knex("order")
            .where("phone_number", phone_number)
            .select("*");
        if (orderList.length == 0) {
            throw new Error("not found orders");
        }

        return res.status(200).json(orderList);
    } catch (err) {
        return res.status(401).json({
            meta: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};

router.get("/orderList", getOrderList);

module.exports = router;
