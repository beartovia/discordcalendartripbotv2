const { Events } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const settings = await GuildSettings.findOne({ guildId: member.guild.id });
        if (!settings || !settings.reminderRoleId) return;

        const role = member.guild.roles.cache.get(settings.reminderRoleId);
        if (role) {
            try {
                await member.roles.add(role);
                console.log(`Assigned role ${role.name} to ${member.user.tag}`);
            } catch (error) {
                console.error(`Failed to assign role to ${member.user.tag}:`, error);
            }
        }
    },
};