const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");
const Joi = require("joi");

//user login validation fuction
const userAuthentication = async (req, res) => {
    //joi validation schema for login data
    const schema = Joi.object({
        phone_number: Joi.number().required().min(999999999).max(9999999999),
        password: Joi.string().required(),
    });
    try {
        // validate data
        const result = await schema.validateAsync(req.body);

        //check user in database
        const isUserExist = await knex("user_details")
            .select("*")
            .where("phone_number", result.phone_number)
            .andWhere("password", result.password)
            .limit(1);
        //if wrong pass or phone number
        if (isUserExist.length < 1) {
            throw new Error("invalid username or Password");
        }
        // if true
        else {
            return res.status(200).json({
                success: true,
                message: `Hello ${isUserExist[0].first_name}.`,
            });
        }
    } catch (err) {
        return res.status(401).json({
            error: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};
router.post("/login", userAuthentication);

module.exports = router;
