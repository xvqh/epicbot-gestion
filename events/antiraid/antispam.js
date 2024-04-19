const db = require("quick.db");
const Discord = require('discord.js');
const { sanction } = require("../../base/functions");
var spam = {}
module.exports = {
    name: 'messageCreate',

    run: async (client, message) => {
        if (message.author.id === client.user.id) return
        if (!message.guild) return
        let check = db.fetch(`${message.guild.id}.anti.spam`)
        let checkk = db.fetch(`${message.guild.id}.anti.spam_allow`)
        if (checkk && checkk.includes(message.channel.id)) return
        let sensibilite = db.fetch(`${message.guild.id}.anti.spam_sensi`)
        if (!sensibilite) {
            db.set(`${message.guild.id}.anti.spam_sensi`, "6/5")
            sensibilite = "6/5"
        }
        let slash = sensibilite.indexOf("/")
        let msg = sensibilite.substring(0, slash)
        let time = sensibilite.substring(slash + 1, sensibilite.length)
        let sctn = db.fetch(`${message.guild.id}.punition.antispam`)
        if (!sctn) sctn = client.perms.antiraid.antispam
        if (check === "max") {
            let o = db.fetch(`bot.owner`)
            if (o && o.includes(message.author.id)) return
            if (isNaN(spam[message.author.id])) { spam[message.author.id] = 1 } else spam[message.author.id]++
            setTimeout(() => { if (isNaN(spam[message.author.id])) { spam[message.author.id] = 0 } else spam[message.author.id]-- }, parseInt(time * 1000));
        }
        if (check === "on") {
            let o = db.fetch(`bot.owner`)
            if (o && o.includes(message.author.id)) return
            let oo = db.fetch(`${message.guild.id}.botwhitelist`)
            if (oo && oo.includes(message.author.id)) return
            if (isNaN(spam[message.author.id])) { spam[message.author.id] = 1 } else spam[message.author.id]++
            setTimeout(() => { if (isNaN(spam[message.author.id])) { spam[message.author.id] = 0 } else spam[message.author.id]-- }, parseInt(time * 1000));
        }

        if (spam[message.author.id] === parseInt(msg)) {
            let botMessages = botMessages.filter(msg => msg.author == member.user)
            message.channel.bulkDelete(botMessages).catch(e => {})
            message.channel.send(`Vous envoyez des messages trop rapidement **${message.author.username}** [mute 5sec] !`).then(m => { setTimeout(async () => { m.delete().catch(e => { }) }, 3000) })
            sanction(message.member, message.guild, sctn, `[automod] Anti-Spam`)
            let logchannel = db.fetch(`${message.guild.id}.automodlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir spam dans ${message.channel} !`)]
            }).catch(e => { e })
            db.push(`${message.guild.id}.${message.author.id}.warns`, "[automod] Anti-Spam")
        }
    }
}