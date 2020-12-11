const express = require("express");
const router = express.Router();
const Joi = require('joi')
const knex = require("../../helper/knex");

const getBillTotal = async (req, res) => {
    const schema = Joi.object({
        phone_number: Joi.number().required().min(999999999).max(9999999999),
    })
    try {
        // get total fromr database
        const {phone_number} = req.body
        await schema.validateAsync({phone_number});

        const total = await knex("payment_details")
            .select("*")
            .where("phone_number", phone_number);

        return res.status(200).send(total[0].total);
    }catch(err){
        return res.status(404).json({
            error: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};

router.get("/billTotal", getBillTotal);

module.exports = router;
