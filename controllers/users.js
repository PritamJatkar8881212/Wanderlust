const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {   
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    if (res.locals.redirectUrl) {
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/listings");
}

module.exports.logout = (req, res, err) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out successfully");
        res.redirect("/listings");
    });
}