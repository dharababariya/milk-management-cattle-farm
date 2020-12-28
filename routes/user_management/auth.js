const { Router } = require("express");
const router = Router();
const passport = require('passport')
const local = require("../../helper/passport");

router.post("/singin", passport.authenticate('local'),(req,res)=>{
    res.status(200);
});

module.exports = router;
