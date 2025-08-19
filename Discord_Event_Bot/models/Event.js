const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    guildId: { type: String, required: true },
    creatorId: { type: String, required: true },
    name: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null, required: false }, // Corrected: not required
    isAllDay: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    location: { type: String, default: null },
    participants: [{ type: String }],
    completedBy: [{ type: String }],
    mutedNotifications: [{ type: String }],
    isUrgentMuted: { type: Boolean, default: false },
    messageId: { type: String, default: null },
});

module.exports = model('Event', eventSchema);