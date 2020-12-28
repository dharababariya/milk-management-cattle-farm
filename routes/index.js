const { Router } = require("express");
const router = Router();
// routs
router.use("/", require("./user_management/user_registration"));
router.use("/", require("./user_management/user_login"));
router.use("/", require("./user_management/update_user"));


// router.use("/", require("./get_api/product_list"));
router.use("/", require("./get_api/bill_total"));
router.use("/", require("./get_api/orders"));
router.use("/", require("./get_api/product_list"));



router.use("/", require("./post_api/add_product"));
router.use("/", require("./post_api/new_order"));

router.use("/", require("./update/order_deliver"));
router.use("/", require("./update/cancel_order"));
router.use("/", require("./update/update_price"));
router.use("/", require("./update/update_stock"));

module.exports = router;