const { Schema, model } = require('mongoose');

const userPointsSchema = new Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    points: { type: Number, default: 0 },
}, { unique: ['userId', 'guildId'] });

module.exports = model('UserPoints', userPointsSchema);