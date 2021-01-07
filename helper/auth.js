module.exports = {
    permit: (...permittedRoles) => {
        // return a middleware
        return (req, res, next) => {
            const { user } = req;
            if (user && permittedRoles.includes(user.role)) {
                return next(); // role is allowed, so continue on the next middleware
            } else {
                return res.status(403).json({ message: "Forbidden" }); // user is forbidden
            }
        };
    },

    forwardAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }

        // res.redirect('/dashboard');  // if auth
        return next();
    },
};
