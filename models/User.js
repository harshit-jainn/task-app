
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('age not valid');
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email not valid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.trim().length <= 6) {
                throw new Error('password is small')
            }
            if (value.indexOf('password') > -1) {
                throw new Error('password cannot have password string')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        } 
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'user'
});

userSchema.methods.generateToken = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id.toString()}, process.env.AUTH_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('invalid credentials');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('invalid credentials');
    }
    return user;

};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user['password'] = await bcrypt.hash(user['password'], 8);
    }
    next();
});

userSchema.methods.toJSON = function () {
    let user = this.toObject();

    delete user.tokens;
    delete user.password;

    return user;
}


const User = mongoose.model('User', userSchema);

module.exports = User;