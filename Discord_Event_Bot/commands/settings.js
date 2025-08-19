const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Configure the calendar bot for this server (interactive).')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const settings = await GuildSettings.findOne({ guildId: interaction.guild.id }) || new GuildSettings({ guildId: interaction.guild.id });

        const embed = new EmbedBuilder()
            .setColor('#FEE75C')
            .setTitle('📅 Trip Calendar Settings')
            .setDescription('Click the buttons below to configure the bot for this server.')
            .addFields(
                { name: '📝 Calendar Channel', value: settings.calendarChannelId ? `<#${settings.calendarChannelId}>` : 'Not Set', inline: true },
                { name: '🔔 Reminder Role', value: settings.reminderRoleId ? `<@&${settings.reminderRoleId}>` : 'Not Set', inline: true },
                { name: '🌍 Timezone', value: `\`${settings.timezone}\``, inline: true },
                { name: '⏰ Daily Post Time', value: `\`${settings.dailyPostTime}\``, inline: true },
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('settings_set_channel').setLabel('Set Channel').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('settings_set_role').setLabel('Set Role').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('settings_set_timezone').setLabel('Set Timezone').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('settings_set_post_time').setLabel('Set Post Time').setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    },
};