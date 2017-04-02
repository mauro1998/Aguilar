const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    token: String,
    isAdministrator: { type: Boolean, default: false },
    registerDate: { type: Date, default: new Date() }
});

module.exports = mongoose.model('user', UserSchema);
