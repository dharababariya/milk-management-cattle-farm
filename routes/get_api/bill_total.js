const { Router } = require("express");
const router = Router();
const Joi = require("joi");
const knex = require("../../helper/knex");

const getBillTotal = async (req, res) => {
    const schema = Joi.object({
        phone_number: Joi.number().min(999999999).max(9999999999),
    });
    const phone_number = Number(req.query.phone_number);

    try {
        // get total fromr database
        let total ;
        if (phone_number) {
            await schema.validateAsync({ phone_number });
            total = await knex("payment_details")
                .select("*")
                .where("phone_number", phone_number);
        } else {
            total = await knex("payment_details").select("*");
        }
        if(total.length==0){
            throw new Error("NotFound")
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

router.get("/billTotal", getBillTotal);

module.exports = router;
