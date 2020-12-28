const { Router } = require("express");
const router = Router();
const knex = require("../../helper/knex");
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
        const isProductExist = await knex("product")
            .where("product_name", newProduct.product_name)
            .select("id");
        if (isProductExist.length != 0) {
            throw new Error("Product is Alrady Availble");
        }

        await knex("product").insert(newProduct);

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

router.post("/products", addProduct);

module.exports = router;
