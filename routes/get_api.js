const { Router } = require("express");
const router = Router();
const knex = require("../helper/knex");
const auth = require("../helper/auth");

const getBillTotal = async (req, res) => {
    const user = req.user;
    try {
        let total;
        if (user.role == "customer") {
            // get total fromr database
            if (user.phone_number) {
                total = await knex("payment_details")
                    .select("*")
                    .where("phone_number", Number(user.phone_number));
            }
        } else {
            total = await knex("payment_details").select("*");
        }
        if (total.length == 0) {
            throw new Error("NotFound");
        }
        return res.status(200).send(total);
    } catch (err) {
        return res.status(404).json({
            error: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};
const getOrderList = async (req, res) => {
    const user = req.user;
    const q = req.query.q;
    console.log(q);
    var orderList = {};
    try {
        if (user.role == "customer") {
            if (q) {
                if (typeof q === "string") {
                    if (q == "cancaled") {
                        orderList = await knex("order")
                            .where("phone_number", user.phone_number)
                            .select("*")
                            .where("status", "0");
                    } else if (q == "delivered") {
                        orderList = await knex("order")
                            .where("phone_number", user.phone_number)
                            .select("*")
                            .where("status", "2");
                    } else if (q === "placed") {
                        orderList = await knex("order")
                            .where("phone_number", user.phone_number)
                            .select("*")
                            .where("status", "1");
                    } else if (Number(q)) {
                        orderList = await knex("order")
                            .where("phone_number", user.phone_number)
                            .select("*")
                            .where("id", Number(q));
                    }
                }
            } else {
                orderList = await knex("order")
                    .where("phone_number", Number(user.phone_number))
                    .select("*");
            }
        } else {
            if (q) {
                if (typeof q === "string") {
                    if (q == "cancaled") {
                        orderList = await knex("order")
                            .select("*")
                            .where("status", "0");
                    } else if (q == "delivered") {
                        orderList = await knex("order")
                            .select("*")
                            .where("status", "2");
                    } else if (q === "placed") {
                        orderList = await knex("order")
                            .select("*")
                            .where("status", "1");
                    } else if (Number(q)) {
                        orderList = await knex("order")
                            .select("*")
                            .where("id", Number(q));
                    }
                }
            } else {
                orderList = await knex("order").select("*");
            }
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

const getProductList = async (req, res) => {
    // get products from database
    const productList = await knex("product").select("product_name", "price");

    return res.status(200).send(productList);
};

router.get(
    "/billTotal",
    auth.ensureAuthenticated("customer", "admin"),
    getBillTotal
);
router.get(
    "/orders",
    auth.ensureAuthenticated("customer", "admin"),
    getOrderList
);
router.get("/productList", getProductList);

module.exports = router;
