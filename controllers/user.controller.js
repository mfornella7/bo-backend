const { User } = require("../models/user.model");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function placeBet(req, res, next) {
    try {
        if (req.body.amount > req.userModel.balance) {
            return res.status(400).send("Trade amount should be less than your balance.");
        }
        if ( Math.random() < 0.5)
            req.userModel.balance = Number(req.userModel.balance) + Number(req.body.amount);
        else
            req.userModel.balance = Number(req.userModel.balance) - Number(req.body.amount);
        const updatedUser = await req.userModel.save();
        const returnedUser = updatedUser.toObject();
        delete returnedUser.password;
        res.json(returnedUser);
    } catch (error) {
        next(error);
    }
}

async function depositToBalance(req, res, next) {
    try {        
        const updatedUser = await req.userModel.save();
        const returnedUser = updatedUser.toObject();
        delete returnedUser.password;
        res.json(returnedUser);
    } catch (error) {
        next(error);
    }
}

async function getUserById(req, res, next, id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      req.userModel = user;
      next();
    } catch (error) {
      next(error);
    }
}

module.exports = {
    placeBet,
    getUserById
}