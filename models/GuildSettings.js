const { Schema, model } = require('mongoose');

const guildSettingsSchema = new Schema({
    guildId: { type: String, required: true, unique: true },
    calendarChannelId: { type: String, default: null },
    reminderRoleId: { type: String, default: null },
    timezone: { type: String, default: 'America/Los_Angeles' }, // PST/PDT
    dailyPostTime: { type: String, default: '08:00' }, // 8 AM
    dailyCalendarMessageId: { type: String, default: null },
    lastPostedDate: { type: String, default: null }, // Store as YYYY-MM-DD string
});

module.exports = model('GuildSettings', guildSettingsSchema);