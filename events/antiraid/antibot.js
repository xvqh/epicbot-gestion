const db = require("quick.db");
const { sanction } = require("../../base/functions");
const Discord = require('discord.js');
module.exports = {
    name: 'guildMemberAdd',

    run: async (client, member) => {
        if (member.user.bot) {
            const entry = await member.guild.fetchAuditLogs({ type: 'BOT_ADD' }).then(audit => audit.entries.first()).catch()
            if (entry.executor.id === client.user.id) return
            if (!entry.executor) return
            let memberr = member.guild.members.cache.get(entry.executor.id)
            let check = db.fetch(`${member.guild.id}.anti.bot`)
            let logs = false
            let sctn = db.fetch(`${member.guild.id}.punition.antibot`)
            if(!sctn) sctn = client.perms.antiraid.antibot
            if (check === "max") {
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(entry.executor.id)) return
                await member.guild.bans.create(member, {
                    "reason": `ANTIBOT`
                });
                let logchannel = db.fetch(`${member.guild.id}.raidlogs`)
                logchannel = member.guild.channels.cache.get(logchannel)
                logs = true
                sanction(memberr, member.guild, sctn, `[automod] Anti-Bot`)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${member.guild.id}.color`))
                        .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir ajouté le bot ${member.user.tag} !`)]
                }).catch(e => { e })
                db.push(`${member.guild.id}.${entry.executor.id}.warns`, "[automod] Anti-Bot")
            }

            if (check === "on") {
                let o = db.fetch(`bot.owner`)
                if (o && o.includes(entry.executor.id)) return
                let oo = db.fetch(`${member.guild.id}.botwhitelist`)
                if (oo && oo.includes(entry.executor.id)) return
                await member.guild.bans.create(member, {
                    "reason": `ANTIBOT`
                });
                let logchannel = db.fetch(`${member.guild.id}.raidlogs`)
                logchannel = member.guild.channels.cache.get(logchannel)
                logs = true
                sanction(memberr, member.guild, sctn, `[automod] Anti-Bot`)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${member.guild.id}.color`))
                        .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir ajouté le bot ${member.user.tag} !`)]
                }).catch(e => { e })
                db.push(`${member.guild.id}.${entry.executor.id}.warns`, "[automod] Anti-Bot")
            }
            if (logs !== true) {
                let logchannel = db.fetch(`${member.guild.id}.raidlogs`)
                logchannel = member.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${member.guild.id}.color`))
                        .setDescription(`${entry.executor} a ajouté le bot ${member.user.tag} !`)]
                })
            }
        }
    }
}