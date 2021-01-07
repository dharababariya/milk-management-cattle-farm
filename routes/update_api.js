const { Router } = require("express");
const router = Router();
const Joi = require("joi");
const knex = require("../helper/knex");
const auth = require("../helper/auth");

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
        await knex.transaction(async (trx) => {
            const op = await trx("order")
                .where({ id: orderId, status: 1 })
                .update("status", "2");
            console.log(op);
            if (op == 0) {
                throw new Error("this order is already delever or canceld");
            }
            // user order details
            const order = await trx("order")
                .select("phone_number", "total")
                .where("id", orderId);
            console.log(order);

            //get priviuse bill total
            const pymentTotal = await trx("payment_details")
                .select("total")
                .where("phone_number", Number(order[0].phone_number));

            console.log(pymentTotal);

            const total = Number(pymentTotal[0].total) + Number(order[0].total); // add new order in bill
            console.log(total);
            // save new total in bill
            await trx("payment_details")
                .update("total", total)
                .where("phone_number", Number(order[0].phone_number));

            return res.status(200).json({
                success: true,
            });
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

const cancelOrder = async (req, res) => {
    //joi validation schema
    const authSchema = Joi.object({
        orderId: Joi.number().required(),
    });
    try {
        // get data from body
        const { orderId } = req.body;
        //validate data
        await authSchema.validateAsync({ orderId });
        await knex.transaction(async (trx) => {
            // get order deatils  from database
            const orderData = await trx("order")
                .select("*")
                .where("id", orderId)
                .limit(1);

            //check order status
            if (orderData[0].status == 2) {
                throw new Error("your order is deleverd ");
            }

            if (orderData[0].status == 0) {
                throw new Error("your order is alrady canceled  ");
            }

            // inser in to database
            await trx("order").where("id", orderId).update({ status: 0 });

            // update product Quantity in product table
            const currentData = await trx("product")
                .select("*")
                .where("product_name", orderData[0].product);

            const newQuantity =
                Number(currentData[0].quantity) + Number(orderData[0].quantity);

            await trx("product")
                .update("quantity", newQuantity)
                .where("product_name", orderData[0].product);

            // send resposnce
            return res.status(202).json({
                message: "order succsesfully canceled",
            });
        });
    } catch (err) {
        return res.status(400).json({
            error: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};

const updateProductPrice = async (req, res) => {
    //joi validation schema
    const schema = Joi.object({
        product: Joi.string().required(),
        price: Joi.number().required(),
    });

    try {
        // get data from body
        const newProductPrice = {
            product: req.body.product,
            price: req.body.price,
        };

        // validate data
        schema.validateAsync(newProductPrice);
        //update price in database
        await knex("product")
            .where("product_name", newProductPrice.product)
            .update("price", Number(newProductPrice.price));

        return res.status(200).json({
            success: true,
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

router.put(
    "/addProductStock",
    auth.permit("admin"),
    addProductStock
);
router.put(
    "/updateProductPrice",
    auth.permit("admin"),
    updateProductPrice
);
router.put(
    "/cancelOrder",
    auth.permit("customer", "admin", "vendor"),
    cancelOrder
);
router.put(
    "/orderDelivered",
    auth.permit("vendor"),
    orderDelivered
);

module.exports = router;
