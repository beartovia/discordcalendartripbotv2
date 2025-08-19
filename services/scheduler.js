const cron = require('node-cron');
const GuildSettings = require('../models/GuildSettings');
const Event = require('../models/Event');
const { generateDailyCalendarEmbed } = require('./calendar');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function startScheduler(client) {
    // --- Daily Calendar Post Scheduler ---
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const guilds = await GuildSettings.find({ calendarChannelId: { $ne: null } });

        for (const settings of guilds) {
            const [hour, minute] = settings.dailyPostTime.split(':');
            
            // This logic ensures it only runs once per day at the specified time
            const todayStr = now.toLocaleDateString('en-CA');
            if (settings.lastPostedDate === todayStr) continue;

            if (now.getHours() === parseInt(hour, 10) && now.getMinutes() === parseInt(minute, 10)) {
                 try {
                    const channel = await client.channels.fetch(settings.calendarChannelId);
                    if (channel) {
                        const { embed, row } = await generateDailyCalendarEmbed(settings.guildId, now);
                        const reminderRole = settings.reminderRoleId ? `<@&${settings.reminderRoleId}>` : '';
                        const sentMessage = await channel.send({ content: `${reminderRole} Here is the schedule for today!`, embeds: [embed], components: [row] });
                        
                        // Save message ID for dynamic updates
                        settings.dailyCalendarMessageId = sentMessage.id;
                        settings.lastPostedDate = todayStr;
                        await settings.save();
                    }
                } catch (error) {
                    console.error(`Failed to send daily calendar for guild ${settings.guildId}:`, error);
                }
            }
        }
    });

    // --- Event Reminder Scheduler (runs every minute) ---
    cron.schedule('* * * * *', async () => {
       const now = new Date();
       const reminderWindows = [60, 30, 15];

       for (const window of reminderWindows) {
           const reminderTimeStart = new Date(now.getTime() + window * 60000 - 30000);
           const reminderTimeEnd = new Date(now.getTime() + window * 60000 + 30000);

           const eventsToRemind = await Event.find({
               startTime: { $gte: reminderTimeStart, $lte: reminderTimeEnd },
               isUrgent: false,
           });

           for (const event of eventsToRemind) {
               await sendReminder(client, event, window);
           }
       }
        // Urgent event handler (pings every minute for the last 15 minutes)
        const urgentEvents = await Event.find({
            startTime: {
                $gt: now,
                $lte: new Date(now.getTime() + 15 * 60000)
            },
            isUrgent: true,
            isUrgentMuted: false, // Check if globally muted
        });

        for (const event of urgentEvents) {
            const minutesUntil = Math.max(1, Math.round((event.startTime - now) / 60000));
            await sendReminder(client, event, minutesUntil, true);
        }
    });
}

async function sendReminder(client, event, minutesUntil, isUrgent = false) {
    const settings = await GuildSettings.findOne({ guildId: event.guildId });
    if (!settings || !settings.calendarChannelId) return;

    const channel = await client.channels.fetch(settings.calendarChannelId).catch(() => null);
    if (!channel) return;

    // Filter out participants who have muted this specific event
    const participantsToPing = event.participants.filter(p => !event.mutedNotifications.includes(p));
    const pingString = participantsToPing.length > 0 ? participantsToPing.map(id => `<@${id}>`).join(' ') : '';
    
    if (!pingString) return; // Don't send a reminder if no one is left to ping

    const embed = new EmbedBuilder()
        .setTitle(`${isUrgent ? '🚨 URGENT' : '🔔'} Reminder: ${event.name}`)
        .setDescription(`Starts in **~${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}** at <t:${Math.floor(event.startTime.getTime() / 1000)}:t>`)
        .setColor(isUrgent ? '#FF4444' : '#FFBB33')
        .setTimestamp(event.startTime);
    
    if (event.location) embed.addFields({ name: 'Location', value: `[${event.location}](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)})` });
    
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`complete_event:${event._id}`).setLabel('Mark Complete').setStyle(ButtonStyle.Success).setEmoji('✅'),
        new ButtonBuilder().setCustomId(`mute_event_pings:${event._id}`).setLabel('Mute My Pings').setStyle(ButtonStyle.Secondary).setEmoji('🔕')
    );
    
    // Add the "Mute for Everyone" button only for urgent events
    if (isUrgent) {
        row.addComponents(new ButtonBuilder().setCustomId(`mute_urgent_all:${event._id}`).setLabel('Mute All Pings').setStyle(ButtonStyle.Danger));
    }

    await channel.send({ content: pingString, embeds: [embed], components: [row] });
}


module.exports = { startScheduler };