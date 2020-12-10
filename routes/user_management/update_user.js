const express = require("express");
const router = express.Router();
const knex = require("../../helper/knex");
const Joi = require("joi");

const updateUser = async (req, res) => {
    // validation schemz
    const schema = Joi.object({
        phone_number: Joi.number().required().min(999999999).max(9999999999),
        password: Joi.string()
            .required()
            .pattern(
                new RegExp(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                )
            ),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        address: Joi.string().required(),
    });

    try {
        //get data from dody
        let receiveData = {
            phone_number: req.body.phone_number,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
        };

        //validate
        await schema.validateAsync(receiveData);

        //check is user phone number in used
        const isUserExist = await knex("public.user_details")
            .select("*")
            .where("phone_number", receiveData.phone_number);

        const phone_number = receiveData.phone_number;
        delete receiveData["phone_number"];

        //if not in use then
        if (isUserExist.length != 0) {
            await knex("user_details")
                .where("phone_number", phone_number)
                .update(receiveData);

            return res.status(200).json({
                Success: "OK",
            });
        }
        //if in use
        else {
            throw new Error("update unsucsessfull");
        }
    } catch (err) {
        return res.status(401).json({
            meta: {
                status: "0",
                message: `${err}`,
            },
        });
    }
};

router.post("/updateUser", updateUser);

module.exports = router;
