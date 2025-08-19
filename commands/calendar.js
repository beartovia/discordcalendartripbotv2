const { SlashCommandBuilder } = require('discord.js');
const { generateDailyCalendarEmbed } = require('../services/calendar');
const chrono = require('chrono-node');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('Displays the schedule for a specific day.')
        .addStringOption(option => 
            option.setName('date')
                .setDescription('The date to view (e.g., "tomorrow", "August 22nd", "2025-08-22")')
                .setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
        const dateString = interaction.options.getString('date');
        const date = chrono.parseDate(dateString);

        if (!date) {
            return interaction.editReply({ content: "I couldn't understand that date. Please try again.", ephemeral: true });
        }
        
        const { embed, row } = await generateDailyCalendarEmbed(interaction.guild.id, date);
        await interaction.editReply({ embeds: [embed], components: [row] });
	},
};