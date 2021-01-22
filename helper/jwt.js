var jwt = require("jsonwebtoken"),
    // knex = require("../db/knex");

verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    // headers["x-access-token"];
    if (typeof bearerHeader === "undefined")
        return res
            .status(403)
            .send({ auth: false, message: "No token provided." });

    const token = bearerHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err)
            return res.status(500).send({
                auth: false,
                message: "Failed to authenticate token.",
            });

        // if everything good, save to request for use in other routes
        req.user = { phone_number: decoded.phone_number, role : decoded.role };
        next();
    });
}

const generateToken = (email, name) => {
    const a = jwt.sign({ email, name }, process.env.SECRET, {
        expiresIn: "300s",
    });
    return a;
};

module.exports = { verifyToken, generateToken };
