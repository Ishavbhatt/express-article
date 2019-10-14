var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var session = require('express-session');


var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /@/,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

}, {timestamps: true});


// hash password
userSchema.pre('save', function(next) {
    if(this.password) {
        this.password = bcrypt.hashSync(this.password, 10);
        console.log(this);
    };
    next();
});

// Matchpassword
userSchema.methods.matchPassword = function(plainpassword) {
    console.log(plainpassword, this.password);
    return bcrypt.compareSync(plainpassword, this.password);
};

var User = mongoose.model("User", userSchema);
module.exports = User;