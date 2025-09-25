let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});
module.exports = new mongoose.model('category', schema);