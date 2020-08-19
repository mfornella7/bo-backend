const bcrypt    = require('bcrypt');
const Joi       = require('joi');
const jwt       = require('jsonwebtoken');
const mongoose  = require('mongoose');

const config    = require('../config');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 100,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 255,
    },
    currency: {
        type: Number,
        default: 1
    }
});

UserSchema.methods.createAuthToken = function createAuthToken() {
    const token = jwt.sign({ _id: this._id}, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES,
    });
    return token;
};

UserSchema.methods.encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

UserSchema.methods.checkValidity = function checkValidity(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.pre("save", function (next) {
    if (this.password && this.isModified("password")) {
        this.password = this.encryptPassword(this.password);
        next();
    } else {
        next();
    }
});
    
const User = mongoose.model("User", UserSchema);

const validateUser = (user) => {
    const schema = {
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(6).max(50).required(),
        currency: Joi.number().optional().min(0).max(1).default(0),
    };

    return Joi.validate(user, schema);
};
  
const validateUpdateUser = (user) => {
    const schema = {
        email: Joi.string().min(5).max(50).optional().email(),
        password: Joi.string().min(6).max(50).optional(),
        currency: Joi.number().optional().min(0).max(1).default(0),
    };
  
    return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validateUser;
exports.validateUpdate = validateUpdateUser;