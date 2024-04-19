const db = require("quick.db");
const Discord = require('discord.js');
const { sanction } = require("../../base/functions");
module.exports = {
    name: 'messageCreate',
 
    run: async (client, message) => {
        if(!message.guild) return
        if (message.content.includes("discord.gg/" || "https://")) {
            if (message.author.id === client.user.id) return
            let check = db.fetch(`${message.guild.id}.anti.link`)
            let checkk = db.fetch(`${message.guild.id}.anti.link_allow`)
            if (checkk && checkk.includes(message.channel.id)) return
            let sctn = db.fetch(`${message.guild.id}.punition.antilink`)
            if(!sctn) sctn = client.perms.antiraid.antilink
            if (check === "max") {
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(message.author.id)) return
                message.delete().catch(e => { })
                message.channel.send(`Les liens sont interdit dans le serveur **${message.author.username}** !`).then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                sanction(message.member, message.guild, sctn, `[automod] Anti-Link`)
                let logchannel = db.fetch(`${message.guild.id}.automodlogs`)
                logchannel = message.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${message.guild.id}.color`))
                        .setDescription(`${message.author} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir envoyé un lien dans ${message.channel} !`)]
                }).catch(e => { console.log(e) })
                db.push(`${message.guild.id}.${message.author.id}.warns`, "[automod] Anti-Link")
                return
            }
            if (check === "on") {
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(message.author.id)) return
                let oo = db.fetch(`${message.guild.id}.botwhitelist`)
                if (oo && oo.includes(message.author.id)) return
                message.delete().catch(e => { })
                message.channel.send(`Les liens sont interdit dans le serveur **${message.author.username}** !`).then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
                sanction(message.member, message.guild, sctn, `[automod] Anti-Link`)
                let logchannel = db.fetch(`${message.guild.id}.automodlogs`)
                logchannel = message.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${message.guild.id}.color`))
                        .setDescription(`${message.author} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir envoyé un lien dans ${message.channel} !`)]
                }).catch(e => { e })
                db.push(`${message.guild.id}.${message.author.id}.warns`, "[automod] Anti-Link")
                return
            }

        }
    }
}
