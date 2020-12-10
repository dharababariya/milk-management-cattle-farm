const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");
const Joi = require("joi");

const bill = async (req, res) => {
    const authSchema = Joi.object({
        startDate: Joi.required(),
        endDate: Joi.required(),
    });

    try {
        const receiveData = {
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        };
    await authSchema.validateAsync(receiveData);
    
    } catch (err) {
        return res.status(401).json({
            meta: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};
router.post("/bill", bill);

module.exports = router;
