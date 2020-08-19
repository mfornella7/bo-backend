const { User, validate, validateUpdate } = require('../models/user.model');

async function logIn(req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(!user) {
            return res.status(404).send("User not found");
        }

        if(user.checkValidity(req.body.password)) {
            const token = user.createAuthToken();
            res.json({
                info: {
                    _id: user._id,
                    email: user.email,
                    currency: user.currency
                },
                token,
            });
        } else {
            res.status(401).send("Invalid credential");
        }
    } catch (error) {
        res.status(500).send("Interel server error");
        next(error);
    }
}

async function signUp(req, res, next) {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("This email already has been used.");

        user = new User({
            email: req.body.email,
            password: req.body.password,
            currency: req.body.currency
        });
        await user.save();
        res.status(200).send("Your account has been successfully created.");
    } catch (error) {
        res.status(500).send("Interel server error");
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const { error } = validateUpdate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const user = await User.findOne({ _id: req.user._id });
        Object.assign(user, req.body);
        const updatedUser = await user.save();
        const token = updatedUser.createAuthToken();
        res.json({
        info: {
            _id: updatedUser._id,
            email: updatedUser.email,
            currency: updatedUser.currency,
        },
        token,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    logIn,
    signUp,
    update
}