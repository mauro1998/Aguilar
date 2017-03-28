const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    token: String,
    isAdministrator: { type: Boolean, default: false }
});

module.exports = mongoose.model('user', UserSchema);
