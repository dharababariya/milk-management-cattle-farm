const { Router } = require("express");
const router = Router();
const knex = require("../db/knex");
const Joi = require("joi");

const addProduct = async (req, res) => {
    //joi validation schema
    const schema = Joi.object({
        product_name: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
    });

    try {
        //get data from body
        const newProduct = {
            product_name: String(req.body.product),
            price: req.body.price,
            quantity: req.body.quantity,
        };

        await schema.validateAsync(newProduct); // validate data

        // check  prosuct is availabele
        await knex.transaction(async (trx) => {
            const isProductExist = await trx("product")
                .where("product_name", newProduct.product_name)
                .select("id");
            if (isProductExist.length != 0) {
                throw new Error("Product is Alrady Availble");
            }

            await trx("product").insert(newProduct);
        });

        return res.status(201).json({
            success: true,
            message: "Product added",
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
// new order fuction
const newOrder = async (req, res) => {
    //joi validation schema
    const schema = Joi.object({
        phone_number: Joi.number().required().min(999999999).max(9999999999),
        quantity: Joi.number().required(),
        product: Joi.required(),
    });
    const user = req.user;
    try {
        if (user.role == "costomer") {
            var receiveData = {
                phone_number: user.phone_number,
                quantity: Number(req.body.quantity),
                product: req.body.product,
            };
        } else {
            receiveData = {
                phone_number: req.body.phone_number,
                quantity: Number(req.body.quantity),
                product: req.body.product,
            };
        }

        //validate data
        await schema.validateAsync(receiveData);
        // get product price from database
        await knex.transaction(async (trx) => {
            const result = await trx("product")
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
            await trx("order").insert(receiveData);
            const newQuantity =
                Number(result[0].quantity) - receiveData.quantity;
            await trx("product")
                .update("quantity", newQuantity)
                .where("product_name", "=", receiveData.product);
        });
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

router.post("/products", addProduct);
router.post("/order", newOrder);

module.exports = router;
