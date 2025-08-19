const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newevent')
        .setDescription('Creates a new event for the trip calendar.'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('new-event-modal')
            .setTitle('Create a New Event');

        const nameInput = new TextInputBuilder()
            .setCustomId('eventName')
            .setLabel("What's the event name?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const dateInput = new TextInputBuilder()
            .setCustomId('eventDate')
            .setLabel("Date (YYYY-MM-DD)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const startTimeInput = new TextInputBuilder()
            .setCustomId('eventStartTime')
            .setLabel("Start Time (HH:MM - 24hr format)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const endTimeInput = new TextInputBuilder()
            .setCustomId('eventEndTime')
            .setLabel("End Time (Optional - HH:MM)")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);
        
        const locationInput = new TextInputBuilder()
            .setCustomId('eventLocation')
            .setLabel("Location (Optional)")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(dateInput),
            new ActionRowBuilder().addComponents(startTimeInput),
            new ActionRowBuilder().addComponents(endTimeInput),
            new ActionRowBuilder().addComponents(locationInput)
        );

        await interaction.showModal(modal);
    },
};