const { Router } = require("express");
const router = Router();
const knex = require("../../helper/knex");

const getOrderList = async (req, res) => {
    const phone_number = Number(req.query.phone_number);
    const q = req.query.q;
    try {
        // get phone_number form body
        let orderList = {};
        if (q) {
            if (typeof q === "string") {
                if (q == "cancaled") {
                    orderList = await knex("order")
                        .where("phone_number", phone_number)
                        .select("*")
                        .where("status", "0");
                } else if (q == "delivered") {
                    orderList = await knex("order")
                        .where("phone_number", phone_number)
                        .select("*")
                        .where("status", "2");
                } else if (q === "placed") {
                    orderList = await knex("order")
                        .where("phone_number", phone_number)
                        .select("*")
                        .where("status", "1");
                } else if (Number(q)) {
                    orderList = await knex("order")
                        .where("phone_number", phone_number)
                        .select("*")
                        .where("id", Number(q));
                }
            }
        } else {
            orderList = await knex("order")
                .where("phone_number", phone_number)
                .select("*");
        }

        if (orderList.length === 0) {
            throw new Error("Not found order");
        }
        return res.status(200).json(orderList);
    } catch (err) {
        return res.status(401).json({
            error: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};

router.get("/orders", getOrderList);

router.get("/get", (req, res) => {
    const { phone_number, q } = req.query;
    console.log(phone_number, q);
    res.end();
});

module.exports = router;
