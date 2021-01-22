module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        // res.redirect('/login')
        return res.status(403).send("Forbidden"); // if not auth
    },

    forwardAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }

        // res.redirect('/dashboard');  // if auth
        return next();
    },
};
