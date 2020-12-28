const { Router } = require("express");
const router = Router();
const knex = require("../../helper/knex");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const userRegistration = async (req, res) => {
    // validation schemz
    const schema = Joi.object({
        phone_number: Joi.number().required().min(999999999).max(9999999999),
        password: Joi.string().pattern(
            new RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
        ),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        address: Joi.string().required(),
        role: Joi.string(),
    });

    try {
        //get data from dody
        let receiveData = {
            phone_number: Number(req.body.phone_number),
            password: String(req.body.password),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            role: req.body.role,
        };

        //validate
        await schema.validateAsync(receiveData);

        //check is user phone number in used
        const isUserExist = await knex("public.user_details")
            .select("*")
            .where("phone_number", receiveData.phone_number);

        //if not in use then
        if (isUserExist.length == 0) {
            receiveData.id = uuidv4();
            await knex("user_details").insert(receiveData);
            await knex("payment_details").insert({
                phone_number: receiveData.phone_number,
                total: 0,
            });
            return res.status(201).json({
                success: true,
            });
        }
        //if in use
        else {
            return res.status(400).json({ error: "User already exists" });
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

router.post("/registration", userRegistration);

module.exports = router;
