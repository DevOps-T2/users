const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const povprasevanjeSchema = new Schema({
    placnik:        { type: mongoose.Schema.Types.ObjectId, required: true, ref:"placniki"},
    datum:          { type: Date, required: true},
    status:         { type: String, required: true},
    skupaj:         { type: Number, required: true},
    izdelki:        { type: [Object], required: true}
}, { timestamps: true });

const povprasevanjeModel = mongoose.model('povprasevanja', povprasevanjeSchema, 'povprasevanja');

module.exports = povprasevanjeModel;