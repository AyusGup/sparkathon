const mongoose = require('mongoose');

const kioskSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    location : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Kiosk', kioskSchema);