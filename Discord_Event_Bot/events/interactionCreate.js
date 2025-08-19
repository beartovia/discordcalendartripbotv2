const { Events, InteractionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');
const Event = require('../models/Event');
const { addPoint } = require('../services/points');
const { updateDailyCalendar } = require('../services/calendar');
const chrono = require('chrono-node');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`, error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            const [action, ...params] = interaction.customId.split(':');

            // --- Settings Buttons ---
            if (action.startsWith('settings_')) {
                const settingsAction = action.split('_')[1];
                let modal;
                switch(settingsAction) {
                    case 'set':
                        const subAction = action.split('_')[2];
                        if (subAction === 'channel') {
                            modal = new ModalBuilder().setCustomId('settings_modal_channel').setTitle('Set Calendar Channel');
                            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('channelId').setLabel('Channel ID or Name').setStyle(TextInputStyle.Short).setRequired(true)));
                        } else if (subAction === 'role') {
                            modal = new ModalBuilder().setCustomId('settings_modal_role').setTitle('Set Reminder Role');
                            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('roleId').setLabel('Role ID or Name').setStyle(TextInputStyle.Short).setRequired(true)));
                        } else if (subAction === 'timezone') {
                            modal = new ModalBuilder().setCustomId('settings_modal_timezone').setTitle('Set Server Timezone');
                            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('timezone').setLabel('Timezone (e.g., America/New_York)').setStyle(TextInputStyle.Short).setRequired(true)));
                        } else if (subAction === 'post_time') {
                             modal = new ModalBuilder().setCustomId('settings_modal_post_time').setTitle('Set Daily Post Time');
                             modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('postTime').setLabel('Time (HH:MM 24hr format)').setStyle(TextInputStyle.Short).setRequired(true)));
                        }
                        if (modal) await interaction.showModal(modal);
                        break;
                }
                return; // Prevent fall-through
            }
            
            // --- Other Buttons ---
            switch (action) {
                case 'mute_daily_reminders': {
                    const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
                    if (!settings || !settings.reminderRoleId) return interaction.reply({ content: 'Reminder role not set up.', ephemeral: true });
                    const role = interaction.guild.roles.cache.get(settings.reminderRoleId);
                    if (role && interaction.member.roles.cache.has(role.id)) {
                        await interaction.member.roles.remove(role);
                        await interaction.reply({ content: 'You will no longer receive daily pings.', ephemeral: true });
                    } else {
                        await interaction.member.roles.add(role);
                        await interaction.reply({ content: 'You will now receive daily pings again.', ephemeral: true });
                    }
                    break;
                }
                case 'complete_event': {
                    const eventId = params[0];
                    const event = await Event.findById(eventId);
                    if (!event) return interaction.reply({ content: 'This event no longer exists.', ephemeral: true });
                    if (event.completedBy.includes(interaction.user.id)) return interaction.reply({ content: 'You have already marked this complete!', ephemeral: true });
                    
                    await Event.updateOne({ _id: eventId }, { $addToSet: { completedBy: interaction.user.id } });
                    await addPoint(interaction.user.id, interaction.guild.id, interaction.member);
                    await interaction.reply({ content: `Great job! You've completed "${event.name}" and earned 1 point.`, ephemeral: true });
                    await updateDailyCalendar(interaction.guild);
                    break;
                }
                case 'mute_event_pings': {
                    const eventId = params[0];
                    await Event.updateOne({ _id: eventId }, { $addToSet: { mutedNotifications: interaction.user.id } });
                    await interaction.reply({ content: "You will no longer be pinged for this event's reminders.", ephemeral: true });
                    break;
                }
                case 'mute_urgent_all': {
                    const eventId = params[0];
                    await Event.updateOne({ _id: eventId }, { isUrgentMuted: true });
                    await interaction.message.edit({ components: [] });
                    await interaction.reply({ content: `All further urgent notifications for this event have been muted by ${interaction.user.tag}.`});
                    break;
                }
                case 'finalize_event': {
                    const eventId = params[0];
                    const event = await Event.findById(eventId);
                    await interaction.message.edit({ content: `✅ Event "${event.name}" has been created successfully!`, embeds: [], components: [] });
                    await updateDailyCalendar(interaction.guild);
                    break;
                }
            }
        } else if (interaction.isUserSelectMenu()) {
            const [action, eventId] = interaction.customId.split(':');
            if (action === 'select_participants') {
                await Event.updateOne({ _id: eventId }, { participants: interaction.values });
                const event = await Event.findById(eventId);
                const embed = EmbedBuilder.from(interaction.message.embeds[0]);
                embed.setFields(
                    { name: '⏰ Time', value: embed.data.fields[0].value, inline: false },
                    { name: '👥 Participants', value: interaction.values.map(id => `<@${id}>`).join(', ') || 'None selected', inline: false }
                );
                await interaction.update({ embeds: [embed] });
            }

        } else if (interaction.isModalSubmit()) {
            // --- New Event Modal ---
            if (interaction.customId === 'new-event-modal') {
                await interaction.deferReply({ ephemeral: true });

                const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
                const timezone = settings?.timezone || 'America/Los_Angeles';

                const name = interaction.fields.getTextInputValue('eventName');
                const dateStr = interaction.fields.getTextInputValue('eventDate');
                const timeStr = interaction.fields.getTextInputValue('eventTime');
                const location = interaction.fields.getTextInputValue('eventLocation');
                
                const isAllDay = timeStr.toLowerCase().trim() === 'all day';
                const parsedDate = chrono.parseDate(`${dateStr} ${isAllDay ? '12:00am' : timeStr}`, { timezone });
                
                if (!parsedDate) {
                    return interaction.editReply({ content: 'Could not understand the date or time. Please try again (e.g., "tomorrow 7pm").', ephemeral: true });
                }

                const newEvent = new Event({
                    guildId: interaction.guild.id,
                    creatorId: interaction.user.id,
                    name,
                    startTime: parsedDate,
                    isAllDay: isAllDay,
                    location: location || null,
                    participants: [interaction.user.id],
                });
                await newEvent.save();

                const embed = new EmbedBuilder()
                    .setColor('#2ECC71')
                    .setTitle(`Configure: ${name}`)
                    .setDescription('Select the participants for this event below, then click Finalize.')
                    .addFields(
                        { name: '⏰ Time', value: `<t:${Math.floor(newEvent.startTime.getTime() / 1000)}:F>${isAllDay ? ' (All Day)' : ''}`, inline: false },
                        { name: '👥 Participants', value: `<@${interaction.user.id}>`, inline: false }
                    );

                const userSelect = new UserSelectMenuBuilder().setCustomId(`select_participants:${newEvent.id}`).setPlaceholder('Select who is involved...').setMinValues(0).setMaxValues(25);
                const finalizeButton = new ButtonBuilder().setCustomId(`finalize_event:${newEvent.id}`).setLabel('Finalize Event').setStyle(ButtonStyle.Success);
                await interaction.editReply({
                    content: 'Event details saved! Now, who is participating?',
                    embeds: [embed],
                    components: [new ActionRowBuilder().addComponents(userSelect), new ActionRowBuilder().addComponents(finalizeButton)],
                    ephemeral: true
                });
            }

            // --- Settings Modals ---
            const [action, modalType] = interaction.customId.split('_modal_');
            if (action === 'settings') {
                const settings = await GuildSettings.findOneAndUpdate({ guildId: interaction.guild.id }, {}, { upsert: true, new: true });
                let replyMessage = 'Setting could not be updated.';

                switch(modalType) {
                    case 'channel':
                        const channelInput = interaction.fields.getTextInputValue('channelId');
                        const channel = interaction.guild.channels.cache.find(c => c.name === channelInput || c.id === channelInput);
                        if(channel && channel.type === ChannelType.GuildText) {
                            settings.calendarChannelId = channel.id;
                            replyMessage = `Calendar channel set to ${channel}.`;
                        } else { replyMessage = 'Could not find that text channel.'; }
                        break;
                    case 'role':
                        const roleInput = interaction.fields.getTextInputValue('roleId');
                        const role = interaction.guild.roles.cache.find(r => r.name === roleInput || r.id === roleInput);
                        if(role) {
                            settings.reminderRoleId = role.id;
                            replyMessage = `Reminder role set to ${role}.`;
                        } else { replyMessage = 'Could not find that role.'; }
                        break;
                    case 'timezone':
                        const timezoneInput = interaction.fields.getTextInputValue('timezone');
                        // Basic validation for timezone format
                        try {
                           new Intl.DateTimeFormat('en-US', { timeZone: timezoneInput }).format();
                           settings.timezone = timezoneInput;
                           replyMessage = `Timezone set to \`${timezoneInput}\`.`;
                        } catch (e) {
                           replyMessage = 'Invalid timezone format. Please use a valid IANA timezone name (e.g., `America/New_York`).';
                        }
                        break;
                    case 'post_time':
                        const timeInput = interaction.fields.getTextInputValue('postTime');
                        if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeInput)) {
                            settings.dailyPostTime = timeInput;
                            replyMessage = `Daily post time set to \`${timeInput}\`.`;
                        } else { replyMessage = 'Invalid time format. Please use HH:MM (24-hour).'; }
                        break;
                }
                await settings.save();
                await interaction.reply({ content: replyMessage, ephemeral: true });
            }
        }
    },
};