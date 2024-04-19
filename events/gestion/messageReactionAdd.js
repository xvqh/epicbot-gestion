const db = require("quick.db")
const { MessageReaction, User, MessageEmbed } = require("discord.js");
module.exports = {
    name: 'messageReactionAdd',

    run: async (client, messageReaction, user) => {
        if (client.user === user) return;
        const { message, emoji } = messageReaction;
        if (message.partial) await messageReaction.message.fetch();
        const member = await message.guild.members.cache.get(user.id);
        if (member) {
            let roletoadd = db.fetch(`${message.guild.id}.rolereact.${message.id}`)
            let canadd = true
            if (roletoadd && roletoadd.options) {
                if(roletoadd.options.filter(i => i.react === messageReaction.emoji.toString() )) {
                let role = member.guild.roles.cache.get(roletoadd.options.filter(i => i.react === messageReaction.emoji.toString())[0].id)
                if (role) {
                    if(!roletoadd.multi){
                        for (i in roletoadd.options){
                            if(member.roles.cache.has(roletoadd.options[i].id)) canadd = false
                        }
                    }
                    if (!member.roles.cache.has(role.id) && canadd) {
                        member.roles.add(role).catch(console.error);
                    } else messageReaction.users.remove(user).catch()
                }
                }
            }
        }

    }
}