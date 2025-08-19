const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Event = require('../models/Event');
const GuildSettings = require('../models/GuildSettings');
const { getFormattedTime, getFormattedDate } = require('../utils/time');

async function generateDailyCalendarEmbed(guildId, date) {
    const settings = await GuildSettings.findOne({ guildId });
    const timezone = settings?.timezone || 'America/Los_Angeles';

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await Event.find({
        guildId,
        startTime: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ startTime: 'asc' });

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`🗓️ Schedule for ${getFormattedDate(date, timezone)}`)
        .setFooter({ text: `All times are in ${timezone}` });

    let description = '';
    if (events.length === 0) {
        description = 'No events scheduled for today. Time to relax!';
    } else {
        const now = new Date();
        let timeMarkerAdded = false;

        events.forEach((event, index) => {
            if (!timeMarkerAdded && event.startTime > now) {
                description += `\n**\`─────────── 🕙 You are here (${getFormattedTime(now, timezone)}) ───────────\`**\n\n`;
                timeMarkerAdded = true;
            }

            const isCompleted = event.completedBy.length > 0;
            const title = isCompleted ? `~~${event.name}~~ ✅` : `**${event.name}**`;
            const timeRange = `${getFormattedTime(event.startTime, timezone)}${event.endTime ? ' - ' + getFormattedTime(event.endTime, timezone) : ''}`;
            
            description += `**\`${timeRange}\`** - ${title}\n`;
            if (event.location) {
                const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
                description += `> 📍 Location: [${event.location}](${mapsLink})\n`;
            }
            if (event.participants.length > 0) {
                 description += `> 👥 Involved: ${event.participants.map(p => `<@${p}>`).join(', ')}\n`;
            }
            description += '\n';
        });

        if (!timeMarkerAdded) {
            description += `\n**\`─────────── 🕙 You are here (${getFormattedTime(now, timezone)}) ───────────\`**\n`;
        }
    }

    embed.setDescription(description);

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('mute_daily_reminders')
                .setLabel('Toggle Daily Pings')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔇')
        );

    return { embed, row };
}

// New function to update the calendar message dynamically
async function updateDailyCalendar(guild) {
    const settings = await GuildSettings.findOne({ guildId: guild.id });
    if (!settings || !settings.calendarChannelId || !settings.dailyCalendarMessageId) return;

    // Check if the message was for today
    const todayStr = new Date().toLocaleDateString('en-CA');
    if (settings.lastPostedDate !== todayStr) return;

    try {
        const channel = await guild.channels.fetch(settings.calendarChannelId);
        const message = await channel.messages.fetch(settings.dailyCalendarMessageId);
        const { embed } = await generateDailyCalendarEmbed(guild.id, new Date());
        await message.edit({ embeds: [embed] });
    } catch (error) {
        console.error(`Failed to update daily calendar for guild ${guild.id}:`, error);
    }
}


module.exports = { generateDailyCalendarEmbed, updateDailyCalendar };