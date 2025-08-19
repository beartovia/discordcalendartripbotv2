const UserPoints = require('../models/UserPoints');

async function addPoint(userId, guildId, member) {
    const user = await UserPoints.findOneAndUpdate(
        { userId, guildId },
        { $inc: { points: 1 } },
        { new: true, upsert: true }
    );

    await updateNickname(member, user.points);
    return user;
}

async function updateNickname(member, points) {
    try {
        if (!member.manageable) {
            console.log(`Cannot manage nickname for ${member.user.tag}.`);
            return;
        }

        const currentNickname = member.displayName;
        // Regex to remove a potential existing point prefix (e.g., "123 | Nickname")
        const cleanNickname = currentNickname.replace(/^\d+\s*\|\s*/, '');

        const newNickname = `${points} | ${cleanNickname}`;
        
        // Discord has a 32 character limit for nicknames
        if (newNickname.length > 32) {
            await member.setNickname(newNickname.substring(0, 32));
        } else {
            await member.setNickname(newNickname);
        }
    } catch (error) {
        console.error(`Failed to update nickname for ${member.user.tag}:`, error);
    }
}


module.exports = { addPoint, updateNickname };