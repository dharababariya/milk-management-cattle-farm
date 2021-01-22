const { Router } = require("express");
const router = Router();
const knex = require("../db/knex");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid"),
    { verifyToken, generateToken } = require("../helper/jwt");

const userRegistration = async (req, res) => {
    // validation schemz
    const schema = Joi.object({
        phone_number: Joi.number().required().min(999999999).max(9999999999),
        password: Joi.string(),
        // .pattern(
        //     new RegExp(
        //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        //     ))
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
        const user = await knex("user_details")
            .select("*")
            .where("phone_number", result.phone_number)
            .andWhere("password", result.password)
            .limit(1);
        //if wrong pass or phone number
        if (user.length < 1) {
            throw new Error("invalid username or Password");
        }
        // if true
        else {
            let token = generateToken(user[0].email, user[0].role);
            return res.status(200).json({
                auth: true,
                token,
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
                success: true,
            });
        }
        //if in use
        else {
            throw new Error("update unsucsessfull");
        }
    } catch (err) {
        return res.status(401).json({
            error: {
                success: false,
                message: `${err}`,
            },
        });
    }
};
const getUser = async (req, res) => {
    const { user } = req;
    let resut = [];
    if (user.role == "customer" || user.role == "vender") {
        resut = await knex("public.user_details")
            .select("*")
            .where("phone_number", user.phone_number);
    } else if (user.role == "admin") {
        resut = await knex("public.user_details").select("*");
    }
    return res.status(200).json(resut);
};
router.put("/updateUser", updateUser);
router.post("/registration", userRegistration);

router.post("/login", userAuthentication);
router.get("/users", getUser);
router.get("/logout", (req, res) => {
    req.logout();
    res.status(200).json({ msg: "logout" });
});
router.get("/", verifyToken, (req, res) => {
    res.end(`<h1>milk-management-cattle-farm-backend<h1>`);
});

module.exports = router;
