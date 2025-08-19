const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Event = require('../models/Event');
const GuildSettings = require('../models/GuildSettings');
const { getFormattedTime, getFormattedDate } = require('../utils/time');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whotoday')
        .setDescription("Shows today's schedule organized by person."),
    async execute(interaction) {
        await interaction.deferReply();

        const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        const timezone = settings?.timezone || 'America/Los_Angeles';
        const today = new Date();

        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const events = await Event.find({
            guildId: interaction.guild.id,
            startTime: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ startTime: 'asc' });

        if (events.length === 0) {
            return interaction.editReply("No events scheduled for today, so nobody has a personal schedule!");
        }

        const userSchedules = new Map();

        // Populate the map with user schedules
        for (const event of events) {
            for (const participantId of event.participants) {
                if (!userSchedules.has(participantId)) {
                    userSchedules.set(participantId, []);
                }
                userSchedules.get(participantId).push(event);
            }
        }

        if (userSchedules.size === 0) {
             return interaction.editReply("There are events today, but no one is assigned to them yet.");
        }

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`Who's Doing What Today? (${getFormattedDate(today, timezone)})`)
            .setDescription('A breakdown of each member\'s schedule for the day.')
            .setFooter({ text: `All times are in ${timezone}` });
        
        // Fetch members and add fields to the embed
        for (const [userId, userEvents] of userSchedules.entries()) {
            try {
                const member = await interaction.guild.members.fetch(userId);
                const scheduleString = userEvents
                    .map(event => {
                        const timeRange = `\`${getFormattedTime(event.startTime, timezone)}${event.endTime ? ' - ' + getFormattedTime(event.endTime, timezone) : ''}\``;
                        return `${timeRange} ${event.name}`;
                    })
                    .join('\n');
                
                embed.addFields({ name: `👤 ${member.displayName}`, value: scheduleString, inline: false });
            } catch (error) {
                console.warn(`Could not fetch member for ID ${userId}, skipping.`);
            }
        }

        await interaction.editReply({ embeds: [embed] });
    },
};