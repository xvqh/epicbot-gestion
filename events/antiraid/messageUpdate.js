const db = require("quick.db");
const Discord = require('discord.js');
const { sanction } = require("../../base/functions");
module.exports = {
    name: 'messageUpdate',

    run: async (client, oldMessage, newMessage) => {
        if(!newMessage.guild) return
        if (newMessage.author) {
            if (newMessage.author.id === client.user.id) return;
            if (!oldMessage.guild) return;
            if (newMessage.content.includes("discord.gg/" || "https://")) {
                if (newMessage.author.id === client.user.id) return
                let sctn = db.fetch(`${newMessage.guild.id}.punition.antilink`)
                if(!sctn) sctn = client.perms.antiraid.antilink
                let check = db.fetch(`${newMessage.guild.id}.anti.link`)
                if (check === "max") {
                    let o = db.fetch(`bot.owner`)
                    if (o && o.includes(newMessage.author.id)) return
                    newMessage.delete().catch(e => { })
                    newMessage.channel.send(`Les liens sont interdit dans le serveur **${newMessage.author.username}** [mute 10sec] !`).then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                    sanction(message.member, message.guild, sctn, `[automod] Anti-Link`)
                    let logchannel = db.fetch(`${newMessage.guild.id}.automodlogs`)
                    logchannel = newMessage.guild.channels.cache.get(logchannel)
                    if (logchannel) logchannel.send({
                        embeds: [new Discord.MessageEmbed()
                            .setColor(db.fetch(`${newMessage.guild.id}.color`))
                            .setDescription(`${newMessage.author} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir envoyé un lien dans ${newMessage.channel} !`)]
                    }).catch(e => { e })
                    db.push(`${newMessage.guild.id}.${newMessage.author.id}.warns`, "[automod] Anti-Link")
                    return
                }
                if (check === "on") {
                    let o = db.fetch(`bot.owner`)
                    if (o && o.includes(newMessage.author.id)) return
                    let oo = db.fetch(`${newMessage.guild.id}.botwhitelist`)
                    if (oo && oo.includes(newMessage.author.id)) return
                    newMessage.delete().catch(e => { })
                    newMessage.channel.send(`Les liens sont interdit dans le serveur **${newMessage.author.username}** [mute 10sec] !`).then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                    sanction(message.member, message.guild, sctn, `[automod] Anti-Link`)
                    let logchannel = db.fetch(`${newMessage.guild.id}.automodlogs`)
                    logchannel = newMessage.guild.channels.cache.get(logchannel)
                    if (logchannel) logchannel.send({
                        embeds: [new Discord.MessageEmbed()
                            .setColor(db.fetch(`${newMessage.guild.id}.color`))
                            .setDescription(`${newMessage.author} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir envoyé un lien dans ${newMessage.channel} !`)]
                    }).catch(e => { e })
                    db.push(`${newMessage.guild.id}.${newMessage.author.id}.warns`, "[automod] Anti-Link")
                    return
                }

            }
        }
    }
}