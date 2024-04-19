const db = require("quick.db")
const { MessageReaction, User, MessageEmbed } = require("discord.js");
module.exports = {
    name: 'messageReactionRemove',

    run: async (client, messageReaction, user) => {
        if (client.user === user) return;
        const { message, emoji } = messageReaction;
        if (message.partial) await messageReaction.message.fetch();
        const member = await message.guild.members.cache.get(user.id);
        if (member) {
            let roletoadd = db.fetch(`${message.guild.id}.rolereact.${message.id}`)
            if (roletoadd && roletoadd.options) {
                if(roletoadd.options.filter(i => i.react === messageReaction.emoji.toString() )) {
                let role = member.guild.roles.cache.get(roletoadd.options.filter(i => i.react === messageReaction.emoji.toString())[0].id)
                if (role) {
                    if (member.roles.cache.has(role.id)) {
                        member.roles.remove(role).catch(console.error);
                    }
                }
                }
            }
        }

    }
}