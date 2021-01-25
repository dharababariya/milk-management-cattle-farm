module.exports = {
    permit: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        // res.redirect('/login')
        return res.status(403).send("Forbidden"); // if not auth
    },

    forward: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        // res.redirect('/dashboard');  // if auth
        return next();
    },
};
